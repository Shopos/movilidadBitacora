import { useState } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/recursosAdmin.css"
import { Table } from '@mui/joy'
import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,DialogActions, Button} from "@mui/joy"

type Usuario = {
    correo:string,
    nombre:string,
    cargo:string,
    estado:boolean,
}
type Vehiculo = {
    patente:string,
    modelo:string,
    estado:"Activo"|"Reparacion"|"Dado de baja"|"Disponible",
    KMS_actual:number
}
function recursosAdmin(){
    const usuarios:Usuario[] = [
        {correo:"abc@gmail.com",nombre:"abc def",cargo:"Funcionario",estado:false},
        {correo:"admin@gmail.com",nombre:"abc def",cargo:"Administrador",estado:true},
        {correo:"nombre.apellido@munisantacruz.cl",nombre:"nombre apellido",cargo:"Funcionario",estado:true},
        {correo:"def@gmail.com",nombre:"def acv",cargo:"Funcionario",estado:true},
        {correo:"ghi@gmail.com",nombre:"dhi fgj",cargo:"Funcionario",estado:false},
    ]
    const vehiculos:Vehiculo[] = [
        {patente:"xyz123", modelo:"toyota", KMS_actual:192,estado:"Activo"},
        {patente:"abc123", modelo:"suzuki", KMS_actual:193,estado:"Disponible"},
        {patente:"dfe123", modelo:"toyota", KMS_actual:194,estado:"Reparacion"},
        {patente:"plm123", modelo:"suzuki", KMS_actual:195,estado:"Dado de baja"},
        {patente:"pit123", modelo:"toyota", KMS_actual:196,estado:"Disponible"},
        {patente:"xom123", modelo:"audi", KMS_actual:197,estado:"Activo"},
    ]
    const [vistaActual,setVistaActual] = useState<boolean>(false)
    const [modalAdd,setOpenModalAdd] = useState<boolean>(false)



    const abriModalAdd =()=>{
        //se abre modal y luego antes del retorno se limpian los inputs
        setOpenModalAdd(true)
        return
    }
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
                                            <div style={{display:"flex",gap:"10px"}}>
                                                Acciones
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ):
                (
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
                                {vehiculos.map((vh)=>(
                                    <tr>
                                        <td>{vh.patente}</td>
                                        <td>{vh.modelo}</td>
                                        <td>{vh.KMS_actual}</td>
                                        <td>{vh.estado}</td>
                                        <td>
                                            <div style={{display:"flex",gap:"10px"}}>
                                                Acciones
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
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
        </>
    )
}
export default recursosAdmin