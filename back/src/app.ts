import express, { NextFunction,Response,Request } from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import VehiculoRoutes from "./routes/vehiculos.routes"
import MantencionesRoutes from "./routes/mantenciones.routes"
import UsuariosRoutes from "./routes/usuarios.routes"
import ViajesRoutes from "./routes/viajes.routes"
import AuditoriaRoutes from "./routes/auditorias.routes"
import SolicitudesRoutes from "./routes/solicitudes.route"
import { MulterError } from "multer"
dotenv.config()
const app = express()

app.use(cors())

app.use(express.json())

app.use("/vehiculos",VehiculoRoutes)
app.use("/mantenciones",MantencionesRoutes)
app.use("/usuarios", UsuariosRoutes)
app.use("/viajes", ViajesRoutes)
app.use("/solicitudes",SolicitudesRoutes)
app.use("/auditorias",AuditoriaRoutes)

const UPLOADS_DIR = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(__dirname,'..','..','uploads')
app.use('/uploads',express.static(UPLOADS_DIR,{maxAge:'7d'}))

app.use((err:any, req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({err: 'La imagen no puede superar los 5 mb'})
        }
        return res.status(400).json({err: 'Error al procesar la imagen'})
    }
    if(err?.message?.includes('Solo se permiten imágenes')){
        return res.status(400).json({error: err.message})
    }
    next(err)
})

const PORT = process.env.PORT || 4000


app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})