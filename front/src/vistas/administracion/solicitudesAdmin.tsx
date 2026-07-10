import { useEffect, useState } from "react"
import NavBar from "../../componentes/navBar"
import { getSolicitudes, resolverSolicitudesCambio } from "../../utils/auxiliar"
import { useAlerta } from "../../context/AlertaContext"
import Table from "@mui/joy/Table"
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import type { Solicitud } from "../../tipos/tipoSistema"
import "../../estilos/solicitudesAdmin.css"

import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
function solicitudesAdmin() {
    const { showAlerta } = useAlerta()
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([])
    const [modalSol, setModalSol] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [pass, setPass] = useState("")
    const [showPass,setShowPass] = useState(false)
    const [pass2, setPass2] = useState("")
    const [showPass2,setShowPass2] = useState(false)
    const [solicitudSelected,setSolicitudSelected] = useState<Solicitud|null>()
    const [errorPass, setErrorPass] = useState({
        msg: "", est: false
    })

    //Metodo para obtener las solicitudes pendientes
    useEffect(() => {
        const getSolicitudesPendientes = async () => {
            try {
                const response = await getSolicitudes()
                if (response) {
                    setSolicitudesPendientes(response)
                    setCargando(true)
                }
            } catch (e) {
                showAlerta("Error listando solicitudes, intenta más tarde", "error")
            }
        }
        getSolicitudesPendientes()
    }, [cargando])

    //Metodo para manejar la modificacion de las contraseñas
    //Comprueba que se ingrese informacion a los inputs
    //Compara que las contraseñas ingresadas sean iguales
    //Si se cumple, se permite resolver el cambio de contraseña al usuario solicitante
    const handleModifyPass = async () => {
        if (!pass || !pass2) {
            setErrorPass({ msg: "Los campos son obligatorios", est: true })
            return
        }
        if (pass !== pass2) {
            setErrorPass({ msg: "Las contraseñas no coinciden", est: true })
            return
        }
        setErrorPass({ msg: "", est: false })
        try{
            if(solicitudSelected){
                await resolverSolicitudesCambio(solicitudSelected?.id_solicitud,pass)
                showAlerta("Contraseña modificada correctamente, avisa a usuario")
                handleCloseModal()
                setCargando(false)
            }
        }catch(e){
            showAlerta("Error al cambiar contraseña","error")
        }
    }
    const handleCloseModal = () => {
        setModalSol(false)
        setPass("")
        setPass2("")
        setSolicitudSelected(null)
    }
    const openModalSol = (solicitud:Solicitud) =>{
        setSolicitudSelected(solicitud)
        setModalSol(true)
    }

    return (
        <>
            <NavBar type={1} texto={"Solicitudes"}></NavBar>
            <div>
                {solicitudesPendientes ? (
                    <>
                        <Table hoverRow borderAxis='y' sx={{
                            '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                            '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                            '& td': { textAlign: 'left', paddingLeft: 1.9 },
                            '& th': { backgroundColor: "#bad8b6" },
                            marginTop: "1vh"
                        }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>N°</th>
                                    <th>Correo</th>
                                    <th>Nombre</th>
                                    <th>Fecha solicitada</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesPendientes && solicitudesPendientes.map((sol: Solicitud) => (
                                    <tr>
                                        <td>{sol.id_solicitud}</td>
                                        <td>{sol.correo}</td>
                                        <td>{sol.nombre}</td>
                                        <td>{String(sol.fecha_solicitada).slice(0, 10) + " " + String(sol.fecha_solicitada).slice(11, 19)}</td>
                                        <td>{sol.estado}</td>
                                        <td>
                                            <div className="buttonsIconTable" style={{ display: "flex", gap: "10px" }}>
                                                <button style={{ width: "4.5vh" }} onClick={() => openModalSol(sol)}>
                                                    <ManageAccountsSharpIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {solicitudesPendientes.length === 0 &&(
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "5%" }}>
                                            No hay solicitudes pendientes por solucionar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </>
                ) : (<>No cuentas con solicitudes por solucionar</>)}

            </div>
            {/**Modal para el tratamiento del cambio de contraseñas --> se debe confirmar que ambas contraseñas sean iguales */}
            <Modal open={modalSol} onClose={() => setModalSol(false)}>
                <ModalDialog>
                    <DialogTitle>Ingresa la nueva contraseña</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <label>Nueva contraseña</label>
                        <div className="inputPass">
                            <input value={pass} onChange={(e) => setPass(e.currentTarget.value)} type={showPass ? "text":"password"}></input>
                            <button onClick={()=>setShowPass(!showPass)}>
                                {showPass ? <VisibilityOffSharpIcon fontSize="small"/>:<VisibilitySharpIcon fontSize="small"/>}
                            </button>
                        </div>
                        
                        <label>Confirmar la contraseña</label>
                        <div className="inputPass">
                            <input value={pass2} onChange={(e) => setPass2(e.currentTarget.value)} type={showPass2 ? "text":"password"}></input>
                            <button onClick={()=>setShowPass2(!showPass2)}>
                                {showPass2 ? <VisibilityOffSharpIcon fontSize="small"/>:<VisibilitySharpIcon fontSize="small" />}
                            </button>
                        </div>
                        {errorPass.est && (
                            <p style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}>
                                {errorPass.msg}
                            </p>
                        )}
                        <br></br>
                        <p>Recuerda entregar esta nueva contraseña al solicitante</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModifyPass}>Modificar</Button>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </>
    )
}
export default solicitudesAdmin