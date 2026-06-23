import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/inicioViaje.css"
import React, { useEffect, useState } from "react";
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import type { Vehiculo, User } from "../../tipos/tipoSistema.ts";
import Routing from "../../componentes/routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/
import getVehiculos from "../../utils/auxiliar.ts";
import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { isMobile } from "react-device-detect"

type GPS = {
    lat: number,
    lng: number
}

interface prop {
    points: GPS[]
}
/**Solo toma la segunda vez que se hace drag del pin */
function inicioViaje() {
    const [vehiculoSelected, setVehiculoSelected] = useState<Vehiculo | null>(null)
    const [modalDestino, openModalDestino] = useState<boolean>(false)
    const [modalCamara, openModalCamara] = useState<boolean>(false)
    const [destinoChange, setDestinoChange] = useState<number>(0)
    const [cargando,setCargando] = useState<boolean>(false)
    const [dataGPS, setDataGPS] = useState<GPS>({
        lat: -34.639739, lng: -71.365916
    })
    const [dataGPSDestino, setDataGPSDestino] = useState<GPS>({
        lat: -34.639739, lng: -71.365916
    })
    const points: GPS[] = [dataGPS, dataGPSDestino]

    const [formInicio, setFormInicio] = useState({
        fecha: "",
        patente: "",
        horaInicio: "",
        motivo: "",
        modelo: "",
        kmsInicio: "",
        horaLlegada: "",
        kmsFinViaje: "",
        funcionario: "",
        combustible: false,
        cantidad: 0,
        observaciones: "",
        latInicio: 0,
        lngInicio: 0,
        latFin: 0,
        lngFin: 0
    })
    const usuario: User = {
        cargo: "Funcionario",
        correo: "usr@usr.cl",
        nombre: "Pepe pape",
        estado: false,
        tipo_licencia: "A1",
        pass: ""
    }
    const [vehiculos, setVehiculos] = useState<[Vehiculo]>()

    /*Funcion para dar colores especificos a los Marker de leaflet y poder diferenciar punto de inicio y destino */
    const createCustomIcon = (color: string) => {
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
        })
    }

    /*Trigger por select --> Ajusta los datos del vehiculo cuya patente ha sido seleccionada en esta vista */

    const manejarDataVehiculo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const patenteselected = event.target.value

        const vehiculoEncontrado = vehiculos!.find(
            (vehiculo) => vehiculo.patente === patenteselected
        )
        if (vehiculoEncontrado) {
            setVehiculoSelected(vehiculoEncontrado || null)
        }
        setFormInicio((prevData) => ({
            ...prevData,
            patente: patenteselected,
            modelo: vehiculoEncontrado ? vehiculoEncontrado.modelo : "",
            kmsInicio: vehiculoEncontrado ? vehiculoEncontrado.kms_actual.toString() : ""
        }))


    }

    /*Efecto para conseguir el nombre del usuario registrado y su posicion actual dependiendo del GPS, solo si ha sido aceptado en app */
    useEffect(() => {
        

        navigator.geolocation.getCurrentPosition(position => {
            setDestinoChange(destinoChange)
            setDataGPS({ lat: position.coords.latitude, lng: position.coords.longitude })
            setDataGPSDestino({ lat: position.coords.latitude, lng: position.coords.longitude })
        });
        const getData = async () => {
            const data = await getVehiculos()
            if (data) {
                setVehiculos(data)
            }
            setFormInicio((prevData) => ({
            ...prevData,
            funcionario: usuario.nombre,
            }))
            setCargando(true)
        }
        getData()
    }, [])

    /*Funcion para centrar el preview del mapa dependiendo de los puntos seleccionados */
    function FitBounds({ points }: prop) {
        const map = useMap()

        useEffect(() => {
            const bound = points.map(p => [p.lat, p.lng] as [number, number])
            if (points.length > 0) {
                map.fitBounds(bound, {
                    padding: [50, 50],
                    maxZoom: 15,
                })
            }
        }, [map, points])
        return null
    }

    /*Efecto para guardar los puntos del destino luego de terminar el drag del marcador de destino*/
    useEffect(() => {
        const actualiza = {
            ...formInicio,
            latInicio: dataGPS.lat,
            lngInicio: dataGPS.lng,
            latFin: dataGPSDestino.lat,
            lngFin: dataGPSDestino.lng
        }
        setFormInicio(actualiza)
        setDestinoChange(destinoChange + 1)
    }, [dataGPSDestino]
    )

    /*Funcion para manejar los cambios de los inputs disponibles */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormInicio((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    /*Funciona para manejar el cambio de destino y guardar esta posicion al finalizar el drag */
    const manejarMovimientoDestino = (e: any) => {
        const marker = e.target;
        if (marker != null) {
            const gps = marker.getLatLng();
            console.log(gps)
            // Actualizamos solo el estado del destino
            setDataGPSDestino({ lat: gps.lat, lng: gps.lng });
        }
    };


    const navigate = useNavigate()

    /*Almacena los datos ingresados dentro de formInicio en db y deja el estado del viaje en "true" (viaje activo -> true/viaje terminado ->false) --> vehiculo a "ACTIVO" */
    const continuarProceso = () => {
        navigate("/viajeProceso", {})
    }
    const volverMenu = () => navigate("/menuUsuario")

    return (
        /*
        Vista inicio de documentacion viaje
            >Se muestran las patentes de vehiculos cuyo estado sea "DISPONIBLE" y se descartan los otros 
            >Se agrega directamente el nombre del usuario ingresado dentro del formulario directamente
            >Modal para agregar primera vista de tablero y seleccion de destino
        */
        <>
            <NavBar type={0} texto="" />
            {cargando ? 
            ( 
                <div>
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
                        {vehiculos && vehiculos!.filter(vehiculo => vehiculo.estado === "DISPONIBLE").map((vehiculo) => (
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
                    <input disabled type="number" name="kmsInicio" value={vehiculoSelected?.kms_actual}></input>
                </div>

                <div className="itemInput">
                    <label>Hora inicio</label>
                    <input name="horaInicio" value={formInicio.horaInicio} onChange={handleChange} type="time"></input>
                </div>

                <div className="itemInput">
                    <label>Funcionario</label>
                    <input disabled name={usuario.nombre} value={usuario.nombre} type="text"></input>
                </div>
            </div>


            {isMobile ? (
                <div className="full-width">
                    <button className="buttonFormularioInicio" onClick={() => openModalCamara(true)}>Agregar imagen tablero</button>
                </div>) : (<></>)}



            <div className="full-width">
                <div className="itemInput2">
                    <label>Motivo</label>
                    <textarea name="motivo" value={formInicio.motivo} onChange={handleChange} placeholder="Explique el objetivo del viaje"></textarea>
                </div>
            </div>
            <div className="full-width-map">
                {destinoChange > 1 ?
                    (<>
                        <div className="leaflet-container-preview">
                            <MapContainer center={[dataGPSDestino.lat, dataGPSDestino.lng]} zoom={18}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                    subdomains="abcd"
                                    minZoom={8}
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
                                <FitBounds points={points}></FitBounds>
                                <Routing point1={dataGPS} point2={dataGPSDestino} />
                            </MapContainer>

                            <button className="buttonFormularioInicio" onClick={() => openModalDestino(true)}>Cambiar destino</button>

                            <span>Destino</span><input type="text"></input>
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
            </div>
            ):(<>Cargando...</>)}


            {/*Modal para la seleccion de destino del viaje */}
            <Modal open={modalDestino} onClose={() => openModalDestino(false)}>
                <ModalDialog variant="soft" size="lg">
                    <DialogTitle>
                        Mueve el pin al lugar de destino aproximado
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <div className="leaflet-container">
                            <MapContainer center={[dataGPS.lat, dataGPS.lng]} zoom={15} scrollWheelZoom={false}>
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

                                <FitBounds points={points}></FitBounds>
                                <Routing point1={dataGPS} point2={dataGPSDestino} />
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

            {/*Modal para ingreso de documentacion tablero vehiculo ya sea imagen previa o con camara */}
            <Modal open={modalCamara} onClose={() => openModalCamara(false)}>
                <ModalDialog variant="plain">
                    <DialogTitle>
                        Agrega una captura del tablero del vehículo
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <div>seccion cámara</div>
                        <label style={{ color: "black" }}>Sube la captura si es necesario</label>
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