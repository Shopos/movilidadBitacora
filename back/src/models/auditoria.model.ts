import { connection } from "../config/database"
import { RowDataPacket } from "mysql2"


export interface FiltroLog {
    tabla?:string
    accion?:string
    usuario?:string
    desde?:string
    hasta?:string
    limit:number
    offset:number
}
/**Funcion para trabajar la tabla de auditoria, revisa si existen datos relacionados al filtro --> parametros en controller
 * si esto ocurre se agrega la "query" a un arreglo, luego si este arreglo tiene un tamaño se agregan las condiciones
 * finalmente a la tabla se le consulta con el arreglo where directamente con los filtros consultados
 */
export async function getLogs(filtro: FiltroLog) {
    const condicion: string[] = []
    const params: any[] = []

    if (filtro.tabla) {
        condicion.push("tabla_afectada = ?")
        params.push(filtro.tabla)
    }
    if (filtro.accion) {
        condicion.push("accion = ?")
        params.push(filtro.accion)
    }
    if (filtro.usuario) {
        condicion.push("cambiado_por = ?")
        params.push(filtro.usuario)
    }
    if (filtro.desde) {
        condicion.push("fecha_cambio >= ?")
        params.push(filtro.desde)
    }
    if (filtro.hasta) {
        condicion.push("fecha_cambio <= ?")
        params.push(filtro.hasta)
    }

    const where = condicion.length ? `WHERE ${condicion.join(" AND ")}` : ""

    const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM auditoria ${where} ORDER BY fecha_cambio DESC LIMIT ? OFFSET ?`,
        [...params, filtro.limit, filtro.offset]
    )

    const [totalRow] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM auditoria ${where}`,
        params
    )

    return { registros: rows, total: totalRow[0]?.total || 0 }
}