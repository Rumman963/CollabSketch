import express from "express";
import { Userrouter } from "./routes/user.js";

const app = express();
const router = express.Router();

app.use(express.json());
router.use("/app/v1/user", Userrouter);
app.use(router);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(3003, () => {
  console.log("HTTP server running on http://localhost:3003");
});
