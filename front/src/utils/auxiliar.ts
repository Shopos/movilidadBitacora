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
