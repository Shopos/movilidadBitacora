import { useEffect, useState } from "react"
import NavBar from "../../componentes/navBar"
import getVehiculos, { getSolicitudes, resolverSolicitudesCambio, getSolicitudesViajes, getFuncionarios, patchSolicitudRechazo, addViajeInicial, pathSolicitudAprobada } from "../../utils/auxiliar"
import { useAlerta } from "../../context/AlertaContext"
import Table from "@mui/joy/Table"
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import { type User, type Vehiculo, type Solicitud, type SolicitudViaje, type Viaje } from "../../types/tipoSistema.ts"
import "../../estilos/solicitudesAdmin.css"

import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import Routing from "../../componentes/routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/
import GeocodeBuscador from "../../componentes/geocodeBuscador.tsx";

import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { useAuth } from "../../context/AuthContext.tsx"


type GPS = {
    lat: number,
    lng: number
}

interface prop {
    points: GPS[]
}

/**
 * Vista para el manejo de solicitudes por parte de la administracion del sistema
 * se manejan dos estados
 *  -False --> Muestra la vista de solicitudes pendientes de usuarios en relacion a temas de cambio de contraseñas
 *  -True --> Muestra la vista de solicitudes de viajes de usuarios departamento: 
 *      Si son aprobadas -> Genera un viaje dependiendo de lo ingresado o solicitando / cambia estado de la solicitud -aprobada-
 *      Si son rechazadas -> Cambia estado solicitud -rechazada- y agrega el motivo del rechazo
 */
function solicitudesAdmin() {
    const { showAlerta } = useAlerta()
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([])
    const [modalSol, setModalSol] = useState(false)
    const [modalViaje, setModalViaje] = useState(false)
    const [modalConfirmar, setModalConfirmar] = useState(false)
    const [modo, setModo] = useState(false)
    const [motivo, setMotivo] = useState("")
    const [cargando, setCargando] = useState(false)
    const [pass, setPass] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [pass2, setPass2] = useState("")
    const [showPass2, setShowPass2] = useState(false)
    const [solicitudSelected, setSolicitudSelected] = useState<Solicitud | null>()
    const [vistaActual, setVistaActual] = useState(false)
    const [solicitudesViaje, setSolicitudesViaje] = useState<SolicitudViaje[]>([])
    const [solicitudViajeSelected, setSolicitudViajeSelected] = useState<SolicitudViaje | null>(null)
    const [errorPass, setErrorPass] = useState({
        msg: "", est: false
    })
    const [dataGPS, setDataGPS] = useState<GPS>({
        lat: -34.639739, lng: -71.365916
    })

    const [dataGPSDestino, setDataGPSDestino] = useState<GPS>({
        lat: -34.639739, lng: -71.365916
    })
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
        modo: "ida", //modo ida (inicial) -> modo vuelta --->nuevo viaje con datos inversos
        imagen_comprobante_ben: "",
        imagen_tablero_ida: "",
        imagen_tablero_vuelta: "",
        hora_recomendada:""
    })
    const viajeVacio: Viaje = {
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
        modo: "ida", //modo ida (inicial) -> modo vuelta --->nuevo viaje con datos inversos
        imagen_comprobante_ben: "",
        imagen_tablero_ida: "",
        imagen_tablero_vuelta: "",
        hora_recomendada:""
    }
    const points: GPS[] = [dataGPS, dataGPSDestino]
    const [funcionarios, setFuncionarios] = useState<[User]>()
    const [vehiculos, setVehiculos] = useState<[Vehiculo]>()
    const [vehiculo, setVehiculo] = useState<Vehiculo>()
    const [modalDestino, openModalDestino] = useState(false)
    const { usuario } = useAuth()
    
    const [vehiculoSelected,setVehiculoSelected] = useState<Vehiculo>()
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<User[]>()
    const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>()
    //Metodo para obtener las solicitudes pendientes, usuarios y vehiculos por si se requiere agregar un viaje
    useEffect(() => {
        const getSolicitudesPendientes = async () => {
            try {
                const response = await getSolicitudes()
                if (response) {
                    setSolicitudesPendientes(response)
                    setCargando(true)
                }
                const responseViajes = await getSolicitudesViajes()
                if (responseViajes) {
                    setSolicitudesViaje(responseViajes)
                    setCargando(true)
                }

            } catch (e) {
                showAlerta("Error listando solicitudes, intenta más tarde", "error")
            }
        }
        const getListaUsuarios = async () => {
            try {
                const response = await getFuncionarios()
                if (response) {
                    setFuncionarios(response)
                }
            } catch (e) {
                showAlerta("Error listando usuarios", "error")
            }
        }
        const getListaVehiculos = async () => {
            try {
                const response = await getVehiculos()
                if (response) {
                    setVehiculos(response)
                    setCargando(true)
                }
            } catch (e) {
                showAlerta("Error listando vehículos", "error")
            }
        }
        getSolicitudesPendientes()
        getListaUsuarios()
        getListaVehiculos()
    }, [cargando])

    useEffect(() => {
        const actualiza = {
            ...formInicio,
            lat_inicio: dataGPS.lat,
            lng_inicio: dataGPS.lng,
            lat_fin: dataGPSDestino.lat,
            lng_fin: dataGPSDestino.lng
        }
        setFormInicio(actualiza)
    }, [dataGPSDestino])

    //Metodo para manejar la modificacion de las contraseñas
    //Comprueba que se ingrese informacion a los inputs
    //Compara que las contraseñas ingresadas sean iguales
    //Si se cumple, se permite resolver el cambio de contraseña al usuario solicitante
    const handleModifyPass = async () => {
        if (!pass || !pass2) {
            setErrorPass({ msg: "Los campos son obligatorios", est: true })
            return
        }
        if (pass !== pass2) {
            setErrorPass({ msg: "Las contraseñas no coinciden", est: true })
            return
        }
        setErrorPass({ msg: "", est: false })
        try {
            if (solicitudSelected) {
                await resolverSolicitudesCambio(solicitudSelected?.id_solicitud, pass)
                showAlerta("Contraseña modificada correctamente, avisa a usuario")
                handleCloseModal()
                setCargando(false)
            }
        } catch (e) {
            showAlerta("Error al cambiar contraseña", "error")
        }
    }
    
    const handleCloseModal = () => {
        setModalSol(false)
        setPass("")
        setPass2("")
        setSolicitudSelected(null)
    }
    //Apertura modal solicitudes usuario
    const openModalSol = (solicitud: Solicitud) => {
        setSolicitudSelected(solicitud)
        setModalSol(true)
    }
    //Rechazar solicitud viaje de departamento
    const rechazarSolicitud = () => {
        setModo(false)
        setModalConfirmar(true)
    }
    //Trata el modal para aprobar una solicitude de un viaje comenzando el flujo de inicio de un viaje
    const aprobarSolicitud = () => {
        setModo(true)
        setModalConfirmar(true)
    }
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

    //Use effect para el tratamiento de un viaje, si dentro del formulario de inicio y una solicitud seleccionada agrega un viaje y aprueba la solicitud
    useEffect(() => {
        const sendData = async () => {
            if (formInicio.estado_viaje === "En espera" && solicitudViajeSelected) {
                try{
                    const res = await pathSolicitudAprobada(solicitudViajeSelected?.id_solicitud,"Viaje Agendado")
                    if(res){
                        await addViajeInicial(formInicio)
                    }
                    setModalConfirmar(false)
                    setModalViaje(false)
                    setMotivo("")
                    setFormInicio(viajeVacio)
                    setCargando(false)
                    showAlerta("Solicitud aprobada, viaje agendado","success")
                }catch(e){
                    showAlerta("Error al intentar aprobar solicitud, intenta más tarde","error")
                }
            }
        }
        sendData()
    },[formInicio])

    const handleAprobarSolicitud = async () => {
        setFormInicio((prev) => ({
            ...prev,
            fecha_hora_inicio: "",
            ultima_modificacion: formatoFecha(),
            modificado_por: usuario!.nombre,
            estado_viaje: "En espera",
            modo: "ida"
        }))
    }
    //rechaza la solicitud de viaje de un departamento
    const handleRechazarSolicitud = async () => {
        if (solicitudViajeSelected) {
            await patchSolicitudRechazo(solicitudViajeSelected.id_solicitud, motivo)
            setModalViaje(false)
            setModalConfirmar(false)
            setMotivo("")
            setCargando(false)
        }
    }
    //funcion para el manejo del destino gps usado en el mapa
    const manejarMovimientoDestino = (e: any) => {
        const marker = e.target;
        if (marker != null) {
            const gps = marker.getLatLng();

            // Actualizamos solo el estado del destino
            setDataGPSDestino({ lat: gps.lat, lng: gps.lng });
        }
    };

    /*---> AGREGAR LOGICA LISTA DE VEHICULOS USUARIOS DEPENDIENDO DE LAS LICENCIAS PERMITIDAS */

    /** Si se selecciona un vehiculo desde un modal, reemplaza con los datos de dicho vehiculo en el formulario */
    const manejarDataVehiculo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const patenteselected = event.target.value

        const vehiculoEncontrado = vehiculos!.find(
            (vehiculo) => vehiculo.patente === patenteselected
        )
        if (vehiculoEncontrado) {
            setVehiculo(vehiculoEncontrado || null)
        }
        setFormInicio((prevData) => ({
            ...prevData,
            patente: patenteselected,
            vehiculo: vehiculoEncontrado ? vehiculoEncontrado.modelo : "",
            kms_inicial: vehiculoEncontrado ? vehiculoEncontrado.kms_actual : 0
        }))
    }
    //Maneja la logica del usuario funcionario dentro de la seleccion de un viaje
    const manejarDataFuncionario = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const usuarioSelected = Number(event.target.value)
        const usuarioFind = funcionarios!.find(
            (usr) => usr.id_usuario === usuarioSelected 
        )
        if (usuarioFind && usuarioFind.id_usuario !== 0) {
            setFormInicio((prevData) => ({
                ...prevData,
                id_usuario: usuarioFind ? usuarioFind.id_usuario : 0,
                nombre_funcionario: usuarioFind ? usuarioFind.nombre : ""
            }))
        }
    }
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

    const manejarResultadoBusqueda = (lat: number, lng: number, destino: string) => {
        setDataGPSDestino({ lat, lng })
        setFormInicio((prev) => ({
            ...prev,
            lat_fin: lat,
            lng_fin: lng,
            lat_inicio: dataGPS.lat,
            lng_inicio: dataGPS.lng,
            destino: destino
        }))
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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormInicio((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    //Manejo de la lista de vehiculos y usuarios disponibles segun licencia. Si un vehiculo es seleccionado, la lista de funcionarios cambia para mostrar
    //aquellos que pueden usar dicho vehiculo
    useEffect(() => {
        const vehiculoActivo = vehiculoSelected || null
        if(!vehiculoActivo){
            setUsuariosFiltrados(funcionarios||[])
            return
        }
        const filtra = (funcionarios || []).filter(u=>u.lista_licencia?.includes(vehiculoActivo?.licencia_min))
        setUsuariosFiltrados(filtra)

        if(formInicio.id_usuario && !filtra.some(u=>u.id_usuario === formInicio.id_usuario)){
            setFormInicio(prev=>({...prev,id_usuario:0,nombre_funcionario:""}))
        }
    }, [vehiculoSelected])

    //Maneja la lista de vehiculos dependiendo si existe un usuario seleccionado en el formulario mostrando aquellos vehiculos que el usuario seleccionado puede usar
    useEffect(() => {
        const idUsuarioActivo = formInicio.id_usuario
        if(!idUsuarioActivo){
            setVehiculoSelected(undefined)
            return
        }
        const usr = funcionarios?.find((u)=>u.id_usuario === idUsuarioActivo)
        const licenciasUsuario = usr?.lista_licencia || []
        const newList = (vehiculos||[]).filter((v)=>licenciasUsuario.includes(v.licencia_min))
        setVehiculosFiltrados(newList)
        if(formInicio.patente && !newList.some(v=>v.patente===formInicio.patente)){
            setFormInicio(prev=>({...prev,patente:"",vehiculo:"",kms_inicial:0}))
            setVehiculoSelected(undefined)
        }
    }, [formInicio.id_usuario])

    return (
        <>
            <NavBar type={1} texto={"Solicitudes"}></NavBar>
            <div>
                <div className='buttonsTablaH'>
                    
                    <button className="bordeIzquierdoBoton" disabled={vistaActual} onClick={() => setVistaActual(true)}>Solicitudes viajes</button>
                    <button className="bordeDerechaBoton" disabled={!vistaActual} onClick={() => setVistaActual(false)}>Solicitudes usuarios</button>
                </div>
                {vistaActual && solicitudesViaje && (
                    <>
                        <Table hoverRow borderAxis='y' sx={{
                            '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                            '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                            '& td': { textAlign: 'left', paddingLeft: 1.9 },
                            '& th': { backgroundColor: "#bad8b6" },
                            marginTop: "1vh"
                        }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>N°</th>
                                    <th>Solicitante</th>
                                    <th>Fecha solicitada</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesViaje && solicitudesViaje.map((sol: SolicitudViaje, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{sol.solicitante}</td>
                                        <td>{String(sol.fecha_solicitada).slice(0, 10) + " " + String(sol.fecha_solicitada).slice(11, 19)}</td>
                                        <td>{sol.estado}</td>
                                        <td>
                                            <div className="buttonsIconTable" style={{ display: "flex", gap: "10px" }}>
                                                <button style={{ width: "4.5vh" }} onClick={() => {
                                                    setSolicitudViajeSelected(sol)
                                                    setModalViaje(true)
                                                }}>
                                                    <VisibilitySharpIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {solicitudesViaje.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "5%" }}>
                                            No hay solicitudes pendientes por solucionar
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>
                    </>
                )}
                {solicitudesPendientes && !vistaActual && (
                    <>
                        <Table hoverRow borderAxis='y' sx={{
                            '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                            '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                            '& td': { textAlign: 'left', paddingLeft: 1.9 },
                            '& th': { backgroundColor: "#bad8b6" },
                            marginTop: "1vh"
                        }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>N°</th>
                                    <th>Correo</th>
                                    <th>Nombre</th>
                                    <th>Fecha solicitada</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesPendientes && solicitudesPendientes.map((sol: Solicitud, index) => (
                                    <tr>
                                        <td>{index.valueOf() + 1}</td>
                                        <td>{sol.correo}</td>
                                        <td>{sol.nombre}</td>
                                        <td>{String(sol.fecha_solicitada).slice(0, 10) + " " + String(sol.fecha_solicitada).slice(11, 19)}</td>
                                        <td>{sol.estado}</td>
                                        <td>
                                            <div className="buttonsIconTable" style={{ display: "flex", gap: "10px" }}>
                                                <button style={{ width: "4.5vh" }} onClick={() => openModalSol(sol)}>
                                                    <ManageAccountsSharpIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {solicitudesPendientes.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "5%" }}>
                                            No hay solicitudes pendientes por solucionar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </>
                )}
                

            </div>
            {/**Modal para el tratamiento del cambio de contraseñas --> se debe confirmar que ambas contraseñas sean iguales */}
            <Modal open={modalSol} onClose={() => setModalSol(false)}>
                <ModalDialog>
                    <DialogTitle>Ingresa la nueva contraseña</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <label>Nueva contraseña</label>
                        <div className="inputPass">
                            <input value={pass} onChange={(e) => setPass(e.currentTarget.value)} type={showPass ? "text" : "password"}></input>
                            <button onClick={() => setShowPass(!showPass)}>
                                {showPass ? <VisibilityOffSharpIcon fontSize="small" /> : <VisibilitySharpIcon fontSize="small" />}
                            </button>
                        </div>

                        <label>Confirmar la contraseña</label>
                        <div className="inputPass">
                            <input value={pass2} onChange={(e) => setPass2(e.currentTarget.value)} type={showPass2 ? "text" : "password"}></input>
                            <button onClick={() => setShowPass2(!showPass2)}>
                                {showPass2 ? <VisibilityOffSharpIcon fontSize="small" /> : <VisibilitySharpIcon fontSize="small" />}
                            </button>
                        </div>
                        {errorPass.est && (
                            <p style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}>
                                {errorPass.msg}
                            </p>
                        )}
                        <br></br>
                        <p>Recuerda entregar esta nueva contraseña al solicitante</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModifyPass}>Modificar</Button>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/**Modal para revision de solicitud y tramitacion de la misma -->aprobada abre modal agregar viaje y deja en espera dicho viaje, rechaza limpia solicitud */}
            <Modal open={modalViaje} onClose={() => setModalViaje(false)}>
                <ModalDialog>
                    <DialogTitle>Solicitud de {solicitudViajeSelected?.solicitante}</DialogTitle>
                    <Divider />
                    <DialogContent>
                        {solicitudViajeSelected &&
                            <><label style={{ fontWeight: "bold" }}>Estado</label><span>{solicitudViajeSelected.estado}</span></>
                        }
                        <label style={{ fontWeight: "bold" }}>Vehiculo solicitado</label>
                        <span>{solicitudViajeSelected?.vehiculo_solicitado}</span>

                        <label style={{ fontWeight: "bold" }}>Motivo</label>
                        <span>{solicitudViajeSelected?.motivo}</span>
                        {solicitudViajeSelected && solicitudViajeSelected.estado !== "pendiente" &&
                            <>
                                {solicitudViajeSelected.estado === "rechazada" && (<>
                                    <label style={{ fontWeight: "bold" }}>Rechazada por:</label> <span>{solicitudViajeSelected.estado_texto}</span>
                                </>)}
                                <label style={{ fontWeight: "bold" }}>Fecha resuelta</label><span>{solicitudViajeSelected.fecha_resuelta}</span>
                                <label style={{ fontWeight: "bold" }}>Resuelto por</label> <span>{solicitudViajeSelected.resuelta_por}</span>
                            </>
                        }
                    </DialogContent>
                    <DialogActions>
                        {solicitudViajeSelected?.estado === "pendiente" && (
                            <>
                                <Button color="success" onClick={() => aprobarSolicitud()}>Aprobar viaje</Button>
                                <Button color="danger" onClick={() => rechazarSolicitud()}>Rechazar</Button>
                            </>
                        )}
                        <Button color="neutral" onClick={() => setModalViaje(false)}>Volver</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/**Modal para resolver solicitud viaje ---Si rechazada explica el motivo del porque */}

            <Modal open={modalConfirmar} onClose={() => setModalConfirmar(false)}>
                <ModalDialog>
                    <DialogTitle>{modo ? "Aprobar viaje" : "Rechazar viaje"}</DialogTitle>
                    <Divider />
                    <DialogContent>
                        {modo ?
                            (<>
                                Agendar viaje aprobado
                                <div className="items-Modal">

                                    <div className="itemInput-Modal">
                                <label>Patente</label>
                                <select name="Patentes" value={formInicio.patente} onChange={manejarDataVehiculo}>
                                    <option value={""} disabled>Selecciona una patente disponible</option>
                                    {/**Solo se muestran las patentes de vehiculos disponibles */}
                                    {formInicio.id_usuario !== 0 ?
                                        (vehiculosFiltrados && vehiculosFiltrados.filter(veh => veh.estado === 'DISPONIBLE').map((veh) => (
                                            <option key={veh.patente} value={veh.patente}>
                                                {veh.patente}
                                            </option>
                                        )))
                                        :
                                        (vehiculos && vehiculos.filter(veh => veh.estado === "DISPONIBLE").map((veh) => (
                                            <option key={veh.patente} value={veh.patente}>
                                                {veh.patente}
                                            </option>
                                        )))
                                    }

                                </select>
                            </div>
                                    <div className="itemInput-Modal">
                                <label>Funcionario</label>
                                <select name="funcionarios" value={formInicio.id_usuario || ""} onChange={manejarDataFuncionario}>
                                    <option value={""} disabled>Designa un funcionario</option>
                                    {vehiculoSelected?.patente ?
                                        (
                                            usuariosFiltrados && usuariosFiltrados.map((usr: User) => (
                                                <option key={usr.id_usuario} value={usr.id_usuario}>{usr.nombre}</option>
                                            ))
                                        )
                                        : (funcionarios && funcionarios.map((usr: User) => (
                                            <option key={usr.id_usuario} value={usr.id_usuario}>{usr.nombre}</option>
                                        )))
                                    }

                                </select>
                            </div>
                                    <div className="itemInput-Modal">
                                        <label>Modelo Vehículo</label>
                                        <input disabled value={formInicio.vehiculo} placeholder=""></input>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Kilometraje actual</label>
                                        <input disabled type="number" name="kmsInicio" value={vehiculo?.kms_actual}></input>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Fecha y hora recomendada</label>
                                        <input type="datetime-local" name="hora_recomendada" value={formInicio.hora_recomendada ? formInicio.hora_recomendada:""}
                                        onChange={(e)=>setFormInicio({...formInicio,hora_recomendada:e.currentTarget.value})}></input>
                                    </div>
                                    <div className="itemInput2-Modal">
                                        <label>Motivo</label>
                                        <textarea name="motivo" value={solicitudViajeSelected?.motivo} placeholder="Explique el objetivo del viaje"></textarea>
                                    </div>
                                    <div className="divMapaDestino">
                                        {formInicio.destino && <p>Destino: {formInicio.destino}</p>}
                                        <button onClick={() => openModalDestino(true)}>Agregar destino del viaje</button>
                                    </div>
                                </div>
                            </>) :
                            (<>
                                Rechazar solicitud de viaje
                                <div className="itemInput2-Modal">
                                    <label>Motivo del rechazo </label>
                                    <textarea style={{ width: "25vw", maxWidth: "25vw" }} value={motivo} onChange={(e) => setMotivo(String(e.currentTarget.value))}></textarea>
                                </div>
                            </>)}

                    </DialogContent>
                    <DialogActions>
                        <Button color="success" onClick={() => {
                            modo ?
                                handleAprobarSolicitud()
                                :
                                handleRechazarSolicitud()

                        }}>Confirmar</Button>
                        <Button color="neutral" onClick={() => { setModalConfirmar(false) }}>Cancelar</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/*Modal para la seleccion de destino del viaje */}
            <Modal open={modalDestino} onClose={() => openModalDestino(false)}>
                <ModalDialog variant="soft" size="lg">
                    <DialogTitle>
                        "Mueve el pin al destino aproximado"
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <>
                            <div>
                                <label>"Agrega el destino del viaje"</label>
                                <input style={{ display: "flex", width: "50vw", fontSize: "0.8rem" }} type="text" name="destino" value={formInicio.destino}
                                    onChange={
                                        (e) => {
                                            handleChange(e)
                                        }
                                    }
                                ></input>
                            </div>
                            <div className="leaflet-container">
                                <MapContainer center={[dataGPS.lat, dataGPS.lng]} zoom={15} scrollWheelZoom={false}>
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                        subdomains="abcd"
                                        maxZoom={20}
                                    />
                                    <GeocodeBuscador onResult={manejarResultadoBusqueda} />
                                    <Marker
                                        position={[dataGPS.lat, dataGPS.lng]}
                                        draggable={false} // Queda estatico con la posicion actual del usuario
                                        icon={createCustomIcon("#3b40cf")}
                                    />
                                    <Marker
                                        position={[formInicio.lat_fin ?? dataGPS.lat, formInicio.lng_fin ?? dataGPS.lng]}
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
                        </>
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
export default solicitudesAdmin