import { Router } from "express";

import authRoutes from "./authRoutes";
import huntSessionRoutes from "./huntSessionRoutes";
import hutRoutes from "./hutRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/hunt/session", huntSessionRoutes);
router.use("/hut", hutRoutes);

export default router;
