import NavBar from "../../componentes/navBar.tsx"
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from "react"
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import { useNavigate } from "react-router-dom";
import "../../estilos/viajesUsuario.css"

type Viaje={
    id:number,
    patente:string,
    horaInicio:string,
    horallegada:string,
    estado:boolean
}

function viajesUsuario(){

    const Viajes:Viaje[]=[
        {id:1,patente:"xtz123",horaInicio:"12:00",horallegada:"13:00",estado:false},
        {id:2,patente:"xtz124",horaInicio:"12:00",horallegada:"13:00",estado:false},
        {id:3,patente:"abc134",horaInicio:"12:00",horallegada:"13:00",estado:false},
        {id:4,patente:"imu123",horaInicio:"12:00",horallegada:"13:00",estado:true},
    ]
    const [viajeSelected,setViajeSelected] = useState<Viaje|null>(null)
    const [openModalViaje,setOpenModalViaje] = useState<boolean>(false)
    const navigate = useNavigate()
    const volverMenu = () => navigate("/menuUsuario")
    const handleModalViajeView=(viaje:Viaje):void=>{
        setViajeSelected(viaje)
        setOpenModalViaje(true)
    }
    const exportarPDF=()=>{
        console.log("se exporta")
        return
    }
    
    return(
        <>  
            <NavBar type={0} texto=""/>
            <div>
                <Table hoverRow borderAxis="y" sx={
                            {'& td':{textAlign:'left',paddingLeft:1.9}}
                        }>
                    <thead>
                        <tr>
                            <th style={{width:"5%"}}>ID</th>
                            <th>Patente vehículo</th>
                            <th style={{width:"10%"}}>Hora inicio</th>
                            <th style={{width:"10%"}}>Hora llegada</th>
                            <th>Estado viaje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        
                        {Viajes.map((viaje)=>(
                        <tr>
                            <td>{viaje.id}</td>
                            <td>{viaje.patente}</td>
                            <td>{viaje.horaInicio}</td>
                            <td>{viaje.horallegada}</td>
                            <td>{viaje.estado === true ? "En proceso" : "Terminado"}</td>
                            <td>
                                <div style={{display:"flex",gap:"10px"}}>
                                    <button className="buttonIconTable" onClick={()=>handleModalViajeView(viaje)}>
                                        <VisibilityIcon />
                                    </button>
                                    <button className="buttonIconTable" onClick={()=>exportarPDF()}>
                                        <PictureAsPdfIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                

                <button className="botonPaso" onClick={()=>volverMenu()}>Volver</button>

                <Modal open={openModalViaje} onClose={() => setOpenModalViaje(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Viaje {viajeSelected?.id}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Data viaje
                    INICIO: {viajeSelected?.horaInicio}
                    LLEGADA: {viajeSelected?.horallegada}
                    PATENTE VEHICULO: {viajeSelected?.patente}
                    ESTADO VIAJE: {viajeSelected?.estado == true ? "EN PROCESO" : "TERMINADO"}
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => setOpenModalViaje(false)}>
                    Finalizar viaje
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => setOpenModalViaje(false)}>
                    Cancelar
                    </Button>
                </DialogActions>
                </ModalDialog>
            </Modal>
            </div>
        </>
    )
}

export default viajesUsuario