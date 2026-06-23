import { Request, Response } from "express";
import * as usuarioModel from "../models/usuario.model"

export async function getUsuarios(req:Request,res:Response){
    try{
        const usuarios = await usuarioModel.getAllUsuarios()
        res.json(usuarios)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " error al listar usuarios "})
    }
}

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