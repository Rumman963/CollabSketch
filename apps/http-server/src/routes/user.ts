import { Router } from "express";

const Userrouter: Router = Router();

Userrouter.post("/signup", (req, res) => {
  res.status(200).json({ message: "signup ok" });
});

Userrouter.post("/signin", (req, res) => {
  res.status(200).json({ message: "signin ok" });
});

export { Userrouter };
