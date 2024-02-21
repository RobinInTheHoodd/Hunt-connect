import { Router, response } from "express";
import { Response } from "express";

const router = Router();

router.get("/login", (res: Response) => {
  console.log("TEST");
  res.send("Bonjour depuis le serveur!");
});

router.get("/register", (res: Response) => {
  console.log("register");
  res.send("register");
});

export default router;
