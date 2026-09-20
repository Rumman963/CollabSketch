import dotenv from "dotenv";
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || "123123";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002"

