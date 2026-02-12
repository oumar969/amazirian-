import path from "node:path";
import { fileURLToPath } from "node:url";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "dev.sqlite");

export async function openDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec("PRAGMA foreign_keys = ON;");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      displayName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      isAdmin INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
  `);

  // Lightweight migration for existing dev.sqlite created before isAdmin existed.
  const userColumns = await db.all("PRAGMA table_info(users)");
  const hasIsAdmin = userColumns?.some((c) => c?.name === "isAdmin");
  if (!hasIsAdmin) {
    await db.exec("ALTER TABLE users ADD COLUMN isAdmin INTEGER NOT NULL DEFAULT 0;");
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sellerId TEXT NOT NULL,
      sellerName TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      category TEXT NOT NULL,
      prime INTEGER NOT NULL,
      rating REAL NOT NULL,
      ratingCount INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_sellerId ON products(sellerId);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_createdAt ON products(createdAt);`);

  return db;
}
