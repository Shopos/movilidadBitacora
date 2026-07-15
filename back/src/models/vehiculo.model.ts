import {connection}from "../config/database"
import {RowDataPacket} from 'mysql2'

export interface Vehiculo extends RowDataPacket{
    patente:String,
    modelo:String,
    kms_actual:Number,
    estado: "DISPONIBLE"|"EN RUTA"|"EN REPARACION"|"DADO DE BAJA"
}
export interface vehiculoEdit {
    kms_actual:Number,
    estado: "DISPONIBLE"|"EN RUTA"|"EN REPARACION"|"DADO DE BAJA"
}
export interface vehiculoInput {
    patente:String,
    modelo:String,
    kms_actual:Number,
    estado: "DISPONIBLE"|"EN RUTA"|"EN REPARACION"|"DADO DE BAJA"
    tipo_vehiculo: "Automóvil"|"Motocicleta"|"Bus"|"Camioneta"|"Furgón"|"Camión"|"Maquinaria"
}
const licenciasPorVehiculo = {
    "Automóvil": "B",
    "Camioneta": "B",
    "Bus": "A2",
    "Camión": "A4",
    "Furgón": "A2",
    "Maquinaria": "D",
    "Motocicleta": "C"
};
//Metodo que devuelve todos los vehiculos
export async function getAllVehiculos(): Promise<Vehiculo[]>{
    const [rows] =  await connection.query<Vehiculo[]>(
        "SELECT * FROM vehiculos"
    )
    return rows
}

//Metodo que devuelve un vehiculo cual patente sea igual a la solicitada
export async function getVehiculo(patenteBusqueda:string|string[]): Promise<Vehiculo[] | null>{
    const [rows] = await connection.query<Vehiculo[]>(
        "SELECT * FROM vehiculos WHERE patente = ?", [patenteBusqueda]
    )
    return rows
}

//Metodo que agrega un vehiculo
export async function addVehiculo(data:vehiculoInput): Promise<number>{
    const licencia_min = licenciasPorVehiculo[data.tipo_vehiculo]||"B"
    const [resultado] = await connection.query(
        "INSERT INTO vehiculos (patente,modelo,kms_actual,estado,tipo_vehiculo,licencia_min) VALUES (?,?,?,?,?,?)",
        [data.patente,data.modelo,data.kms_actual,data.estado,data.tipo_vehiculo,licencia_min]
    )
    //@ts-ignore
    return resultado.insertId
}

//Metodo que edita la informacion de un vehiculo
export async function editVehiculo(patenteBusqueda:string|string[], data:vehiculoEdit): Promise<boolean>{
    const [resultado] = await connection.query(
        "UPDATE vehiculos SET kms_actual=?,estado=? WHERE patente = ?",
        [data.kms_actual,data.estado, patenteBusqueda]
    )
    //@ts-ignore
    return (resultado.affectedRows > 0)
}


//Metodo para cambiar el estado de un vehiculo
export async function changeStatus(patente:string,status:string):Promise<boolean>{
    const [res] = await connection.query(
        "UPDATE vehiculos SET estado=? WHERE patente = ?",
        [status,patente]
    )
    //@ts-ignore
    return (res.affectedRows > 0)
}
//Metodo para cambiar el kilometraje de un vehiculo {patente}
export async function changeKms(patente:string, cantidad:Number):Promise<boolean>{  
    const [res] = await connection.query(
        "UPDATE vehiculos set kms_actual= ? WHERE patente= ?",
        [cantidad,patente]
    )
    //@ts-ignore
    return (res.affectedRows>0)
}
