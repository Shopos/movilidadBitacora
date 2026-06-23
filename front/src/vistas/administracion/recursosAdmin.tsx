import { useState,useEffect } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import Mantenciones from "../../componentes/mantencionesVehiculo.tsx"
import "../../estilos/recursosAdmin.css"
import { Table } from '@mui/joy'
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import type { Vehiculo, User, Mantencion } from '../../tipos/tipoSistema.ts'
import getVehiculos, { addMantencionVehiculo } from "../../utils/auxiliar.ts"


const vehiculoVacio:Vehiculo = {
    patente:"",
    modelo:"",
    kms_actual:0,
    estado:"DADO DE BAJA"
}
const mantencionVacia:Mantencion = {
    id_mantencion:0,
    detalle_mantencion:"",
    patente:"",
    taller:"",
    ultima_mantencion:"",
    ultimo_cambio_aceite:""
}
const usuarioVacio:User = {
    cargo:"Funcionario",
    correo:"",
    estado:false,
    nombre:"",
    pass:"",
    tipo_licencia:""
}
function recursosAdmin(){
    const usuarios:User[] = []
    const [vehiculos,setVehiculos]= useState<[]>()
    const [vistaActual,setVistaActual] = useState<boolean>(false)
    const [modalAdd,setOpenModalAdd] = useState<boolean>(false)
    const [modalMantencion,setOpenModalMantencion] = useState<boolean>(false)
    const [modalViewRecurso,openModalViewRecurso] = useState<boolean>(false)
    const [recursoShow,setRecursoShow] = useState<Vehiculo|User|null>(null)
    const [recursoEdit,setRecursoEdit] = useState<Vehiculo|User|null>(null)
    const [modalEdit,openModalEdit] = useState<boolean>(false)
    
    const [refresh,setRefresh] = useState(false)

    const [cargando, setCargando] = useState(false)

    const [formV,setFormV] = useState<Vehiculo>(vehiculoVacio)
    const [formAddV,setFormAddV] = useState<Vehiculo>(vehiculoVacio)
    const [formMantencion,setFormMantencion] = useState<Mantencion>(mantencionVacia)
    const [formAddU,setFormAddU] = useState<User>(usuarioVacio)

    useEffect(()=>{
        const getListaVehiculos = async () =>{
            try{
                const response = await getVehiculos()
                if(response){
                    setVehiculos(response)
                }
            }catch(e){
                console.error("error encontrando vehiculos: ",e)

            }
        }
        getListaVehiculos()
    },[modalEdit,refresh])

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

    const abriModalEdit=(recurso:Vehiculo|User)=>{
        setRecursoEdit(recurso)
        if(recurso && 'patente'in recurso){
            setFormV(recurso)
        }else{
            /**para usuario */
        }
        openModalEdit(true)
    }


    const handleEditVehiculo=async()=>{
        if (recursoEdit && 'patente' in recursoEdit){
            const patente = recursoEdit.patente
            const url = `http://localhost:4000/vehiculos/${patente}`
            const payload = formV
        
        try{
            const res = await fetch(url,{
                method: 'PUT',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(!res.ok){
                setFormV(vehiculoVacio)
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        const data = await res.json();
        console.log('Success:', data);
        setFormV(vehiculoVacio)
        } catch (error) {
            console.error('Error:', error); 
            console.log({msg:"Error al editar vehiculo"})
        }  
        }
    }

    const handleAgregar=async()=>{
        if(!formAddV || cargando) return

        const url = `http://localhost:4000/vehiculos`
        setCargando(true)
        const payload = formAddV
        console.log(formAddV)
        try{
            const res = await fetch(url,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(!res.ok){
                setFormAddV(vehiculoVacio)
                const errorData = await res.json().catch(()=>{
                })
                console.log("back",errorData)
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log('Success:', data);
            setFormAddV(vehiculoVacio)
            setRefresh(!refresh)
        }catch(e){
            console.error('Error:', e); 
            console.log({msg:"Error al agregar vehiculo"})
            setFormAddV(vehiculoVacio)
        }
    }

    const handleAgregarMantencion=async()=>{
        if(!formMantencion || cargando) return

        setCargando(true)
        addMantencionVehiculo(formMantencion)
        setFormMantencion(mantencionVacia)
        setCargando(!refresh)
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
                    {vistaActual ? (<button onClick={()=>abrirModalMantencion()} > Agregar mantención</button>):(<></>)}
                    
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
                                        <td style={{overflow:"clip"}}>{usuario.correo}</td>
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
                                        <td>{vh.kms_actual}</td>
                                        <td>{vh.estado}</td>
                                        <td>
                                            <div className="buttonsIconTable" style={{display:"flex",gap:"10px"}}>
                                                <button onClick={()=>abrirModalView(vh)}>
                                                    <VisibilityIcon/>
                                                </button>
                                                <button onClick={()=>abriModalEdit(vh)}>
                                                    <EditIcon />
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
                    <form style={{display:"flex",flexDirection:"column"}}>
                        <label>Patente</label>
                        <input type='text' value={formAddV.patente} onChange={(e)=>setFormAddV({...formAddV,patente:(e.target.value)})}></input>
                        <label>Modelo</label>
                        <input type='text' value={formAddV.modelo} onChange={(e)=>setFormAddV({...formAddV, modelo:(e.target.value)})}></input>
                        <label>kilometraje actual</label>
                        <input type='number' value={formAddV.kms_actual} onChange={(e)=>setFormAddV({...formAddV, kms_actual:Number(e.target.value)})}></input>
                        <label>Estado</label>
                        <select value={formAddV.estado} onChange={(e)=> setFormAddV({...formAddV,estado:e.target.value as "DISPONIBLE" | "EN REPARACION" | "EN RUTA" | "DADO DE BAJA"})}>
                            <option>DISPONIBLE</option>
                            <option>EN REPARACION</option>
                            <option>DADO DE BAJA</option>
                            <option>EN RUTA</option>
                        </select>
                    </form>
                    </>)
                    :
                    (<>
                    <form style={{display:"flex", flexDirection:"column"}}>
                        <label>Correo</label>
                        <input type='email' placeholder='nombre.apellido@mail.com' value={formAddU.correo} onChange={(e)=>setFormAddU({...formAddU,correo:(e.target.value)})}></input>
                        <label>Contraseña</label>
                        <input type='password' placeholder='********'></input>
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
                    </form>
                    </>)}
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        handleAgregar()
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
            <ModalDialog variant="outlined" sx={{
                width:"50hw"
            }}>
                <DialogTitle>
                    Agregar mantención a vehículo
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <label>Patente del vehiculo</label>
                    <select defaultValue={""} onChange={(e)=>setFormMantencion({...formMantencion,patente:e.target.value})}>
                        <option value={""} disabled>Selecciona la patente a agregar mantención</option>
                        {vehiculos?.length && vehiculos!.map((veh:Vehiculo)=>(
                            <option key={veh.patente} value={veh.patente}>{veh.patente}</option>
                        ))}
                    </select>
                    <label>Último cambio de aceite</label>
                    <input type='date' name='fechaAceite' value={formMantencion.ultimo_cambio_aceite} onChange={(e)=>setFormMantencion({...formMantencion,ultimo_cambio_aceite:e.target.value})}></input>
                    <label>Taller</label>
                    <input type='text' name='taller' value={formMantencion.taller} onChange={(e)=>setFormMantencion({...formMantencion,taller:e.target.value})}></input>
                    <label>Última mantención</label>
                    <input type='date' name='fechaMantención' value={formMantencion.ultima_mantencion} onChange={(e)=>setFormMantencion({...formMantencion,ultima_mantencion:e.target.value})}></input>
                    <label>Motivo o detalle de la mantención</label>
                    <textarea rows={5} style={{overflowY:"auto", resize:"none"}} name='motivoMantencion' value={formMantencion.detalle_mantencion} onChange={(e)=>setFormMantencion({...formMantencion,detalle_mantencion:e.target.value})}></textarea>
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="success" onClick={() => {
                        handleAgregarMantencion(),
                        setOpenModalMantencion(false)}}>
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
            <ModalDialog variant="outlined" sx={{
                width: { xs: '90%', sm: '500px', md: '700px' } 
            }}>
                <DialogTitle>
                    Vista de {recursoShow && 'correo' in recursoShow ? (
                        `Vista de usuario: ${recursoShow.nombre}`
                    ): recursoShow && 'patente' in recursoShow ? (
                        `Vista de vehículo: ${recursoShow.patente}`
                    ):("vista de recurso")} 
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {recursoShow && 'correo' in recursoShow ? (
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
                        <p><strong>Kilometraje: </strong>{recursoShow.kms_actual}</p>
                        <Mantenciones patenteBuscada={recursoShow.patente}/>

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
                    <form style={{display:"flex", flexDirection:"column"}}>
                        <label>Patente</label>
                        <input value={recursoEdit.patente} type='text' disabled ></input>
                        <label>Modelo</label>
                        <input value={recursoEdit.modelo} type='text' disabled></input>
                        <label>kilometraje actual</label>
                        <input value={formV.kms_actual }  type='number' onChange={(e)=>setFormV({...formV,kms_actual:Number(e.target.value)})}></input>
                        <label>Estado</label>
                        <select defaultValue={formV.estado} onChange={(e)=>setFormV({...formV, estado: e.target.value as "DISPONIBLE" | "EN REPARACION" | "EN RUTA" | "DADO DE BAJA"})}>
                            <option>DISPONIBLE</option>
                            <option>EN RUTA</option>
                            <option>EN REPARACION</option>
                            <option>DADO DE BAJA</option>
                        </select>
                    </form>
                    </>)
                    : recursoEdit && 'email' in recursoEdit ?
                    (<>
                        <label>Correo</label>
                        <input value={recursoEdit.correo} type='email' placeholder='nombre.apellido@mail.com'></input>
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
                        handleEditVehiculo()
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