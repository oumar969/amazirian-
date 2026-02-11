import express from "express";
import cors from "cors";

import { openDb } from "./db.js";
import {
  hashPassword,
  loginSchema,
  newId,
  newToken,
  registerSchema,
  verifyPassword,
} from "./auth.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

const app = express();
app.use(cors());
app.use(express.json());

const db = await openDb();

// Seed a demo user on first run so the frontend can log in immediately.
const existingUserCount = await db.get("SELECT COUNT(*) as count FROM users");
if ((existingUserCount?.count ?? 0) === 0) {
  const now = Date.now();
  const demoUser = {
    id: newId(),
    username: "demo",
    displayName: "Demo",
    passwordHash: await hashPassword("demo"),
    createdAt: now,
  };

  await db.run(
    "INSERT INTO users (id, username, displayName, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?)",
    demoUser.id,
    demoUser.username,
    demoUser.displayName,
    demoUser.passwordHash,
    demoUser.createdAt,
  );

  // eslint-disable-next-line no-console
  console.log("Seeded demo user: username=demo password=demo");
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { username, password, displayName } = parsed.data;

  const existing = await db.get("SELECT id FROM users WHERE username = ?", username);
  if (existing) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const now = Date.now();
  const user = {
    id: newId(),
    username,
    displayName: displayName ?? username,
    passwordHash: await hashPassword(password),
    createdAt: now,
  };

  await db.run(
    "INSERT INTO users (id, username, displayName, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?)",
    user.id,
    user.username,
    user.displayName,
    user.passwordHash,
    user.createdAt,
  );

  return res.status(201).json({
    user: { id: user.id, username: user.username, displayName: user.displayName },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { username, password } = parsed.data;

  const user = await db.get(
    "SELECT id, username, displayName, passwordHash FROM users WHERE username = ?",
    username,
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = newToken();
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  await db.run(
    "INSERT INTO sessions (token, userId, createdAt, expiresAt) VALUES (?, ?, ?, ?)",
    token,
    user.id,
    now,
    expiresAt,
  );

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    },
  });
});

app.get("/api/auth/me", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "Missing token" });

  const now = Date.now();
  const session = await db.get(
    "SELECT userId, expiresAt FROM sessions WHERE token = ?",
    token,
  );

  if (!session) return res.status(401).json({ error: "Invalid token" });
  if (session.expiresAt <= now) {
    await db.run("DELETE FROM sessions WHERE token = ?", token);
    return res.status(401).json({ error: "Token expired" });
  }

  const user = await db.get(
    "SELECT id, username, displayName FROM users WHERE id = ?",
    session.userId,
  );

  if (!user) return res.status(401).json({ error: "Invalid token" });
  return res.json({ user });
});

app.post("/api/auth/logout", async (req, res) => {
  const token = getBearerToken(req);
  if (token) {
    await db.run("DELETE FROM sessions WHERE token = ?", token);
  }
  return res.status(204).send();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});
