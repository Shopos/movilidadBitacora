import { BrowserRouter, Route, Routes } from "react-router-dom"
import InicioSesion from "./vistas/inicioSesion.tsx"
import MenuUsuario from "./vistas/usuario/menuUsuario.tsx"
import MenuAdmin from "./vistas/administracion/menuAdmin.tsx"
import InicioViaje from "./vistas/usuario/inicioViaje.tsx"
import ViajeProceso from "./vistas/usuario/viajeProceso.tsx"
import CierreViaje from "./vistas/usuario/cierreViaje.tsx"
import ViajesUsuario from "./vistas/usuario/viajesUsuario.tsx"
import Recursos from "./vistas/administracion/recursosAdmin.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"
import ProtectedRoute from "./componentes/protectedRoute.tsx"

function App(){

  /*Rutas de la app*/
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InicioSesion />}></Route>
          {/**Rutas usuario */}
          <Route path="/inicioViaje" element={<ProtectedRoute rolesPermitidos="Funcionario"><InicioViaje /></ProtectedRoute>} />
          <Route path="/viajeProceso" element={<ProtectedRoute rolesPermitidos="Funcionario"><ViajeProceso /></ProtectedRoute>}  />
          <Route path="/cierreViaje" element={<ProtectedRoute rolesPermitidos="Funcionario"><CierreViaje /></ProtectedRoute>}/>
          <Route path="/viajesUsuario" element={<ProtectedRoute rolesPermitidos="Funcionario"><ViajesUsuario /></ProtectedRoute>}></Route>
          <Route path="/menuUsuario" element={<ProtectedRoute rolesPermitidos="Funcionario"><MenuUsuario /></ProtectedRoute>}></Route>

          {/**Rutas administración */}
          <Route path="/menuAdmin" element={<ProtectedRoute rolesPermitidos="Administrativo"><MenuAdmin /></ProtectedRoute>}></Route>
          <Route path="/recursos" element={<ProtectedRoute rolesPermitidos="Administrativo"><Recursos /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App