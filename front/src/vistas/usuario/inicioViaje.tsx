import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"
import ImageUploader from "../../componentes/imageUploader.tsx";
import "../../estilos/inicioViaje.css"
import React, { useEffect, useState } from "react";
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import type { Viaje } from "../../types/tipoSistema.ts";
import Routing from "../../componentes/routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/
import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { isMobile } from "react-device-detect"
import { useAuth } from "../../context/AuthContext.tsx";
import { getViajeUsuarioEspera, patchInicio, resolverSubidaImagen } from "../../utils/auxiliar.ts";
import { useAlerta } from "../../context/AlertaContext.tsx";


type GPS = {
    lat: number,
    lng: number
}

interface prop {
    points: GPS[]
}

function inicioViaje() {
    const { showAlerta } = useAlerta()
    const [archivo, setArchivo] = useState<File | null>(null)
    const [previewInicio, setPreviewInicio] = useState<string | null>(null)

    const [modalCamara, openModalCamara] = useState<boolean>(false)
    const [cargando, setCargando] = useState<boolean>(false)
    const [formInicio, setFormInicio] = useState<Viaje | null>()
    const [dataGPS, setDataGPS] = useState<GPS>({
        lat: 0, lng: 0
    })
    const [dataGPSDestino, setDataGPSDestino] = useState<GPS>({
        lat: 0, lng: 0
    })
    const points: GPS[] = [dataGPS, dataGPSDestino]
    const { usuario } = useAuth()
    const date = new Date()
    const today = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const nowTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

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

    /**Consulta por el viaje en espera del usuario, si este existe carga los elementos del viaje en el formulario  */
    useEffect(() => {
        const getViajeEspera = async () => {
            try {
                if (usuario) {
                    const idViaje = localStorage.getItem("idViaje")
                    const response = await getViajeUsuarioEspera(usuario.id)
                    const viaje = response.find((vje: Viaje) => vje.id_viaje === Number(idViaje))

                    if (viaje && response) {
                        setFormInicio(viaje)
                        setCargando(true)
                    } else {
                        setFormInicio(null)
                    }
                }
            } catch (e) {
                console.error(" Error encontrando viaje ")
                setFormInicio(null)
            }
        }
        getViajeEspera()
    }, [usuario, cargando])

    useEffect(() => {
        if (formInicio?.lat_inicio) {
            setDataGPS({ lat: formInicio!.lat_inicio, lng: formInicio!.lng_inicio })
            setDataGPSDestino({ lat: formInicio!.lat_fin, lng: formInicio!.lng_fin })
        }
    }, [formInicio])

    /*Funcion para manejar los cambios de los inputs disponibles */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormInicio((prevData) => ({
            ...prevData!,
            [name]: value
        }))
    }

    const navigate = useNavigate()

    /* método para formatear la fecha, para poder enviar correctamente la informacion a DB, devuelve el formato correcto */
    const formatoFecha = () => {
        const d = new Date()
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const hour = String(d.getHours()).padStart(2, '0')
        const min = String(d.getMinutes()).padStart(2, '0')

        const formato = `${year}-${month}-${day} ${hour}:${min}`
        return formato
    }

    /* Método para actualizar la informacion antes del envio de esta misma a la DB */
    const updateData = async () => {
        if (formInicio) {
            setFormInicio((prevData) => ({
                ...prevData!,
                fecha_hora_inicio: `${today} ${nowTime}`,
                ultima_modificacion: formatoFecha(),
                modificado_por: usuario!.nombre,
                estado_viaje: "En proceso",
            }))
        }
    }

    /**Efecto para el envio de informacion del viaje inicial, una vez que el usuario haya ingresado fecha y hora del viaje y confirme los datos
     * estos son enviados a updateData donde se cambia el estado_viaje a En proceso --> detecta el cambio y se envia la informacion, una vez enviada se navega a 
     * viajeProceso
     */
    useEffect(() => {
        const patch = async () => {
            if (formInicio?.estado_viaje === "En proceso") {
                //localStorage.setItem("idViaje",String(formInicio.id_viaje))//guardar idViaje para consulta futura
                //Si formInicio modo==Vuelta fecha hora inicio !< ultima modificacion
                await patchInicio(formInicio.id_viaje, {
                    fecha_hora_inicio: formInicio.fecha_hora_inicio,
                    ultima_modificacion: formInicio.ultima_modificacion,
                    modificado_por: formInicio.modificado_por
                })
                navigate("/viajeProceso")
            }
        }
        patch()
    }, [formInicio?.estado_viaje])




    /*Almacena los datos ingresados dentro de formInicio en db y deja el estado del viaje en "true" (viaje activo -> true/viaje terminado ->false) --> vehiculo a "ACTIVO" */
    const continuarProceso = async () => {
        //Almacenar en localStorage id_viaje
        //Hacer patch al viaje y cambiar estado del vehiculo y usuario a en ruta, como tambien al viaje
        if (formInicio && archivo) {
            const res = await resolverSubidaImagen(formInicio.id_viaje, 'foto-inicio', archivo)
            if (res?.ok) {
                if (previewInicio) {
                    URL.revokeObjectURL(previewInicio)
                }
                await updateData().then()
            } else {
                switch (res?.status) {
                    case 400:
                        showAlerta(res.message || "Datos inválidos. Revisa la información.", "warning");
                        break;
                    case 413: 
                        showAlerta("La imagen es demasiado pesada para el servidor.", "error");
                        break;
                    case 403:
                        showAlerta("No tienes permisos para realizar esta acción.", "error");
                        break;
                    case 401:
                        showAlerta("Sesión expirada. Vuelve a iniciar sesión.", "error");
                        break;
                    default:
                        showAlerta(res?.message || "Hubo un problema al agregar, intenta más tarde.", "error");
                        break;
                }
            }
        } else {
            showAlerta("Debes incluir la foto de tablero antes de continuar", "warning")
        }


    }


    const volverMenu = () => navigate("/menuUsuario")

    return (
        /*
        Vista inicio de documentacion viaje
            Si existe un viaje En espera para el usuario es enviado a esta ventana donde debe ingresar la hora y fecha de inicio del viaje
            Si no existe viaje se muestra cargando
        */
        <>
            <NavBar type={0} texto="" />
            {cargando && formInicio ?
                (
                    <div>
                        <div className="tituloPaso">
                            <h1>Iniciar un viaje</h1>
                            <h2>Confirma los datos antes de comenzar</h2>
                        </div>

                        <div className="inputsInicio">
                            <div className="itemInput">
                                <label>Fecha</label>
                                <input name="dia" type="date" min={today} value={today} disabled></input>
                            </div>

                            <div className="itemInput">
                                <label>Patente</label>
                                <input disabled value={formInicio.patente}></input>
                            </div>

                            <div className="itemInput">
                                <label>Modelo Vehículo</label>
                                <input disabled value={formInicio.vehiculo} placeholder=""></input>
                            </div>

                            <div className="itemInput">
                                <label>Kilometraje actual</label>
                                <input disabled type="number" name="kmsInicio" value={formInicio.kms_inicial}></input>
                            </div>

                            <div className="itemInput">
                                <label>Hora inicio</label>
                                <input name="time" value={nowTime} disabled type="time"></input>
                            </div>

                            <div className="itemInput">
                                <label>Funcionario</label>
                                <input disabled name={usuario!.nombre} value={usuario!.nombre} type="text"></input>
                            </div>
                        </div>
                        <div className="full-width">
                            <div className="itemInput2">
                                <label>Motivo</label>
                                <textarea name="motivo" value={formInicio.motivo} onChange={handleChange} disabled></textarea>
                            </div>
                        </div>


                        {isMobile && !previewInicio && (
                            <div className="full-width">
                                <button className="buttonFormularioInicio" onClick={() => openModalCamara(true)}>Agregar imagen tablero</button>
                            </div>)}
                        {previewInicio && (
                            <div>
                                <img
                                    src={previewInicio}
                                    alt="tablero-inicio"
                                    style={{ width: "50vh", objectFit: 'cover' }}
                                ></img>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                    <p style={{ fontSize: '0.8rem', color: '#555' }}>Foto tablero lista</p>
                                    <button style={{ fontSize: "0.75rem", color: "#e53935", background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {
                                        URL.revokeObjectURL(previewInicio)
                                        setPreviewInicio(null)
                                        setArchivo(null)
                                    }}>Quitar</button>
                                </div>
                            </div>

                        )}



                        <div>Destino: {formInicio.destino}</div>
                        <div className="full-width">
                            <>
                                <div className="leaflet-container-preview">
                                    <MapContainer zoom={18}>
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                            subdomains="abcd"
                                            minZoom={8}
                                            maxZoom={18}
                                        />
                                        <Marker
                                            position={[formInicio.lat_inicio, formInicio.lng_inicio]}
                                            draggable={false}
                                            icon={createCustomIcon("#3b40cf")}
                                        />
                                        <Marker
                                            position={[formInicio.lat_fin, formInicio.lng_fin]}
                                            draggable={false}
                                            icon={createCustomIcon('#57A450')}
                                        >
                                        </Marker>
                                        <FitBounds points={points}></FitBounds>
                                        <Routing point1={dataGPS} point2={dataGPSDestino} option={false}/>
                                    </MapContainer>
                                </div>
                            </>

                        </div>

                        <div className="botonesPaso">
                            <button className="botonPaso" onClick={() => volverMenu()}>Volver</button>
                            <button className="botonPaso" onClick={() => continuarProceso()}>Continuar</button>
                        </div>
                    </div>
                ) : (<>
                    <div>Cargando...</div>
                    <div className="botonesPaso">
                        <button className="botonPaso" onClick={() => volverMenu}>Volver</button>
                    </div></>)}

            {/*Modal para ingreso de documentacion tablero vehiculo ya sea imagen previa o con camara */}
            <Modal open={modalCamara} onClose={() => openModalCamara(false)}>
                <ModalDialog variant="plain">
                    <DialogTitle>
                        Agrega una captura del tablero del vehículo
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {formInicio && (
                            <ImageUploader
                                //capture="environment"
                                capture="environment"
                                label="Agrega la imagen del tablero, ubicando el medidor de kilometraje"
                                onArchivoReady={(archivoInicio, url) => {
                                    if (previewInicio) {
                                        URL.revokeObjectURL(previewInicio)
                                    }
                                    setArchivo(archivoInicio)
                                    setPreviewInicio(url)
                                    openModalCamara(false)

                                }}
                                onCancelar={() => openModalCamara(false)}
                            />
                        )}
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