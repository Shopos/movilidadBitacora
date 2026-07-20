import { useNavigate } from "react-router-dom";
import NavBar from "../../componentes/navBar";
import { useEffect, useState } from "react";
import type{ SolicitudViaje } from "../../types/tipoSistema";
import { useAuth } from "../../context/AuthContext";
import { useAlerta } from "../../context/AlertaContext";
import { getSolicitudesUsuario } from "../../utils/auxiliar";
import "../../estilos/menuDepartamento.css"
import Table from '@mui/joy/Table'
import { Modal, ModalDialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/joy"
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { TablePagination } from "@mui/material";
import { VisibilitySharp } from "@mui/icons-material";



/**Vista de las solicitudes de un usuario departamento, muestra el estado en el que estan y los motivos de su aprobacion o rechazo
 */
function solicitudesDepartamento(){
    const {usuario} = useAuth()
    const {showAlerta} = useAlerta()
    const navigate= useNavigate()
    const [cargando,setCargando] = useState(false)
    const [listaSolicitudes,setLista] = useState<SolicitudViaje[]>([])
    const [solicitudSelected,setSolicitudSelected] = useState<SolicitudViaje|null>(null)
    const [openModal,setOpenModal]=useState(false)

    useEffect(()=>{
        const getSolicitudes=async()=>{ 
            try{
                const response = await getSolicitudesUsuario(usuario!.id)
                if(response){
                    setLista(response)
                }
            }catch(e){
                showAlerta("Error listando solicitudes, intenta más tarde","error")
                console.error(e)
            }
        }
        getSolicitudes()
        setCargando(true)
    },[cargando])

    const handleModalSolicitudView = (sol:SolicitudViaje):void =>{
        setSolicitudSelected(sol)
        setOpenModal(true)
    }

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    return(
        <div>
            <NavBar type={0} texto=""></NavBar>
            {cargando &&(
                <>
                <Table hoverRow borderAxis="y" sx={
                            {
                                '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                                '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                                '& td': { textAlign: 'left', paddingLeft: 1.9 },
                                '& th': { backgroundColor: "#bad8b6" },
                                marginTop: "1vh"
                            }
                        }>
                            <thead>
                                <tr>
                                    <th style={{width:"10%"}}>N°</th>
                                    <th style={{width:"20%"}}>Fecha solicitada</th>
                                    <th style={{width:"20%"}}>Estado</th>
                                    <th style={{width:"20%"}}>Fecha resuelta</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaSolicitudes.length>0 ? (listaSolicitudes.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((sol:SolicitudViaje,index:number)=>(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{sol.fecha_solicitada.slice(0,10)+" "+sol.fecha_solicitada.slice(11,19)}</td>
                                        <td>{sol.estado.charAt(0).toUpperCase()+sol.estado.slice(1)}</td>
                                        <td>{sol.estado==="pendiente" ? "":sol.fecha_resuelta.slice(0,10)+" "+sol.fecha_resuelta.slice(11,19)}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button className="buttonIconTable" onClick={() => handleModalSolicitudView(sol)}>
                                                    <VisibilitySharp />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))):(
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "5%" }}>
                                            No tienes solicitudes de momento
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5,10,25]}
                            component={"div"}
                            count={listaSolicitudes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Cantidad de solicitudes a mostrar"}
                            labelDisplayedRows={({from,to,count})=>`${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                        ></TablePagination>
                </>
            )}
            <Button className="buttonSolicitudes" style={{backgroundColor:"#306D29",display:"flex"}} startDecorator={<ArrowBackSharpIcon/>} onClick={()=>navigate("/menuDepto")}>Volver</Button>


            <Modal open={openModal} onClose={()=>setOpenModal(false)}>
                <ModalDialog sx={{
                    width: { xs: '90%', sm: '500px', md: '700px' }
                }}>
                    <DialogTitle sx={{fontSize:"1.3rem", fontWeight:"bold"}}>
                        Solicitud {solicitudSelected?.estado}
                    </DialogTitle>
                    <DialogContent>
                        <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Fecha Solicitada</label>{solicitudSelected?.fecha_solicitada.slice(0,10)+" "+solicitudSelected?.fecha_solicitada.slice(11,19)}
                        <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Estado</label>{solicitudSelected?.estado}
                        <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Solicitante</label>{solicitudSelected?.solicitante}
                        <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Motivo</label>{solicitudSelected?.motivo}
                        <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Vehículo solicitado</label>{solicitudSelected?.vehiculo_solicitado}
                        {
                            solicitudSelected?.estado!=="pendiente" && (
                                <>
                                <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Fecha resuelta</label> {solicitudSelected?.fecha_resuelta.slice(0,10)+" "+solicitudSelected?.fecha_resuelta.slice(11,19)}
                                <label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Resuelta por</label> {solicitudSelected?.resuelta_por}
                                {solicitudSelected?.estado==="rechazada" && (<><label style={{fontWeight:"bold", fontSize:"0.95rem"}}>Motivo rechazo</label> {solicitudSelected?.estado_texto}</>)}
                                </>
                            )
                        }
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setOpenModal(false)}>Volver</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </div>
    )
}
export default solicitudesDepartamento