import { Router } from "express";
import { getLogs } from "../controllers/auditorias.controller"
import { autenticarJWT,verifyAdmin } from "../middleware/auth.middleware";

const router = Router()
//Ruta para obtener los logs de auditorias
router.get('/',autenticarJWT,verifyAdmin,getLogs)

export default router