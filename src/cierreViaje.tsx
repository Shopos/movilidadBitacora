import { useNavigate } from "react-router-dom"
import { useState } from "react"
import NavBar from "./componentes/navBar"
import "./estilos/cierreViaje.css"

import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


function cierreViaje(){
    //inputs de recoleccion y cierre final con dialogo de confirmacion
    //es posible cancelar y volver al estado de viajeProceso si es necesario
    //al finalizar cambia los estados del viaje y vehiculo asociados
    //vuelve a menu inicial    
    const navigate = useNavigate()
    const volverProceso = () =>navigate("/viajeProceso")
    const cerrarYvolver = () =>navigate("/menuUsuario")
    
    const [openModal,setOpenModal] = useState<boolean>(false)
    const [modalFoto, setOpenModalFoto] = useState<boolean>(false)
    return(
        <div>
            <NavBar />
            <div className="formularioFin">
                <div className="gridInput">
                    <div className="itemInput">
                        <label>Llegada</label>
                        <input type="time"></input>
                    </div>
                    <div className="itemInput">
                        <label>Kilometraje final</label>
                        <input type="number"></input>
                    </div>
                </div>
                <div className="argumento">
                    <label>Comentarios</label>
                    <textarea  placeholder="En el viaje ocurrio..."></textarea>
                </div>
                <div className="selectInput">
                    <div className="itemInputSelect">
                        <label>Carga combustible</label>
                        <input type="checkbox"></input>
                    </div>
                    <label>Cantidad</label>
                    <input type="number"></input>
                </div>
                
                <p>Comprobante</p>
                <div className="displayModal">
                    <label>Subir imagen desde dispositivo</label>
                    <input type="file" ></input>
                    modal movil / input Escritorio
                    <button onClick={()=>setOpenModalFoto(true)}>Subir imagen desde cámara</button>    
                </div>
            </div>
            <div className="gridButton">
                <button className="botonPasoFin" onClick={()=>volverProceso()}>Volver</button>
                <button className="botonPasoFin2" onClick={()=>setOpenModal(true)}>Finalizar viaje</button>
            </div>


            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <WarningRoundedIcon />
                    ¿Estas seguro de finalizar el viaje?
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Al hacerlo no podras ingresar más datos al viaje actual.
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => cerrarYvolver()}>
                    Finalizar viaje
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => setOpenModal(false)}>
                    Cancelar
                    </Button>
                </DialogActions>
                </ModalDialog>
            </Modal>


            <Modal open={modalFoto} onClose={() => setOpenModalFoto(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <CameraAltIcon />
                    Comenzar captura de datos por cámara
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Asegura de aceptar los permisos para acceder a tu cámara y poder capturar la imagen
                </DialogContent>
                <Divider/>
                <DialogContent>
                    <div>Acceso a cámara</div>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => setOpenModalFoto(false)}>
                        Capturar
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => setOpenModalFoto(false)}>
                    Cancelar
                    </Button>
                </DialogActions>
                </ModalDialog>
            </Modal>


        </div>
    )
}
export default cierreViaje