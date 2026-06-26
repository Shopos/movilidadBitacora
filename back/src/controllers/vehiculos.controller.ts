import { Request, Response } from 'express'
import * as vehiculoModel from "../models/vehiculo.model"

/* Controladores para el llamado al modelo de vehiculos con el fin de manejar correctamente la informacion solicitada y recibida */

/* Metodo para solicitar los vehiculos al modelo de vehiculos */
export async function getVehiculos(req:Request,res:Response){
    try{
        const vehiculos = await vehiculoModel.getAllVehiculos()
        res.json(vehiculos)
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al listar vehiculos "})
    }
}

/* Metodo para solicitar el vehiculo cuya patente coincida con la solicitada

    parametro esperado a solicitar patente:string
    parametro esperado a recibir vehiculo:Vehiculo
*/
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

/* Metodo para agregar un nuevo vehiculo cuyos datos sean del tipo Vehiculo

    parametro esperado a solicitar vehiculo:VehiculoInput

    si los parametros patente y modelo estan vacios, la solicitud es rechazada
*/

export async function agregarVehiculo(req:Request,res:Response){
    try{
        const {patente, modelo, kms_actual, estado} = req.body
        
        if( patente === "" && modelo === "" ){
            return res.status(400).json({error: " Los campos patente, modelo y estado son obligatorios "})
        }
        const id = await vehiculoModel.addVehiculo({patente,modelo,kms_actual,estado})
        res.status(201).json({id , mensaje: " vehiculo correctamente agregado "})
    }catch(e){
        console.error(e)
        res.status(500).json({error: " Error al agregar vehiculo "})
    }
}


/*Metodo para solicitar la edicion de un vehiculo cuyos datos coincidan con la patente solicitada

    parametros esperados a solicitar id:string (patente) datos{}: (datos a editar) --> kms_actual y estado
*/
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