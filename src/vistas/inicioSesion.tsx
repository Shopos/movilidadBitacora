import { useNavigate } from "react-router-dom"
import "../estilos/incioSesion.css"
import { useState } from "react"

type User={
    correo:string,
    contraseña:string,
}
function inicioSesion(){
    const Admin:User={
        correo:"admin@admin.cl",
        contraseña:"123abc"
    }
    const user:User={
        correo:"usr@usr.cl",
        contraseña:"123"
    }
    const [formData,setFormData]=useState({
        mail:"",
        pass:""
    })

    const navigate = useNavigate()
    const manejoNavigate = () => navigate("/menuUsuario")
    const manejoNavigate2 = () => navigate("/menuAdmin")

    const handleRedirection = () =>{
        if(formData.mail === Admin.correo && formData.pass===Admin.contraseña){
            manejoNavigate2()
        }if(formData.mail === user.correo && formData.pass === user.contraseña){
            manejoNavigate()
        }
    }
    const handleChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = event.target
        setFormData((prevData)=>({
            ...prevData,
            [name]:value
        }))
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