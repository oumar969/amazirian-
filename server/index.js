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
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  productSchemas,
  updateProduct,
} from "./products.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

async function requireUser(req, res) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return null;
  }

  const now = Date.now();
  const session = await db.get(
    "SELECT userId, expiresAt FROM sessions WHERE token = ?",
    token,
  );

  if (!session) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }

  if (session.expiresAt <= now) {
    await db.run("DELETE FROM sessions WHERE token = ?", token);
    res.status(401).json({ error: "Token expired" });
    return null;
  }

  const user = await db.get(
    "SELECT id, username, displayName, isAdmin FROM users WHERE id = ?",
    session.userId,
  );

  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }

  return user;
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
    isAdmin: 1,
    createdAt: now,
  };

  await db.run(
    "INSERT INTO users (id, username, displayName, passwordHash, isAdmin, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    demoUser.id,
    demoUser.username,
    demoUser.displayName,
    demoUser.passwordHash,
    demoUser.isAdmin,
    demoUser.createdAt,
  );

  console.log("Seeded demo user: username=demo password=demo");
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", async (_req, res) => {
  const products = await listProducts(db);
  return res.json({ products });
});

app.get("/api/products/:id", async (req, res) => {
  const product = await getProduct(db, req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  return res.json({ product });
});

app.post("/api/products", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const schema = productSchemas().create;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const input = user.isAdmin
    ? parsed.data
    : {
        ...parsed.data,
        sellerId: user.id,
        sellerName: user.displayName,
      };

  const product = await createProduct(db, input);
  return res.status(201).json({ product });
});

app.put("/api/products/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const existing = await getProduct(db, req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const canEdit = Boolean(user.isAdmin) || existing.sellerId === user.id;
  if (!canEdit) return res.status(403).json({ error: "Forbidden" });

  const schema = productSchemas().update;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const updateInput = user.isAdmin
    ? parsed.data
    : {
        ...parsed.data,
        sellerId: undefined,
        sellerName: undefined,
      };

  const updated = await updateProduct(db, req.params.id, updateInput);
  if (!updated) return res.status(404).json({ error: "Not found" });
  return res.json({ product: updated });
});

app.delete("/api/products/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const existing = await getProduct(db, req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const canDelete = Boolean(user.isAdmin) || existing.sellerId === user.id;
  if (!canDelete) return res.status(403).json({ error: "Forbidden" });

  const ok = await deleteProduct(db, req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  return res.status(204).send();
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
    isAdmin: 0,
    createdAt: now,
  };

  await db.run(
    "INSERT INTO users (id, username, displayName, passwordHash, isAdmin, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    user.id,
    user.username,
    user.displayName,
    user.passwordHash,
    user.isAdmin,
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
  const user = await requireUser(req, res);
  if (!user) return;
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      isAdmin: Boolean(user.isAdmin),
    },
  });
});

app.post("/api/auth/logout", async (req, res) => {
  const token = getBearerToken(req);
  if (token) {
    await db.run("DELETE FROM sessions WHERE token = ?", token);
  }
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
