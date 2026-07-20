import { RowDataPacket } from "mysql2"
import { connection } from "../config/database"
import { queryAsUser } from "../utils/auditoria.utils"

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
//Agrega una solicitud de viaje
export async function crearSolicitud(data:solicitudViaje,usuarioResponsable:string):Promise<boolean>{
    //solicitar nueva solicitud
    const rows:any = await queryAsUser(usuarioResponsable,
        `INSERT INTO solicitudes_viaje
        (id_solicitante,solicitante,motivo,vehiculo_solicitado) VALUES (?,?,?,?)`,
        [data.id_solicitante,data.solicitante,data.motivo,data.vehiculo_solicitado]
    )
    //@ts-ignore
    return rows.insertId
}
//Devuelve todas las solicitudes actuales de viajes
export async function getSolicitudes():Promise<solicitud[]>{
    const [rows] = await connection.query<solicitud[]>(
        "SELECT * FROM solicitudes_viaje"
    )
    return rows
}
//Devuelve las solicitudes de viajes de un usuario
export async function getSolicitudesUsuario(id:number):Promise<solicitud[]>{
    const [rows] = await connection.query<solicitud[]>(
        "SELECT * FROM solicitudes_viaje WHERE id_solicitante=?",[id]
    )
    return rows
}
//Actualiza la solicitud a estado Rechazada
export async function rechazarSolicitud(id:number,motivo:string,autor:string,usuarioResponsable:string):Promise<solicitud[]>{
    const rows:any = await queryAsUser(usuarioResponsable,
        `UPDATE solicitudes_viaje
        SET estado='rechazada', resuelta_por=?, fecha_resuelta=NOW(),estado_texto=?
        WHERE id_solicitud=? AND estado='pendiente' `,[autor,motivo,id]
    )
    return rows
}
//Actualiza la solicitud a estado Aprobada
export async function aprobarSolicitud(id:number, motivo:string, autor:string,usuarioResponsable:string): Promise<solicitud[]>{
    const rows:any=await queryAsUser(usuarioResponsable,
        `UPDATE solicitudes_viaje
        SET estado='resuelta',resuelta_por=?, fecha_resuelta=NOW(),estado_texto=?
        WHERE id_solicitud=? AND estado='pendiente' `,[autor,motivo,id]
    )
    return rows
}