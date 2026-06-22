import { Request, Response } from 'express'
import * as vehiculoModel from "../models/vehiculo.model"

export async function getVehiculos(req:Request,res:Response){
    try{
        const vehiculos = await vehiculoModel.getAllVehiculos()
        res.json(vehiculos)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar vehiculos "})
    }
}

export async function getVehiculoPatente(req:Request,res:Response){
    try{
        const patenteBusqueda= req.params.patente
        const vehiculo = await vehiculoModel.getVehiculo(patenteBusqueda)

        if(!vehiculo){
            return res.status(404).json({error: " Vehiculo no encontrado "})
        }
        res.json(vehiculo)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al buscar vehiculo "})
    }
}

export async function agregarVehiculo(req:Request,res:Response){
    try{
        const {patente, modelo, kms_actual, estado} = req.body
        
        if( patente!== null || modelo!==null || !estado){
            return res.status(400).json({error: " Los campos patente, modelo y estado son obligatorios "})
        }
        const id = await vehiculoModel.addVehiculo({patente,modelo,kms_actual,estado})
        res.status(201).json({id , mensaje: " vehiculo correctamente agregado "})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al agregar vehiculo "})
    }
}

export async function editarVehiculo(req:Request,res:Response){
    try{
        const id = req.params.patente
        const {patente,modelo,kms_actual,estado} = req.body

        const actualiza = await vehiculoModel.editVehiculo(id,{patente,modelo,kms_actual,estado})
        if(!actualiza){
            return res.status(404).json({error:" vehiculo no encontrado"})
        }
        res.json({mensaje: " vehiculo editado "})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al editar vehiculo "})
    }
}