import { Router, response } from "express";
import huntSessionController from "../controllers/huntSessionController";
import observationRoutes from "./observationRoutes";

const router = Router({ mergeParams: true });

router.post("/add", huntSessionController.addController);
router.get("/finish/:huntID", huntSessionController.finishHuntingSession);
router.use("/:huntID", observationRoutes);

export default router;

/*
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
*/
