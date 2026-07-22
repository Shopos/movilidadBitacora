import { useState } from "react"
import "../estilos/cambioPass.css"
import { useNavigate } from "react-router-dom"
import { useAlerta } from "../context/AlertaContext"
import { solicitarRecuperarContraseña } from "../utils/auxiliar"
import logo from "../assets/icon.jpg"
function cambioPass(){

    const [formData,setFormData] = useState("")
    const [enviado,setEnviado] = useState(false)
    const {showAlerta} = useAlerta()
    const navigate = useNavigate()
    const handleVolver=()=>{
        navigate("/")
    }

    /*Maneja la solicitud y la redireccion del usuario
        Permite enviar una solicitud si el ingreso es correcto @
        
    */
    const handleRedirection=async()=>{
        if(!formData || !formData.includes('@')){
            showAlerta("Ingresa un correo valido","warning")
            return
        }
        setEnviado(true)
        try{
            const res = await solicitarRecuperarContraseña(formData)
            if(res.error){
                showAlerta(res.error,"error")
            }else{
                showAlerta(res.msg || "Solicitud enviada, contacta a Administración para continuar","success")
                setTimeout(()=>navigate("/"),3500)
            }
        }finally{
            setEnviado(false)
        }
    }
    //Vista para la solicitud de cambio de contraseñas, si un usuario registrado cuenta con una cuenta ACTIVA puede solicitar un cambio de contraseña 
    //Estas solicitudes se almacenan en BD y se muestran en la vista de Administracion
    return(
        <>
        <header className="headerInicio">
            <img  src={logo}></img>
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
                    <button onClick={()=>handleRedirection()} disabled={enviado}>{enviado ? "Enviando...":"Solicitar"}</button>
                </div>
            </div>
            
                
        </div>
        </>
    )
}

export default cambioPass