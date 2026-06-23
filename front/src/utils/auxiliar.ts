import type { Mantencion, Vehiculo, User } from "../tipos/tipoSistema";

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