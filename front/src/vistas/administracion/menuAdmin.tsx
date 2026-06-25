import NavBar from "../../componentes/navBar.tsx"
import DataViewViaje from "../../componentes/dataViewViaje.tsx";
import "../../estilos/menuAdmin.css"

import { useState,useEffect } from "react";
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button, Chip, Input} from "@mui/joy"
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable";

import type {Viaje} from "../../tipos/tipoSistema.ts"
import { getViajes } from "../../utils/auxiliar.ts";

function menuAdmin(){
    const [viajes,setViajes] = useState<[Viaje]>()
    const [viajeSelected,setViajeSelected] = useState<Viaje|null>(null)
    const [viajeEdit,setViajeEditSelected] = useState<Viaje|null>(null)
    const [modalVista,setOpenModalVista] = useState<boolean>(false)
    const [modalEdicion,setOpenModalEdit] = useState<boolean>(false)
    const [cargando,setCargando] = useState<boolean>(false)

    useEffect(()=>{
        const getListaViajes = async()=>{
            try{
                const response = await getViajes()
                if(response){
                    setViajes(response)
                }
            }catch(e){
                console.error(" Error listando viajes ",e)
            }
        }
        getListaViajes()
        setCargando(true)
    },[])


    const handleModalViajeView=(viaje:Viaje)=>{
        //Visualiza la informacion del viaje en un modal, si el viaje esta en proceso muestra la informacion del viaje hasta el momento
        setViajeSelected(viaje)
        setOpenModalVista(true)
        return
    }


    const exportarViajesPDF =()=>{
        const doc = new jsPDF('l','pt','a4')

        const columns = ['ID','Vehiculo','Patente','Funcionario','kM inicio','kM fin','Hora inicio','Destino','Hora llegada','Estado del viaje']

        if(viajes){
        const rows = viajes.map((viaje)=>[
            viaje.id_viaje,
            viaje.vehiculo,
            viaje.patente,
            viaje.nombre_funcionario,
            viaje.kms_inicial,
            (viaje.kms_fin ? viaje.kms_fin : 0),
            (viaje.fecha_hora_inicio.slice(0,10)+" "+viaje.fecha_hora_inicio.slice(11,19)),
            viaje.destino,
            (viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(0,10)+" "+viaje.fecha_hora_fin.slice(11,19)) : "-"),
            (viaje.estado_viaje ? "En ruta":"Terminado")
        ])
        doc.setFontSize(12)
        doc.text("Reporte de viajes departamento de movilización",20,20)

        autoTable(doc,{
            startY:40,
            head:[columns],
            body: rows,
            theme: 'plain',
            styles: {fontSize:10,cellPadding:5},
            headStyles:{fillColor:[41,120,120],textColor:255}
        })
        doc.save("Reporte.pdf")
    }
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

                <button className="buttonExport" onClick={()=>exportarViajesPDF()}>Exportar tabla</button>
            </div>
            {cargando ? (<><div className="tablaViajes">
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
                        
                        {viajes && viajes.map((viaje:Viaje)=>(
                        <tr>
                            <td>{viaje.patente}</td>
                            <td>{(viaje.fecha_hora_inicio.slice(0,10))}</td>
                            <td>{viaje.nombre_funcionario}</td>
                            <td>{(viaje.fecha_hora_inicio.slice(11,19))}</td>
                            
                            <td>{viaje.fecha_hora_fin ? (viaje.fecha_hora_fin.slice(11,19)):("-")}</td>
                            
                            <td>{viaje.estado_viaje ? "En ruta" : "Terminado"}</td>
                            <td>
                                <div style={{display:"flex",gap:"10px"}}>
                                    <button onClick={()=>handleModalViajeView(viaje)}>
                                        <VisibilityIcon />
                                    </button>
                                    {Number(viaje.estado_viaje) === 0 ? 
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
            </div>  </>):(<>Cargando</>) }
            
        </div>
       

        {/*Modal vista viaje */}
        <Modal open={modalVista} onClose={() => setOpenModalVista(false)}>
            <ModalDialog variant="outlined"  sx={{width: { xs: '90%', sm: '500px', md: '700px' }}}>
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
            <ModalDialog variant="outlined"  sx={{width: { xs: '90%', sm: '500px', md: '700px' }}}>
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