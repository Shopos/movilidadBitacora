import { Router } from "express";
import { getUsuarioCorreo, getUsuarios, agregarUsuario, editarUsuario, getUsuarioId, login, perfil, solicitarReset, getSolicitudes, resolverResetPass} from "../controllers/usuarios.controller"
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware";


const router = Router()
//Verificacion para ingresar al sistema
router.post('/login', login)
//Verifica que el usuario aun cuenta con credenciales validas
router.get('/perfil',autenticarJWT,perfil)

//Obtener todos los usuarios
router.get('/',autenticarJWT,verifyAdmin,getUsuarios)
//Obtener usuario cual correo sea igual a 
router.get('/correos/:correo',autenticarJWT,verifyAdmin,getUsuarioCorreo)
//Obtener usuario cual id sea igual a
router.get('/id/:id',autenticarJWT,getUsuarioId)
//Agregar usuario
router.post('/',autenticarJWT,verifyAdmin,agregarUsuario)
//Editar usuario cual correo sea igual a
router.put('/:correo',autenticarJWT,verifyAdmin ,editarUsuario)
//Agrega una solicitud de cambio de contraseña
router.post('/solicitar-reset',solicitarReset)
//Obtiene las solicitudes pendientes
router.get('/solicitudes-reset',autenticarJWT,verifyAdmin,getSolicitudes)
//Actualiza el estado de una solicitud y cambia una contraseña dado un id
router.post('/solicitudes-reset/:id_solicitud/resolver',autenticarJWT,verifyAdmin,resolverResetPass)

export default router