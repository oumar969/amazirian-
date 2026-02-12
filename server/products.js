import crypto from "node:crypto";

import { z } from "zod";

const Currency = z.enum(["SYP", "DKK"]);

const ProductInput = z.object({
  sellerName: z.string().trim().min(1).max(120),
  sellerId: z.string().trim().min(1).max(160).optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: z.number().finite().min(0),
  currency: Currency,
  imageUrl: z.string().trim().min(1).max(2000),
  category: z.string().trim().min(1).max(80),
  prime: z.boolean().default(false),
});

function slugify(input) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function productSchemas() {
  return {
    create: ProductInput,
    update: ProductInput.partial(),
  };
}

export function normalizeProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    sellerId: row.sellerId,
    sellerName: row.sellerName,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency,
    imageUrl: row.imageUrl,
    category: row.category,
    prime: Boolean(row.prime),
    rating: row.rating,
    ratingCount: row.ratingCount,
    createdAt: row.createdAt,
  };
}

export async function listProducts(db) {
  const rows = await db.all("SELECT * FROM products ORDER BY createdAt DESC");
  return rows.map(normalizeProductRow);
}

export async function getProduct(db, id) {
  const row = await db.get("SELECT * FROM products WHERE id = ?", id);
  return normalizeProductRow(row);
}

export async function createProduct(db, input) {
  const nowIso = new Date().toISOString();
  const id = crypto.randomUUID();
  const sellerId = input.sellerId?.trim() || slugify(input.sellerName) || "seller";

  const product = {
    id,
    sellerId,
    sellerName: input.sellerName.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    currency: input.currency,
    imageUrl: input.imageUrl.trim(),
    category: input.category.trim(),
    prime: input.prime ? 1 : 0,
    rating: 0,
    ratingCount: 0,
    createdAt: nowIso,
  };

  await db.run(
    `INSERT INTO products (
      id, sellerId, sellerName, title, description, price, currency, imageUrl,
      category, prime, rating, ratingCount, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    product.id,
    product.sellerId,
    product.sellerName,
    product.title,
    product.description,
    product.price,
    product.currency,
    product.imageUrl,
    product.category,
    product.prime,
    product.rating,
    product.ratingCount,
    product.createdAt,
  );

  return normalizeProductRow({ ...product, prime: product.prime });
}

export async function updateProduct(db, id, input) {
  const existing = await db.get("SELECT * FROM products WHERE id = ?", id);
  if (!existing) return null;

  const next = {
    sellerName: input.sellerName?.trim() ?? existing.sellerName,
    sellerId: input.sellerId?.trim() ?? existing.sellerId,
    title: input.title?.trim() ?? existing.title,
    description: input.description?.trim() ?? existing.description,
    price: input.price ?? existing.price,
    currency: input.currency ?? existing.currency,
    imageUrl: input.imageUrl?.trim() ?? existing.imageUrl,
    category: input.category?.trim() ?? existing.category,
    prime: input.prime === undefined ? existing.prime : input.prime ? 1 : 0,
  };

  const sellerId = next.sellerId || slugify(next.sellerName) || existing.sellerId;

  await db.run(
    `UPDATE products SET
      sellerId = ?,
      sellerName = ?,
      title = ?,
      description = ?,
      price = ?,
      currency = ?,
      imageUrl = ?,
      category = ?,
      prime = ?
    WHERE id = ?`,
    sellerId,
    next.sellerName,
    next.title,
    next.description,
    next.price,
    next.currency,
    next.imageUrl,
    next.category,
    next.prime,
    id,
  );

  const row = await db.get("SELECT * FROM products WHERE id = ?", id);
  return normalizeProductRow(row);
}

export async function deleteProduct(db, id) {
  const result = await db.run("DELETE FROM products WHERE id = ?", id);
  return (result?.changes ?? 0) > 0;
}
