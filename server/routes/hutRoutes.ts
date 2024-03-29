import { Router, response } from "express";
import { Response } from "express";
import AuthController from "../controllers/authController";
import hutController from "../controllers/hutController";

const router = Router();

router.get("/:hutID/participants", hutController.getParticipantsByHutID);

export default router;
