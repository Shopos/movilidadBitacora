import { useState } from "react"
import "../estilos/cambioPass.css"
import { useNavigate } from "react-router-dom"
import { useAlerta } from "../context/AlertaContext"
function cambioPass(){

    const [formData,setFormData] = useState("")
    const {showAlerta} = useAlerta()
    const navigate = useNavigate()
    const handleVolver=()=>{
        navigate("/")
    }

    const handleRedirection=()=>{
        if(formData){
            //Enviar consulta de usuario ->si existe enviar nueva contraseña
        }else{
            showAlerta("Correo invalido","error")
        }
    }
    return(
        <>
        <header className="headerInicio">
            <img  src='./src/assets/icon.jpg'></img>
            <h2>Ilustre Municipalidad de Santa Cruz</h2>
        </header>
        <div className="contenidoInicio">
            <div className="textoTituloInicio">
                <h1>Departamento de movilización</h1>
                <h2>Gestión de bitácoras</h2>
            </div>
            <div className="contenido-formulario">
                <h3>Solicitar un cambio de contraseña</h3>
                <div className="campo-formulario">
                    <label>Usuario</label>
                    <input type="email" name="mail" value={formData} onChange={(e)=>setFormData(e.target.value)} placeholder="nombe.apellido@mail.com">
                        
                    </input>
                </div>
                <div className="buttonFormularioPass">
                    <button onClick={()=>handleVolver()}>Volver</button>
                    <button onClick={()=>handleRedirection()}>Solicitar</button>
                </div>
            </div>
            
                
        </div>
        </>
    )
}

export default cambioPass