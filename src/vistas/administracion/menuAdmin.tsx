import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/menuAdmin.css"

import { useState } from "react";
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"

type Viaje = {
    id:number,
    patente:string,
    fecha:string,
    funcionario:string,
    horaInicio:string,
    KMSinicio:number,
    horaLlegada:string,
    KMSLlegada:number,
    estado:boolean,
}
function menuAdmin(){
    const viajes:Viaje[]=[
        {id:1,patente:"yzx123",fecha: "14/7/2026",funcionario:"sanchez miguel",horaInicio:"12:00",KMSinicio:100,horaLlegada:"13:30",KMSLlegada:110,estado:false},
        {id:1,patente:"wxz122",fecha: "13/6/2026",funcionario:"linus loan",horaInicio:"12:00",KMSinicio:100,horaLlegada:"14:30",KMSLlegada:110,estado:true},
        {id:1,patente:"asv124",fecha: "14/6/2026",funcionario:"tobar papu",horaInicio:"12:00",KMSinicio:100,horaLlegada:"15:30",KMSLlegada:110,estado:true},
        {id:1,patente:"abc143",fecha: "12/3/2026",funcionario:"mejias miguel",horaInicio:"15:00",KMSinicio:100,horaLlegada:"16:30",KMSLlegada:110,estado:false},
        {id:2,patente:"yzx123",fecha: "16/5/2026",funcionario:"sanchez miguel",horaInicio:"9:00",KMSinicio:100,horaLlegada:"13:30",KMSLlegada:110,estado:false},
        {id:3,patente:"yzx123",fecha: "15/2/2026",funcionario:"mato juan",horaInicio:"8:00",KMSinicio:100,horaLlegada:"12:30",KMSLlegada:110,estado:false},
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
    return(
        <>
        <NavBar type={1} texto="Bitácoras"/>
        <div className="cuerpoMenu">
            <div className="barraFiltro">
                <div className="inputBusqueda">
                    <input type="search" placeholder="Busca por patente, funcionario o estado del viaje"></input>
                </div>
                <button>Exportar tabla</button>
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
                            <td>{viaje.funcionario}</td>
                            <td>{viaje.horaInicio}</td>
                            
                            <td>{viaje.horaLlegada}</td>
                            
                            <td>{viaje.estado === true ? "En proceso" : "Terminado"}</td>
                            <td>
                                <div style={{display:"flex",gap:"10px"}}>
                                    <button onClick={()=>handleModalViajeView(viaje)}>
                                        <VisibilityIcon />
                                    </button>
                                    <button onClick={()=>exportarViajePDF(viaje)}>
                                        <PictureAsPdfIcon />
                                    </button>
                                    {viaje.estado === false ? 
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
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Viaje {viajeSelected?.id}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Data viaje
                    INICIO: {viajeSelected?.horaInicio}
                    LLEGADA: {viajeSelected?.horaLlegada}
                    PATENTE VEHICULO: {viajeSelected?.patente}
                    FUNCIONARIO: {viajeSelected?.funcionario}
                    DESTINO: XX
                    MOTIVO: XX
                    ESTADO VIAJE: {viajeSelected?.estado == true ? "EN PROCESO" : "TERMINADO"}
                    CARGA COMBUSTIBLE: XX
                    CANTIDAD: XX
                    OBSERVACIONES: XX
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
                    Viaje {viajeEdit?.id}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Datos viaje -- cambiar a inputs y logica reemplazo
                    INICIO: {viajeEdit?.horaInicio}
                    LLEGADA: {viajeEdit?.horaLlegada}
                    PATENTE VEHICULO: {viajeEdit?.patente}
                    FUNCIONARIO: {viajeEdit?.funcionario}
                    DESTINO: XX
                    MOTIVO: XX
                    ESTADO VIAJE: {viajeEdit?.estado == true ? "EN PROCESO" : "TERMINADO"}
                    CARGA COMBUSTIBLE: XX
                    CANTIDAD: XX
                    OBSERVACIONES: XX
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