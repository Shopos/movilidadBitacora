import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/inicioViaje.css"
import React, { useState } from "react";


type Vehiculo = {
    patente:string;
    modelo:string;
    KMS_actual: number;
}
function inicioViaje(){
    const navigate = useNavigate()
    const continuarProceso =() => navigate("/viajeProceso")
    const volverMenu = () => navigate("/menuUsuario")

    const [vehiculoSelected, setVehiculoSelected] = useState<Vehiculo|null>(null)

    const Vehiculos:Vehiculo[] = [
        {patente:"xyz123", modelo:"toyota", KMS_actual:192},
        {patente:"abc123", modelo:"suzuki", KMS_actual:193},
        {patente:"dfe123", modelo:"toyota", KMS_actual:194},
        {patente:"plm123", modelo:"suzuki", KMS_actual:195},
        {patente:"pit123", modelo:"toyota", KMS_actual:196},
        {patente:"xom123", modelo:"audi", KMS_actual:197},
    ]

    const manejarDataVehiculo=(event:React.ChangeEvent<HTMLSelectElement>)=>{
        const patenteselected= event.target.value

        const vehiculoEncontrado = Vehiculos.find(
            (vehiculo) => vehiculo.patente===patenteselected
        )
        
        setVehiculoSelected(vehiculoEncontrado || null)
    }
    return(
        //inputs iniciales, boton de confirmacion para iniciar viaje
        //->Da inicio a la creacion del viaje a BD, asi como deja su estado ACTIVO
        //Carga nueva ventana del viaje activo

        //Se pide listado de patentes para seleccionar una
        <>
            <NavBar type={0} texto=""/>
            <div className="tituloPaso">
                <h1>Iniciar un viaje</h1>
                <h2>Ingresa los datos necesarios</h2>   
            </div>

            <div className="inputsInicio">
                <div className="itemInput">
                    <label>Fecha</label>
                    <input type="date"></input>
                </div>
                
                <div className="itemInput">
                    <label>Patente</label>
                    <select name="Patentes" defaultValue={""} onChange={manejarDataVehiculo}>
                        <option value={""} disabled>Selecciona una de las patentes disponibles</option>
                        {Vehiculos.map((vehiculo)=>(
                            <option key={vehiculo.patente} value={vehiculo.patente}>{vehiculo.patente}</option>
                        ))}
                    </select>
                </div>
                
                <div className="itemInput">
                    <label>Modelo Vehículo</label>
                    <input value={vehiculoSelected?.modelo} placeholder=""></input>
                </div>
                
                <div className="itemInput">
                    <label>Kilometraje actual</label>
                    <input type="number" value={vehiculoSelected?.KMS_actual}></input>
                </div>
                
                <div className="itemInput">
                    <label>Hora salida</label>
                    <input type="time"></input>
                </div>

                <div className="itemInput">
                    <label>Funcionario</label>
                    <input type="text"></input>
                </div>
            </div>
            
            
            {/**Agregar input cámara*/}
            <div className="full-width">
                <label>Ingresa captura</label>
                <input type="file"></input>
            </div>

            {/**Apertura modal mapa seleccion destino */}
            
            <div className="full-width">
                <div className="itemInput">
                    <label>Motivo</label>
                    <textarea placeholder="Explique el objetivo del viaje"></textarea>
                </div>
            </div>

            <div>
                <button className="botonPaso" onClick={()=>volverMenu()}>Volver</button>
                <button className="botonPaso" onClick={()=>continuarProceso()}>Continuar</button>    
            </div>
        </>
    )
}
export default inicioViaje