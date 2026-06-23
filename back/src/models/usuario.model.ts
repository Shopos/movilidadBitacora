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

const hashPass = (pass:string) =>{
    bcrypt.genSalt(10,function(err,salt){
        if(err){
            return
        }
        bcrypt.hash(pass,salt,function(err,hash){
            if(err){
                return
            }
            return hash
        })
    })
}

export async function addUsuario(data:UsuarioInput):Promise<Number>{
    const passEncrypt  = hashPass(data.pass)
    const [res] = await connection.query(
        "INSERT INTO usuarios (correo,pass,tipo_licencia,nombre,cargo,estado) VALUES (?,?,?,?,?,?)",
        [data.correo,passEncrypt,data.tipo_licencia,data.nombre,data.cargo,data.estado]
    )
    //@ts-ignore
    return res.insertId
}