import dotenv from "dotenv"
import { Request,Response } from "express"
import * as solicitudViaje from "../models/solicitudViaje.model"

dotenv.config

export async function agregarSolicitud(req:Request,res:Response){
    try{
        const { id_solicitante,motivo,solicitante,vehiculo_solicitado } = req.body
        console.log(req.body)
        if(motivo==="" && solicitante===""){
            return res.status(400).json({error:"Los campos no pueden estar vacíos"})
        }
        const id = await solicitudViaje.crearSolicitud({id_solicitante,motivo,solicitante,vehiculo_solicitado})
        res.status(201).json({ id, mensaje: " Viaje solicitado " })
    }catch(e){
         console.error(e)
        res.status(500).json({ error: " Error al agregar solicitud " })
    }
}

export async function aprobarSolicitud(req:Request,res:Response){
    console.log("aprobando...")
    try{
          const id=Number(req.params.id)
          const {motivo} = req.body
          const autor = (req.usuario as any).nombre
          const response = await solicitudViaje.aprobarSolicitud(id,motivo,autor)
          if(!response){
            return res.status(404).json({error: "No se logro completar la aprobación de la solicitud"})
          }
          console.log("solicitud aprobada")
          res.status(200).json({id,mensaje: "Viaje aprobado correctamente"})
    }catch(e){
        console.log("error solicitud")
        res.status(500).json({error: " Error al agregar aprobar solicitud "})
    }
}

export async function getSolicitudes(req:Request,res:Response) {
    try{
        const solicitudes = await solicitudViaje.getSolicitudes()
        res.json(solicitudes)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar solicitudes "})
    }
}

export async function getSolicitudesUsuario(req:Request,res:Response){
    try{
        const id=Number(req.params.id)
        const solicitudes=await solicitudViaje.getSolicitudesUsuario(id)
        res.json(solicitudes)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar solicitudes "})
    }
}

export async function rechazarSolicitud(req:Request,res:Response){
    try{
        const id = Number(req.params.id)
        const {motivo} = req.body
        const autor = (req.usuario as any).nombre
        const response = await solicitudViaje.rechazarSolicitud(id,motivo,autor)
        if(!response){
            return res.status(404).json({ error: " No se logro completar el rechazo de solicitud " })
        }
        res.status(200).json({id,mensaje:" Viaje rechazado correctamente"})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al rechazar solicitud "})
    }
}