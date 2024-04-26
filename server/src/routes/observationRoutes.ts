import { Router, response } from "express";
import observationController from "../controllers/observationController";

const router = Router({ mergeParams: true });

router.post("/observation/create", observationController.create);
router.post("/observation/update", observationController.update);
router.post("/observation/delete", observationController.deletePosition);

export default router;
