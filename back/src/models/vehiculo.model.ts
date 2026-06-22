import {connection}from "../config/database"
import {RowDataPacket} from 'mysql2'

export interface Vehiculo extends RowDataPacket{
    patente:String,
    modelo:String,
    kms_actual:Number,
    estado: "DISPONIBLE"|"EN RUTA"|"EN REPARACION"|"DADO DE BAJA"
}

export interface vehiculoInput {
    patente:String,
    modelo:String,
    kms_actual:Number,
    estado: "DISPONIBLE"|"EN RUTA"|"EN REPARACION"|"DADO DE BAJA"
}

export async function getAllVehiculos(): Promise<Vehiculo[]>{
    const [rows] =  await connection.query<Vehiculo[]>(
        "SELECT * FROM vehiculos"
    )
    return rows
}

export async function getVehiculo(patenteBusqueda:string|string[]): Promise<Vehiculo[] | null>{
    const [rows] = await connection.query<Vehiculo[]>(
        "SELECT * FROM vehiculos WHERE patente = ?", [patenteBusqueda]
    )
    return rows
}
export async function addVehiculo(data:vehiculoInput): Promise<number>{
    const [resultado] = await connection.query(
        "INSERT INTO vehiculos (patente,modelo,kms_actual,estado) VALUES (?,?,?,?)",
        [data.patente,data.modelo,data.kms_actual,data.estado]
    )
    //@ts-ignore
    return resultado.insertId
}

export async function editVehiculo(patenteBusqueda:string|string[], data:vehiculoInput): Promise<boolean>{
    const [resultado] = await connection.query(
        "UPDATE vehiculos SET kms_actual=?,estado=? WHERE patente = ?",
        [data.kms_actual,data.estado, patenteBusqueda]
    )
    //@ts-ignore
    return (resultado.affectedRows > 0)
}