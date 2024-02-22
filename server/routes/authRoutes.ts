import { Router, response } from "express";
import { Response } from "express";
import authController from "../controllers/authController";

const router = Router();

router.get("/login", (res: Response) => {
  console.log("TEST");
  res.send("Bonjour depuis le serveur!");
});

router.post("/register", authController.register);

export default router;
