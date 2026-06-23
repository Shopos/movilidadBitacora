import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import VehiculoRoutes from "./routes/vehiculos.routes"
import MantencionesRoutes from "./routes/mantenciones.routes"
import UsuariosRoutes from "./routes/usuarios.routes"

dotenv.config()
const app = express()

app.use(cors())

app.use(express.json())

app.use("/vehiculos",VehiculoRoutes)
app.use("/mantenciones",MantencionesRoutes)
app.use("/usuarios", UsuariosRoutes)

const PORT = process.env.PORT || 4000

app.get("/vehiculos",async (_req,res) =>{
    res.json({msg:"ruta funcionando"})
})

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})