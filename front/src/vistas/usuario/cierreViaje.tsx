import { useNavigate } from "react-router-dom"
import { useState } from "react"
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/cierreViaje.css"

import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { isMobile } from "react-device-detect"


function cierreViaje(){
    //inputs de recoleccion y cierre final con dialogo de confirmacion
    //es posible cancelar y volver al estado de viajeProceso si es necesario
    //al finalizar cambia los estados del viaje y vehiculo asociados
    const navigate = useNavigate()
    const volverProceso = () =>navigate("/viajeProceso")
    const cerrarYvolver = () =>navigate("/menuUsuario")
    
    const [openModal,setOpenModal] = useState<boolean>(false)
    const [modalFoto, setOpenModalFoto] = useState<boolean>(false)
    const [checkCarga,setCheckCarga] = useState<number>(0)


    const handleCheck=()=>{
        if(checkCarga===0){
            setCheckCarga(1)
        }else{
            setCheckCarga(0)
        }
    }

    /*
    Vista fin cierre bitacora
        >inputs que recolectan la informacion de cierre
        >Check por si se realiza carga de combustible -> 
            >1 --> Señala que si se realizo y se pide informacion
            >0 --> Quedan vacios
        >Se pide confirmacion para cerrar el proceso-->se guardan los datos finales y viaje queda en estado false indicando que el viaje ya no esta activo
    */
    return(
        <div>
            <NavBar type={0} texto=""/>
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
                        <input name="carga" onChange={()=>handleCheck()} value={checkCarga} type="checkbox"></input>
                    </div>
                    {checkCarga===1 ? 
                    (<div className="itemInputSelect">
                        <label>Cantidad</label>
                        <input type="number"></input>
                    </div>):(
                        <>

                        </>
                    )
                    }
                </div>
                
                {checkCarga===1 && isMobile ? (
                    <>
                    <div className="displayModal">
                        <p>Comprobante</p>
                        <button onClick={()=>setOpenModalFoto(true)}>sube tu Comprobante aquí</button>   
                    </div>
                    </>
                ):(<></>)}
                
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
                    <div>
                        <p>Puedes subir una existente aquí</p>
                        <input type="file" accept="image/*" name="comprobante"></input>
                    </div>
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