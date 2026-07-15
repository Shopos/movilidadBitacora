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
    estado:boolean,
    estado_viaje_usuario:string,
}
export interface UsuarioInput {
    correo:String,
    pass:string,
    tipo_licencia:string,
    nombre:string,
    cargo:string, //Administrativo || Funcionario
    estado:boolean,
}
export interface UsuarioEdit{
    estado:string,
    tipo_licencia:string,
    lista_licencia:string[]
}
//Metodo que devuelve todos los usuarios
export async function getAllUsuarios(): Promise<any[]>{
    const [rows] = await connection.query<Usuario[]>(
        `SELECT u.*, GROUP_CONCAT(lu.tipo_licencia) AS licencias_concat
            FROM usuarios u LEFT JOIN licencias_usuario lu ON lu.id_usuario = u.id_usuario
            GROUP BY u.id_usuario`
    )
    return rows
}
//Metodo que devuelve el usuario cual correo sea igual al solicitado
export async function getUsuarioCorreo(correo:string|string[]): Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        `SELECT * from usuarios where correo=?`,[correo]
    )
    return rows
}
//Metodo que devuelve el id de un usuario cuyo correo y nombre sean iguales al solicitado
export async function getIdUsuario(correo:string, nombre:string):Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        "SELECT id_usuario FROM usuarios WHERE correo=? AND nombre=?",[correo,nombre]
    )
    return rows
}

//Metodo que devuelve el usuario cual id sea igual al solicitado
export async function getUsuarioId(id:number): Promise<Usuario[]>{
    const [rows] = await connection.query<Usuario[]>(
        "SELECT * FROM usuarios WHERE id_usuario = ?",[id]
    )
    return rows
}
//Metodo para encriptar contraseña
async function hashPass(pass:string) :Promise<string>{
    const saltRounds= 11
    const hash = await bcrypt.hash(pass,saltRounds)
    return hash
}

//Agrega un usuario y encripta su contraseña haciendo uso de bcrypt
export async function addUsuario(data:UsuarioInput):Promise<Number>{
    const passEncrypt  = await hashPass(data.pass)
    const [res] = await connection.query(
        "INSERT INTO usuarios (correo,pass,tipo_licencia,nombre,cargo,estado) VALUES (?,?,?,?,?,?)",
        [data.correo,passEncrypt,data.tipo_licencia,data.nombre,data.cargo,data.estado]
    )
    
    //@ts-ignore
    return res.insertId
}
//Edita el usuario donde solo se podra actualizar su estado y licencia 
export async function editUsuario(correo:string|string[],data:UsuarioEdit):Promise<boolean>{
    const [resultado] = await connection.query(
        "UPDATE usuarios SET estado=?, tipo_licencia=? WHERE correo = ?",
        [data.estado,data.tipo_licencia,correo]
    )
    if(data.lista_licencia){
        const [rows] = await connection.query<RowDataPacket[]>("SELECT id_usuario FROM usuarios WHERE correo=?",[correo])
        if(rows[0]){
            await addLicencias(rows[0].id_usuario,data.lista_licencia)
            //Verificar que no existan id del usuario con las mismas licencias para evitar duplicados
            //Agregar las licencias 
        }
    }
    //@ts-ignore
    return(resultado.affectedRows>0)
}
//Cambia el estado viaje del usuario
export async function changeStatus(id:number, status:string):Promise<boolean>{
    const [res] = await connection.query(
        "UPDATE usuarios SET estado_viaje_usuario=? WHERE id_usuario=?", [status,id]
    )
    //@ts-ignore
    return(res.affectedRows>0)
}

export async function addLicencias(id:Number,lista:string[]){
    await connection.query("DELETE FROM licencias_usuario WHERE id_usuario=?",[id])
    if(!lista||lista.length===0)return
    const val = lista.map((lic)=>[id,lic])
    await connection.query(
        "INSERT INTO licencias_usuario (id_usuario,tipo_licencia) VALUES ? ",[val]
    )
}

export async function addLicenciasIniciales(id:Number,lista:string[]){
    if(!lista||lista.length===0)return
    const val = lista.map((lic)=>[id,lic])
    const res = await connection.query(
        "INSERT INTO licencias_usuario (id_usuario,tipo_licencia) VALUES ? ",[val]
    )
    //@ts-ignore
    return res.insertId
}

export async function getLicenciasUsuario(id_usuario:number):Promise<string[]>{
    const [rows]=await connection.query<RowDataPacket[]>(
        "SELECT tipo_licencia FROM licencias_usuario WHERE id_usuario=?",[id_usuario]
    )
    return rows.map(r=>r.tipo_licencia)
}