import type { Mantencion, Vehiculo, User, Viaje, ViajeInputFin } from "../tipos/tipoSistema";

/* Clase auxiliar para manejar la solicitud de informacion hacia el backend del proyecto */


/** Metodos para obtener informacion desde el backend
 * 
 * considerando "/{algo}" se obtendra la informacion necesaria solo si existe dicha ruta en el apartado backend
 * 
 * Considerando "/{algo}:[algo]" se obtendra la informacion mas precisa solo si existe dicha ruta 
 *  **/
export default async function getVehiculos() {
  try {
    const response = await fetch('http://localhost:4000/vehiculos');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error('Error encontrando vehículos:', e);
    return null;
  }
}
export async function getFuncionarios(){
  try{
    const response = await fetch('http://localhost:4000/usuarios')
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const filter  = await response.json()
    const funcionarios =  filter.filter((usr:User)=>usr.cargo==="Funcionario")
    return funcionarios
  }catch(e){
    console.error('Error encontrando usuarios funcionarios:', e);
    return null;
  }
}

export async function getUsuarios(){
  try{
    const response = await fetch('http://localhost:4000/usuarios')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }catch(e){
    console.error('Error encontrando usuarios:', e);
    return null;
  }
}

export async function getViajes(){
  try{
    const response = await fetch('http://localhost:4000/viajes')
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json()
  }catch(e){
    console.error(" Error encontrando viajes:  ", e)
    return null
  }
}

export async function getNameFuncionario(id:number){
  try{
    const response = await fetch(`http://localhost:4000/usuarios/id/${id}`)
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  }catch (e) {
    console.error('Error encontrando nombre del usuario:', e);
    return null;
  }
}

export async function getMantencionesVehiculo(patente: string) {

  try {
    const response = await fetch(`http://localhost:4000/mantenciones/${patente}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (e) {
    console.error('Error encontrando mantenciones:', e);
    return null;
  }
}
export async function getViajeUsuario(id_usuario:number){
  try{
    if(id_usuario){
    const response = await fetch(`http://localhost:4000/viajes/${id_usuario}`)
     if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`)
   }
   return await response.json()
  }
}catch(e){
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
    const url = `http://localhost:4000/mantenciones`
    const payload = data
    console.log(payload)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    const url = `http://localhost:4000/vehiculos`
    const payload = data
    console.log(data)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => {
        })
        console.log("back", errorData)
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
    } catch (e) {
      console.error('Error:', e);
      console.log({ msg: "Error al agregar vehiculo" })
    }
  }
}


export async function agregarUsuario(data:User){
  if(data){
    const url = `http://localhost:4000/usuarios`
    const payload = data
    try{
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
    }catch(e){
      console.error('Error:', e);
      console.log({ msg: "Error al agregar usuario" })
    }
  }
}

export async function addViajeInicial(data:Viaje){
  if(data){
    const url = `http://localhost:4000/viajes`
    const payload = data
    try{
      const res = await fetch(url,{
        method: 'POST',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if(!res.ok){
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Succes: ',data)
    }catch(e){
      console.error('Error: ',e)
      console.log({msg: "Error al agregar viaje, revisar datos enviados"})
    }
  }
}

export async function addDataViajeFin(patente:string,data:ViajeInputFin){
  if(data && patente){
    const url = `http://localhost:4000/viajes/${patente}`
    const payload = data
    try{
      const res = await fetch(url,{
        method: 'PUT',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if(!res.ok){
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Succes: ',data)
    }catch(e){
      console.error('Error: ',e)
      console.log({msg: "Error al agregar datos para finalizar viaje"})
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
    const url = `http://localhost:4000/vehiculos/${patenteBuscada}`
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
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
      console.log({ msg: "Error al editar vehiculo" })
    }
  }
}


export async function editarUsuario(correo:string,data:User){
  if(data){
    const url = `http://localhost:4000/usuarios/${correo}`
    const payload = data
    try{
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Success:', data);
    }catch(e){
      console.error('Error:', e);
      console.log({ msg: "Error al editar usuario" })
    }
  }
}

