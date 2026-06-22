import { connection } from "../config/database"
import { RowDataPacket } from "mysql2"


export interface Usuario extends RowDataPacket{
    id_usuario: Number,
    correo:String,
    pass:String,
    tipo_licencia:String,
    nombre:String,
    cargo:String,
    estado:boolean
}
export interface UsuarioInput {
    correo:String,
    pass:string,
    tipo_licencia:string,
    nombre:string,
    cargo:string,
    estado:boolean
}

export async function getAllUsuarios(): Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        "SELECT * FROM usuarios"
    )
    return rows
}