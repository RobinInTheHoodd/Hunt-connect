import { Router } from "express";

import hutController from "../controllers/hutController";

const router = Router();

router.post("/:hutID/addHunter", hutController.addHunter);
router.post("/:hutID/updateHunterDay", hutController.updateHunterDay);
router.post("/:hutID/deleteHutHunter", hutController.deleteHutHunter);

export default router;
