import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar"
import { useEffect, useState } from "react"
import { DialogActions, DialogContent, DialogTitle, Divider, Modal } from "@mui/material"
import {Button} from "@mui/joy"
import { ModalDialog } from "@mui/joy"
import { solicitarViaje } from "../../utils/auxiliar"
import { useAuth } from "../../context/AuthContext"
import type { SolicitudInicio } from "../../tipos/tipoSistema"

function menuDepartamento(){
    const {usuario} = useAuth()
    const navigate = useNavigate()
    const [modalSolicitud,openModalSolicitud] = useState(false)
    const [cargando,setCargando] = useState(false)
    const [formSolicitud,setFormSolicitud] = useState<SolicitudInicio>({
        motivo:"",vehiculo_solicitado:"",solicitante:"",id_solicitante:0
    })

    const handleOpenModal=()=>{
        openModalSolicitud(true)
    }

    useEffect(()=>{
        setFormSolicitud((prev)=>({
            ...prev,
            id_solicitante:usuario!.id
        }))
        setCargando(true)
    },[cargando])


        //se enviar logica para agendar un viaje y generar una solicitud->si solicitud se aprueba se modifica el estado del funcionario asociado al viaje y el vehiculo
        //El estado del viaje pasa a en espera
        //Solicitud pasa a aprobada
        //Si solicitud se cancela o no es aprobada el estado del viaje queda en terminado y se deja en blanco. La observacion del viaje queda con los motivos del rechazo
        //La solicitud debe quedar con un estado cancelada y el porque ademas se rechazo    
    const handleSolicitar=async()=>{
        if(formSolicitud && formSolicitud.motivo!==""&&formSolicitud.solicitante!==""&&formSolicitud.id_solicitante!==0){
            await solicitarViaje(formSolicitud)
            openModalSolicitud(false)
            setFormSolicitud({solicitante:"",motivo:"",vehiculo_solicitado:"",id_solicitante:0})
            setCargando(false)
        }
    }

    const handleChange=(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
        const { name, value} = event.target
        setFormSolicitud((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }

    return(
    <div>
        <NavBar type={0} texto=""/>

        <button onClick={handleOpenModal}>Solicitar un viaje</button>
        <button onClick={()=>navigate("/solicitudesDepto")}>Ver mis solicitudes</button>

        <Modal open={modalSolicitud} onClose={()=>openModalSolicitud(false)}>
            <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                <DialogTitle>
                    Solicitar un nuevo viaje
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div className="items-Modal">
                       <div className="itemInput-Modal">
                            <label>Departamento solicitante</label>
                            <input name="solicitante" placeholder="Departamento de informática" value={formSolicitud.solicitante} onChange={handleChange}></input>
                       </div>
                       <div className="itemInput-Modal">
                            <label>Tipo vehículo</label>
                            <select name="vehiculo_solicitado" defaultValue={""} value={formSolicitud.vehiculo_solicitado} onChange={handleChange}>
                                <option value={""} disabled>Selecciona el tipo de vehículo</option>
                                <option>Camioneta</option>
                                <option>Furgon</option>
                                <option>Auto</option>
                            </select>
                       </div>
                       <div className="itemInput2-Modal" >
                            <label>Motivo</label>
                            <textarea name="motivo" value={formSolicitud.motivo} onChange={handleChange} placeholder="El departamento solicita un viaje hacia la municipalidad donde viajaran 4 personas más el chofer designado para el día xx-xx"></textarea>
                       </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="danger" onClick={()=>{
                        setFormSolicitud({solicitante:"",motivo:"",vehiculo_solicitado:"",id_solicitante:0})
                        openModalSolicitud(false)
                    }}>Cancelar</Button>
                    <Button variant="solid" color="success" onClick={()=>handleSolicitar()}>Solicitar viaje</Button>
                    
                </DialogActions>
            </ModalDialog>
        </Modal>
    </div>
)
}

export default menuDepartamento