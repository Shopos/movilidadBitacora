import { Request, Response } from "express";
import * as mantencionModel from "../models/mantencion.model"

export async function getMantencionesPatente(req:Request,res:Response){
    try{
        const patenteBuscada = req.params.patente
        const mantenciones = await mantencionModel.getMantencionesVehiculo(patenteBuscada)

        if(!mantenciones){
            return res.status(404).json({error:" Mantenciones para este vehiculo no encontradas "})
        }
        res.json(mantenciones)
    }catch(e){
        console.error(e)
        res.status(500).json({error:" Error al buscar mantenciones "})
    }
}

export async function agregarMantencion(req:Request,res:Response) {
    try{
        const {ultimo_cambio_aceite,taller,ultima_mantencion,detalle_mantencion,patente} = req.body

        if(patente === "" && taller === "" && ultimo_cambio_aceite === "" ){
            return res.status(400).json({error: "Los campos patente, taller y ultimo cambio de aceite son obligatorios "})
        }
        const id = await mantencionModel.addMantencion({ultimo_cambio_aceite,taller,ultima_mantencion,detalle_mantencion,patente})
        res.status(201).json({id, mensaje: " Mantencion agregada correctamente "})
    }catch(e){
        res.status(500).json({error:" Error al agregar mantencion "})
    }
}