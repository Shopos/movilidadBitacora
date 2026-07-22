// src/vistas/notFound.tsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta a la que intentas acceder no existe o no tienes permisos para verla.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;