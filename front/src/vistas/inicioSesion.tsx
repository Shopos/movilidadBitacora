import { useNavigate } from "react-router-dom"
import '../estilos/incioSesion.css'
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useAlerta } from "../context/AlertaContext"


function inicioSesion(){
    
    const [formData,setFormData]=useState({
        mail:"",
        pass:""
    })
    const { login,usuario } = useAuth()
    const { showAlerta } = useAlerta()
    const [error,setError] = useState("")

    const navigate = useNavigate()
    /*Maneja los datos ingresados en los inputs de inicio de sesión
    >los datos de inicio se almacenan en formData y se deben comprobar en DB    
    */
    const handleRedirection = async() =>{
        const resultadoInicio = await login(formData.mail,formData.pass)
        if(!resultadoInicio.ok){
            setError(resultadoInicio.msg || "No se pudo iniciar sesión")
            showAlerta(`${resultadoInicio.msg}`,'error')
            return
        }
        
        setFormData({mail:"",pass:""})
        //Navega dependiendo del resultado de resultadoInicio que almacena el usuario si este obtiene un resultado positivo desde login
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