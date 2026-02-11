import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import { z } from "zod";

const Username = z.string().trim().min(3).max(50);
const Password = z.string().min(4).max(200);

export const registerSchema = z.object({
  username: Username,
  password: Password,
  displayName: z.string().trim().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  username: Username,
  password: Password,
});

export function newId() {
  return crypto.randomUUID();
}

export function newToken() {
  return `t_${Date.now()}_${crypto.randomBytes(16).toString("hex")}`;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
