import { RowDataPacket } from "mysql2";
import { connection } from "../config/database"
export interface SolicitudReset extends RowDataPacket{
    id_solicitud:number,
    id_usuario:number,
    correo:string,
    nombre:string,
    fecha_solicitada:string,
    estado:"pendiente"|"resuelta",
    resuelta_por:string,
    fecha_resuelta:string
}

export async function crearSolicitud(id_usuario:Number,correo:String,nombre:String):Promise<boolean>{
    //marcar solicitudes anteriores y evitar duplicados
    await connection.query(
        `UPDATE solicitudes_reset 
        SET estado='resuelta', resuelta_por='duplicada-sistema',fecha_resuelta=NOW() 
        WHERE id_usuario=? AND estado='pendiente'`,[id_usuario]
    )
    //solicitar nueva solicitud
    const [rows] = await connection.query(
        `INSERT INTO solicitudes_reset
        (id_usuario,correo,nombre) VALUES (?,?,?)`,[id_usuario,correo,nombre]
    )
    //@ts-ignore
    return rows.insertId
}

export async function getSolicitudes():Promise<SolicitudReset[]>{
    //Devolver todas las solicitudes
    const [rows] = await connection.query<SolicitudReset[]>("SELECT * FROM solicitudes_reset WHERE estado='pendiente'")
    return rows
}

export async function resolverSolicitud(id:Number,resueltoPor:string):Promise<boolean> {
    const [rows] = await connection.query(
        `UPDATE solicitudes_reset
        SET estado='resuelta', resuelta_por=?, fecha_resuelta=NOW()
        WHERE id_solicitud=? AND estado='pendiente'
        `,[resueltoPor,id]
    )
    //@ts-ignore
    return rows.affectedRows > 0
}