import { RowDataPacket } from "mysql2"
import { connection } from "../config/database"

export interface solicitudViaje{
    id_solicitante:Number,
    motivo:string,
    vehiculo_solicitado:string,
    solicitante:string
}
export interface solicitud extends RowDataPacket{
    id_solicitud:number,
    id_solicitante:number,
    fecha_solicitada:string,
    fecha_resuelta:string,
    estado:string,
    estado_texto:string,
    vehiculo_solicitado:string,
    resuelta_por:string,
    solicitante:string,
    motivo:string,
}

export async function crearSolicitud(data:solicitudViaje):Promise<boolean>{
    //solicitar nueva solicitud
    const [rows] = await connection.query(
        `INSERT INTO solicitudes_viaje
        (id_solicitante,solicitante,motivo,vehiculo_solicitado) VALUES (?,?,?,?)`,
        [data.id_solicitante,data.solicitante,data.motivo,data.vehiculo_solicitado]
    )
    //@ts-ignore
    return rows.insertId
}

export async function getSolicitudes():Promise<solicitud[]>{
    const [rows] = await connection.query<solicitud[]>(
        "SELECT * FROM solicitudes_viaje"
    )
    return rows
}

export async function rechazarSolicitud(id:number,motivo:string,autor:string):Promise<solicitud[]>{
    const [rows] = await connection.query<solicitud[]>(
        `UPDATE solicitudes_viaje
        SET estado='rechazada', resuelta_por=?, fecha_resuelta=NOW(),estado_texto=?
        WHERE id_solicitud=? AND estado='pendiente' `,[autor,motivo,id]
    )
    return rows
}