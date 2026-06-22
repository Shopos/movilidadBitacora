import { useState,useEffect } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/recursosAdmin.css"
import { Table } from '@mui/joy'
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BuildIcon from '@mui/icons-material/Build';
import type { Vehiculo,User } from '../../tipos/tipoSistema.ts'

function recursosAdmin(){
    const usuarios:User[] = [
        {email:"abc@gmail.com",nombre:"abc def",cargo:"Funcionario",estado:false},
        {email:"admin@gmail.com",nombre:"abc def",cargo:"Administrador",estado:true},
        {email:"nombre.apellido@munisantacruz.cl",nombre:"nombre apellido",cargo:"Funcionario",estado:true},
        {email:"def@gmail.com",nombre:"def acv",cargo:"Funcionario",estado:true},
        {email:"ghi@gmail.com",nombre:"dhi fgj",cargo:"Funcionario",estado:false},
    ]
    const [vehiculos,setVehiculos]= useState<[]>()
    const [vistaActual,setVistaActual] = useState<boolean>(false)
    const [modalAdd,setOpenModalAdd] = useState<boolean>(false)
    const [modalMantencion,setOpenModalMantencion] = useState<boolean>(false)
    const [modalViewRecurso,openModalViewRecurso] = useState<boolean>(false)
    const [recursoShow,setRecursoShow] = useState<Vehiculo|User|null>(null)
    const [recursoEdit,setRecursoEdit] = useState<Vehiculo|User|null>(null)
    const [modalEdit,openModalEdit] = useState<boolean>(false)



    

    useEffect(()=>{
        const getVehiculos = async () =>{
        try{
            const response = await fetch('http://localhost:3306/vehiculos')
            const data = await response.json()
            console.log("datos vehiculos")
            console.log(data)
        }catch(e){
            console.error("error encontrando vehiculos: ",e)

        }finally{
            setVehiculos([])
        }  
        }
    getVehiculos()
    },[])
    const abriModalAdd =()=>{
        //se abre modal y luego antes del retorno se limpian los inputs
        setOpenModalAdd(true)
        return
    }
    const abrirModalMantencion=()=>{
        console.log("mantencion")
        setOpenModalMantencion(true)
        return
    }
    const abrirModalView=(recurso:Vehiculo|User)=>{
        setRecursoShow(recurso)
        openModalViewRecurso(true)
    }
    const handlePatenteMantencion=(event:React.ChangeEvent<HTMLSelectElement>)=>{
        /**Mantener patente en memoria para luego de tomar datos de mantencion indexar */
    }  
    const abriModalEdit=(recurso:Vehiculo|User)=>{
        setRecursoEdit(recurso)
        openModalEdit(true)
    }

    /*
        Vista de recursos del departamento
        
    */
    return(
        <>
            <NavBar type={1} texto={"Recursos"} />

            <div>
                <div className='buttonsFlexEnd'> 
                    <button>Exportar tabla actual</button>
                    <button onClick={()=>abriModalAdd()}>Agregar nuevo {vistaActual===true ? "vehículo" : "usuario"}</button>
                    
                </div>
                <div className='buttonsTablaH'>
                    <button className="bordeIzquierdoBoton" disabled={!vistaActual} onClick={()=>setVistaActual(false)}>Usuarios</button>
                    <button className="bordeDerechaBoton" disabled={vistaActual} onClick={()=>setVistaActual(true)}>Vehiculos</button>
                </div>
                {vistaActual === false ? 
                (
                    /* Tabla usuarios */
                    <div>
                        <Table hoverRow borderAxis="y" sx={
                            {'& td':{textAlign:'left',paddingLeft:1.9}}
                        }>
                            <thead>
                                <tr>
                                    <th style={{width:"20%", overflow:"clip"}} >Correo</th>
                                    <th >Nombre</th>
                                    <th style={{width:"15%"}}>Cargo</th>
                                    <th style={{width:"10%"}}>Estado</th>
                                    <th style={{width:"30%"}}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody> 
                                {usuarios.map((usuario)=>(
                                    <tr>
                                        <td style={{overflow:"clip"}}>{usuario.email}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.cargo}</td>
                                        <td>{usuario.estado === false ? "Bloqueado":"Activo"}</td>
                                        <td>
                                            <div className='buttonsIconTable' style={{display:"flex",gap:"10px"}}>
                                                <button onClick={()=>abrirModalView(usuario)}>
                                                    <VisibilityIcon/>
                                                </button>
                                                <button onClick={()=>abriModalEdit(usuario)}>
                                                    <EditIcon />
                                                </button>
                                                {usuario.cargo === "Administrador" ? 
                                                (
                                                    <></>
                                                ):(
                                                    <>
                                                        {usuario.estado === false ? 
                                                        (
                                                            <button>
                                                                <LockOpenIcon />
                                                            </button>
                                                        ):(
                                                            <button>
                                                                <LockOutlinedIcon />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ):
                (
                    /* Tabla vehiculos */
                    <div>
                        <Table hoverRow borderAxis="y" sx={
                            {'& td':{textAlign:'left',paddingLeft:1.9}}
                        }>
                            <thead>
                                <tr>
                                    <th >Patente</th>
                                    <th >Modelo</th>
                                    <th style={{width:"15%"}}>KMS actual</th>
                                    <th style={{width:"10%"}}>Estado</th>
                                    <th style={{width:"30%"}}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody> 
                                {vehiculos && vehiculos!.map((vh:Vehiculo)=>(
                                    <tr>
                                        <td>{vh.patente}</td>
                                        <td>{vh.modelo}</td>
                                        <td>{vh.KMS_actual}</td>
                                        <td>{vh.estado}</td>
                                        <td>
                                            <div className="buttonsIconTable" style={{display:"flex",gap:"10px"}}>
                                                <button onClick={()=>abrirModalView(vh)}>
                                                    <VisibilityIcon/>
                                                </button>
                                                <button onClick={()=>abriModalEdit(vh)}>
                                                    <EditIcon />
                                                </button>
                                                <button onClick={()=>abrirModalMantencion()}>
                                                    <BuildIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

        {/**Modal agrega recurso */}
        <Modal open={modalAdd} onClose={() => setOpenModalAdd(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Agregar nuevo {vistaActual === true ? "vehículo" : "usuario"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {vistaActual === true ? 
                    (<>
                        <label>Patente</label>
                        <input type='text'></input>
                        <label>Modelo</label>
                        <input type='text'></input>
                        <label>kilometraje actual</label>
                        <input type='number'></input>
                        <label>Estado</label>
                        <select>
                            <option>Activo</option>
                            <option>Reparacion</option>
                            <option>Dado de baja</option>
                            <option>Disponible</option>
                        </select>
                    </>)
                    :
                    (<>
                        <label>Correo</label>
                        <input type='email' placeholder='nombre.apellido@mail.com'></input>
                        <label>Nombre</label>
                        <input type='text'></input>
                        <label>Cargo</label>
                        <select>
                            <option>Funcionario</option>
                            <option>Administrativo</option>
                        </select>
                        <label>Estado</label>
                        <select>
                            <option>Activo</option>
                            <option>Bloqueado</option>
                        </select>
                    </>)}
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        
                        setOpenModalAdd(false)}}>
                    Agregar
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => {
                        
                        setOpenModalAdd(false)}}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
        {/**Modal agrega mantencion vehiculo */}
        <Modal open={modalMantencion} onClose={()=>setOpenModalMantencion(false)}>
            <ModalDialog variant="outlined">
                <DialogTitle>
                    Agregar mantención a vehículo
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <label>Patente del vehiculo</label>
                    <select defaultValue={""} onChange={()=>handlePatenteMantencion}>
                        {vehiculos?.length && vehiculos!.map((veh:Vehiculo)=>(
                            <option key={veh.patente} value={veh.patente}>{veh.patente}</option>
                        ))}
                    </select>
                    <label>Último cambio de aceite</label>
                    <input type='date' name='fechaAceite' ></input>
                    <label>Taller</label>
                    <input type='text' name='taller'></input>
                    <label>Última mantención</label>
                    <input type='date' name='fechaMantención'></input>
                    <label>Motivo o detalle de la mantención</label>
                    <textarea rows={5} style={{overflowY:"auto", resize:"none"}} name='motivoMantencion'></textarea>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => setOpenModalMantencion(false)}>
                    Agregar
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => setOpenModalMantencion(false)}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
        {/**Abrir modal vista recurso */}
        <Modal open={modalViewRecurso} onClose={()=>openModalViewRecurso(false)}>
            <ModalDialog variant="outlined">
                <DialogTitle>
                    Vista de {recursoShow && 'email' in recursoShow ? (
                        `Vista de usuario: ${recursoShow.nombre}`
                    ): recursoShow && 'patente' in recursoShow ? (
                        `Vista de vehículo: ${recursoShow.patente}`
                    ):("vista de recurso")} 
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {recursoShow && 'email' in recursoShow ? (
                        <>
                            <p><strong>Nombre: </strong>{recursoShow.nombre}</p>
                            <p><strong>Cargo: </strong>{recursoShow.cargo}</p>
                            <p><strong>Estado: </strong>{recursoShow.estado===false ? "Bloqueado":"Activo"}</p>
                        </>
                     ):
                     recursoShow && 'patente' in recursoShow ? 
                     (<>
                        <p><strong>Patente: </strong>{recursoShow.patente}</p>
                        <p><strong>Modelo: </strong>{recursoShow.modelo}</p>
                        <p><strong>Kilometraje: </strong>{recursoShow.KMS_actual}</p>

                        {/*Apartado mantenciones del vehiculo --> asociadas a X patente*/}
                    </>):"datos no encontrados"}
                </DialogContent>
            </ModalDialog>
        </Modal>
        
        {/**Abrir modal edicion recurso */}
        <Modal open={modalEdit} onClose={() => openModalEdit(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    Editar {vistaActual === true ? "vehículo" : "usuario"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {recursoEdit && 'patente' in recursoEdit  ? 
                    (<>
                        <label>Patente</label>
                        <input value={recursoEdit.patente} type='text'></input>
                        <label>Modelo</label>
                        <input value={recursoEdit.modelo} type='text'></input>
                        <label>kilometraje actual</label>
                        <input value={recursoEdit.KMS_actual}  type='number'></input>
                        <label>Estado</label>
                        <select defaultValue={recursoEdit.estado}>
                            <option>Activo</option>
                            <option>Reparacion</option>
                            <option>Dado de baja</option>
                            <option>Disponible</option>
                        </select>
                    </>)
                    : recursoEdit && 'email' in recursoEdit ?
                    (<>
                        <label>Correo</label>
                        <input value={recursoEdit.email} type='email' placeholder='nombre.apellido@mail.com'></input>
                        <label>Nombre</label>
                        <input value={recursoEdit.nombre} type='text'></input>
                        <label>Cargo</label>
                        <select defaultValue={recursoEdit.cargo} disabled>
                            <option>Funcionario</option>
                            <option>Administrativo</option>
                        </select>
                        <label>Estado</label>
                        <select defaultValue={recursoEdit.estado===true ? "Activo" : "Bloqueado"}>
                            <option>Activo</option>
                            <option>Bloqueado</option>
                        </select>
                    </>):<>Error</>}
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        
                        openModalEdit(false)}}>
                    Agregar
                    </Button>
                    <Button variant="plain" color="danger" onClick={() => {
                        
                        openModalEdit(false)}}>
                    Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
        </>
        
    )
}
export default recursosAdmin