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
    


    /* Verificar si en BD existe algun viaje asignado al usuario y que este en estado "En espera"
    */
    const verificarViajeActivo = async() =>{
       
    }

    //Verificar en db si existen viajes activos o no terminados y dicho usuario es el actual

    /* Metodo para comprobar si existe un viaje activo en localStorage llamando verificarViajeActivo
    Si esto ocurre devuelve a viaje en proceso
    Caso contrario continua la navegacion a menuUsuario
    */
    useEffect(()=>{
        //const comprobar=async()=>{
        //    if(await verificarViajeActivo()){
        //        navigate("/viajeProceso")
        //    }
        //}
        //comprobar()
    },[])

    return(
        <div>
            <NavBar type={0} texto=""/>
            <div className="containerBotones">
                <button onClick={()=>verViajes()}>
                    <h2>Ver mis viajes</h2>
                </button>
            </div>
            <div className="spacer"></div>

        </div>
    )
}
export default menuUsuario