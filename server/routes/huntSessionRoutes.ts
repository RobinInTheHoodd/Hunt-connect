import { Router, response } from "express";
import { Response } from "express";
import AuthController from "../controllers/authController";
import huntSessionController from "../controllers/huntSessionController";

import { checkSchema, query } from "express-validator";
import WeatherInfoModel from "../models/WeatherModel";
import HuntingSessionModel from "../models/HuntingSessionModel";
import DuckTeamsModel from "../models/DuckTeamsModel";
import HuntingParticipantModel from "../models/HuntingPariticpantModel";
import observationRoutes from "./observationRoutes";

const router = Router();

router.post(
  "/add",
  checkSchema({
    ...WeatherInfoModel.getValidation(),
    ...DuckTeamsModel.getValidation(),
    ...HuntingParticipantModel.validateBody(),
    ...HuntingSessionModel.getValidation(),
  }),
  huntSessionController.addController
);
router.get("/getCurrent/:userID", huntSessionController.getCurrent);

router.get("/finish/:huntID", huntSessionController.finishHuntingSession);

router.use("/:huntID", observationRoutes);

export default router;
