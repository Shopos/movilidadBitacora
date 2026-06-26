import { Router } from "express";
import { getMantencionesPatente, agregarMantencion } from "../controllers/mantenciones.controller";

const router = Router()

//Obtener todas las patentes de un vehiculo{patente}
router.get('/:patente',getMantencionesPatente)

//Agrega mantencion a un vehiculo
router.post('/',agregarMantencion)

export default router