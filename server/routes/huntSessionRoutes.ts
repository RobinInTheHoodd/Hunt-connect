import { Router, response } from "express";
import { Response } from "express";
import AuthController from "../controllers/authController";
import huntSessionController from "../controllers/huntSessionController";

import { checkSchema, query } from "express-validator";
import WeatherInfoModel from "../models/weather/WeatherModel";
import HuntingSessionModel from "../models/huntingSession/HuntingSessionModel";
import DuckTeamsModel from "../models/duckTeams/DuckTeamsModel";
import HuntingParticipantModel from "../models/huntingParticipant/HuntingPariticpantModel";
import observationRoutes from "./observationRoutes";

const router = Router({ mergeParams: true });

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
router.get("/get/:huntingID", huntSessionController.getById);
router.get("/finish/:huntID", huntSessionController.finishHuntingSession);

router.get("/getHistory/:userID", huntSessionController.getHistoryByUserId);

router.use("/:huntID", observationRoutes);

export default router;
