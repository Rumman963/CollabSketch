import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET && process.env.RENDER) {
  throw new Error("JWT_SECRET is not set");
}

export const JWT_SECRET = process.env.JWT_SECRET || "123123";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002"

