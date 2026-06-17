import { data, useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/inicioViaje.css"
import React, { useEffect, useState } from "react";
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import type { Vehiculo,User } from "../../tipos/tiposSistema.ts";


import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

/**Solo toma la segunda vez que se hace drag del pin */
function inicioViaje() {
    const [vehiculoSelected, setVehiculoSelected] = useState<Vehiculo | null>(null)
    const [modalDestino, openModalDestino] = useState<boolean>(false)
    const [modalCamara, openModalCamara] = useState<boolean>(false)
    const [destinoChange,setDestinoChange] = useState<number>(0)
   const [dataGPS, setDataGPS] = useState({
        lat: -34.639739, lng: -71.365916
    })
    const [dataGPSDestino, setDataGPSDestino] = useState({
        lat: -34.639739, lng: -71.365916
    })
    const [coordCenter,setCoordCenter] = useState({
        lat:0,lng:0
    })
    const [formInicio,setFormInicio] = useState({
        fecha:"",
        patente:"",
        horaInicio:"",
        motivo:"",
        modelo:"",
        kmsInicio:"",
        horaLlegada:"",
        kmsFinViaje:"",
        funcionario:"",
        combustible:false,
        cantidad:0,
        observaciones:"",
        latInicio:0,
        lngInicio:0,
        latFin:0,
        lngFin:0
    })
    const usuario:User = {
        cargo:"Funcionario",
        email:"usr@usr.cl",
        nombre:"Pepe pape",
        estado: false
    }
    const Vehiculos: Vehiculo[] = [
        { patente: "xyz123", modelo: "toyota", KMS_actual: 192,estado:"Disponible" },
        { patente: "abc123", modelo: "suzuki", KMS_actual: 193,estado:"Disponible"},
        { patente: "dfe123", modelo: "toyota", KMS_actual: 194,estado:"En reparación" },
        { patente: "plm123", modelo: "suzuki", KMS_actual: 195,estado:"Activo" },
        { patente: "pit123", modelo: "toyota", KMS_actual: 196,estado:"Dado de baja"},
        { patente: "xom123", modelo: "audi", KMS_actual: 197,estado:"Activo" },
    ]

    const createCustomIcon = (color:string) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            position: absolute;
            left: -12px;
            top: -12px;
            border: 2px solid white;
            "></div>`,
            iconAnchor: [0, 12]
        });
    };

    const manejarDataVehiculo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const patenteselected = event.target.value

        const vehiculoEncontrado = Vehiculos.find(
            (vehiculo) => vehiculo.patente === patenteselected
        )
        if(vehiculoEncontrado){
            setVehiculoSelected(vehiculoEncontrado || null)
        }
        setFormInicio((prevData)=>({
            ...prevData,
            patente:patenteselected,
            modelo: vehiculoEncontrado ? vehiculoEncontrado.modelo:"",
            kmsInicio: vehiculoEncontrado ? vehiculoEncontrado.KMS_actual.toString():""
        }))

        
    }
    useEffect(()=>{
        /**Se consultan los datos del usuario (nombre)*/
        setFormInicio((prevData)=>({
            ...prevData,
            funcionario:usuario.nombre,
        }))
    },[])

    useEffect(()=>
    {
        const actualiza = {...formInicio,
            latInicio:dataGPS.lat,
            lngInicio:dataGPS.lng,
            latFin:dataGPSDestino.lat,
            lngFin:dataGPSDestino.lng
        }
        setNewMid()
        setFormInicio(actualiza)
        setDestinoChange(destinoChange+1)
    },[dataGPSDestino]
    )
    
    const setNewMid = () =>{
        let minLat = Math.min(formInicio.latInicio, formInicio.latFin)
        let maxLat = Math.max(formInicio.latInicio, formInicio.latFin)
        let minlng = Math.min(formInicio.lngInicio, formInicio.lngFin)
        let maxlng = Math.max(formInicio.lngInicio, formInicio.lngFin)
        let midLat = ((minLat+maxLat)/2)
        let midLng = ((minlng+maxlng)/2)
        setCoordCenter({lat:midLat,lng:midLng})
        console.log(midLat,midLng)
        console.log(coordCenter)
    }

    const handleChange=(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name,value} = event.target
        setFormInicio((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }

    const manejarMovimientoDestino = (e: any) => {
        const marker = e.target;
        if (marker != null) {
            const gps = marker.getLatLng();
            console.log(gps)
            // Actualizamos solo el estado del destino
            setDataGPSDestino({lat:gps.lat,lng:gps.lng});
        }
    };
    

    const navigate = useNavigate()
    const continuarProceso = () => {
        console.log(formInicio)
        navigate("/viajeProceso")
    }
    const volverMenu = () => navigate("/menuUsuario")

    return (
        //inputs iniciales, boton de confirmacion para iniciar viaje
        //->Da inicio a la creacion del viaje a BD, asi como deja su estado ACTIVO
        //Carga nueva ventana del viaje activo

        //Se pide listado de patentes para seleccionar una
        <>
            <NavBar type={0} texto="" />
            <div className="tituloPaso">
                <h1>Iniciar un viaje</h1>
                <h2>Ingresa los datos necesarios</h2>
            </div>

            <div className="inputsInicio">
                <div className="itemInput">
                    <label>Fecha</label>
                    <input name="fecha" type="date" value={formInicio.fecha} onChange={handleChange}></input>
                </div>

                <div className="itemInput">
                    <label>Patente</label>
                    <select name="Patentes" defaultValue={""} onChange={manejarDataVehiculo}>
                        <option value={""} disabled>Selecciona una de las patentes disponibles</option>
                        {/**Solo se muestran las patentes de vehiculos disponibles */}
                        {Vehiculos.filter(vehiculo => vehiculo.estado === "Disponible").map((vehiculo) => (
                            <option key={vehiculo.patente} value={vehiculo.patente}>
                                {vehiculo.patente}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="itemInput">
                    <label>Modelo Vehículo</label>
                    <input disabled value={formInicio.modelo} placeholder=""></input>
                </div>

                <div className="itemInput">
                    <label>Kilometraje actual</label>
                    <input disabled type="number" name="kmsInicio" value={vehiculoSelected?.KMS_actual}></input>
                </div>

                <div className="itemInput">
                    <label>Hora inicio</label>
                    <input name="horaInicio" value={formInicio.horaInicio} onChange={handleChange} type="time"></input>
                </div>

                <div className="itemInput">
                    <label>Funcionario</label>
                    <input disabled name={formInicio.funcionario} value={formInicio.funcionario} type="text"></input>
                </div>
            </div>


            {/**Agregar input cámara*/}
            <div className="full-width">
                {}
                <button className="buttonFormularioInicio" onClick={()=>openModalCamara(true)}>Agregar imagen tablero</button>
            </div>



            <div className="full-width">
                <div className="itemInput2">
                    <label>Motivo</label>
                    <textarea name="motivo" value={formInicio.motivo} onChange={handleChange} placeholder="Explique el objetivo del viaje"></textarea>
                </div>
            </div>
            <div className="full-width-map">
                {destinoChange>1 ? 
                (<>
                        <div className="leaflet-container-preview">
                            <MapContainer center={[coordCenter.lat,coordCenter.lng]} zoom={14}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                    subdomains="abcd"
                                    maxZoom={18}
                                />
                                <Marker
                                    position={[dataGPS.lat, dataGPS.lng]}
                                    draggable={false} 
                                    icon={createCustomIcon("#3b40cf")}
                                />
                                <Marker
                                    position={[dataGPSDestino.lat, dataGPSDestino.lng]}
                                    draggable={false} 
                                    icon={createCustomIcon('#57A450')}
                                >
                                </Marker>
                            </MapContainer>
                            
                            <button className="buttonFormularioInicio" onClick={() => openModalDestino(true)}>Cambiar destino</button>
                        </div>
                </>)
                :
                (<>
                    <button className="buttonFormularioInicio" onClick={() => openModalDestino(true)}>Agregar destino del viaje</button>
                </>)}
                
            </div>

            <div className="botonesPaso">
                <button className="botonPaso" onClick={() => volverMenu()}>Volver</button>
                <button className="botonPaso" onClick={() => continuarProceso()}>Continuar</button>
            </div>
            
            


            <Modal open={modalDestino} onClose={() => openModalDestino(false)}>
                <ModalDialog variant="soft" size="lg">
                    <DialogTitle>
                        Mueve el pin al lugar de destino aproximado
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <div className="leaflet-container">
                            <MapContainer center={[dataGPS.lat,dataGPS.lng]} zoom={15} scrollWheelZoom={false}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                    subdomains="abcd"
                                    maxZoom={20}
                                />
                                <Marker
                                    position={[dataGPS.lat, dataGPS.lng]}
                                    draggable={false} // Queda estatico con la posicion actual del usuario
                                    icon={createCustomIcon("#3b40cf")}
                                />
                                <Marker
                                    position={[dataGPSDestino.lat, dataGPSDestino.lng]}
                                    draggable={true} // El usuario mueve este para determinar el destino
                                    autoPan={true}
                                    eventHandlers={{
                                        dragend: manejarMovimientoDestino // Captura la nueva posición al soltarlo
                                    }}
                                    riseOnHover={true}
                                    icon={createCustomIcon('#57A450')}
                                >

                                </Marker>
                            </MapContainer>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => openModalDestino(false)}>
                            Agregar destino
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => openModalDestino(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            <Modal open={modalCamara} onClose={()=>openModalCamara(false)}>
                <ModalDialog variant="plain">
                    <DialogTitle>
                        Agrega una captura del tablero del vehículo
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                            <div>seccion cámara</div>
                            <label style={{color:"black"}}>Sube la captura si es necesario</label>
                            <input type="file" accept="image/*"></input>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => openModalCamara(false)}>
                                Agregar captura
                            </Button>
                            <Button variant="plain" color="danger" onClick={() => openModalCamara(false)}>
                                Cancelar
                            </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </>
    )
}
export default inicioViaje