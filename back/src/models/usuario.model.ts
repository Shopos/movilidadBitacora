import { connection } from "../config/database"
import { RowDataPacket } from "mysql2"
import bcrypt from "bcrypt"

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
export interface UsuarioEdit{
    estado:string,
    tipo_licencia:string
}
export async function getAllUsuarios(): Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        "SELECT * FROM usuarios"
    )
    return rows
}

export async function getUsuarioCorreo(correo:string|string[]): Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        "SELECT * FROM usuarios WHERE correo = ? ",[correo]
    )
    return rows
}

async function hashPass(pass:string) :Promise<string>{
    const saltRounds= 11
    const hash = await bcrypt.hash(pass,saltRounds)
    return hash
}

export async function addUsuario(data:UsuarioInput):Promise<Number>{
    const passEncrypt  = await hashPass(data.pass)
    console.log(passEncrypt)
    const [res] = await connection.query(
        "INSERT INTO usuarios (correo,pass,tipo_licencia,nombre,cargo,estado) VALUES (?,?,?,?,?,?)",
        [data.correo,passEncrypt,data.tipo_licencia,data.nombre,data.cargo,data.estado]
    )
    //@ts-ignore
    return res.insertId
}

export async function editUsuario(correo:string|string[],data:UsuarioEdit):Promise<boolean>{
    const [resultado] = await connection.query(
        "UPDATE usuarios SET estado=?, tipo_licencia=? WHERE correo = ?",
        [data.estado,data.tipo_licencia,correo]
    )
    //@ts-ignore
    return(resultado.affectedRows>0)
}
