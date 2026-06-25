import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import '../../estilos/menuUsuario.css'
import type { Viaje } from "../../tipos/tipoSistema.ts"


function menuUsuario(){
    const navigate = useNavigate()
    const comenzarViaje=()=>navigate("/inicioViaje")
    const verViajes =()=> navigate("/viajesUsuario");
    const nombreUsuario = "Pepe pape"
    /*Vista del menu del usuario
        >Iniciar viaje para comenzar proceso de documentacion bitacora
        >Ver mis viajes para navegar a vista de viajes del usuario
    */
    const verificarViajeActivo = async() =>{
        const item = localStorage.getItem('viajeEnProceso')
        if(item && item!==null){
            const data:Viaje = JSON.parse(item)
            console.log(data)
            if(data.estado_viaje && data.modificado_por===nombreUsuario){
                //ANUNCIAR QUE TIENE VIAJE ACTIVO
                
                return true
            }
        }
        return false
    }

    useEffect(()=>{
        const comprobar=async()=>{
            if(await verificarViajeActivo()){
                navigate("/viajeProceso")
            }
        }
        comprobar()
    },[])

    return(
        <div>
            <NavBar type={0} texto=""/>
            <div className="containerBotones">
                <button onClick={()=>comenzarViaje()}>
                    <h2>Iniciar un viaje</h2>
                </button>
                <button onClick={()=>verViajes()}>
                    <h2>Ver mis viajes</h2>
                </button>
            </div>
            <div className="spacer"></div>

        </div>
    )
}
export default menuUsuario