import { RowDataPacket } from "mysql2";
import { connection } from "../config/database";

export async function queryAsUser<T=any>(
    usuarioResponsable:string,
    sql:string,
    params:any[]=[]
):Promise<T>{
    const conn = await connection.getConnection()
    try{
        await conn.query("SET @usuario_actual = ?",[usuarioResponsable])
        const [result] = await conn.query(sql,params)
        return result as T
    }finally{
        conn.release
    }
}

export async function registroEvento(tabla:string,idRegistro:string|number|null,accion:"INSERT"|"UPDATE"|"DELETE"|"LOGIN",usuarioResponsable:string,datosNuevos?:Record<string,any>){
    await connection.query(
        `INSERT INTO auditoria (tabla_afectada,id_registro,accion,cambiado_por,valor_new)
        VALUES (?,?,?,?,?)`,[tabla,idRegistro,accion,usuarioResponsable,datosNuevos ? JSON.stringify(datosNuevos):null]
    )
}