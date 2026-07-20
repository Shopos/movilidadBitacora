import dotenv from "dotenv"
import { Request,Response } from "express"
import * as solicitudViaje from "../models/solicitudViaje.model"

dotenv.config

//Agrega una solicitud de viaje
export async function agregarSolicitud(req:Request,res:Response){
    try{
        const usuario = (req.usuario as any).correo
        const { id_solicitante,motivo,solicitante,vehiculo_solicitado } = req.body
        if(motivo==="" || solicitante===""){
            return res.status(400).json({error:"Los campos no pueden estar vacíos"})
        }
        const id = await solicitudViaje.crearSolicitud({id_solicitante,motivo,solicitante,vehiculo_solicitado},usuario)
        res.status(201).json({ id, mensaje: " Viaje solicitado " })
    }catch(e){
         console.error(e)
        res.status(500).json({ error: " Error al agregar solicitud " })
    }
}
//Aprueba una solicitud de un viaje id
export async function aprobarSolicitud(req:Request,res:Response){
    try{
          const id=Number(req.params.id)
          const {motivo} = req.body
          const autor = (req.usuario as any).nombre
          const autorMail = (req.usuario as any).correo
          const response = await solicitudViaje.aprobarSolicitud(id,motivo,autor,autorMail)
          if(!response){
            return res.status(404).json({error: "No se logro completar la aprobación de la solicitud"})
          }
          res.status(200).json({id,mensaje: "Viaje aprobado correctamente"})
    }catch(e){
        console.log("error solicitud")
        res.status(500).json({error: " Error al agregar aprobar solicitud "})
    }
}
//Devuelve las solicitudes
export async function getSolicitudes(req:Request,res:Response) {
    try{
        const solicitudes = await solicitudViaje.getSolicitudes()
        res.json(solicitudes)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar solicitudes "})
    }
}
//Devuelve las solicitudes de un usuario
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
//Rechaza una solicitud de un viaje id
export async function rechazarSolicitud(req:Request,res:Response){
    try{
        const id = Number(req.params.id)
        const {motivo} = req.body
        const autor = (req.usuario as any).nombre
        const autorMail = (req.usuario as any).correo
        const response = await solicitudViaje.rechazarSolicitud(id,motivo,autor,autorMail)
        if(!response){
            return res.status(404).json({ error: " No se logro completar el rechazo de solicitud " })
        }
        res.status(200).json({id,mensaje:" Viaje rechazado correctamente"})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al rechazar solicitud "})
    }
}