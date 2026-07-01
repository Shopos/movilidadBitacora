import { useNavigate } from "react-router-dom"
import { useEffect,useState } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import '../../estilos/menuUsuario.css'
import type { Viaje } from "../../tipos/tipoSistema.ts"
import { useAuth } from "../../context/AuthContext.tsx"
import { getViajeID, getViajeUsuarioEspera } from "../../utils/auxiliar.ts"
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/joy"

/*Vista del menu del usuario
        >Iniciar viaje para comenzar proceso de documentacion bitacora
        >Ver mis viajes para navegar a vista de viajes del usuario
    */
function menuUsuario(){
    const navigate = useNavigate()
    const { usuario } = useAuth()
    const verViajes =()=> navigate("/viajesUsuario");
    const [viajeEspera,setViajeEspera] = useState<Viaje|null>(null)
    const [cargando,setCargando] = useState(false)

    /* Verificar si existe un viaje en espera para dicho usuario, si existe mostrar tarjeta con boton para redirigir a iniciarViaje */
    useEffect(()=>{
        const getViajeUsuario=async()=>{
            try{
                if(usuario){
                    const response = await getViajeUsuarioEspera(usuario?.id)
                    if (response && Object.keys(response).length > 0) {
                        setViajeEspera(response[0]) //
                        setCargando(true)
                    } else {
                        setViajeEspera(null)
                    }
                }
            }catch(e){
                console.error(" Error listando viaje usuario ")
                setViajeEspera(null)
            }
        }
        getViajeUsuario()
    },[usuario,cargando])

    useEffect(()=>{
        
        const getViajeUsuarioProceso=async()=>{
            if(localStorage.getItem("idViaje")){
                console.log("tienes viaje en proceso")
                navigate("/viajeProceso")
            }
            try{
                if(usuario){
                    const response = await getViajeID(usuario.id)
                    if(response && Object.keys(response).length > 0){
                        //verificar
                    }
                }
            }catch(e){
                console.error( " Error buscando viaje en proceso ")
            }
        }
        getViajeUsuarioProceso()
    })

    /* Al accionar boton de Card para comenzar viaje se almacena en localStorage id_viaje para futuras consultas
    y se redirige a inicioViaje */
    const manejarViajeEspera=()=>{
        if(viajeEspera){
            console.log(viajeEspera.id_viaje)
            
            navigate("/inicioViaje")
        }
    }
    /* Verificar si existe viaje en proceso del usuario o mantiene un id_viaje en localStorage, si existe redirigir a viajeProceso */

    return(
        <div>
            <NavBar type={0} texto=""/>
            <div className="containerBotones">
            {viajeEspera && viajeEspera.vehiculo!=="" ? 
             (<div style={{display:"flex", flexDirection:"row", justifyContent:"center",marginBottom:"5vh"}}>
                <Card variant="outlined" sx={{width:"40vw", display:"flex",flexDirection:"column"}}>
                    <CardContent>
                        <Typography level="h1">Tienes un viaje en espera</Typography>
                        <Typography level="h3">Viaje a {viajeEspera!.destino}</Typography>
                        <Typography level="body-md">Vehiculo: {viajeEspera!.vehiculo}</Typography>
                        <Typography level="body-md">Patente: {viajeEspera!.patente}</Typography>
                    </CardContent>
                    <CardActions sx={{
                        display:"flex",
                        flexDirection:"row",
                        justifyContent:"flex-end"
                    }}>
                        <IconButton variant="solid" color="primary" onClick={()=>manejarViajeEspera()}>Comenzar viaje</IconButton>
                    </CardActions>
                </Card>
             </div>): 
             (<>No tienes viajes de momento</>)}
                <button onClick={()=>verViajes()}>
                    <h2>Ver mis viajes</h2>
                </button>
            </div>
            <div className="spacer"></div>

        </div>
    )
}
export default menuUsuario