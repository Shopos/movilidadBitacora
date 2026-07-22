import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

type Role = "Administrativo" | "Funcionario" | "Departamento";

type ProtectedRouteProp = {
  children: ReactNode,
  // Permitimos que sea un solo rol o una lista de roles
  rolesPermitidos?: Role | Role[] 
}

/** Componente para proteger rutas/componentes del sistema
 * 
 * - Si no está autenticado, redirige al Inicio de Sesión ("/").
 * - Si está autenticado pero su rol no está permitido, redirige a la página 404.
 */
function ProtectedRoute({ children, rolesPermitidos }: ProtectedRouteProp) {
  const { autenticado, usuario, cargando } = useAuth()

  if (cargando) {
    return <div>...Cargando...</div>
  }
  if (!autenticado) {
    return <Navigate to="/" replace />
  }

  if (rolesPermitidos && usuario) {
    const rolesArray = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    if (!rolesArray.includes(usuario.cargo as Role)) {
      return <Navigate to="/404" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute