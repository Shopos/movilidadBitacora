import { Router } from "express"
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware"
import { agregarSolicitud,getSolicitudes,rechazarSolicitud,aprobarSolicitud,getSolicitudesUsuario } from "../controllers/solicitudesViaje.controller"

const router = Router()

router.patch('/:id/rechazo',autenticarJWT,verifyAdmin,rechazarSolicitud)
router.patch('/:id/aprobado',autenticarJWT,verifyAdmin,aprobarSolicitud)
router.get('/usuario/:id',autenticarJWT,getSolicitudesUsuario)
router.get('/',autenticarJWT,getSolicitudes)
router.post('/',autenticarJWT,agregarSolicitud)
export default router