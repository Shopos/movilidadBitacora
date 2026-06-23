import { Router } from "express";
import { getUsuarioCorreo, getUsuarios, agregarUsuario, editarUsuario} from "../controllers/usuarios.controller"


const router = Router()

router.get('/',getUsuarios)

router.get('/:correo',getUsuarioCorreo)

router.post('/',agregarUsuario)

router.put('/:correo', editarUsuario)

export default router