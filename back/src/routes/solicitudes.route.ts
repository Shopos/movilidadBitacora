import { Router } from "express"
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware"
import { agregarSolicitud,getSolicitudes,rechazarSolicitud,aprobarSolicitud,getSolicitudesUsuario } from "../controllers/solicitudesViaje.controller"

const router = Router()
//Actualiza una solicitud a estado rechazado
router.patch('/:id/rechazo',autenticarJWT,verifyAdmin,rechazarSolicitud)
//Actualiza una solicitud a estado aprobada
router.patch('/:id/aprobado',autenticarJWT,verifyAdmin,aprobarSolicitud)
//Devuelve las solicitudes de viajes de un usuario :id_usuario
router.get('/usuario/:id',autenticarJWT,getSolicitudesUsuario)
//Devuelve todas las solicitudes de viajes y sus estados
router.get('/',autenticarJWT,getSolicitudes)
//Agrega una solicitud de viaje
router.post('/',autenticarJWT,agregarSolicitud)
export default router