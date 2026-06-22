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
