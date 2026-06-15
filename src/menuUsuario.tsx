import { useNavigate } from "react-router-dom"
import NavBar from "./componentes/navBar"
import './estilos/menuUsuario.css'

function menuUsuario(){
    const navigate = useNavigate()
    const comenzarViaje=()=>navigate("/inicioViaje")
    const verViajes =()=> navigate("/viajesUsuario");

    return(
        <div>
            <NavBar />
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