import {Navigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

type ProtectedRouteProp = {
    children:ReactNode,
    rolesPermitidos? : ("Administrativo"|"Funcionario")
}

function ProtectedRoute({children,rolesPermitidos}: ProtectedRouteProp) {
    const {autenticado, usuario,cargando} = useAuth()
    if(cargando){
        return null
    }
    if(!autenticado){
        return <Navigate to="/" replace />
    }
    if(rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.cargo)){
        const destino = usuario.cargo === "Administrativo" ? "/menuAdmin" : "/menuUsuario"
        return <Navigate to={destino} replace />
    }
    return <>{children}</>
}
export default ProtectedRoute