import NavBar from "../../componentes/navBar.tsx"
import DataViewViaje from "../../componentes/dataViewViaje.tsx";
import "../../estilos/menuAdmin.css"

import { useState } from "react";
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button, Chip, Input} from "@mui/joy"
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import type {Viaje} from "../../tipos/tipoSistema.ts"
function menuAdmin(){
    const viajes:Viaje[]=[
        {id_viaje:1,
            patente:"yzx123",
            fecha: "14/7/2026",
            nombre_funcionario:"sanchez miguel",
            fecha_hora_inicio:"12:00",
            kms_inicio:100,
            fecha_hora_fin:"13:30",
            kms_fin:110,
            estado_viaje:false,
            cantidad_combustible:10,
            carga_combustible:true,
            destino:"santa cruz",
            lat_inicio: -34.639464, 
            lng_inicio: -71.365910,
            lat_fin:-34.627511,
            lng_fin:-71.349689,
            motivo:"Visita a parque",
            obs_viaje:"-",
            vehiculo:"Toyota"
        },
        {id_viaje:2,
            patente:"yzx123",
            fecha: "14/7/2026",
            nombre_funcionario:"pedro pablo",
            fecha_hora_inicio:"13:00",
            kms_inicio:100,
            fecha_hora_fin:"17:30",
            kms_fin:110,
            estado_viaje:true,
            cantidad_combustible:10,
            carga_combustible:false,
            destino:"santa cruz",
            lat_inicio: -34.639464, 
            lng_inicio: -71.365910,
            lat_fin:-34.661494,
            lng_fin:-71.420961,
            motivo:"Mirador la lajuela",
            obs_viaje:"-",
            vehiculo:"Toyota"
        },
        {id_viaje:3,
            patente:"yzx123",
            fecha: "14/7/2026",
            nombre_funcionario:"sanchez miguel",
            fecha_hora_inicio:"12:00",
            kms_inicio:100,
            fecha_hora_fin:"21:30",
            kms_fin:110,
            estado_viaje:false,
            cantidad_combustible:10,
            carga_combustible:true,
            destino:"Santiago",
            lat_inicio: -34.639464, 
            lng_inicio: -71.365910,
            lat_fin:-33.444210, 
            lng_fin:-70.653608,
            motivo:"Visita a Moneda",
            obs_viaje:"-",
            vehiculo:"Toyota"
        }
    ]
    const [viajeSelected,setViajeSelected] = useState<Viaje|null>(null)
    const [viajeEdit,setViajeEditSelected] = useState<Viaje|null>(null)
    const [modalVista,setOpenModalVista] = useState<boolean>(false)
    const [modalEdicion,setOpenModalEdit] = useState<boolean>(false)


    const handleModalViajeView=(viaje:Viaje)=>{
        //Visualiza la informacion del viaje en un modal, si el viaje esta en proceso muestra la informacion del viaje hasta el momento
        setViajeSelected(viaje)
        setOpenModalVista(true)
        return
    }
    const exportarViajePDF =(viaje:Viaje)=>{
        //Exporta el viaje con sus datos en formato pdf
        console.log("se exporta viaje seleccionado", viaje)
        return
    }
    const editarViajeModal = (viaje:Viaje) =>{
        //Visualiza y permite editar la informacion de un viaje X, solo si el viaje ha sido terminado previamente
        setViajeEditSelected(viaje)
        setOpenModalEdit(true)
        return
    }

    /*
    Vista menu administracion
    >Directamente abre la tabla de las bitacoras
    >Muestra input barra para busqueda por patente o nombre usuario, mas 2 de busqueda rapida que muestra bitacoras del ultimo dia o la ultima semana
    >boton para exportar la tabla actual en formato pdf
        >Cada celda presenta botones de acciones para visualizar la bitacora de la celda, editar los datos (dejando registro de esto) y exportar dicha bitacora a PDF
    */
    return(
        <>
        <NavBar type={1} texto="Bitácoras"/>
        <div className="cuerpoMenu">
            <div className="barraFiltro">
                <div className="inputBusqueda">
                    <Input 
                    startDecorator={<SearchOutlinedIcon/>}
                    endDecorator={<button>buscar</button>}
                    sx={{width:"100%"}}></Input>
                </div>
                <Chip
                    variant="outlined"
                    color="neutral"
                    size="lg"
                    startDecorator={<TodayOutlinedIcon />}
                    onClick={()=>("Filtra por día")}
                    sx={{
                        padding:"0.5%",
                        paddingLeft:"5px",
                        marginRight:"2px"
                    }}
                >Último día</Chip>
                <Chip
                    variant="outlined"
                    color="neutral"
                    size="lg"
                    startDecorator={<DateRangeOutlinedIcon />}
                    onClick={()=>("Filtra por día")}
                    sx={{
                        padding:"0.5%",
                        paddingLeft:"5px",
                        marginRight:"2px"
                    }}
                >Última semana</Chip>

                <button className="buttonExport">Exportar tabla</button>
            </div>
            <div className="tablaViajes">
                <Table hoverRow borderAxis="y" sx={
                            {'& td':{textAlign:'left',paddingLeft:1.9}}
                        }>
                    <thead>
                        <tr>
                            <th style={{width:"5%"}}>Patente</th>
                            <th style={{width:"10%"}}>Fecha</th>
                            <th style={{width:"15%"}}>Funcionario</th>
                            <th style={{width:"10%"}}>Hora inicio</th>
                            <th style={{width:"10%"}}>Hora llegada</th>
                            <th style={{width:"10%"}}>Estado viaje</th>
                            <th >Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        
                        {viajes.map((viaje)=>(
                        <tr>
                            <td>{viaje.patente}</td>
                            <td>{viaje.fecha}</td>
                            <td>{viaje.nombre_funcionario}</td>
                            <td>{viaje.fecha_hora_inicio}</td>
                            
                            <td>{viaje.fecha_hora_fin}</td>
                            
                            <td>{viaje.estado_viaje === true ? "En proceso" : "Terminado"}</td>
                            <td>
                                <div style={{display:"flex",gap:"10px"}}>
                                    <button onClick={()=>handleModalViajeView(viaje)}>
                                        <VisibilityIcon />
                                    </button>
                                    <button onClick={()=>exportarViajePDF(viaje)}>
                                        <PictureAsPdfIcon />
                                    </button>
                                    {viaje.estado_viaje === false ? 
                                       ( 
                                        <button onClick={()=>editarViajeModal(viaje)}>
                                            <EditDocumentIcon />
                                        </button>
                                        ):(
                                            <></>
                                        )
                                    }
                                    
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>

        {/*Modal vista viaje */}
        <Modal open={modalVista} onClose={() => setOpenModalVista(false)}>
            <ModalDialog variant="outlined" size="lg" sx={{width:"70%"}}>
                <DialogTitle>
                    Viaje {viajeSelected?.id_viaje}
                </DialogTitle>
                <Divider />
                <DialogContent>
                        <DataViewViaje viajeSelected={viajeSelected}></DataViewViaje>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        setViajeSelected(null)
                        setOpenModalVista(false)}}>
                    exportar viaje a PDF
                    </Button>
                    <Button variant="plain" color="danger" onClick={() =>{ 
                        setViajeSelected(null)
                        setOpenModalVista(false)}}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
        {/*Modal edición viaje */}

        <Modal open={modalEdicion} onClose={() => setOpenModalEdit(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Viaje {viajeEdit?.id_viaje}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {/*Cambiar para aceptar edicion */}
                   <DataViewViaje viajeSelected={viajeEdit}></DataViewViaje>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        setViajeEditSelected(null)
                        setOpenModalEdit(false)}}>
                    guardar cambios
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => {
                        setViajeEditSelected(null)
                        setOpenModalEdit(false)}}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>

                

        </>
    )
}
export default menuAdmin