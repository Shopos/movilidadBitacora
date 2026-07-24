// src/vistas/notFound.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


/**Componente llamado cuando la ruta a consultar no existe o no tiene permisos para su visualización */
function NotFound() {
  const [link,setLink] = useState("/")
  const { usuario } = useAuth()
  useEffect(()=>{
    if(usuario){
      switch(usuario.cargo){
        case "Funcionario":
          setLink("/menuUsuario")
          break
        case "Administrativo":
          setLink("/menuAdmin")
          break
        case "Departamento":
          setLink("/menuDepto")
          break
        default:
          setLink("/")
          break
      }
    }
  },[])

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta a la que intentas acceder no existe o no tienes permisos para verla.</p>
      <Link to={link}>Volver al inicio</Link>
    </div>
  );
}

export default NotFound;