import { connection } from "../config/database"
import { RowDataPacket } from "mysql2"

export interface Viaje extends RowDataPacket{
    id_viaje:number,
    vehiculo:string, 
    id_usuario:number,
    patente:string, 
    kms_inicio:number, 
    fecha_hora_inicio:string, //separar fecha y hora al pedir datos
    lat_inicio:number,
    lng_inicio:number,
    kms_fin:number,
    fecha_hora_fin:string, //separar fecha y hora al pedir datos
    destino:string, 
    lat_fin:number,
    lng_fin:number,
    lat_fin_real:number,
    lng_fin_real:number,
    motivo:string,
    obs_viaje:string,
    carga_combustible:boolean,
    cantidad_combustible:number,
    nombre_funcionario:string, //
    estado_viaje:boolean,
    ultima_modificacion:string,
    modificado_por:string
}
export interface ViajeInputInicio{
    vehiculo:string,
    id_usuario:number,
    patente:string,
    kms_inicio:number,
    fecha_hora_inicio:string,
    lat_inicio:number,
    lng_inicio:number,
    destino:string,
    lat_fin:number,
    lng_fin:number,
    motivo:string,
    nombre_funcionario:string,
    estado_viaje:boolean,
    ultima_modificacion:string,
    modificado_por:string
}
export interface ViajeInputFin{
    fecha_hora_fin:string,
    lat_fin_real:number,
    lng_fin_real:number,
    obs_viaje:string,
    carga_combustible:boolean,
    cantidad_combustible:number,
    ultima_modificacion:string,
    modificado_por: string
}

export async function getAllViajes(): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes"
    )
    return rows
}

export async function getViajeIdUsuario(id:number): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes WHERE id_usuario = ?",[id]
    )
    return rows
} 

export async function getViajeNombreUsuario(id:string): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT usuarios.nombre, viajes.* FROM viajes,usuarios WHERE viajes.id_usuario = usuarios.id_usuario and usuarios.nombre = ? ",
        [id]
    )
    return rows
}

export async function getViajePatente(id:string): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes WHERE patente = ?",[id]
    )
    return rows
}

export async function addViajeInicio(data:ViajeInputInicio): Promise<ViajeInputInicio>{
    const [resultado] = await connection.query(
         `INSERT INTO viajes (
         vehiculo,
         id_usuario,
         patente,
         kms_inicio,
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
        modificado_por)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `,
        [
            data.vehiculo,
            data.id_usuario,
            data.patente,
            data.kms_inicio,
            data.fecha_hora_inicio,
            data.lat_inicio,
            data.lng_inicio,
            data.destino,
            data.lat_fin,
            data.lng_fin,
            data.motivo,
            data.nombre_funcionario,
            data.estado_viaje,
            data.ultima_modificacion
        ]
    )
    //@ts-ignore
    return resultado.insertId
}
export async function editViajeFin(patente:string,user:number,data:ViajeInputFin): Promise<boolean>{
    const [resultado] = await connection.query(
        `UPDATE viajes SET 
        fecha_hora_fin = ?, 
        lat_fin_real = ?,
        lng_fin_real = ?,
        obs_viaje = ?,
        carga_combustible = ?,
        cantidad_combustible = ?,
        estado_viaje = ?,
        ultima_modificacion = ?,
        modificado_por = ?
        
        WHERE patente = ? AND usuario_id = ?
        `,
        [
            data.fecha_hora_fin,
            data.lat_fin_real,
            data.lng_fin_real,
            data.obs_viaje,
            data.carga_combustible,
            data.cantidad_combustible,
            false,
            data.ultima_modificacion,
            data.modificado_por,
            patente,
            user
        ]
    )
    //@ts-ignore
    return (resultado.affectedRows > 0)

}