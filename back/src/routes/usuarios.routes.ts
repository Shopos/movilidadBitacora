import { Router } from "express";
import { getUsuarioCorreo, getUsuarios, agregarUsuario, editarUsuario, getUsuarioId} from "../controllers/usuarios.controller"


const router = Router()
//Obtener todos los usuarios
router.get('/',getUsuarios)
//Obtener usuario cual correo sea igual a 
router.get('/correos/:correo',getUsuarioCorreo)
//Obtener usuario cual id sea igual a
router.get('/id/:id', getUsuarioId)
//Agregar usuario
router.post('/',agregarUsuario)
//Editar usuario cual correo sea igual a
router.put('/:correo', editarUsuario)

export default router