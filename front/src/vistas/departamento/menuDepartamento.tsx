import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar"
import { useState } from "react"
import { DialogActions, DialogContent, DialogTitle, Divider, Modal,Button } from "@mui/material"
import { ModalDialog } from "@mui/joy"


function menuDepartamento(){

    const navigate = useNavigate()
    const [modalSolicitud,openModalSolicitud] = useState(false)

    const handleOpenModal=()=>{
        openModalSolicitud(true)
    }
    const handleSolicitar=()=>{
        //se enviar logica para agendar un viaje y generar una solicitud->si solicitud se aprueba se modifica el estado del funcionario asociado al viaje y el vehiculo
        //El estado del viaje pasa a en espera
        //Solicitud pasa a aprobada
        //Si solicitud se cancela o no es aprobada el estado del viaje queda en terminado y se deja en blanco. La observacion del viaje queda con los motivos del rechazo
        //La solicitud debe quedar con un estado cancelada y el porque ademas se rechazo
    }
    return(
    <div>
        <NavBar type={0} texto=""/>

        <button onClick={handleOpenModal}>Solicitar un viaje</button>
        <button onClick={()=>navigate("/solicitudesDepto")}>Ver mis solicitudes</button>

        <Modal open={modalSolicitud} onClose={()=>openModalSolicitud(false)}>
            <ModalDialog variant="outlined" sx={{ width: { xs: '90%', sm: '500px', md: '700px' } }}>
                <DialogTitle>
                    Solicitando un nuevo viaje
                </DialogTitle>
                <Divider />
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={()=>handleSolicitar()}>Solicitar viaje</Button>
                    <Button variant="outlined" color="error" onClick={()=>{
                        //limpiar inputs
                        //Limpiar formulario
                        openModalSolicitud(false)
                    }}>Cancelar</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    </div>
)
}

export default menuDepartamento