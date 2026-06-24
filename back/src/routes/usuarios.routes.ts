import { Router } from "express";
import { getUsuarioCorreo, getUsuarios, agregarUsuario, editarUsuario, getUsuarioId} from "../controllers/usuarios.controller"


const router = Router()

router.get('/',getUsuarios)

router.get('/correos/:correo',getUsuarioCorreo)

router.get('/id/:id', getUsuarioId)

router.post('/',agregarUsuario)

router.put('/:correo', editarUsuario)

export default router