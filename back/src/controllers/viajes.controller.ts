import { Request, Response } from "express";
import * as viajesModel from "../models/viaje.model"
import * as vehiculoModel from "../models/vehiculo.model" 

/* Controladores para el llamado al modelo de viajes con el fin de manejar correctamente la informacion solicitada y recibida */

//Metodo para solicitar los viajes al modelo de viajes
export async function getViajes(req:Request,res:Response){
    try{
        const viajes = await viajesModel.getAllViajes()
        res.json(viajes)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar viajes "})
    }
}

/*Metodo para agregar informacion inicial al viaje correspondiente

    parametro esperado a solicitar agregar viaje:Viaje

    Se hace participe ademas el modelo de vehiculo para cambiar el estado del vehiculo a "EN RUTA"
    con el fin de que no existan dos viajes con un vehiculo participando al mismo tiempo
*/
export async function addViajeInicio(req:Request,res:Response){
    
    try{
        const {
            vehiculo,
            id_usuario,
            patente,
            kms_inicial,
            fecha_hora_inicio,
            lat_inicio,
            lng_inicio,
            destino,
            lat_fin,
            lng_fin,
            motivo,
            nombre_funcionario,
            estado_viaje,
            ultima_modificacion,
            modificado_por,
            kms_fin
        } = req.body

        console.log(req.body)
    if( patente===" " && nombre_funcionario==="" && !estado_viaje ){
        return res.status(400).json({error:" Los campos patente, nombre funcionario no pueden estar vacios "})
    }
    const id = await viajesModel.addViajeInicio({
            vehiculo,
            id_usuario,
            patente,
            kms_inicial,
            fecha_hora_inicio,
            lat_inicio,
            lng_inicio,
            destino,
            lat_fin,
            lng_fin,
            motivo,
            nombre_funcionario,
            estado_viaje,
            ultima_modificacion,
            modificado_por,
            kms_fin
        })
    await vehiculoModel.changeStatus(patente,"EN RUTA")

    res.status(201).json({id, mensaje: " Viaje agregado inicialmente "})
    
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al agregar un viaje inicial"})
    }
}

/* Metodo para agregar la informacion faltante a un viaje iniciado 
    parametro esperado a solicitar id:string --> patente {Para comprobar si el vehiculo realmente esta en ruta}
    parametro esperado a solicitar {datos}:viajeInputFin

    se hace uso del metodo checkPatente, si es verdadero se agrega la informacion, caso contrario cancela la accion
    Una vez agregada la informacion, libera el vehiculo involucrado cambiando su estado a "DISPONIBLE"
*/
export async function addViajeFin(req:Request,res:Response){
    try{
        const id = req.params.patente
        const { cantidad_combustible,
        carga_combustible,
        fecha_hora_fin,
        lat_fin_real,
        lng_fin_real,
        modificado_por,
        ultima_modificacion,
        obs_viaje,
        kms_fin,
        estado_viaje,
        } = req.body

        if(await checkPatente(String(id))){
            const actualiza = await viajesModel.editViajeFin(id,{ cantidad_combustible,
            carga_combustible,
            fecha_hora_fin,
            lat_fin_real,
            lng_fin_real,
            modificado_por,
            ultima_modificacion,
            obs_viaje,
            kms_fin,
            estado_viaje,})
            if(!actualiza){
                return res.status(404).json({error: " no se pudo actualizar el viaje"})
            }
            res.json({msg: " Viaje finalizado"})
            await vehiculoModel.changeStatus(String(id),"DISPONIBLE")
        }else{
            console.log({msg: " Problema al agregar nuevos datos a este viaje"})
        }
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al finalizar viaje"})
    }
}

/* Metodo para comprobar la patente de un vehiculo */
async function checkPatente (patente:string) : Promise<boolean>{
    const res = await viajesModel.checkPatenteEstado(patente)

    return res.length > 0
}