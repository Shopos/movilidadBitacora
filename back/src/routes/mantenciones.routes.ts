import { Router } from "express";
import { getMantencionesPatente, agregarMantencion } from "../controllers/mantenciones.controller";

const router = Router()

router.get('/:patente',getMantencionesPatente)

router.post('/',agregarMantencion)

export default router