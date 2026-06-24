import NavBar from "../../componentes/navBar.tsx"
import Table from '@mui/joy/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react"
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import { useNavigate } from "react-router-dom";
import "../../estilos/viajesUsuario.css"
import type {Viaje} from "../../tipos/tipoSistema.ts"
import DataViewViaje from "../../componentes/dataViewViaje.tsx"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function viajesUsuario(){

    const Viajes:Viaje[]=[
        {
            id_viaje:1,
            patente:"yzx123",
            nombre_funcionario:"sanchez miguel",
            fecha_hora_inicio:"12:00",
            kms_inicial:100,
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
            vehiculo:"Toyota",
            id_usuario:3,
            lat_fin_real:0,
            lng_fin_real:0,
            modificado_por:"",
            ultima_modificacion:""
        }
    ]
    let name = Viajes.at(0)?.nombre_funcionario
    const [viajeSelected,setViajeSelected] = useState<Viaje|null>(null)
    const [openModalViaje,setOpenModalViaje] = useState<boolean>(false)
    const navigate = useNavigate()
    const volverMenu = () => navigate("/menuUsuario")
    const handleModalViajeView=(viaje:Viaje):void=>{
        setViajeSelected(viaje)
        setOpenModalViaje(true)
    }
    const exportarPDF=()=>{
        if(Viajes){
            const doc = new jsPDF('l','pt','a4')
            doc.setFontSize(12)
            const columns = ['ID','Vehiculo','Patente','kM inicio','kM fin','Hora inicio','Destino','Hora llegada','Estado del viaje']
            const rows = Viajes.map((vje) => [
                vje.id_viaje,
                vje.vehiculo,
                vje.patente,
                vje.kms_inicial,
                (vje.kms_fin ? vje.kms_fin : 0),
                (vje.fecha_hora_inicio.slice(0,10)+" "+vje.fecha_hora_inicio.slice(11,19)),
                vje.destino,
                (vje.fecha_hora_fin.slice(0,10)+ " "+ vje.fecha_hora_fin.slice(11,19)),
                (vje.estado_viaje ? "Activo":"Terminado")
            ])
            doc.text(`Reporte de viajes de ${name} - Departamento de Movilización`,20,20)

            autoTable(doc,{
                startY:40,
                head:[columns],
                body: rows,
                theme: 'plain',
                styles: {fontSize:10,cellPadding:5},
                headStyles:{fillColor:[41,120,120],textColor:255}
            })
            doc.save(`Reporte viajes ${name}.pdf`)
        }else{
            return
        }
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
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                
                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                    <button className="botonPaso" onClick={()=>volverMenu()}>Volver</button>
                    <button className="botonPaso" onClick={()=>exportarPDF()}>Exportar Tabla a PDF</button>
                </div>

                <Modal open={openModalViaje} onClose={() => setOpenModalViaje(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Viaje {viajeSelected?.id_viaje}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {viajeSelected ? (<DataViewViaje viajeSelected={viajeSelected} modo={0}/>) : "ERROR"}
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