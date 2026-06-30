import NavBar from "../../componentes/navBar.tsx"
import DataViewViaje from "../../componentes/dataViewViaje.tsx";
import "../../estilos/menuAdmin.css"

import { useState, useEffect } from "react";
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button, Chip, Input } from "@mui/joy"
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable";

import type { Vehiculo, Viaje, User } from "../../tipos/tipoSistema.ts"
import getVehiculos, { getViajes, getFuncionarios } from "../../utils/auxiliar.ts";
import { useAuth } from "../../context/AuthContext.tsx";

import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import Routing from "../../componentes/routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/

type GPS = {
    lat: number,
    lng: number
}

interface prop {
    points: GPS[]
}
function menuAdmin() {
    const [viajes, setViajes] = useState<[Viaje]>()
    const [viajeSelected, setViajeSelected] = useState<Viaje | null>(null)
    const [viajeEdit, setViajeEditSelected] = useState<Viaje | null>(null)
    const [modalVista, setOpenModalVista] = useState<boolean>(false)
    const [modalEdicion, setOpenModalEdit] = useState<boolean>(false)
    const [cargando, setCargando] = useState<boolean>(false)
    const [modalNewViaje, setModalNewViaje] = useState(false)
    const [vehiculoSelected, setVehiculoSelected] = useState<Vehiculo>()
    const [funcionarioSelected, setFuncionarioSelected] = useState<User>()
    const [listaUsuarios, setListaUsuarios] = useState<[User]>()
    const [vehiculos, setListaVehiculos] = useState<[Vehiculo]>()
    const [dia, setDia] = useState("")
    const [time, setTime] = useState("")
    const [formInicio, setFormInicio] = useState<Viaje>({
        id_viaje: 0,
        fecha_hora_inicio: "",
        patente: "",
        motivo: "",
        vehiculo: "",
        kms_inicial: 0,
        fecha_hora_fin: "",
        kms_fin: 0,
        nombre_funcionario: "",
        carga_combustible: false,
        cantidad_carga: 0,
        obs_viaje: "",
        lat_inicio: 0,
        lng_inicio: 0,
        lat_fin: 0,
        lng_fin: 0,
        destino: "",
        estado_viaje: "Terminado", //inicio viaje -> cambiar
        id_usuario: 0, //inicio viaje -> cambiar
        lat_fin_real: 0,
        lng_fin_real: 0,
        modificado_por: "", //inicio viaje -> cambiar
        ultima_modificacion: "", //inicio viaje ->cambiar
    })

    /* Metodo para obtener la lista de viajes */
    useEffect(() => {
        const getListaViajes = async () => {
            try {
                const response = await getViajes()
                if (response) {
                    setViajes(response)
                }
            } catch (e) {
                console.error(" Error listando viajes ", e)
            }
        }
        const getListaUsuarios = async () => {
            try {
                const response = await getFuncionarios()
                if (response) {
                    setListaUsuarios(response)
                }
            } catch (e) {
                console.error(" Error listando usuarios ", e)
            }
        }
        const getListaVehiculos = async () => {
            try {
                const response = await getVehiculos()
                if (response) {
                    setListaVehiculos(response)
                    setCargando(true)
                }
            } catch (e) {
                console.error(" Error listando Vehiculos ", e)
            }
        }
        getListaViajes()
        getListaUsuarios()
        getListaVehiculos()
    }, [cargando])

    const handleModalViajeView = (viaje: Viaje) => {
        //Visualiza la informacion del viaje en un modal, si el viaje esta en proceso muestra la informacion del viaje hasta el momento
        setViajeSelected(viaje)
        setOpenModalVista(true)
        return
    }

    /* Metodo para exportar a documento la tabla de viajes actual */
    const exportarViajesPDF = () => {
        const doc = new jsPDF('l', 'pt', 'a4')
        const columns = ['ID', 'Vehiculo', 'Patente', 'Funcionario', 'kM inicio', 'kM fin', 'Hora inicio', 'Destino', 'Hora llegada', 'Estado del viaje']

        if (viajes) {
            const rows = viajes.map((viaje) => [
                viaje.id_viaje,
                viaje.vehiculo,
                viaje.patente,
                viaje.nombre_funcionario,
                viaje.kms_inicial,
                (viaje.kms_fin ? viaje.kms_fin : 0),
                (viaje.fecha_hora_inicio.slice(0, 10) + " " + viaje.fecha_hora_inicio.slice(11, 19)),
                viaje.destino,
                (viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(0, 10) + " " + viaje.fecha_hora_fin.slice(11, 19)) : "-"),
                (viaje.estado_viaje ? "En ruta" : "Terminado")
            ])
            doc.setFontSize(12)
            doc.text("Reporte de viajes departamento de movilización", 20, 20)

            autoTable(doc, {
                startY: 40,
                head: [columns],
                body: rows,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 5 },
                headStyles: { fillColor: [41, 120, 120], textColor: 255 }
            })
            doc.save("Reporte.pdf")
        }
        return
    }

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
            vehiculo: vehiculoEncontrado ? vehiculoEncontrado.modelo : "",
            kms_inicial: vehiculoEncontrado ? vehiculoEncontrado.kms_actual : 0
        }))
    }

    const manejarDataFuncionario = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const usuarioSelected = (event.target.value).split(" / ")[0]
        const usuarioFind = listaUsuarios!.find(
            (usr) => usr.nombre === usuarioSelected
        )
        setFormInicio((prevData) => ({
            ...prevData,
            id_usuario: usuarioFind ? usuarioFind.id_usuario : 0,
            nombre_funcionario: usuarioFind ? usuarioFind.nombre : ""
        }))
    }

    const editarViajeModal = (viaje: Viaje) => {
        //Visualiza y permite editar la informacion de un viaje X, solo si el viaje ha sido terminado previamente
        setViajeEditSelected(viaje)
        setOpenModalEdit(true)
        return
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = event.target
            setFormInicio((prevData) => ({
                ...prevData,
                [name]: value
            }))
        }
    
    const {usuario} = useAuth()
    console.log(localStorage.getItem("token"))
    console.log(usuario)

    /*Mapa */
    const [modalDestino,openModalDestino] = useState(false)
    const [dataGPS, setDataGPS] = useState<GPS>({
            lat: -34.639739, lng: -71.365916
        })
        const [dataGPSDestino, setDataGPSDestino] = useState<GPS>({
            lat: -34.639739, lng: -71.365916
        })
    const points: GPS[] = [dataGPS, dataGPSDestino]
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
         const manejarMovimientoDestino = (e: any) => {
        const marker = e.target;
        if (marker != null) {
            const gps = marker.getLatLng();
            console.log(gps)
            // Actualizamos solo el estado del destino
            setDataGPSDestino({ lat: gps.lat, lng: gps.lng });
        }
    };
    /*
    Vista menu administracion
    >Directamente abre la tabla de las bitacoras
    >Muestra input barra para busqueda por patente o nombre usuario, mas 2 de busqueda rapida que muestra bitacoras del ultimo dia o la ultima semana
    >boton para exportar la tabla actual en formato pdf
        >Cada celda presenta botones de acciones para visualizar la bitacora de la celda, editar los datos (dejando registro de esto) y exportar dicha bitacora a PDF
    */
    return (
        <>
            <NavBar type={1} texto="Bitácoras" />
            <div className="cuerpoMenu">
                <div className="barraFiltro">
                    <div className="inputBusqueda">
                        <Input
                            startDecorator={<SearchOutlinedIcon />}
                            endDecorator={<button>buscar</button>}
                            sx={{ width: "100%" }}></Input>
                    </div>
                    <Chip
                        variant="outlined"
                        color="neutral"
                        size="lg"
                        startDecorator={<TodayOutlinedIcon />}
                        onClick={() => ("Filtra por día")}
                        sx={{
                            padding: "0.5%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}
                    >Último día</Chip>
                    <Chip
                        variant="outlined"
                        color="neutral"
                        size="lg"
                        startDecorator={<DateRangeOutlinedIcon />}
                        onClick={() => ("Filtra por día")}
                        sx={{
                            padding: "0.5%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}
                    >Última semana</Chip>
                    <button className="buttonExport" onClick={() => setModalNewViaje(true)}>Generar viaje</button>
                    <button className="buttonExport" onClick={() => exportarViajesPDF()}>Exportar tabla</button>
                </div>
                {cargando ? (<><div className="tablaViajes">
                    <Table hoverRow borderAxis="y" sx={
                        { '& td': { textAlign: 'left', paddingLeft: 1.9 } }

                    }>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>Patente</th>
                                <th style={{ width: "10%" }}>Fecha</th>
                                <th style={{ width: "15%" }}>Funcionario</th>
                                <th style={{ width: "10%" }}>Hora inicio</th>
                                <th style={{ width: "10%" }}>Hora llegada</th>
                                <th style={{ width: "10%" }}>Estado viaje</th>
                                <th >Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {viajes && viajes.map((viaje: Viaje) => (
                                <tr>
                                    <td>{viaje.patente}</td>
                                    <td>{(viaje.fecha_hora_inicio.slice(0, 10))}</td>
                                    <td>{viaje.nombre_funcionario}</td>
                                    <td>{(viaje.fecha_hora_inicio.slice(11, 19))}</td>

                                    <td>{viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(11, 19)) : ("-")}</td>

                                    <td>{viaje.estado_viaje}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleModalViajeView(viaje)}>
                                                <VisibilityIcon />
                                            </button>
                                            {(viaje.estado_viaje === "En espera" || viaje.estado_viaje === "Terminado") ?
                                                (
                                                    <button onClick={() => editarViajeModal(viaje)}>
                                                        <EditDocumentIcon />
                                                    </button>
                                                ) : (
                                                    <></>
                                                )
                                            }

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>  </>) : (<>Cargando</>)}

            </div>


            {/*Modal vista viaje */}
            <Modal open={modalVista} onClose={() => setOpenModalVista(false)}>
                <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                    <DialogTitle>
                        Viaje {viajeSelected?.id_viaje}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <DataViewViaje viajeSelected={viajeSelected!} modo={0}></DataViewViaje>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            setViajeSelected(null)
                            setOpenModalVista(false)
                        }}>
                            exportar viaje a PDF
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => {
                            setViajeSelected(null)
                            setOpenModalVista(false)
                        }}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
            {/*Modal edición viaje */}

            <Modal open={modalEdicion} onClose={() => setOpenModalEdit(false)}>
                <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                    <DialogTitle>
                        Viaje {viajeEdit?.id_viaje}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {/*Cambiar para aceptar edicion */}
                        <DataViewViaje viajeSelected={viajeEdit!} modo={1}></DataViewViaje>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            setViajeEditSelected(null)
                            setOpenModalEdit(false)
                        }}>
                            guardar cambios
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => {
                            setViajeEditSelected(null)
                            setOpenModalEdit(false)
                        }}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/*Modal para crear un viaje nuevo
            -Designa a usuario disponibles para viaje
            -Designa vehiculo disponible para viaje
            -Marca el punto de destino
            -Describe el motivo
            -Dependiendo del vehiculo se agrega el kilometraje actual
                ->Crea un viaje en DB a la espera de ser iniciado por usuario designado
                    ->Viajes en espera pueden ser editados
                    ->Viajes en proceso no pueden ser editados
                    ->Viajes terminados pueden ser editados (dependiendo del campo)
        */}
            <Modal open={modalNewViaje} onClose={() => setModalNewViaje(false)}>
                <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                    <DialogTitle>
                        Creando nuevo viaje
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <div>
                            <div className="itemInput">
                                <label>Fecha</label>
                                <input name="dia" type="date" value={dia} onChange={(e) => setDia(e.target.value)}></input>
                            </div>
                            <div className="itemInput">
                                <label>Hora inicio</label>
                                <input name="time" value={time} onChange={(e) => setTime(e.target.value)} type="time"></input>
                            </div>
                            <div className="itemInput">
                                <label>Patente</label>
                                <select name="Patentes" defaultValue={""} onChange={manejarDataVehiculo}>
                                    <option value={""} disabled>Selecciona una patente disponible</option>
                                    {/**Solo se muestran las patentes de vehiculos disponibles */}
                                    {vehiculos && vehiculos.filter(veh => veh.estado === "DISPONIBLE").map((veh) => (
                                        <option key={veh.patente} value={veh.patente}>
                                            {veh.patente}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="itemInput">
                                <label>Funcionario</label>
                                <select name="funcionarios" defaultValue={""} onChange={manejarDataFuncionario}>
                                    <option value={""} disabled>Designa un funcionario</option>
                                    {listaUsuarios && listaUsuarios.map((usr: User) => (
                                        <option>{`${usr.nombre} / ${usr.tipo_licencia}`}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="itemInput">
                                <label>Modelo Vehículo</label>
                                <input disabled value={formInicio.vehiculo} placeholder=""></input>
                            </div>
                            <div className="itemInput">
                                <label>Kilometraje actual</label>
                                <input disabled type="number" name="kmsInicio" value={vehiculoSelected?.kms_actual}></input>
                            </div>
                            <div className="itemInput2">
                                <label>Motivo</label>
                                <textarea name="motivo" value={formInicio.motivo} onChange={handleChange} placeholder="Explique el objetivo del viaje"></textarea>
                            </div>
                            <div>
                                <button>Cambiar destino del viaje</button>
                                <button>Agregar destino del viaje</button>
                            </div>
                        </div>
                    </DialogContent>
                </ModalDialog>
            </Modal>


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
        </>
    )
}
export default menuAdmin