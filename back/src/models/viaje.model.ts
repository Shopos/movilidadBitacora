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
    kms_inicial:number,
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
    modificado_por:string,
    kms_fin:number
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
    kms_fin:number
    estado_viaje:boolean
}

//Metodo que devuelve todos los viajes
export async function getAllViajes(): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes"
    )
    return rows
}

//Metodo que devuelve los viajes segun el id de un usuario
export async function getViajeIdUsuario(id:number): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes WHERE id_usuario = ?",[id]
    )
    return rows
} 

//Metodo que devuelve los viajes de un usuario cuyo nombre sea igual al solicitado
export async function getViajeNombreUsuario(id:string): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT usuarios.nombre, viajes.* FROM viajes,usuarios WHERE viajes.id_usuario = usuarios.id_usuario and usuarios.nombre = ? ",
        [id]
    )
    return rows
}

//Metodo que devuelve los viajes segun la patente solicitada
export async function getViajePatente(id:string): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes WHERE patente = ?",[id]
    )
    return rows
}

//Comprobar si la patente existe y esta dentro de un viaje activo
export async function checkPatenteEstado(id:string): Promise<Viaje[]>{
    const [rows] = await connection.query<Viaje[]>(
        "SELECT * FROM viajes WHERE patente= ? AND estado_viaje = ?", [id, 1]
    )
    return rows
}

//Metodo para agregar un viaje con los datos necesarios para comenzar uno
export async function addViajeInicio(data:ViajeInputInicio): Promise<ViajeInputInicio>{
    const [resultado] = await connection.query(
         `INSERT INTO viajes (vehiculo,id_usuario,patente,kms_inicial,fecha_hora_inicio,lat_inicio,lng_inicio,destino,lat_fin,
        lng_fin,
        motivo,
        nombre_funcionario,
        estado_viaje,
        ultima_modificacion,
        modificado_por,
        kms_fin
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `,
        [
            data.vehiculo,
            data.id_usuario,
            data.patente,
            data.kms_inicial,
            data.fecha_hora_inicio,
            data.lat_inicio,
            data.lng_inicio,
            data.destino,
            data.lat_fin,
            data.lng_fin,
            data.motivo,
            data.nombre_funcionario,
            data.estado_viaje,
            data.ultima_modificacion,
            data.modificado_por,
            data.kms_fin
        ]
    )
    //@ts-ignore
    return resultado.insertId
}

//Metodo para editar/agregar informacion de un viaje que termina su recoleccion de informacion
export async function editViajeFin(patente:string|string[],data:ViajeInputFin): Promise<boolean>{
    const [resultado] = await connection.query(
        `UPDATE viajes SET 
        fecha_hora_fin = ?, 
        lat_fin_real = ?,
        lng_fin_real = ?,
        obs_viaje = ?,
        carga_combustible = ?,
        cantidad_carga = ?,
        estado_viaje = ?,
        ultima_modificacion = ?,
        modificado_por = ?,
        kms_fin = ?
        
        WHERE patente = ?
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
            data.kms_fin,
            patente,
        ]
    )
    //@ts-ignore
    return (resultado.affectedRows > 0)

}