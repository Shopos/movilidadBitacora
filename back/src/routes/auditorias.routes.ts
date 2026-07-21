import { Router } from "express";
import { getLogs } from "../controllers/auditorias.controller"
import { autenticarJWT,verifyAdmin } from "../middleware/auth.middleware";

const router = Router()

router.get('/',autenticarJWT,verifyAdmin,getLogs)

export default router