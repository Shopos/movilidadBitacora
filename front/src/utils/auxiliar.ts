import type { Mantencion, Vehiculo, User, Viaje, ViajeInputFin, ViajeInputInicio, SolicitudInicio } from "../types/tipoSistema";

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
/* Clase auxiliar para manejar la solicitud de informacion hacia el backend del proyecto */


/** Metodos para obtener informacion desde el backend
 * 
 * considerando "/{algo}" se obtendra la informacion necesaria solo si existe dicha ruta en el apartado backend
 * 
 * Considerando "/{algo}:[algo]" se obtendra la informacion mas precisa solo si existe dicha ruta 
 * 
 * En los casos donde las solicitudes requieran cambios directos o solicitudes importantes debe considerarse la autorizacion entregada
 * por el token JWT y donde se comprueba el rango del usuario que solicita
 * 
 * Estas solicitudes pueden consultarse a mayor escala dentro de back/{rutaConsultar}
 * ej: back/vehiculos/... mostraria la consulta en especifico dependiendo del metodo que solicita la funcion
 *  **/
export default async function getVehiculos() {
  try {
    const response = await fetch(`${API}/vehiculos`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error('Error encontrando vehículos:', e);
    return null;
  }
}
export async function getFuncionarios() {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API}/usuarios`, { headers: { 'Authorization': `Bearer ${token}` } })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const filter = await response.json()
    const funcionarios = filter.filter((usr: User) => usr.cargo === "Funcionario" && (usr.estado_viaje_usuario !== "En ruta") && usr.estado)
    return funcionarios
  } catch (e) {
    console.error('Error encontrando usuarios funcionarios:', e);
    return null;
  }
}

export async function getSolicitudesViajes() {
  try {
    const url = `${API}/solicitudes/`
    const token = localStorage.getItem("token")
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const res = await response.json()
    return res
  } catch (e) {
    console.error("Error encontrando solicitudes", e)
    return null
  }
}

export async function getUsuarios() {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API}/usuarios`, { headers: { 'Authorization': `Bearer ${token}` } })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error('Error encontrando usuarios:', e);
    return null;
  }
}

export async function getViajes() {
  try {
    const response = await fetch(`${API}/viajes`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json()
  } catch (e) {
    console.error(" Error encontrando viajes:  ", e)
    return null
  }
}

export async function getNameFuncionario(id: number) {
  try {
    const response = await fetch(`${API}/usuarios/id/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (e) {
    console.error('Error encontrando nombre del usuario:', e);
    return null;
  }
}

export async function getMantencionesVehiculo(patente: string) {

  try {
    const response = await fetch(`${API}/mantenciones/${patente}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (e) {
    console.error('Error encontrando mantenciones:', e);
    return null;
  }
}

export async function getViajeUsuarioEspera(id: number) {
  try {
    if (id) {
      const response = await fetch(`${API}/viajes/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    }
  } catch (e) {
    console.error('Error encontrando viaje-usuario:', e);
    return null;
  }
}

export async function getViajeID(id: number) {
  try {
    if (id) {
      const response = await fetch(`${API}/viajes/id/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    }
  } catch (e) {
    console.error('Error encontrando viaje-usuario:', e);
    return null;
  }
}

export async function getSolicitudesUsuario(id:number) {
  try{
    if(id){
      const token = localStorage.getItem("token")
      const response= await fetch(`${API}/solicitudes/usuario/${id}`,{headers:{'Authorization':`Bearer ${token}`}})
      if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    }
  }catch(e){
    console.error(e)
    return null
  }
}

export async function getViajeProceso(id: number) {
  try {
    if (id) {
      const response = await fetch(`${API}/viajes/search/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      if (!data) {
        return null
      }
      return data
    }
  } catch (e) {
    console.error('Error encontrando viaje-usuario:', e);
    return null;
  }
}



/** Metodos para solicitar agregar informacion hacia backend
 * 
 * Considerando "/{algo}" se agregara informacion a la tabla asociada a dicha ruta descrita en backend
 * 
 * En el caso del metodo addDataViajeFin edita la informacion de un viaje previamente creado ingresando nueva informacion
 *  **/
export async function addMantencionVehiculo(data: Mantencion) {
  if (data) {
    const url = `${API}/mantenciones`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => {
        })
        console.log("back", errorData)
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (e) {
      console.error('Error:', e);
      console.log({ msg: "Error al agregar vehiculo" })
    }
  }
}

export async function agregarVehiculo(data: Vehiculo) {
  if (data) {
    const url = `${API}/vehiculos`
    const payload = data
    const key=localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload),
         
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => {
        })
        console.log("back", errorData)
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
      return true
    } catch (e) {
      console.error('Error:', e);
      console.log({ msg: "Error al agregar vehiculo" })
      return false
    }
  }
}

export async function agregarUsuario(data: User) {
  if (data) {
    const url = `${API}/usuarios`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
      return true
    } catch (e) {
      console.error('Error:', e);
      console.log({ msg: "Error al agregar usuario" })
      return false
    }
  }
}

export async function addViajeInicial(data: Viaje) {
  if (data) {
    const url = `${API}/viajes`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Succes: ', data)
    } catch (e) {
      console.error('Error: ', e)
      console.log({ msg: "Error al agregar viaje, revisar datos enviados" })
    }
  }
}

export async function addDataViajeFin(patente: string, data: ViajeInputFin) {
  if (data && patente) {
    const url = `${API}/viajes/${patente}`
    const payload = data
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Succes: ', data)
    } catch (e) {
      console.error('Error: ', e)
      console.log({ msg: "Error al agregar datos para finalizar viaje" })
    }
  }
}

/**  Metodos para solicitar edicion de un elemento hacia el backend
 * 
 *  Considerando "/{algo}:[algo]" como los elementos para solicitar la edicion de informacion
 * 
 *  Siendo {algo} la 'Tabla' y [algo] como el identificador del elemento a editar
 * **/

export async function editarVehiculo(patente: string, data: Vehiculo) {
  if (data) {
    const patenteBuscada = patente
    const url = `${API}/vehiculos/${patenteBuscada}`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return true
    } catch (error) {
      return false
    }
  }
}

export async function editarUsuario(correo: string, data: User) {
  if (data) {
    const url = `${API}/usuarios/${correo}`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return true
    } catch (e) {
      console.error('Error:', e);
      console.log({ msg: "Error al editar usuario" })
      return false
    }
  }
}

export async function patchInicio(id: number, data: ViajeInputInicio) {
  if (data) {
    const url = `${API}/viajes/inicio/${id}`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      console.log('Success: ', data)
    } catch (e) {
      console.error('Error:', e)
      console.log({ msg: "Error al parchar viaje" })
    }
  }
}

export async function patchFin(id: number, data: ViajeInputFin) {
  if (data) {
    console.log("Agregando info final")
    const url = `${API}/viajes/fin/${id}`
    const payload = data
    const key = localStorage.getItem("token")
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      console.log('Succes: ', data)
    } catch (e) {
      console.error('Error:', e)
      console.log({ msg: "Error al parchar viaje" })
    }
  }
}

export async function patchSolicitudRechazo(id:number,data:string){
  if(data){
    const url = `${API}/solicitudes/${id}/rechazo`
    const token=localStorage.getItem("token")
    try{
      const res = await fetch(url,{
        method: 'PATCH',
        headers:{
          'Content-type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({motivo:data})
      })
      const json = await res.json()
      return json
    }catch(e){
      console.log({ msg: "Error al parchar solicitud rechazo",e })
    }
  }
}

export async function pathSolicitudAprobada(id:number,data:string){
  if(data){
    const url = `${API}/solicitudes/${id}/aprobado`
    const token = localStorage.getItem("token")
    try{
      const res = await fetch(url,{
        method:'PATCH',
        headers:{
          'Content-type':'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify({motivo:data})
      })
      const json = await res.json()
      console.log(json)
      return json
    }catch(e){
      console.log({msg: "Error al parchar solicitud aprobada",e})
    }
  }
}

export async function editarViaje(id: number, data: Partial<Viaje>) {
  const token = localStorage.getItem("token")
  const url = `${API}/viajes/${id}`
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Error al editar viaje')
    }

    return json
  } catch (e) {
    console.error("Error: ", e)
    console.log({ msg: "Error al editar viaje" })
  }
}

/**Metod para borrar un elemento hacia el backend
 * 
 * Solo esta restringido para eliminar un viaje que este en espera y no haya sido iniciado por algun usuario
 * 
 */
export async function borrarViajeEspera(idViaje: number) {
  const token = localStorage.getItem("token")
  const url = `${API}/viajes/${idViaje}`
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || "No se logro eliminar viaje en espera")
    }
    return json
  } catch (e) {
    console.log("error borrando viaje en espera")
    return null
  }
}

/***SOLICITUDES******/

export async function solicitarRecuperarContraseña(correo: string) {
  try {
    const res = await fetch(`${API}/usuarios/solicitar-reset`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ correo })
    })
    return await res.json()
  } catch (e) {
    return { error: 'No se logro solicitar cambio' }
  }
}

export async function getSolicitudes() {
  const token = localStorage.getItem("token")
  const url = `${API}/usuarios/solicitudes-reset`
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) {
      throw new Error()
    }
    return await res.json()
  } catch (e) {
    return { error: "No se logro obtener las solicitudes" }
  }

}

export async function resolverSolicitudesCambio(id: number, pass: string) {
  const token = localStorage.getItem("token")
  const url = `${API}/usuarios/solicitudes-reset/${id}/resolver`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ pass })
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || "No se logro resolver la solicitud")
  }
  return json
}

export async function solicitarViaje(data: SolicitudInicio) {
  const payload = data
  const token = localStorage.getItem("token")
  const url = `${API}/solicitudes/`
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || " No se logro agregar solicitud ")
    }
    return json
  } catch (e) {
    console.log("Error al agregar solicitud")
    return null
  }
}

export async function resolverSubidaImagen(
  id: number,
  tipo: "foto-inicio" | "foto-fin" | "foto-comprobante",
  archivo: File): Promise<{ msg: string, ruta?: string } | null> {

  const token = localStorage.getItem("token")
  const form = new FormData()
  form.append('foto', archivo)
  const url = `${API}/viajes/${id}/${tipo}`
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || "No se logro subir imagen")
    }
    return json
  } catch (e) {
    console.error('error subiendo imagen', e)
    return null
  }
}

