import { Router, response } from "express";
import { Response } from "express";
import AuthController from "../controllers/authController";

const router = Router();

router.post("/register", AuthController.registerController);

export default router;

/*

router.get("/login", (res: Response) => {
  console.log("TEST");
});
*/
