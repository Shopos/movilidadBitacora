import { Router } from "express";
import { getMantencionesPatente, agregarMantencion } from "../controllers/mantenciones.controller";
import { autenticarJWT } from "../middleware/auth.middleware";

const router = Router()

//Obtener todas las patentes de un vehiculo{patente}
router.get('/:patente',getMantencionesPatente)

//Agrega mantencion a un vehiculo
router.post('/',autenticarJWT,agregarMantencion)

export default router