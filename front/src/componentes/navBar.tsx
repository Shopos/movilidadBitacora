import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import "../estilos/navBar.css"
import PersonIcon from '@mui/icons-material/Person';
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import type { navBarProps } from '../tipos/tipoSistema';
import { useAuth } from '../context/AuthContext';


function navBar({type,texto}:navBarProps){
    const [modalCierre,setOpenModalCierre] = useState<boolean>(false)
    const navigate = useNavigate()
    const irBitacoras = () =>navigate("/menuAdmin")
    const irRecursos =()=> navigate("/recursos")

    const {logOut} = useAuth()
    /*Si usuario(cualquiera) selecciona el icono de usuario, comienza proceso cierre de sesión y se devuelve al home de la app (/) */
    const handleCierreSesion =()=>{
        logOut()
        setOpenModalCierre(false)
        navigate("/")
    }


    /* 
    Barra navegacion adaptable segun tipo de usuario, 
        si tipo de usuario === 1 --> Administracion, entrega acceso rapido a recursos y bitacoras 
        si tipo de usuario === 0 --> Usuario comun, deja sin acceso directo a ciertas funciones claves para centrar el funcionamiento a documentacion de viaje
    */
    return(
        <>
        {type===1 ? 
        (
        <div className='gridAdmin'>
            <div className='encabezado'>
                <h1>Departamento de movilización</h1>
                <h2>{texto}</h2>
            </div>
            <div className='barraAux'>
                <div className='imgIconBar'>
                    <img src='./src/assets/icon.jpg'></img>
                </div>
                <button className='buttonBarra' onClick={()=>irRecursos()}>Recursos</button>
                <button className='buttonBarra' onClick={()=>irBitacoras()}>Bitácoras</button>
                <button className='buttonBarra' onClick={()=>setOpenModalCierre(true)}>
                    <PersonIcon sx={{color:"black"}} style={{
                        justifyContent:"center",
                        alignContent:"center"
                    }} />   
                </button>
            </div>
        </div>
        )        
            : 
        (<div className="navBarGrid">
            <div className="imgIconBar">
                <img src=".\src\assets\icon.jpg"></img>
            </div>
            <div className="textDiv">
                <h2>Bitácoras</h2>
            </div>
            <button className="iconSesion" onClick={()=>setOpenModalCierre(true)}>
                <PersonIcon style={{
                        color:"white",
                        justifyContent:"center",
                        alignContent:"center"
                    }} /> 
            </button>
        </div>)
        }

        <Modal open={modalCierre} onClose={() => setOpenModalCierre(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    ¿Quieres cerrar sesión?
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Asegurate de guardar tus cambios antes de hacerlo
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => handleCierreSesion()}>
                    Cerrar sesión
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => setOpenModalCierre(false)}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
        </>
    )
}
export default navBar