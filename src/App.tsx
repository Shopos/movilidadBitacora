import { BrowserRouter, Route, Routes } from "react-router-dom"
import InicioSesion from "./inicioSesion.tsx"
import MenuUsuario from "./menuUsuario.tsx"
import MenuAdmin from "./menuAdmin.tsx"
import InicioViaje from "./inicioViaje.tsx"
import ViajeProceso from "./viajeProceso.tsx"
import CierreViaje from "./cierreViaje.tsx"
import ViajesUsuario from "./viajesUsuario.tsx"

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />}></Route>
        <Route path="/menuUsuario" element={<MenuUsuario />}></Route>

        {/**Rutas usuario */}
        <Route path="/inicioViaje" element={<InicioViaje />} />
        <Route path="/viajeProceso" element={<ViajeProceso />} />
        <Route path="/cierreViaje" element={<CierreViaje />}/>
        <Route path="/viajesUsuario" element={<ViajesUsuario />}></Route>
        <Route path="/menuAdmin" element={<MenuAdmin />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App