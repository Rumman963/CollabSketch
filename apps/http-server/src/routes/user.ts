import express, { Router } from "express";

export const Userrouter:Router = Router();

Userrouter.post("/signup", (req, res) => {
  res.status(200).json({ message: "signup ok" });
});

Userrouter.post("/signin", (req, res) => {
  res.status(200).json({ message: "signin ok" });
});

