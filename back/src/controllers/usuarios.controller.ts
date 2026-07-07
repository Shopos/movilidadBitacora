import { Request, Response } from "express";
import * as usuarioModel from "../models/usuario.model"
import * as solicitudesModel from "../models/solicitud.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { connection } from "../config/database";

dotenv.config()
/*Controladores para el llamado al modelo de usuarios con el fin de manejar correctamente la informacion solicitada y recibida */


/* Metodo para solicitar los usuarios al modelo de usuarios */
export async function getUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await usuarioModel.getAllUsuarios()
        res.json(usuarios)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " error al listar usuarios " })
    }
}
/* Metodo para solicitar el usuario cuyo correo coincida con el solicitado

    parametro esperado a solicitar correo:string
    parametro esperado a recibir usuario:Usuario
*/
export async function getUsuarioCorreo(req: Request, res: Response) {
    try {
        const correoUsuario = req.params.correo
        const usuario = await usuarioModel.getUsuarioCorreo(correoUsuario)
        if (!usuario) {
            return res.status(404).json({ error: " Usuario no encontrado para este correo " })
        }
        res.json(usuario)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " error al buscar usuario por correo " })
    }
}

/* Metodo para solicitar el usuario cuyo correo coincida con el solicitado

    parametro esperado a solicitar id:number
    parametro esperado a recibir usuario:Usuario
*/
export async function getUsuarioId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const usuario = await usuarioModel.getUsuarioId(id)
        if (!usuario) {
            return res.status(404).json({ error: " Usuario no encontrado para este id" })
        }
        res.json(usuario)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " error encontrando usuario por id " })
    }
}

/*Metodo para solicitar agregar un usuario cuyos datos sean del tipo Usuario
    paramentro esperado a solicitar usuario:UsuarioInput

    si los parametros contienen informacion vacia en cualquiera sea de sus campos la solicitud es rechazada
*/
export async function agregarUsuario(req: Request, res: Response) {
    try {
        const { correo, pass, tipo_licencia, nombre, cargo, estado } = req.body
        if (correo === "" && pass === "" && tipo_licencia === "" && nombre === "" && cargo === "") {
            return res.status(400).json({ error: "Los campos son obligatorios " })
        }
        const id = await usuarioModel.addUsuario({ correo, pass, tipo_licencia, nombre, cargo, estado })
        res.status(201).json({ id, mensaje: " Usuario agregado correctamente " })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " error al agregar usuario " })
    }
}

/* Metodo para solicitar la edicion de un usuario cuyos datos coincidan con el correo solicitado

    parametros esperados a solicitar id:string (correo) datos{}: (datos a editar) --> estado y tipo de licencia
*/
export async function editarUsuario(req: Request, res: Response) {
    try {
        console.log(req)
        const id = req.params.correo
        const { estado, tipo_licencia } = req.body

        const actualiza = await usuarioModel.editUsuario(id, { estado, tipo_licencia })
        if (!actualiza) {
            return res.status(404).json({ error: " usuario no encontrado " })
        }
        res.json({ msg: " Usuario editado " })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al editar usuario " })
    }
}
/** Metodo para validar al usuario dentro de la bd, si se valida devuelve token jwt y al usuario */
export async function login(req: Request, res: Response) {
    try {
        const { correo, pass } = req.body
        if (correo === "" && pass === "") {
            return res.status(400).json({ error: " Los campos correo y contraseña son obligatorios " })
        }
        const usuarios = await usuarioModel.getUsuarioCorreo(correo)
        const usuarioEncontrado = usuarios[0]
        if (!usuarioEncontrado) {
            return res.status(401).json({ error: " Credenciales invalidas " })
        }
        if (!usuarioEncontrado.estado) {
            return res.status(403).json({ error: " Usuario bloqueado, comunicarse con administración " })
        }
        const passUser = bcrypt.compareSync(pass, String(usuarioEncontrado.pass))

        if (!passUser) {
            return res.status(403).json({ error: " Credenciales invalidas " })
        }

        const payload = {
            id: usuarioEncontrado.id_usuario,
            cargo: usuarioEncontrado.cargo,
            correo: usuarioEncontrado.correo,
            nombre: usuarioEncontrado.nombre
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES || '9h') as any }
        )
        res.json({ token, usuario: payload })

    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al iniciar sesión " })
    }
}

export async function perfil(req: Request, res: Response) {
    res.json({ usuario: req.usuario })
}

export async function solicitarReset(req: Request, res: Response) {
    try{//Tomar correo
        const mail = req.body.correo
        //verificar que existe
        const usuarios = await usuarioModel.getUsuarioCorreo(mail)
        const usuario = usuarios[0]
        console.log(usuario)
        //obtener data asociada
        if (usuario && usuario.estado) {
            const idUsuario = usuario.id_usuario
            const nombre = usuario.nombre
            const correo = usuario.correo
            //enviar solicitud con datos necesarios
            await solicitudesModel.crearSolicitud(idUsuario, correo, nombre)
            res.json({msg:"solicitud enviada"})
        }else{
            res.json({msg:"Solicitud enviada a correo"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({error:" Error al solicitar cambio contraseña "})
    }
    //notificar usuario}
}

export async function getSolicitudes(req: Request, res: Response) {
    //Devolver tabla con solicitudes
    try {
        const solicitudes = await solicitudesModel.getSolicitudes()
        res.json(solicitudes)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al listar solicitudes " })
    }
}

export async function resolverResetPass(req: Request, res: Response) {
    //Recibir pass temporal
    //Asignar a usuario
    //Resolver solicitud
    try{
        const idSolicitud = Number(req.params.id_solicitud)
        const {temporalPass} = req.body
        const autor = (req.usuario as any).nombre

        if(!temporalPass){
            res.status(404).json({error: " Contraseña invalida para su cambio "})
        }
        const solicitud = await connection.query<any>(
            "SELECT * FROM solicitudes_reset WHERE id_solicitud=? AND estado='pendiente'",[idSolicitud]
        )
        if(!solicitud[0]){
            res.status(404).json({error: " Error encontrando solicitud asociada "})
        }
        const hashPass = await bcrypt.hash(temporalPass,11)
        await connection.query("UPDATE usuarios SET pass=? WHERE id_usuario=?"),[hashPass,solicitud[0].id_usuario]
        await solicitudesModel.resolverSolicitud(idSolicitud,autor)
        res.json({msg:` Contraseña nueva asignada al usuario ${solicitud[0].nombre} `})
    }catch(e){
        console.log(e)
        res.status(500).json({error: " Error al resolver cambio contraseña "})
    }
}