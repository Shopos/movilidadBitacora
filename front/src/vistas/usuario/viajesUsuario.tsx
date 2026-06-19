import NavBar from "../../componentes/navBar.tsx"
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from "react"
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import { useNavigate } from "react-router-dom";
import "../../estilos/viajesUsuario.css"
import type {Viaje} from "../../tipos/tipoSistema.ts"
import DataViewViaje from "../../componentes/dataViewViaje.tsx"

function viajesUsuario(){

    const Viajes:Viaje[]=[
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
            nombre_funcionario:"sanchez miguel",
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
        }
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
    
    /*
    Vista para los viajes del usuario
        >Se listan los viajes y se muestran en tabla
        >Usuario puede ver su viaje y detalles o exportar dicho viaje a formato pdf
            >La edicion de dicho viaje sera vista y editada por Administracion para evitar problemas
    */
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
                            <td>{viaje.id_viaje}</td>
                            <td>{viaje.patente}</td>
                            <td>{viaje.fecha_hora_inicio}</td>
                            <td>{viaje.fecha_hora_fin}</td>
                            <td>{viaje.estado_viaje === true ? "En proceso" : "Terminado"}</td>
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
                    Viaje {viajeSelected?.id_viaje}
                </DialogTitle>
                <Divider />
                <DialogContent>
                   <DataViewViaje viajeSelected={viajeSelected} />
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