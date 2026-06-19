import { BrowserRouter, Route, Routes } from "react-router-dom"
import InicioSesion from "./vistas/inicioSesion.tsx"
import MenuUsuario from "./vistas/usuario/menuUsuario.tsx"
import MenuAdmin from "./vistas/administracion/menuAdmin.tsx"
import InicioViaje from "./vistas/usuario/inicioViaje.tsx"
import ViajeProceso from "./vistas/usuario/viajeProceso.tsx"
import CierreViaje from "./vistas/usuario/cierreViaje.tsx"
import ViajesUsuario from "./vistas/usuario/viajesUsuario.tsx"
import Recursos from "./vistas/administracion/recursosAdmin.tsx"

function App(){

  /*Rutas de la app*/
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />}></Route>
        {/**Rutas usuario */}
        <Route path="/inicioViaje" element={<InicioViaje />} />
        <Route path="/viajeProceso" element={<ViajeProceso />}  />
        <Route path="/cierreViaje" element={<CierreViaje />}/>
        <Route path="/viajesUsuario" element={<ViajesUsuario />}></Route>
        <Route path="/menuUsuario" element={<MenuUsuario />}></Route>

        {/**Rutas administración */}
        <Route path="/menuAdmin" element={<MenuAdmin />}></Route>
        <Route path="/recursos" element={<Recursos />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App