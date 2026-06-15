import { useNavigate } from "react-router-dom"

function inicioSesion(){
    const navigate = useNavigate()
    const manejoNavigate = () => navigate("/menuUsuario")
    const manejoNavigate2 = () => navigate("/menuAdmin")
    return(
        <>
            <button onClick={()=>manejoNavigate()}>usuario</button>
            <button onClick={()=>manejoNavigate2()}>admin</button>
        </>
    )
}
export default inicioSesion