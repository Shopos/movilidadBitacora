import {Navigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

type ProtectedRouteProp = {
    children:ReactNode,
    rolesPermitidos? : ("Administrativo"|"Funcionario"|"Departamento")
}

/**Componente para proteger rutas-componentes del sistema
 * 
 * Si el usuario no inicia sesion, no puede navegar a otro componente 
 * Si el usuario inicia sesion solo tiene permitido ingresar a aquellos componente donde su rol sea permitido, si intenta 
 * se redirige a el menu del usuario cuyo cargo corresponda administracion -> menuAdmin funcionario/usuario->menuUsuario
 */
function ProtectedRoute({children,rolesPermitidos}: ProtectedRouteProp) {
    const {autenticado, usuario,cargando} = useAuth()
    if(cargando){
        return <div>...Cargando...</div>
    }
    if(!autenticado){
        return <Navigate to="/" replace />
    }
    if(rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.cargo)){
        switch(usuario.cargo){
            case "Administrativo":
                return <Navigate to={"/menuAdmin"} replace />
            case "Funcionario":
                return <Navigate to={"/menuUsuario"} replace />
            case "Departamento":
                return <Navigate to={"/menuDepto"} replace />
        }
    }
    return <>{children}</>
}
export default ProtectedRoute