import { useNavigate } from "react-router-dom";
import NavBar from "../../componentes/navBar";

function solicitudesDepartamento(){

    const navigate= useNavigate()
    return(
        <div>
            <NavBar type={0} texto=""></NavBar>
            <button onClick={()=>navigate("/menuDepto")}>Volver</button>
        </div>
    )
}
export default solicitudesDepartamento