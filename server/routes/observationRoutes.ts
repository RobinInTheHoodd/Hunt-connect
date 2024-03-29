import { Router, response } from "express";
import { Response } from "express";
import AuthController from "../controllers/authController";
import huntSessionController from "../controllers/huntSessionController";

import { checkSchema, query } from "express-validator";
import WeatherInfoModel from "../models/WeatherModel";
import HuntingSessionModel from "../models/HuntingSessionModel";
import DuckTeamsModel from "../models/DuckTeamsModel";
import HuntingParticipantModel from "../models/HuntingPariticpantModel";
import observationController from "../controllers/observationController";

const router = Router({ mergeParams: true });

router.post("/observation/create", observationController.create);
router.post("/observation/update", observationController.update);
router.post("/observation/delete", observationController.deletePosition);
router.get("/observations", observationController.getObservations);

export default router;
