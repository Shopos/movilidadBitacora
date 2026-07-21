import { Request, Response } from "express";
import * as auditModel from "../models/auditoria.model"

export async function getLogs(req: Request, res: Response) {
    try {
        const { tabla, accion, usuario, desde, hasta, page = "0", size = "10" } = req.query

        const limit = Number(size) || 10
        const offset = (Number(page) || 0) * limit

        const resultado = await auditModel.getLogs({
            tabla: tabla as string,
            accion: accion as string,
            usuario: usuario as string,
            desde: desde as string,
            hasta: hasta as string,
            limit,
            offset
        })

        res.json(resultado)
    } catch (e) {
        console.error("Error en getLogs:", e)
        res.status(500).json({ error: "Error al listar logs audit" })
    }
}