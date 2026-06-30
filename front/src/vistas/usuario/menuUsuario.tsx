import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import '../../estilos/menuUsuario.css'
import type { Viaje } from "../../tipos/tipoSistema.ts"

/*Vista del menu del usuario
        >Iniciar viaje para comenzar proceso de documentacion bitacora
        >Ver mis viajes para navegar a vista de viajes del usuario
    */
function menuUsuario(){
    const navigate = useNavigate()
    const comenzarViaje=()=>navigate("/inicioViaje")
    const verViajes =()=> navigate("/viajesUsuario");
    const nombreUsuario = "Pepe pape"
    


    /* Verifica si dentro de localStorage existe un viaje, este se encuentra activo y el nombre de la ultima modificacion fue
    hecha por el usuario guardado al ingresar al sistema
    */
    const verificarViajeActivo = async() =>{
        const item = localStorage.getItem('viajeEnProceso')
        if(item && item!==null){
            const data:Viaje = JSON.parse(item)
            console.log(data)
            if(data.estado_viaje && data.modificado_por===nombreUsuario){
                return true
            }
        }
        return false
    }

    //Verificar en db si existen viajes activos o no terminados y dicho usuario es el actual

    /* Metodo para comprobar si existe un viaje activo en localStorage llamando verificarViajeActivo
    Si esto ocurre devuelve a viaje en proceso
    Caso contrario continua la navegacion a menuUsuario
    */
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