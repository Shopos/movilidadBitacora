import { useNavigate } from "react-router-dom"
import '../estilos/incioSesion.css'
import { useState } from "react"
import { useAuth } from "../context/AuthContext"


function inicioSesion(){
    
    const [formData,setFormData]=useState({
        mail:"",
        pass:""
    })
    const { login,usuario } = useAuth()
    const [error,setError] = useState("")

    const navigate = useNavigate()
    /*Maneja los datos ingresados en los inputs de inicio de sesión
    >los datos de inicio se almacenan en formData y se deben comprobar en DB    
    */
    const handleRedirection = async() =>{
        const resultadoInicio = await login(formData.mail,formData.pass)
        if(!resultadoInicio.ok){
            setError(resultadoInicio.msg || "No se pudo iniciar sesión")
            return
        }
        
        setFormData({mail:"",pass:""})
            //buscar cargo de usuario inicio en resultado    
        navigate(resultadoInicio.usuario!.cargo === "Administrativo" ? "/menuAdmin" : "/menuUsuario")
        
    }
    const handleChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = event.target
        setFormData((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }

    /*Vista inicial de la app
        Muestra directamente el inicio de sesión de la app
    */
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
                <h3>Inicio de sesión</h3>
                <div className="campo-formulario">
                    <label>Usuario</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} placeholder="nombe.apellido@mail.com">
                        
                    </input>
                </div>
                <div className="campo-formulario">
                    <label>Contraseña</label>
                    <input type="password" name="pass" value={formData.pass} onChange={handleChange} placeholder="*******"></input>
                </div>
                <div className="buttonFormulario">
                    <button onClick={()=>handleRedirection()}>Ingresar</button>
                </div>
            </div>
        </div>
           
        </>
    )
}
export default inicioSesion