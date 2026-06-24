import { Request, Response } from "express";
import * as viajesModel from "../models/viaje.model"

export async function getViajes(req:Request,res:Response){
    try{
        const viajes = await viajesModel.getAllViajes()
        res.json(viajes)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar viajes "})
    }
}