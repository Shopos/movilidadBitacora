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
//Metodo para solicitar los viajes cuyo id sea igual al solicitado
export async function getViajeByid(id: number) {
    try {
        const ide = Number(id)
        const viaje = await viajesModel.getViajeId(ide)
        return viaje
    } catch (e) {
        console.error(e)
    }
}
//Metodo para solicitar y entregar un viaje que este en estado "En proceso"
export async function getViajeProceso(req:Request,res:Response) {
    try {
        const ide = Number(req.params.id)
        const viaje = await viajesModel.getViajeProceso(ide)
        if(viaje && viaje.length>0){
            res.json(viaje[0])
        }else{
            return res.json(null)
        }
        
    } catch (e) {
        console.error(e)
    }
}
//Metodo que solicita y entrega todos los viajes de un usuario
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



//Metodo que solicita y entrega los viajes al usuario{id} y el estado del viaje sea "En espera"
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


/** Metodo para agregar la informacion necesaria para iniciar un viaje
 * Se cambia el estado del usuario involucrado en el viaje a "En ruta"
 */
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
/**Metodo para ingresar los datos faltantes de un viaje 
 * 
 * Se cambia el kilometraje del vehiculo por el kilometraje final registrado en el formulario y se asigna al vehiculo
 * Si el viaje a agregar informacion faltante es del modo "ida" --> se genera un viaje adicional con los datos inversos y con modo "vuelta"
 * Si el viaje a agregar informacion faltante es del modo "vuelta" --> cambia el estado del vehiculo a "DISPONIBLE" y del usuario involucrado a "Disponible"
*/
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

        await vehiculoModel.changeKms(viaje[0].patente, kms_fin)
        if(!resultado){
            return res.status(404).json({ error: " No se logro actualizar los datos finales del viaje " })
        }
        
        if(viaje[0].modo==="ida"){
            try{
                const id = await viajesModel.addViajeRegreso(viaje[0],ultima_modificacion,kms_fin)
                res.status(201).json({ id, mensaje: " Viaje agregado inicialmente " })
            }catch(e){
                console.error(e)
                res.status(500).json({ error: " Error al agregar viaje de regreso" })
            }
        }
        if(viaje[0].modo==="vuelta"){
            //Liberar usuario vehiculo
            await vehiculoModel.changeStatus(viaje[0].patente, "DISPONIBLE")
            await usuarioModel.changeStatus(Number(viaje[0].id_usuario), "Disponible")
            res.status(201).json({mensaje:" Viaje finalizado "})
        }
        
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: " Error ingresando datos iniciales " })
    }
}

export async function editarViaje(req:Request,res:Response){
    try{
        const id = Number(req.params.id)
        const adminName = (req.usuario as any).nombre
        const ahora = new Date()
        const ultimaModificacion=`${ahora.getFullYear()}-${String(ahora.getMonth()+1).padStart(2,'0')}-${String(ahora.getDate()).padStart(2,'0')} ${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}`

        const viajeEncontrado = await viajesModel.getViajeId(id)
        if(viajeEncontrado[0].estado_viaje === "Terminado"){
            const {obs_viaje,cantidad_carga} = req.body

            const actualizaTerminado = await viajesModel.editarTerminado(id,
                {
                    obs_viaje,
                    cantidad_carga,
                    ultimaModificacion,
                    adminName
                })
            if(!actualizaTerminado){
                return res.status(404).json({error: "Viaje no encontrado"})
            }
            res.json({mensaje: "Viaje editado correctamente"})
        }
        if(viajeEncontrado[0].estado_viaje==="En espera"){
            const {patente,vehiculo,kms_inicial,id_usuario,nombre_funcionario,motivo,destino,lat_fin,lng_fin} = req.body
            
            if(id_usuario && id_usuario !== viajeEncontrado[0].id_usuario){
                await usuarioModel.changeStatus(Number(viajeEncontrado[0].id_usuario),"Disponible")
                await usuarioModel.changeStatus(Number(id_usuario),"Asignado")
            }

            if(patente && patente !== viajeEncontrado[0].patente){
                await vehiculoModel.changeStatus(viajeEncontrado[0].patente,"DISPONIBLE")
                await vehiculoModel.changeStatus(patente,"EN RUTA")
            }

            const actualizaEspera = await viajesModel.editarEspera(id,
                {
                    patente:patente ?? viajeEncontrado[0].patente,
                    vehiculo:vehiculo ?? viajeEncontrado[0].vehiculo,
                    kms_inicial:kms_inicial || viajeEncontrado[0].kms_inicio,
                    id_usuario:id_usuario || viajeEncontrado[0].id_usuario,
                    nombre_funcionario:nombre_funcionario ?? viajeEncontrado[0].nombre_funcionario,
                    destino:destino ?? viajeEncontrado[0].destino,
                    motivo:motivo ?? viajeEncontrado[0].motivo,
                    lat_fin:lat_fin || viajeEncontrado[0].lat_fin,
                    lng_fin:lng_fin || viajeEncontrado[0].lng_fin,
                    modificado_por:adminName,
                    ultima_modificacion:ultimaModificacion
                })
            if(!actualizaEspera){
                return res.status(404).json({error: "Viaje no encontrado"})
            }
            res.json({mensaje: "Viaje editado correctamente"})
        }

    }catch(e){
        console.error(e)
        res.status(500).json({error: "Error al editar el viaje"})
    }
}