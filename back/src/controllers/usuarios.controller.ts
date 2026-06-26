import { Request, Response } from "express";
import * as usuarioModel from "../models/usuario.model"

/*Controladores para el llamado al modelo de usuarios con el fin de manejar correctamente la informacion solicitada y recibida */


/* Metodo para solicitar los usuarios al modelo de usuarios */
export async function getUsuarios(req:Request,res:Response){
    try{
        const usuarios = await usuarioModel.getAllUsuarios()
        res.json(usuarios)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " error al listar usuarios "})
    }
}
/* Metodo para solicitar el usuario cuyo correo coincida con el solicitado

    parametro esperado a solicitar correo:string
    parametro esperado a recibir usuario:Usuario
*/
export async function getUsuarioCorreo(req:Request,res:Response){
    try{
        const correoUsuario = req.params.correo
        const usuario = await usuarioModel.getUsuarioCorreo(correoUsuario)
        if(!usuario){
            return res.status(404).json({error:" Usuario no encontrado para este correo "})
        }
        res.json(usuario)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " error al buscar usuario por correo "})
    }
}

/* Metodo para solicitar el usuario cuyo correo coincida con el solicitado

    parametro esperado a solicitar id:number
    parametro esperado a recibir usuario:Usuario
*/
export async function getUsuarioId(req:Request,res:Response){
    try{
        const id = Number(req.params.id)
        const usuario = await usuarioModel.getUsuarioId(id)
        if(!usuario){
            return res.status(404).json({error: " Usuario no encontrado para este id"})
        }
        res.json(usuario)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " error encontrando usuario por id "})
    }
}

/*Metodo para solicitar agregar un usuario cuyos datos sean del tipo Usuario
    paramentro esperado a solicitar usuario:UsuarioInput

    si los parametros contienen informacion vacia en cualquiera sea de sus campos la solicitud es rechazada
*/
export async function agregarUsuario(req:Request,res:Response) {
    try{
        const {correo,pass,tipo_licencia,nombre,cargo,estado} = req.body
        if(correo==="" && pass ==="" && tipo_licencia==="" && nombre==="" && cargo===""){
            return res.status(400).json({error: "Los campos son obligatorios "})
        }
        const id = await usuarioModel.addUsuario({correo,pass,tipo_licencia,nombre,cargo,estado})
        res.status(201).json({id, mensaje: " Usuario agregado correctamente "})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " error al agregar usuario "})
    }
}

/* Metodo para solicitar la edicion de un usuario cuyos datos coincidan con el correo solicitado

    parametros esperados a solicitar id:string (correo) datos{}: (datos a editar) --> estado y tipo de licencia
*/
export async function editarUsuario(req:Request,res:Response){
    try{
        const id = req.params.correo
        const {estado,tipo_licencia} = req.body

        const actualiza = await usuarioModel.editUsuario(id,{estado,tipo_licencia})
        if(!actualiza){
            return res.status(404).json({error: " usuario no encontrado "})
        }
        res.json({msg: " Usuario editado "})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al editar usuario "})
    }
}