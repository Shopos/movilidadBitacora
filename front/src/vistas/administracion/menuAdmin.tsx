import NavBar from "../../componentes/navBar.tsx"
import DataViewViaje from "../../componentes/dataViewViaje.tsx";
import "../../estilos/menuAdmin.css"
import GeocodeBuscador from "../../componentes/geocodeBuscador.tsx";
import logoSC from "../../assets/logo.png"
const API = import.meta.env.VITE_API_URL || 'http://192.168.2.65:4000'

import { useState, useEffect, useMemo } from "react";
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button, Chip, Input } from "@mui/joy"
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable";
import { TablePagination } from "@mui/material"

import type { Vehiculo, Viaje, User } from "../../types/tipoSistema.ts"
import getVehiculos, { getViajes, getFuncionarios, addViajeInicial, editarViaje, borrarViajeEspera } from "../../utils/auxiliar.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { useAlerta } from "../../context/AlertaContext.tsx";

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

function dentroPeriodo(fechaConsulta: string | null, periodo: string): boolean {
    if (!fechaConsulta) {
        return false
    }
    const fecha = new Date(fechaConsulta)
    const hoy = new Date()

    if (periodo === "Hoy") {
        return fecha.toDateString() === hoy.toDateString()
    }
    if (periodo === "Semana") {
        const siete = new Date()
        siete.setDate(hoy.getDate() - 7)
        siete.setHours(0, 0, 0, 0)
        return fecha >= siete
    }
    if (periodo === "Mes") {
        const treinta = new Date()
        treinta.setDate(hoy.getDate() - 30)
        treinta.setHours(0, 0, 0, 0)
        return fecha >= treinta
    }
    return true //TODOS
}

function menuAdmin() {
    const { showAlerta } = useAlerta()
    const { usuario } = useAuth() //usuario ingresado en el inicio de sesión
    const [viajes, setViajes] = useState<[Viaje]>()

    const [periodos, setPeriodos] = useState<"Todos" | "Hoy" | "Semana" | "Mes">("Todos")
    const [busqueda, setBusqueda] = useState("")
    const [estado, setEstado] = useState<"Terminado" | "En proceso" | "En espera" | "Todos">("Todos")

    const [modoEdicionMapa, setModoEdicionMapa] = useState<"nuevo" | "edicion">("nuevo")

    const [usuariosFiltrados, setUsuariosFiltrados] = useState<User[]>()
    const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>()


    const [formEdit, setFormEdit] = useState<Partial<Viaje>>({})
    const [viajeSelected, setViajeSelected] = useState<Viaje | null>(null)
    const [viajeEdit, setViajeEditSelected] = useState<Viaje | null>(null)
    const [modalVista, setOpenModalVista] = useState<boolean>(false)
    const [modalEdicion, setOpenModalEdit] = useState<boolean>(false)
    const [cargando, setCargando] = useState<boolean>(false)
    const [modalNewViaje, setModalNewViaje] = useState(false)
    const [vehiculoSelected, setVehiculoSelected] = useState<Vehiculo>()
    const [listaUsuarios, setListaUsuarios] = useState<User[]>()
    const [vehiculos, setListaVehiculos] = useState<Vehiculo[]>()
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
        modo: "ida", //modo ida (inicial) -> modo vuelta --->nuevo viaje con datos inversos
        imagen_comprobante_ben: "",
        imagen_tablero_ida: "",
        imagen_tablero_vuelta: "",
        hora_recomendada: ""
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
        hora_recomendada: ""
    }

    /* Metodo para obtener la lista de viajes, usuarios y vehiculos */
    useEffect(() => {
        const getListaViajes = async () => {
            try {
                const response = await getViajes()
                if (response) {
                    setViajes(response)
                }
            } catch (e) {
                showAlerta("Error listando viajes", "error")
            }
        }
        const getListaUsuarios = async () => {
            try {
                const response = await getFuncionarios()
                if (response) {
                    setListaUsuarios(response)
                }
            } catch (e) {
                showAlerta("Error listando usuarios", "error")
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
                showAlerta("Error listando vehículos", "error")
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
                (viaje.fecha_hora_inicio ? (viaje.fecha_hora_inicio.slice(0, 10) + " " + viaje.fecha_hora_inicio.slice(11, 19)) : ("No iniciado")),
                viaje.destino,
                (viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(0, 10) + " " + viaje.fecha_hora_fin.slice(11, 19)) : "No terminado"),
                (viaje.estado_viaje)
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
            showAlerta("Archivo creado, guardando...", "success")
        }
        return
    }

    /** Si se selecciona un vehiculo desde un modal, reemplaza con los datos de dicho vehiculo en el formulario */
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

    /** Si se selecciona un usuario desde un modal, reemplaza con los datos de dicho usuario en formulario */
    const manejarDataFuncionario = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSelect = Number(event.target.value)
        const usuarioFind = listaUsuarios!.find(
            (usr) => usr.id_usuario === idSelect
        )
        if (usuarioFind) {
            setFormInicio((prevData) => ({
                ...prevData,
                id_usuario: usuarioFind ? usuarioFind.id_usuario : 0,
                nombre_funcionario: usuarioFind ? usuarioFind.nombre : ""
            }))
        }
    }

    //Maneja el cambio de informacion del funcionario a editar en un viaje
    const manejarDataFuncionarioEdit = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSelect = Number(event.target.value)
        const usrFind = listaUsuarios!.find(
            (usr) => usr.id_usuario === idSelect
        )
        if (usrFind) {
            setFormEdit((prevData) => ({
                ...prevData,
                id_usuario: usrFind.id_usuario,
                nombre_funcionario: usrFind.nombre
            }))
        }
    }
    //Maneja el modal de edicion, poblando de informacion al modal de edicion y al viaje seleccionado para edicion
    const editarViajeModal = (viaje: Viaje) => {
        //Visualiza y permite editar la informacion de un viaje X, solo si el viaje ha sido terminado previamente
        setViajeEditSelected(viaje)
        setFormEdit({ ...viaje })
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


    /*Mapa--> Contiene los constructores relacionados al uso del mapa*/
    const [modalDestino, openModalDestino] = useState(false)
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

            // Actualizamos solo el estado del destino
            setDataGPSDestino({ lat: gps.lat, lng: gps.lng });
            if (modoEdicionMapa === "edicion") {
                setFormEdit((prev) => ({ ...prev, lat_fin: gps.lat, lng_fin: gps.lng }))
            }
        }
    };

    //Metodo para la actualizacion de latitud longitud en formulario inicio
    useEffect(() => {
        if (modoEdicionMapa !== "nuevo") return
        const actualiza = {
            ...formInicio,
            lat_inicio: dataGPS.lat,
            lng_inicio: dataGPS.lng,
            lat_fin: dataGPSDestino.lat,
            lng_fin: dataGPSDestino.lng
        }
        setFormInicio(actualiza)
    }, [dataGPSDestino]
    )
    /**-->Terminan metodos relacionados a mapa */

    /**Metodo para tener un formato correcto de las fechas tanto para hora y fecha pedido en back
     * 
     * YYYY-MM-DD HH:MM
     */
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

    //Ultimos cambios antes de subir informacion a db
    const handleAgendaViaje = () => {
        setFormInicio((prevData) => ({
            ...prevData,
            fecha_hora_inicio: `${dia} ${time}`,
            ultima_modificacion: formatoFecha(),
            modificado_por: usuario!.nombre,
            estado_viaje: "En espera",
            modo: "ida"
        }))
    }

    /* Efecto que se activa la momento de actualizar algun valor en formInicio, si detecta algun cambio en el 
        formInicio y al mismo tiempo el estado_viaje de formInicio es "En espera", hace envio de la informacion inicial a DB, guarda
        esta misma informacion en localStorage y envia a la vista de viaje en proceso */
    useEffect(() => {
        const sendData = async () => {
            if (formInicio.estado_viaje === "En espera") {
                await addViajeInicial(formInicio)
                setModalNewViaje(false)
                setCargando(false)
                showAlerta("Viaje agendado correctamente", "success")
                setFormInicio(viajeVacio)
                setVehiculoSelected(undefined)
            }
        }
        sendData()
    }, [formInicio])

    const handleCierre = () => {
        //limpiar formInicio
        setModalNewViaje(false)
    }
    /**Contructor y metodos para la paginacion de la tabla de viajes*/
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    /**-->Terminan los contructores y metodos para paginacion de la tabla de viajes */

    //Funcion para filtrar los {viajes} considerando tiempo{hoy,semana,mes} texto{patente|nombre usuario} estado{En espera|En proceso|Terminado}
    //Estos filtros son llamados por los chips presentes en la cabecera de la tabla
    const viajeFiltrado = useMemo(() => {
        if (!viajes) return []

        return viajes.filter((vje: Viaje) => {
            const tiempo = periodos === "Todos" || dentroPeriodo(vje.fecha_hora_inicio, periodos) || dentroPeriodo(vje.estado_viaje === "En espera" ? vje.ultima_modificacion : "", periodos)

            const texto = busqueda.toLocaleLowerCase().trim()
            const textoPasado = texto === "" || vje.patente.toLocaleLowerCase().includes(texto) || vje.nombre_funcionario.toLocaleLowerCase().includes(texto)

            const estatus = estado === "Todos" || vje.estado_viaje === estado

            return tiempo && textoPasado && estatus
        })

    }, [viajes, periodos, busqueda, estado])

    //Manejar el envio de informacion hacia back idViaje, data a cambiar
    const handleEditViajeData = async () => {
        if (!viajeEdit) return
        try {
            await editarViaje(viajeEdit.id_viaje, formEdit)
            showAlerta("Viaje actualizado correctamente", "success")
            setOpenModalEdit(false)
            setViajeEditSelected(null)
            setCargando(false)
        } catch (e) {
            showAlerta("Error", "error")
        }
    }
    //Manejo para abrir el mapa en modo nuevo
    const abrirMapaNuevo = () => {
        setModoEdicionMapa("nuevo")
        openModalDestino(true)
    }
    //Manejo para el mapa en modo edicion
    const abrirMapaEdicion = () => {
        setModoEdicionMapa("edicion")
        setDataGPSDestino({
            lat: formEdit.lat_fin ?? dataGPS.lat,
            lng: formEdit.lng_fin ?? dataGPS.lng
        })
        openModalDestino(true)
    }

    //Metodo para borrar un viaje, solo si esta en modo espera
    //-->Elimina el viaje y libera a usuario y vehiculo asociado a dicho viaje
    const handleBorrarViaje = async () => {
        if (!viajeEdit) return
        try {
            await borrarViajeEspera(viajeEdit.id_viaje)
            showAlerta("Viaje borrado", "info")
            setOpenModalEdit(false)
            setViajeEditSelected(null)
            setCargando(false)
        } catch (e) {
            showAlerta("Error", "error")
        }
    }
    //Maneja el cambio de informacion detectado por el buscador de locaciones dentro del mapa que ingresa el destino
    //Si esta en modo edicion, cambia las variables de latitud longitud final y el destino 
    //Caso contrario, almacena los datos en el formulario de inicio
    const manejarResultadoBusqueda = (lat: number, lng: number, destino: string) => {
        setDataGPSDestino({ lat, lng })
        if (modoEdicionMapa === "edicion") {
            setFormEdit((prev) => ({
                ...prev,
                lat_fin: lat,
                lng_fin: lng,
                destino: destino
            }))
        } else {
            setFormInicio((prev) => ({
                ...prev,
                lat_fin: lat,
                lng_fin: lng,
                lat_inicio: dataGPS.lat,
                lng_inicio: dataGPS.lng,
                destino: destino
            }))
        }
    }
    const handleExportPDF = async () => {
        await exportViajeSelectedPDF()
        setOpenModalVista(false)
        setViajeSelected(null)
    }

    //FUncion para exportar la vista de un viaje en formato Bitacora
    const exportViajeSelectedPDF = async () => {
        const logo = logoSC
        const doc = new jsPDF('l', "pt", 'a4')
        doc.addImage(logo, "PNG", 750, 15, 60, 60)
        doc.setFontSize(11)
        doc.text("ILUSTRE MUNICIPALIDAD", 85, 30, { align: "center", maxWidth: 150 })
        doc.text("Santa Cruz", 90, 40, { align: "center" })
        doc.text("Departamento de Movilización", 85, 50, { align: "center" })
        doc.setFontSize(20)
        doc.text("BITÁCORA VEHICULO", 421, 80, { align: "center" })
        doc.setFontSize(14)
        { viajeSelected?.fecha_hora_inicio ? doc.text(`Fecha ${viajeSelected?.fecha_hora_inicio.slice(0, 10)}`, 10, 85) : doc.text("Aun no iniciado", 10, 85) }
        doc.text(`Vehiculo: ${viajeSelected?.vehiculo} Placa patente: ${viajeSelected?.patente}`, 10, 110, { align: "justify" })
        doc.text(`Salida:HRS. ${viajeSelected?.fecha_hora_inicio ? viajeSelected.fecha_hora_inicio.slice(11, 19) : ""}  KMS: ${viajeSelected?.kms_inicial}   Llegada:HRS. ${viajeSelected?.fecha_hora_fin ? viajeSelected?.fecha_hora_fin.slice(11, 19) : ""}  KMS: ${viajeSelected?.kms_fin ? viajeSelected.kms_fin : ""} `,
            10, 125, { align: "justify" })
        doc.text(`Destino: ${viajeSelected?.destino}`, 10, 140)
        doc.text(`Funcionario: ${viajeSelected?.nombre_funcionario}`, 10, 155)
        doc.text(`Motivo: ${viajeSelected?.motivo}`, 10, 170, { maxWidth: 800 })
        doc.text(`Combustible Cantidad: ${viajeSelected?.carga_combustible ? viajeSelected?.cantidad_carga : "No aplica"}`, 10, 200)
        doc.text(`Observaciones: ${viajeSelected?.obs_viaje ? viajeSelected.obs_viaje : "No aplica"}`, 10, 215, { maxWidth: 800 })
        if (viajeSelected?.imagen_tablero_ida) {
            const ruta = viajeSelected.imagen_tablero_ida
            try {
                await new Promise<void>((resolve) => {
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload = () => {
                        doc.addPage("l")
                        doc.text(`Tablero Vehículo ${viajeSelected.patente} al inicio`, 420, 20, { align: "center" })
                        doc.addImage(img, 'JPEG', 200, 140, 400, 400)
                        resolve()
                    }
                    img.onerror = (err) => {
                        console.error(err)
                        resolve()
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
        if (viajeSelected?.imagen_tablero_vuelta) {
            const ruta = viajeSelected.imagen_tablero_vuelta
            try {
                await new Promise<void>((resolve) => {
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload = () => {
                        doc.addPage("l")
                        doc.text(`Tablero Vehículo ${viajeSelected.patente} al terminar`, 420, 20, { align: "center" })
                        doc.addImage(img, 'JPEG', 200, 140, 400, 400)
                        resolve()
                    }
                    img.onerror = (err) => {
                        console.error(err)
                        resolve()
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
        if (viajeSelected?.imagen_comprobante_ben) {
            const ruta = viajeSelected.imagen_comprobante_ben
            try {
                await new Promise<void>((resolve) => {
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload = () => {
                        doc.addPage("l")
                        doc.text(`Comprobante carga combustible del vehículo ${viajeSelected.patente}`, 420, 20, { align: "center" })
                        doc.addImage(img, 'JPEG', 200, 140, 400, 400)
                        resolve()
                    }
                    img.onerror = (err) => {
                        console.error(err)
                        resolve()
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
        doc.save(`Bitacora_${viajeSelected?.nombre_funcionario}_${viajeSelected?.fecha_hora_inicio}.pdf`)
    }

    //Manejo de la lista de vehiculos y usuarios disponibles segun licencia. Si un vehiculo es seleccionado, la lista de funcionarios cambia para mostrar
    //aquellos que pueden usar dicho vehiculo
    useEffect(() => {
        const vehiculoActivo = vehiculoSelected || (formEdit.patente ? vehiculos?.find(v=>v.patente===formEdit.patente):null)
        if(!vehiculoActivo){
            setUsuariosFiltrados(listaUsuarios||[])
            return
        }
        const filtra = (listaUsuarios || []).filter(u=>u.lista_licencia?.includes(vehiculoActivo?.licencia_min))
        setUsuariosFiltrados(filtra)

        if(formInicio.id_usuario && !filtra.some(u=>u.id_usuario === formInicio.id_usuario)){
            setFormInicio(prev=>({...prev,id_usuario:0,nombre_funcionario:""}))
        }
    }, [vehiculoSelected,formEdit.patente])

    //Maneja la lista de vehiculos dependiendo si existe un usuario seleccionado en el formulario mostrando aquellos vehiculos que el usuario seleccionado puede usar
    useEffect(() => {
        const idUsuarioActivo = formInicio.id_usuario === 0 ? formEdit.id_usuario : formInicio.id_usuario
        if(!idUsuarioActivo){
            setVehiculoSelected(undefined)
            return
        }
        const usr = listaUsuarios?.find((u)=>u.id_usuario === idUsuarioActivo)
        const licenciasUsuario = usr?.lista_licencia || []
        const newList = (vehiculos||[]).filter((v)=>licenciasUsuario.includes(v.licencia_min))
        setVehiculosFiltrados(newList)
        if(formInicio.patente && !newList.some(v=>v.patente===formInicio.patente)){
            setFormInicio(prev=>({...prev,patente:"",vehiculo:"",kms_inicial:0}))
            setVehiculoSelected(undefined)
        }
    }, [formInicio.id_usuario, formEdit.id_usuario])

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
                <div className="barraButtonsTop">
                    <button className="buttonExport" onClick={() => setModalNewViaje(true)}>Agendar viaje</button>
                    <button className="buttonExport" onClick={() => exportarViajesPDF()}>Exportar tabla</button>
                </div>
                <div className="barraFiltro">
                    <div className="inputBusqueda">
                        <Input
                            placeholder="Buscar por patente o nombre de funcionario"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            startDecorator={<SearchOutlinedIcon />}
                            endDecorator={<button>Buscar</button>}
                            sx={{ width: "100%" }}></Input>
                    </div>
                    <Chip
                        variant={estado === "En espera" ? "outlined" : "plain"}
                        color={estado === "En espera" ? "primary" : "neutral"}
                        size="md"
                        onClick={() => {
                            setEstado(estado === "En espera" ? "Todos" : "En espera")
                            setPage(0)
                        }
                        }
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}>
                        En espera
                    </Chip>
                    <Chip
                        variant={estado === "En proceso" ? "outlined" : "plain"}
                        color={estado === "En proceso" ? "primary" : "neutral"}
                        size="md"
                        onClick={() => {
                            setEstado(estado === "En proceso" ? "Todos" : "En proceso")
                            setPage(0)
                        }
                        }
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}>
                        En curso
                    </Chip>
                    <Chip
                        variant={estado === "Terminado" ? "outlined" : "plain"}
                        color={estado === "Terminado" ? "primary" : "neutral"}
                        size="md"
                        onClick={() => {
                            setEstado(estado === "Terminado" ? "Todos" : "Terminado")
                            setPage(0)
                        }
                        }
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}>
                        Terminado
                    </Chip>
                    <Chip
                        variant={periodos === "Hoy" ? "outlined" : "plain"}
                        color={periodos === "Hoy" ? "primary" : "neutral"}
                        size="md"
                        startDecorator={<TodayOutlinedIcon />}
                        onClick={() => {
                            setPeriodos(periodos === "Hoy" ? "Todos" : "Hoy")
                            setPage(0)
                        }
                        }
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}
                    >Último día</Chip>
                    <Chip
                        variant={periodos === "Semana" ? "outlined" : "plain"}
                        color={periodos === "Semana" ? "primary" : "neutral"}
                        size="md"
                        startDecorator={<DateRangeOutlinedIcon />}
                        onClick={() => {
                            setPeriodos(periodos === "Semana" ? "Todos" : "Semana")
                            setPage(0)
                        }}
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}
                    >Última semana</Chip>
                    <Chip
                        variant={periodos === "Mes" ? "outlined" : "plain"}
                        color={periodos === "Mes" ? "primary" : "neutral"}
                        size="md"
                        startDecorator={<DateRangeOutlinedIcon />}
                        onClick={() => {
                            setPeriodos(periodos === "Mes" ? "Todos" : "Mes")
                            setPage(0)
                        }
                        }
                        sx={{
                            padding: "0.3%",
                            paddingLeft: "5px",
                            marginRight: "2px"
                        }}
                    >Último mes</Chip>

                </div>
                {cargando ? (<><div className="tablaViajes">
                    <Table hoverRow borderAxis="y" sx={
                        {
                            '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                            '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                            '& td': { textAlign: 'left', paddingLeft: 1.9 },
                            '& th': { backgroundColor: "#bad8b6" }
                        }

                    }>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>Patente</th>
                                <th style={{ width: "10%" }}>Fecha</th>
                                <th style={{ width: "15%" }}>Funcionario</th>
                                <th style={{ width: "10%" }}>Hora inicio</th>
                                <th style={{ width: "10%" }}>Hora llegada</th>
                                <th style={{ width: "10%" }}>Estado viaje</th>
                                <th style={{ width: "10%" }}>Duración viaje</th>
                                <th >Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {viajeFiltrado && viajeFiltrado.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((viaje: Viaje) => (
                                <tr>
                                    <td>{viaje.patente}</td>
                                    <td>{viaje.fecha_hora_inicio ? (viaje.fecha_hora_inicio.slice(0, 10)) : ("Viaje en espera")}</td>
                                    <td>{viaje.nombre_funcionario}</td>
                                    <td>{viaje.fecha_hora_inicio ? (viaje.fecha_hora_inicio.slice(11, 19)) : ("Aún no iniciado")}</td>

                                    <td>{viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(11, 19)) : ("Aún no terminado")}</td>

                                    <td>{viaje.estado_viaje}</td>
                                    <td>{viaje.estado_viaje === "Terminado" ? (() => {
                                        const diffMs = new Date(viaje.fecha_hora_fin).valueOf() - new Date(viaje.fecha_hora_inicio).valueOf();
                                        const hours = Math.floor(diffMs / 1000 / 60 / 60);
                                        const minutes = Math.floor((diffMs / 1000 / 60) % 60);
                                        return `${hours}h ${minutes}m`;
                                    })() : ("Aún no terminado")}</td>
                                    <td>
                                        <div className="buttonsIconTable" style={{ display: "flex", gap: "10px" }}>
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

                            {viajeFiltrado.length === 0 && estado === "Todos" && periodos === "Todos" && busqueda === "" && (
                                <tr >
                                    <td colSpan={8} style={{ textAlign: "center", padding: "5%" }}>No cuentas con bitácoras de momento</td>
                                </tr>
                            )}
                            {viajeFiltrado.length === 0 && (estado !== "Todos" || periodos !== "Todos" || busqueda !== "") && (
                                <tr >
                                    <td colSpan={8} style={{ textAlign: "center", padding: "5%" }}>No cuentas con bitácoras para este filtro</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={viajeFiltrado!.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={"Cantidad de viajes a mostrar"}
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                        sx={{
                            '& .MuiTablePagination-actions': { width: '4vw' }
                        }}
                    />
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
                            handleExportPDF()
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

            {/*Modal edicion viaje 
                ->Viaje en espera
                    -Cambia funcionario, vehiculo, destino y motivo
                ->Viaje terminado
                    -Cambia observacion viaje, cantidad combustible
            */}
            <Modal open={modalEdicion} onClose={() => setOpenModalEdit(false)}>
                <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                    <DialogTitle>
                        Viaje {viajeEdit?.id_viaje}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {formEdit.estado_viaje === "En espera" && (
                            <>
                                <div className="items-Modal">
                                    <div className="itemInput-Modal">
                                        <label>Patente</label>
                                        <select name="Patentes" value={formEdit.patente} onChange={(e) => {
                                            const veh = vehiculos?.find(v => v.patente === e.target.value)
                                            setFormEdit({ ...formEdit, patente: e.target.value, vehiculo: veh?.modelo ?? formEdit.vehiculo, kms_inicial: veh?.kms_actual ?? formEdit.kms_inicial })
                                        }}>
                                            {/**Solo se muestran las patentes de vehiculos disponibles */}
                                            <option>{formEdit?.patente}</option>
                                            {formEdit.id_usuario !== 0 ? (
                                                vehiculosFiltrados && vehiculosFiltrados!.filter((veh) => (veh.estado === "DISPONIBLE")).map((veh) => (
                                                    <option key={veh.patente} value={veh.patente}>
                                                        {veh.patente}
                                                    </option>
                                                ))
                                            ) : (vehiculos && vehiculos.filter(veh => (veh.estado === "DISPONIBLE")).map((veh) => (
                                                <option key={veh.patente} value={veh.patente}>
                                                    {veh.patente}
                                                </option>)))}

                                        </select>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Funcionario</label>
                                        <select name="funcionarios" value={formEdit.id_usuario||""} onChange={manejarDataFuncionarioEdit}>
                                            <option value={""}>{formEdit?.nombre_funcionario}</option>
                                            {formEdit?.patente ? 
                                            (
                                                usuariosFiltrados?.map((usr: User) => (
                                                <option key={usr.id_usuario} value={usr.id_usuario}>{usr.nombre}</option>
                                            ))) : (
                                                listaUsuarios && listaUsuarios.map((usr: User) => (
                                                <option key={usr.id_usuario} value={usr.id_usuario}>{usr.nombre}</option>
                                            )))}
                                        </select>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Modelo Vehículo</label>
                                        <input disabled value={formEdit.vehiculo} placeholder=""></input>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Kilometraje actual</label>
                                        <input disabled type="number" name="kmsInicio" value={formEdit.kms_inicial}></input>
                                    </div>
                                    <div className="itemInput-Modal">
                                        <label>Fecha y hora recomendada</label>
                                        <input type="datetime-local" name="hora_recomendada" value={formEdit.hora_recomendada ? formEdit.hora_recomendada : ""}
                                            onChange={(e) => setFormEdit({ ...formEdit, hora_recomendada: e.currentTarget.value })}></input>
                                    </div>
                                    <div className="itemInput2-Modal">
                                        <label>Motivo</label>
                                        <textarea name="motivo" value={formEdit.motivo} onChange={(e) => {
                                            setFormEdit({ ...formEdit, motivo: e.target.value })
                                        }} placeholder="Explique el objetivo del viaje"></textarea>
                                    </div>
                                    <div className="buttonLabel-Modal">
                                        <button onClick={() => abrirMapaEdicion()}>Cambiar destino del viaje</button>
                                        {formEdit.destino ? <label>Destino: {formEdit.destino}</label> : <></>}
                                    </div>
                                </div>
                            </>
                        )
                        }
                        {viajeEdit?.estado_viaje === "Terminado" && (
                            <>
                                <div className="itemInput2-Modal">
                                    <label>Observacion del viaje</label>
                                    <textarea name="motivo" value={formEdit.obs_viaje} onChange={(e) => setFormEdit({ ...formEdit, obs_viaje: e.target.value })} placeholder="Explique el objetivo del viaje"></textarea>
                                </div>
                                {formEdit.carga_combustible ?
                                    (<div className="itemInput2-Modal">
                                        <label>Cantidad de combustible</label>
                                        <textarea name="motivo" value={formEdit.cantidad_carga} onChange={(e) => setFormEdit({ ...formEdit, cantidad_carga: Number(e.target.value) })} placeholder="Explique el objetivo del viaje"></textarea>
                                    </div>) : (<></>)
                                }
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>

                        <Button variant="solid" color="success" onClick={() => {
                            handleEditViajeData()
                        }}>
                            guardar cambios
                        </Button>
                        <Button variant="plain" onClick={() => {
                            setViajeEditSelected(null)
                            setFormEdit({})
                            setOpenModalEdit(false)
                        }}>
                            Cancelar
                        </Button>
                        {viajeEdit?.estado_viaje === "En espera" && (
                            <Button sx={{ marginRight: 'auto' }} variant="plain" color="danger" onClick={() => {
                                handleBorrarViaje()
                            }}>Eliminar viaje</Button>
                        )}
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
                                        : (listaUsuarios && listaUsuarios.map((usr: User) => (
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
                                <input disabled type="number" name="kmsInicio" value={vehiculoSelected?.kms_actual}></input>
                            </div>

                            <div className="itemInput-Modal">
                                <label>Fecha y hora recomendada</label>
                                <input type="datetime-local" name="hora_recomendada" value={formInicio.hora_recomendada ? formInicio.hora_recomendada : ""}
                                    onChange={(e) => setFormInicio({ ...formInicio, hora_recomendada: e.currentTarget.value })}></input>
                            </div>
                            <div className="itemInput2-Modal">
                                <label>Motivo</label>
                                <textarea name="motivo" value={formInicio.motivo} onChange={handleChange} placeholder="Explique el objetivo del viaje"></textarea>
                            </div>
                            <div className="divMapaDestino">
                                {formInicio.destino && <p>Destino: {formInicio.destino}</p>}
                                <button onClick={() => abrirMapaNuevo()}>Agregar destino del viaje</button>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => handleAgendaViaje()}>Agendar Viaje</Button>
                        <Button variant="outlined" color="danger" onClick={() => {
                            setFormInicio(viajeVacio)
                            setVehiculoSelected(undefined)
                            handleCierre()
                        }}>Cancelar</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>


            {/*Modal para la seleccion de destino del viaje */}
            <Modal open={modalDestino} onClose={() => openModalDestino(false)}>
                <ModalDialog variant="soft" size="lg">
                    <DialogTitle>
                        {modoEdicionMapa === "edicion" ? "Cambiar el destino del viaje" : "Mueve el pin al destino aproximado"}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <>
                            <div>
                                <label>{modoEdicionMapa === "edicion" ? "Nombre del nuevo destino" : "Agrega el destino del viaje"}</label>
                                <input style={{ display: "flex", width: "50vw", fontSize: "0.8rem" }} type="text" name="destino" value={modoEdicionMapa === "edicion" ? (formEdit.destino ?? "") : formInicio.destino}
                                    onChange={
                                        (e) => {
                                            if (modoEdicionMapa === "edicion") {
                                                setFormEdit((prev) => ({ ...prev, destino: e.target.value }))
                                            } else {
                                                handleChange(e)
                                            }
                                        }
                                    }></input>
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
                                        position={modoEdicionMapa === "edicion" ? [formEdit.lat_fin ?? dataGPS.lat, formEdit.lng_fin ?? dataGPS.lng] :
                                            [formInicio.lat_fin ?? dataGPS.lat, formInicio.lng_fin ?? dataGPS.lng]}
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
export default menuAdmin