import { Request, Response } from "express";
import * as viajesModel from "../models/viaje.model"
import * as vehiculoModel from "../models/vehiculo.model"
import * as usuarioModel from "../models/usuario.model"

/* Controladores para el llamado al modelo de viajes con el fin de manejar correctamente la informacion solicitada y recibida */

//Metodo para solicitar los viajes al modelo de viajes
export async function getViajes(req: Request, res: Response) {
    try {
        const viajes = await viajesModel.getAllViajes()
        res.json(viajes)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al listar viajes " })
    }
}

export async function getViajeByid(id: number) {
    try {
        const ide = Number(id)
        const viaje = await viajesModel.getViajeId(ide)
        return viaje
    } catch (e) {
        console.error(e)
    }
}

export async function getViajeIdUsuario(req: Request, res: Response) {
    try {
        const viajeBuscado = Number(req.params.id)
        const viaje = await viajesModel.getViajeIdUsuario((viajeBuscado))
        if (!viaje) {
            return res.status(404).json({ Error: " Error encontrando viaje " })
        }
        res.json(viaje)
    } catch (e) {
        res.status(500).json({ Error: " Error al buscar viaje " })
    }
}

/*Metodo para agregar informacion inicial al viaje correspondiente

    parametro esperado a solicitar agregar viaje:Viaje

    Se hace participe ademas el modelo de vehiculo para cambiar el estado del vehiculo a "EN RUTA"
    con el fin de que no existan dos viajes con un vehiculo participando al mismo tiempo
*/
export async function addViajeInicio(req: Request, res: Response) {

    try {
        const {
            vehiculo,
            id_usuario,
            patente,
            kms_inicial,
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
            kms_fin,
            modo
        } = req.body

        console.log(req.body)
        if (patente === " " && nombre_funcionario === "" && !estado_viaje) {
            return res.status(400).json({ error: " Los campos patente, nombre funcionario no pueden estar vacios " })
        }
        const id = await viajesModel.addViajeInicio({
            vehiculo,
            id_usuario,
            patente,
            kms_inicial,
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
            kms_fin,
            modo
        })
        await vehiculoModel.changeStatus(patente, "EN RUTA")
        await usuarioModel.changeStatus(id_usuario, "Asignado")
        res.status(201).json({ id, mensaje: " Viaje agregado inicialmente " })

    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al agregar un viaje inicial" })
    }
}

/* Metodo para agregar la informacion faltante a un viaje iniciado 
    parametro esperado a solicitar id:string --> patente {Para comprobar si el vehiculo realmente esta en ruta}
    parametro esperado a solicitar {datos}:viajeInputFin

    se hace uso del metodo checkPatente, si es verdadero se agrega la informacion, caso contrario cancela la accion
    Una vez agregada la informacion, libera el vehiculo involucrado cambiando su estado a "DISPONIBLE"
*/
export async function addViajeFin(req: Request, res: Response) {
    try {
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

        if (await checkPatente(String(id))) {
            const actualiza = await viajesModel.editViajeFin(id, {
                cantidad_combustible,
                carga_combustible,
                fecha_hora_fin,
                lat_fin_real,
                lng_fin_real,
                modificado_por,
                ultima_modificacion,
                obs_viaje,
                kms_fin,
                estado_viaje,
            })
            if (!actualiza) {
                return res.status(404).json({ error: " no se pudo actualizar el viaje" })
            }
            res.json({ msg: " Viaje finalizado" })
            await vehiculoModel.changeStatus(String(id), "DISPONIBLE")
            await handleChangeKMS(kms_fin, String(id))
        } else {
            console.log({ msg: " Problema al agregar nuevos datos a este viaje" })
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error al finalizar viaje" })
    }
}

/* Metodo para comprobar la patente de un vehiculo */
async function checkPatente(patente: string): Promise<boolean> {
    const res = await viajesModel.checkPatenteEstado(patente)

    return res.length > 0
}

async function handleChangeKMS(cantidad: Number, patente: string) {
    const res: vehiculoModel.Vehiculo[] | null = await vehiculoModel.getVehiculo(patente)

    if (res && res[0].kms_actual < cantidad) {
        await vehiculoModel.changeKms(patente, cantidad)
    }
}

export async function getViajeIdUsuarioEspera(req: Request, res: Response) {
    try {
        const viajeBuscado = Number(req.params.id)
        const viaje = await viajesModel.getViajeIdUsuarioEspera((viajeBuscado))
        if (!viaje) {
            return res.status(404).json({ Error: " Error encontrando viaje " })
        }
        res.json(viaje)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error encontrando viaje" })
    }
}

export async function parcheInicio(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const { fecha_hora_inicio, ultima_modificacion, modificado_por } = req.body
        const viaje = await getViajeByid(Number(id))
        if (!viaje) {
            return res.status(404).json({ error: 'Viaje no encontrado' })
        }
        if (viaje[0].estado_viaje !== "En espera") {
            return res.status(400).json({ error: " El viaje asignado no esta en modo 'En espera' " })
        }
        if (fecha_hora_inicio === "" && ultima_modificacion === "" && modificado_por === "") {
            return res.status(400).json({ error: " Los campos fecha_hora_inicio no puede estar vacio " })
        }
        const resultado = await viajesModel.parcheInicio(id, { fecha_hora_inicio, ultima_modificacion, modificado_por })
        if (!resultado) {
            return res.status(404).json({ error: " No se logro actualizar viaje al inicio " })
        }
        res.json({ msg: " Viaje iniciado " })
        usuarioModel.changeStatus(Number(viaje[0].id_usuario), "En ruta")

    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error ingresando datos iniciales " })
    }
}

export async function parcheFin(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const {
            fecha_hora_fin,
            obs_viaje,
            carga_combustible,
            cantidad_combustible,
            ultima_modificacion,
            modificado_por,
            kms_fin
            } = req.body
        const viaje = await getViajeByid(Number(id))
        if (!viaje) {
            return res.status(404).json({ error: 'Viaje no encontrado' })
        }
        if (viaje[0].estado_viaje !== "En proceso") {
            return res.status(400).json({ error: " El viaje encontrado no esta en modo 'En proceso' " })
        }
        if(fecha_hora_fin === "" && modificado_por === "" && ultima_modificacion === ""){
            return res.status(400).json({error: " Los campos fecha_hora_fin no puede estar vacio "})
        }
        const resultado = await viajesModel.parcheFin(id,{
            fecha_hora_fin,
            obs_viaje,
            carga_combustible,
            cantidad_combustible,
            ultima_modificacion,
            modificado_por,
            kms_fin
            },
        )
        if(!resultado){
            return res.status(404).json({ error: " No se logro actualizar los datos finales del viaje " })
        }
        //Liberar usuario
        if(viaje[0].modo==="ida"){
            //generar viaje de vuelta con datos inversos, En espera
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error ingresando datos iniciales " })
    }
}