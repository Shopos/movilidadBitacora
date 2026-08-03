import NavBar from "../../componentes/navBar.tsx"
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useMemo, useState } from "react"
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button, Chip } from "@mui/joy"
import { useNavigate } from "react-router-dom";
import "../../estilos/viajesUsuario.css"
import type { Viaje } from "../../types/tipoSistema.ts"
import DataViewViaje from "../../componentes/dataViewViaje.tsx"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../../context/AuthContext.tsx";
import { getViajeID } from "../../utils/auxiliar.ts";
import { TablePagination } from "@mui/material";
import { useAlerta } from "../../context/AlertaContext.tsx";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import logoSC from "../../assets/logo.png"
const API = import.meta.env.VITE_API_URL || 'http://192.168.2.65:4000'

//Funcion para el filtrado de viajes por fecha, se considera por dia, semana y mes
function dentroPeriodo(fechaString: string | null, periodo: string): boolean {
    if (!fechaString) {
        return false
    }
    const fecha = new Date(fechaString)
    const hoy = new Date()

    if (periodo === "Dia") {
        return fecha.toDateString() === hoy.toDateString()
    }
    if (periodo === "Semana") {
        const semana = new Date()
        semana.setDate(hoy.getDate() - 7)
        semana.setHours(0, 0, 0, 0)
        return fecha >= semana
    }
    if (periodo === "Mes") {
        const mes = new Date()
        mes.setDate(hoy.getDate() - 30)
        mes.setHours(0, 0, 0, 0)
        return fecha >= mes
    }
    return true
}

function viajesUsuario() {
    const { showAlerta } = useAlerta()
    const { usuario } = useAuth()
    const [viajesUsuario, setViajes] = useState<Viaje[] | null>(null)
    const [viajeSelected, setViajeSelected] = useState<Viaje | null>(null)
    const [openModalViaje, setOpenModalViaje] = useState<boolean>(false)
    const navigate = useNavigate()
    const volverMenu = () => navigate("/menuUsuario")
    const handleModalViajeView = (viaje: Viaje): void => {
        setViajeSelected(viaje)
        setOpenModalViaje(true)
    }
    const [periodos, setPeriodos] = useState<"Todos" | "Dia" | "Semana" | "Mes">("Todos")

    /*Exporta la tabla de viajes, con los datos actuales que presente la lista de viajes activos
    Dentro del informe se encuentran los datos importantes a considerar por los viajes
    */

    const exportarPDF = () => {
        if (viajesUsuario) {
            const doc = new jsPDF('l', 'pt', 'a4')
            doc.setFontSize(12)
            const columns = ['ID', 'Vehiculo', 'Patente', 'kM inicio', 'kM fin', 'Hora inicio', 'Hora llegada','Destino','Estado del viaje']
            const rows = viajesUsuario.map((vje) => [
                vje.id_viaje,
                vje.vehiculo,
                vje.patente,
                vje.kms_inicial,
                (vje.kms_fin ? vje.kms_fin : 0),
                (vje.fecha_hora_inicio ? vje.fecha_hora_inicio.slice(0, 10) + " " + vje.fecha_hora_inicio.slice(11, 19) : ""),
                (vje.fecha_hora_fin ? vje.fecha_hora_fin.slice(0, 10) + " " + vje.fecha_hora_fin.slice(11, 19) : ""),
                vje.destino,
                (vje.estado_viaje)
            ])
            doc.text(`Reporte de Bitácoras de ${usuario?.nombre} - Departamento de Movilización Municipalidad de Santa Cruz`, 20, 20)

            autoTable(doc, {
                startY: 40,
                head: [columns],
                body: rows,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 5 },
                headStyles: { fillColor: [41, 120, 120], textColor: 255 }
            })
            showAlerta("Archivo creado correctamente", "success")
            doc.save(`Reporte viajes ${usuario?.nombre}.pdf`)
        } else {
            return
        }
        return
    }

    /**Consulta los viajes del usuario y los almacena */
    useEffect(() => {
        const getViajesUsuario = async () => {
            try {
                const response = await getViajeID(usuario!.id)
                if (response) {
                    setViajes(response)
                }
            } catch (e) {
                showAlerta("Error listando viajes, intenta más tarde", "error")
                console.error("Error listando viajes ", e)
            }
        }
        getViajesUsuario()
    }, [])

    /**Constructores y metodos para la paginacion de la tabla de viajes del usuario 
     * 
     * handleChangePage -->Manejar el cambio de pagina, como se subdivide el listado en paginas, esta funcion determina la pagina a mostrar
     * handleChangeRowsPerPage -->Maneja la cantidad de filas a mostrar dependiendo de la cantidad de filas a mostrar por la tabla
    */
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    //Funcion para filtrar la lista de {viajes} dependiendo del periodo elegido por los Chips en la vista
    const viajeFiltrado = useMemo(() => {
        if (!viajesUsuario) return []

        return viajesUsuario.filter((vje: Viaje) => {
            const tiempo = periodos === "Todos" || dentroPeriodo(vje.fecha_hora_inicio, periodos)

            return tiempo
        })
    }, [viajesUsuario, periodos])
    
/**Funcion para generar PDF de un viaje seleccionado, si este cuenta con imagenes, crea las paginas adicionales con dichas imagenes */
    const generarViajePdf=async()=>{
        const logo = logoSC
        const doc = new jsPDF('l',"pt",'a4')
        doc.addImage(logo,"PNG",750,15,60,60)
        doc.setFontSize(11)
        doc.text("ILUSTRE MUNICIPALIDAD",85,30,{align:"center",maxWidth:150})
        doc.text("Santa Cruz",90,40,{align:"center"})
        doc.text("Departamento de Movilización",85,50,{align:"center"})
        doc.setFontSize(20)
        doc.text("BITÁCORA VEHICULO",421,80,{align:"center"})
        doc.setFontSize(14)
        doc.text(`Fecha ${viajeSelected?.fecha_hora_inicio?viajeSelected?.fecha_hora_inicio.slice(0,10):"No iniciado"}`,10,85)
        doc.text(`Vehiculo: ${viajeSelected?.vehiculo} Placa patente: ${viajeSelected?.patente}`,10,110,{align:"justify"})
        doc.text(`Salida:HRS. ${viajeSelected?.fecha_hora_inicio? viajeSelected.fecha_hora_inicio.slice(11,19):"-"}  KMS: ${viajeSelected?.kms_inicial}   Llegada:HRS. ${viajeSelected?.fecha_hora_fin ? viajeSelected?.fecha_hora_fin.slice(11,19): "-"}  KMS: ${viajeSelected?.kms_fin ? viajeSelected.kms_fin:"-"} `,
        10,125,{align:"justify"})
        doc.text(`Destino: ${viajeSelected?.destino}`,10,140)
        doc.text(`Funcionario: ${viajeSelected?.nombre_funcionario}`,10,155)
        doc.text(`Motivo: ${viajeSelected?.motivo}`,10,170,{maxWidth:800})
        doc.text(`Combustible Cantidad: ${viajeSelected?.carga_combustible ? viajeSelected?.cantidad_carga:"No aplica"}`,10,200)
        doc.text(`Observaciones: ${viajeSelected?.obs_viaje ? viajeSelected.obs_viaje:"No aplica"}`,10,215,{maxWidth:800})
        if(viajeSelected?.imagen_tablero_ida){
            const ruta = viajeSelected.imagen_tablero_ida
            try{
                await new Promise<void>((resolve)=>{
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload=()=>{    
                        doc.addPage("l")
                        doc.text(`Tablero Vehículo ${viajeSelected.patente} al inicio`,420,20,{align:"center"})
                        doc.addImage(img,'JPEG',200,140,400,400)
                        resolve()
                    }
                    img.onerror=(err)=>{
                        console.error(err)
                        resolve()
                    }
                })
            }catch(e){
                console.error(e)
            }
        }
        if(viajeSelected?.imagen_tablero_vuelta){
            const ruta = viajeSelected.imagen_tablero_vuelta
            try{
                await new Promise<void>((resolve)=>{
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload=()=>{    
                        doc.addPage("l")
                        doc.text(`Tablero Vehículo ${viajeSelected.patente} al terminar`,420,20,{align:"center"})
                        doc.addImage(img,'JPEG',200,140,400,400)
                        resolve()
                    }
                    img.onerror=(err)=>{
                        console.error(err)
                        resolve()
                    }
                })
            }catch(e){
                console.error(e)
            }
        }
        if(viajeSelected?.imagen_comprobante_ben){
            const ruta = viajeSelected.imagen_comprobante_ben
            try{
                await new Promise<void>((resolve)=>{
                    const img = new Image()
                    img.src = `${API}/uploads/${ruta}`
                    img.onload=()=>{    
                        doc.addPage("l")
                        doc.text(`Comprobante carga combustible Vehículo ${viajeSelected.patente}`,420,20,{align:"center"})
                        doc.addImage(img,'JPEG',200,140,400,400)
                        resolve()
                    }
                    img.onerror=(err)=>{
                        console.error(err)
                        resolve()
                    }
                })
            }catch(e){
                console.error(e)
            }
        }
        doc.save(`Bitacora_${viajeSelected?.nombre_funcionario}_${viajeSelected?.fecha_hora_inicio}.pdf`)
    }

    /*
    Vista para los viajes del usuario
        >Se listan los viajes y se muestran en tabla
        >Usuario puede ver su viaje y detalles o exportar dicho viaje a formato pdf
            >La edicion de dicho viaje sera vista y editada por Administracion para evitar problemas
    */
    return (
        <>
            <NavBar type={0} texto="" />
            <div>
                {viajesUsuario ? (
                    <>
                        <div>
                            <Chip
                                variant={periodos === "Dia" ? "outlined" : "plain"}
                                color={periodos === "Dia" ? "primary" : "neutral"}
                                size="lg"
                                startDecorator={<DateRangeOutlinedIcon />}
                                onClick={() => {
                                    setPeriodos(periodos === "Dia" ? "Todos" : "Dia")
                                    setPage(0)
                                }}
                                sx={{
                                    marginTop: "1%",
                                    marginBottom: "1%",
                                    padding: "0.3%",
                                    paddingLeft: "5px",
                                    marginRight: "2px"
                                }}
                            >Último día</Chip>
                            <Chip
                                variant={periodos === "Semana" ? "outlined" : "plain"}
                                color={periodos === "Semana" ? "primary" : "neutral"}
                                size="lg"
                                startDecorator={<DateRangeOutlinedIcon />}
                                onClick={() => {
                                    setPeriodos(periodos === "Semana" ? "Todos" : "Semana")
                                    setPage(0)
                                }}
                                sx={{
                                    marginTop: "1%",
                                    marginBottom: "1%",
                                    padding: "0.3%",
                                    paddingLeft: "5px",
                                    marginRight: "2px"
                                }}
                            >Última semana</Chip>
                            <Chip
                                variant={periodos === "Mes" ? "outlined" : "plain"}
                                color={periodos === "Mes" ? "primary" : "neutral"}
                                size="lg"
                                startDecorator={<DateRangeOutlinedIcon />}
                                onClick={() => {
                                    setPeriodos(periodos === "Mes" ? "Todos" : "Mes")
                                    setPage(0)
                                }}
                                sx={{
                                    marginTop: "1%",
                                    marginBottom: "1%",
                                    padding: "0.3%",
                                    paddingLeft: "5px",
                                    marginRight: "2px"
                                }}>Último mes</Chip>
                        </div>
                        <Table hoverRow borderAxis="y" sx={
                            {
                                '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                                '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                                '& td': { textAlign: 'left', paddingLeft: 1.9 },
                                '& th': { backgroundColor: "#bad8b6" },
                                marginTop: "1vh"
                            }
                        }>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>ID</th>
                                    <th style={{ width: "12%" }}>Patente vehículo</th>
                                    <th style={{ width: "12%" }}>Hora inicio</th>
                                    <th style={{ width: "12%" }}>Hora llegada</th>
                                    <th style={{ width: "12%" }}>Estado viaje</th>
                                    <th style={{ width: "12%" }}>Duración viaje</th>
                                    <th style={{ width: "12%" }}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {viajeFiltrado && viajeFiltrado.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((viaje: Viaje) => (
                                    <tr>
                                        <td><span className="cell-header">ID</span>{viaje.id_viaje}</td>
                                        <td><span className="cell-header">Patente vehiculo</span>{viaje.patente}</td>
                                        <td><span className="cell-header">Hora inicio</span>{viaje.fecha_hora_inicio ? `${viaje.fecha_hora_inicio.slice(0, 10)} ${viaje.fecha_hora_inicio.slice(11, 19)}` : "Aun no iniciado"}</td>
                                        <td><span className="cell-header">Hora llegada</span>{viaje.fecha_hora_fin ? `${viaje.fecha_hora_fin.slice(0, 10)} ${viaje.fecha_hora_fin.slice(11, 19)}` : "Aun no terminado"}</td>
                                        <td><span className="cell-header">Estado viaje</span>{viaje.estado_viaje}</td>
                                        <td>{viaje.estado_viaje === "Terminado" ? (() => {
                                            const diffMs = new Date(viaje.fecha_hora_fin).valueOf() - new Date(viaje.fecha_hora_inicio).valueOf();
                                            const hours = Math.floor(diffMs / 1000 / 60 / 60);
                                            const minutes = Math.floor((diffMs / 1000 / 60) % 60);
                                            return `${hours}h ${minutes}m`;
                                        })() : ("Aún no terminado")}</td>
                                        <td>
                                            <span className="cell-header">Acciones</span>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button className="buttonIconTable" onClick={() => handleModalViajeView(viaje)}>
                                                    <VisibilityIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {viajeFiltrado.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "5%" }}>
                                            No hay viajes que coincidan con la búsqueda
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component={"div"}
                            count={viajeFiltrado!.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Cantidad de viajes a mostrar"}
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                        ></TablePagination>
                    </>
                ) : (<>No cuentas con viajes</>)
                }
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <button className="botonPaso" onClick={() => volverMenu()}>Volver</button>
                    {viajesUsuario ? (<button className="botonPaso" onClick={() => exportarPDF()}>Exportar Tabla a PDF</button>) : (<></>)}
                </div>

                {/**Modal para mostrar la informacion de un viaje seleccionado en la lista de viajes del usuario */}
                <Modal open={openModalViaje} onClose={() => setOpenModalViaje(false)}>
                    <ModalDialog variant="outlined" role="alertdialog">
                        <DialogTitle>
                            Viaje {viajeSelected?.id_viaje}
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            {viajeSelected ? (<DataViewViaje viajeSelected={viajeSelected} modo={0} />) : "ERROR"}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>generarViajePdf()}>Exportar a pdf</Button>
                            <Button variant="soft" color="neutral" onClick={() => setOpenModalViaje(false)}>
                                Volver
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            </div>
        </>
    )
}

export default viajesUsuario