import { Router } from "express";
import { getUsuarioCorreo, getUsuarios, agregarUsuario, editarUsuario, getUsuarioId, login, perfil} from "../controllers/usuarios.controller"
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware";


const router = Router()

router.post('/login', login)

router.get('/perfil',autenticarJWT,perfil)

//Obtener todos los usuarios
router.get('/',getUsuarios)
//Obtener usuario cual correo sea igual a 
router.get('/correos/:correo',getUsuarioCorreo)
//Obtener usuario cual id sea igual a
router.get('/id/:id', getUsuarioId)
//Agregar usuario
router.post('/',autenticarJWT,verifyAdmin,agregarUsuario)
//Editar usuario cual correo sea igual a
router.put('/:correo',autenticarJWT,verifyAdmin ,editarUsuario)

export default router