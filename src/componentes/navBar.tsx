import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import '../estilos/navBar.css'
import PersonIcon from '@mui/icons-material/Person';
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"

type navBarProps={
    type:number;
    texto:string;
}


function navBar({type,texto}:navBarProps){
    const [modalCierre,setOpenModalCierre] = useState<boolean>(false)
    const navigate = useNavigate()
    const irBitacoras = () =>navigate("/menuAdmin")
    const irRecursos =()=> navigate("/recursos")

    const handleCierreSesion =()=>{
        setOpenModalCierre(false)
        navigate("/")
    }

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
                    <PersonIcon style={{
                        color:"black",
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
                        color:"black",
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