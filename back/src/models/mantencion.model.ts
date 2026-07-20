import { connection } from "../config/database"
import { RowDataPacket } from "mysql2"
import { queryAsUser } from "../utils/auditoria.utils"

export interface Mantencion extends RowDataPacket{
    id_mantencion:Number,
    ultimo_cambio_aceite:String,
    taller:String,
    ultima_mantencion:String,
    detalle_mantencion:String,
    patente:string
}

export interface mantencionInput{
    ultimo_cambio_aceite:String,
    taller:String,
    ultima_mantencion:String,
    detalle_mantencion:String,
    patente:string
}

//Metodo que devuelve todas las mantenciones de un vehiculo cuya patente sea igual a la solicitada
export async function getMantencionesVehiculo(patenteBuscada:string|string[]):Promise<Mantencion[]|null>{
    const [rows]=await connection.query<Mantencion[]>(
        "SELECT * FROM mantenciones WHERE patente = ?", [patenteBuscada]
    )
    return rows
}

//Metodo que agrega una mantencion
export async function addMantencion(data:mantencionInput,usuarioResponsable:string):Promise<number> {
    const resultado:any = await queryAsUser(usuarioResponsable,
        "INSERT INTO mantenciones (ultimo_cambio_aceite,taller,ultima_mantencion,detalle_mantencion,patente) VALUES (?,?,?,?,?)",
        [data.ultimo_cambio_aceite,data.taller,data.ultima_mantencion,data.detalle_mantencion,data.patente]
    )
    //@ts-ignore
    return resultado.insertId
}