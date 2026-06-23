import type { Mantencion } from "../tipos/tipoSistema";

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


export async function getMantencionesVehiculo(patente:string){
  
  try{
    const response = await fetch (`http://localhost:4000/mantenciones/${patente}`)
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  }catch(e){
    console.error('Error encontrando mantenciones:', e);
    return null; 
  }
}

export async function addMantencionVehiculo(data:Mantencion){
  if(data){
    const url = `http://localhost:4000/mantenciones`
    const payload = data
    console.log(payload)
    try{
      const res = await fetch(url,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if(!res.ok){
        const errorData = await res.json().catch(()=>{
        })
        console.log("back",errorData)
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    }catch(e){
      console.error('Error:', e); 
      console.log({msg:"Error al agregar vehiculo"})
    }
  }
}