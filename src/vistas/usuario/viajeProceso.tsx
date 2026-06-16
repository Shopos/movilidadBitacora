import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"

import "../../estilos/viajeProceso.css"


/*
    Pasar datos desde viaje inicio 
    recolectar gps?
    pasar info a fin
*/
function viajeProceso(){
    //Ventana que muestra el estado del viaje, solo permite cerrar el viaje al pulsar el boton
    //Se deja debajo un recolector de coordenadas gps para determinar ruta
    //-->Envia a cierreViaje donde se recolectan datos finales y da por cerrado la recoleccion de datos
    const navigate = useNavigate()
    const finViaje = () => navigate("/cierreViaje")
    
    return(
        <>
            <NavBar type={0} texto=""/>

            <div className="grupoIconMsg">
                
                <h2>Viaje en proceso</h2>
            </div>

            <div>
                <p>Manten la vista en el camino, una vez finalizado el viaje continua el proceso de bitácora</p>
            </div>

            <button className="botonPaso" onClick={()=>finViaje()}>terminar viaje</button>
        </>
    )
}
export default viajeProceso