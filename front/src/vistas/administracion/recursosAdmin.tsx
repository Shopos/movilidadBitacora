import { useState, useEffect } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import Mantenciones from "../../componentes/mantencionesVehiculo.tsx"
import "../../estilos/recursosAdmin.css"
import { Table } from '@mui/joy'
import { FormControl, type SelectChangeEvent } from "@mui/material"
import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit';
import type { Vehiculo, User, Mantencion } from '../../tipos/tipoSistema.ts'
import getVehiculos, { addMantencionVehiculo, agregarVehiculo, editarVehiculo, agregarUsuario, getUsuarios, editarUsuario } from "../../utils/auxiliar.ts"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAlerta } from '../../context/AlertaContext.tsx'
import { Box, MenuItem, TablePagination, Chip, Select } from '@mui/material'


const vehiculoVacio: Vehiculo = {
    patente: "",
    modelo: "",
    kms_actual: 0,
    estado: "DADO DE BAJA",
    tipo_vehiculo: "Automóvil",
    licencia_min:"B"
}
const mantencionVacia: Mantencion = {
    id_mantencion: 0,
    detalle_mantencion: "",
    patente: "",
    taller: "",
    ultima_mantencion: "",
    ultimo_cambio_aceite: ""
}
const usuarioVacio: User = {
    id_usuario: 0,
    cargo: "Funcionario",
    correo: "",
    estado: false,
    nombre: "",
    pass: "",
    tipo_licencia: "",
    estado_viaje_usuario: "Disponible",
    lista_licencia: [],
    licencias_concat:""
}
function recursosAdmin() {
    const { showAlerta } = useAlerta()
    const [usuarios, setUsuarios] = useState<[User]>()
    const [vehiculos, setVehiculos] = useState<[Vehiculo]>()
    const [vistaActual, setVistaActual] = useState<boolean>(false)
    const [modalAdd, setOpenModalAdd] = useState<boolean>(false)
    const [modalMantencion, setOpenModalMantencion] = useState<boolean>(false)
    const [modalViewRecurso, openModalViewRecurso] = useState<boolean>(false)
    const [recursoShow, setRecursoShow] = useState<Vehiculo | User>()
    const [recursoEdit, setRecursoEdit] = useState<Vehiculo | User>()
    const [modalEdit, openModalEdit] = useState<boolean>(false)
    const licencias = ["A5", "A4", "A3", "A2", "A1", "B", "C", "D", "E", "F"]
    const [refresh, setRefresh] = useState(false)

    const [cargando, setCargando] = useState(false)

    const [formV, setFormV] = useState<Vehiculo>(vehiculoVacio)
    const [formU, setFormU] = useState<User>(usuarioVacio)
    const [formAddV, setFormAddV] = useState<Vehiculo>(vehiculoVacio)
    const [formMantencion, setFormMantencion] = useState<Mantencion>(mantencionVacia)
    const [formAddU, setFormAddU] = useState<User>(usuarioVacio)


    /* Metodo para obtener los vehiculos desde BD */
    useEffect(() => {
        const getListaVehiculos = async () => {
            try {
                const response = await getVehiculos()
                if (response) {
                    setVehiculos(response)
                }
            } catch (e) {
                console.error("error encontrando vehiculos: ", e)
                showAlerta("Error encontrando vehículos del sistema", "error")
            }
        }
        getListaVehiculos()
    }, [refresh, modalAdd, modalEdit])

    /* Metodo para obtener los usuarios desde BD */
    useEffect(() => {
        const getListaUsuarios = async () => {
            try {
                const response = await getUsuarios()
                if (response) {
                    setUsuarios(response)
                }
            } catch (e) {
                console.error("error encontrando usuarios", e)
                showAlerta("Error encontrando usuarios del sistema", "error")
            }
        }
        getListaUsuarios()
    }, [refresh])

    const abriModalAdd = () => {
        setOpenModalAdd(true)
    }
    const abrirModalMantencion = () => {
        setOpenModalMantencion(true)
    }
    const abrirModalView = (recurso: Vehiculo | User) => {
        setRecursoShow(recurso)
        openModalViewRecurso(true)
    }

    const abriModalEdit = (recurso: Vehiculo | User) => {
        setRecursoEdit(recurso)
        if (recurso && 'patente' in recurso) {
            setFormV(recurso)
        } else {
            setFormU(recurso)
        }
        openModalEdit(true)
    }

    /* Metodo para enviar la informacion editada en modal de edicion a BD
        Si el recurso es vehiculo comprueba que el atributo este dentro de la informacion enviada
        Caso contrario comprueba que exista el atributo correo para verificar si es un usuario
    */
    const handleEditVehiculo = async () => {
        if (!recursoEdit && cargando) return

        if (recursoEdit && 'patente' in recursoEdit) {
            setCargando(true)
            const patente = recursoEdit.patente
            const payload = formV
            const edicion = await editarVehiculo(patente, payload)
            if (edicion) {
                showAlerta("Vehículo editado correctamente", "success")
            } else {
                showAlerta("Hubo un problema al editar, intente más tarde", "warning")
            }
            setFormV(vehiculoVacio)
            setCargando(false)
            setRefresh(!refresh)
        }
        if (recursoEdit && 'correo' in recursoEdit) {
            setCargando(true)
            const correo = recursoEdit.correo
            const payload = formU

            const edicion = await editarUsuario(correo, payload)
            if (edicion) {
                showAlerta("Usuario editado correctamente", "success")
            } else {
                showAlerta("Hubo un problema al editar, intente más tarde", "warning")
            }

            setFormU(usuarioVacio)
            setCargando(false)
            setRefresh(!refresh)
        }
    }

    /* Metodo para agregar un nuevo vehiculo a BD */
    const handleAgregar = async () => {
        if (!formAddV || cargando) return
        setCargando(true)
        const res = await agregarVehiculo(formAddV)
        if (res) {
            showAlerta("Vehículo agregado correctamente", "success")
        } else {
            showAlerta("Hubo un problema al agregar, intenta más tarde", "warning")
        }
        setFormAddV(vehiculoVacio)
        setCargando(false)
        setRefresh(!refresh)
    }
    /* Metodo para agregar un nuevo usuario a BD */
    const handleAgregarUsuario = async () => {
        if (!formAddU || cargando) return
        setCargando(true)

        const res = await agregarUsuario(formAddU)
        if (res) {
            showAlerta("Usuario agregado correctamente", "success")
        } else {
            showAlerta("Hubo un problema al agregar, intenta más tarde", "warning")
        }

        setFormAddU(usuarioVacio)
        setCargando(false)
        setRefresh(!refresh)
    }

    /* Metodo para agregar una nueva mantencion a un vehiculo */
    const handleAgregarMantencion = async () => {
        if (!formMantencion || cargando) return
        setCargando(true)
        await addMantencionVehiculo(formMantencion)
        setFormMantencion(mantencionVacia)
        setCargando(false)
        setRefresh(!refresh)
    }

    /* Metodo para exportar los recursos que se encuentren activo
    Si la vistaActual es verdadero exporta la lista de vehiculos
    Si la vistaActual es falsa exporta la lista de usuarios
    */
    const exportarPdf = () => {
        const doc = new jsPDF('l', 'pt', 'a4')
        doc.setFontSize(12)
        if (vistaActual === true) {
            //Exportar pdf tabla vehiculos
            const columns = ['Patente','Tipo', 'Modelo', 'Kilometraje', 'Estado']
            if (vehiculos) {
                const rows = vehiculos.map((veh) => [
                    veh.patente,
                    veh.tipo_vehiculo,
                    veh.modelo,
                    veh.kms_actual,
                    veh.estado
                ])

                doc.text("Reporte de vehiculos - departamento de movilización", 20, 20)
                autoTable(doc, {
                    startY: 40,
                    head: [columns],
                    body: rows,
                    theme: 'plain',
                    styles: { fontSize: 10, cellPadding: 5 },
                    headStyles: { fillColor: [41, 120, 120], textColor: 255 }
                })
                doc.save("Reportes vehiculos.pdf")
            }
        } else {
            //Exportar pdf tabla usuarios
            const columns = ['Nombre', 'Correo', 'Licencia', 'Cargo', 'Estado']
            if (usuarios) {
                const rows = usuarios.map((usr) => [
                    usr.nombre,
                    usr.correo,
                    usr.licencias_concat,
                    usr.cargo,
                    (usr.estado ? "Activo" : "Bloqueado")
                ])
                doc.text("Reporte de funcionarios - departamento de movilización", 20, 20)
                autoTable(doc, {
                    startY: 40,
                    head: [columns],
                    body: rows,
                    theme: 'plain',
                    styles: { fontSize: 10, cellPadding: 5 },
                    headStyles: { fillColor: [41, 120, 120], textColor: 255 }
                })
                doc.save("Reporte funcionarios.pdf")
            }
        }
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //Manejo de cambio de la lista de licencias disponibles para un usuario --> se agrega un arreglo con la lista de licencias elegidas 
    const handleChangeLicencia = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event
        setFormAddU((prev) => ({
            ...prev,
            lista_licencia: typeof value === 'string' ? value.split(',') : value
        })
        )
    }
    //Manejo de edicion de las licencias permitidas por un usuario
    const handleChangeLicenciaEdit = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event
        setFormU((prev) => ({
            ...prev,
            lista_licencia: typeof value === 'string' ? value.split(',') : value
        }))
    }
    /*
        Vista de recursos del departamento
        
    */
    return (
        <>
            <NavBar type={1} texto={"Recursos"} />

            <div>
                <div className='buttonsFlexEnd'>
                    <button onClick={() => exportarPdf()}>Exportar tabla actual</button>
                    <button onClick={() => abriModalAdd()}>Agregar nuevo {vistaActual === true ? "vehículo" : "usuario"}</button>
                    {vistaActual ? (<button onClick={() => abrirModalMantencion()} > Agregar mantención</button>) : (<></>)}

                </div>
                <div className='buttonsTablaH'>
                    <button className="bordeIzquierdoBoton" disabled={!vistaActual} onClick={() => setVistaActual(false)}>Usuarios</button>
                    <button className="bordeDerechaBoton" disabled={vistaActual} onClick={() => setVistaActual(true)}>Vehiculos</button>
                </div>
                {vistaActual === false && usuarios ?
                    (
                        /* Tabla usuarios */
                        <div>
                            <Table hoverRow borderAxis="y" sx={
                                {
                                    '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                                    '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                                    '& td': { textAlign: 'left', paddingLeft: 1.9 },
                                    '& th': { backgroundColor: "#bad8b6" }
                                }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "20%", overflow: "clip" }} >Correo</th>
                                        <th >Nombre</th>
                                        <th style={{ width: "15%" }}>Cargo</th>
                                        <th style={{ width: "10%" }}>Estado</th>
                                        <th style={{ width: "30%" }}>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usuarios && usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario: User) => (
                                        <tr>
                                            <td style={{ overflow: "clip" }}>{usuario.correo}</td>
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.cargo}</td>
                                            <td>{Number(usuario.estado) === 0 ? "Bloqueado" : "Activo"}</td>
                                            <td>
                                                <div className='buttonsIconTable' style={{ display: "flex", gap: "10px" }}>
                                                    <button onClick={() => abrirModalView(usuario)}>
                                                        <VisibilityIcon />
                                                    </button>
                                                    <button onClick={() => abriModalEdit(usuario)}>
                                                        <EditIcon />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <TablePagination
                                rowsPerPageOptions={[5, 10]}
                                component="div"
                                count={usuarios!.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={"Cantidad de usuarios"}
                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                                sx={{
                                    '& .MuiTablePagination-actions': { width: '5vw' }
                                }}
                            />
                        </div>
                    ) :
                    (
                        /* Tabla vehiculos */
                        <div>
                            <Table hoverRow borderAxis="y" sx={
                                {
                                    '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                                    '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                                    '& td': { textAlign: 'left', paddingLeft: 1.9 },
                                    '& th': { backgroundColor: "#bad8b6" }
                                }}>
                                <thead>
                                    <tr>
                                        <th>Patente</th>
                                        <th>Tipo vehículo</th>
                                        <th>Modelo</th>
                                        <th style={{ width: "15%" }}>KMS actual</th>
                                        <th style={{ width: "10%" }}>Estado</th>
                                        <th style={{ width: "30%" }}>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vehiculos && vehiculos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vh: Vehiculo) => (
                                        <tr>
                                            <td>{vh.patente}</td>
                                            <td>{vh.tipo_vehiculo}</td>
                                            <td>{vh.modelo}</td>
                                            <td>{vh.kms_actual}</td>
                                            <td>{vh.estado}</td>
                                            <td>
                                                <div className="buttonsIconTable" style={{ display: "flex", gap: "10px" }}>
                                                    <button onClick={() => abrirModalView(vh)}>
                                                        <VisibilityIcon />
                                                    </button>
                                                    <button onClick={() => abriModalEdit(vh)}>
                                                        <EditIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {vehiculos &&
                                <TablePagination
                                    rowsPerPageOptions={[5, 10]}
                                    component="div"
                                    count={vehiculos!.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={"Cantidad de vehículos"}
                                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                                    sx={{
                                        '& .MuiTablePagination-actions': { width: '5vw' }
                                    }}
                                />
                            }
                        </div>
                    )}
            </div>

            {/**Modal agrega recurso */}
            <Modal open={modalAdd} onClose={() => setOpenModalAdd(false)}>
                <ModalDialog variant="outlined" sx={{
                    width: { xs: '90%', sm: '500px', md: '700px' }
                }}>
                    <DialogTitle>
                        Agregar nuevo {vistaActual === true ? "vehículo" : "usuario"}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {vistaActual === true ?
                            (<>
                                <form style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Patente</label>
                                    <input type='text' value={formAddV.patente} onChange={(e) => setFormAddV({ ...formAddV, patente: (e.target.value) })}></input>
                                    <label>Tipo Vehículo</label>
                                    <select value={formAddV.tipo_vehiculo} onChange={(e) => setFormAddV({
                                        ...formAddV, tipo_vehiculo: e.target.value as
                                            "Motocicleta" | "Automóvil" | "Camioneta" | "Furgón" | "Camión" | "Bus" | "Maquinaria"
                                    })}>
                                        <option>Motocicleta</option>
                                        <option>Automóvil</option>
                                        <option>Camioneta</option>
                                        <option>Furgón</option>
                                        <option>Camión</option>
                                        <option>Bus</option>
                                        <option>Maquinaria</option>
                                    </select>
                                    <label>Modelo</label>
                                    <input type='text' value={formAddV.modelo} onChange={(e) => setFormAddV({ ...formAddV, modelo: (e.target.value) })}></input>
                                    <label>kilometraje actual</label>
                                    <input type='number' value={formAddV.kms_actual} onChange={(e) => setFormAddV({ ...formAddV, kms_actual: Number(e.target.value) })}></input>
                                    <label>Estado</label>
                                    <select value={formAddV.estado} onChange={(e) => setFormAddV({ ...formAddV, estado: e.target.value as "DISPONIBLE" | "EN REPARACION" | "EN RUTA" | "DADO DE BAJA" })}>
                                        <option>DISPONIBLE</option>
                                        <option>EN REPARACION</option>
                                        <option>DADO DE BAJA</option>
                                        <option>EN RUTA</option>
                                    </select>
                                </form>
                            </>)
                            :
                            (<>
                                <form style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Correo</label>
                                    <input type='email' placeholder='nombre.apellido@mail.com' value={formAddU.correo} onChange={(e) => setFormAddU({ ...formAddU, correo: (e.target.value) })}></input>
                                    <label>Contraseña</label>
                                    <input type='password' placeholder='********' value={formAddU.pass} onChange={(e) => setFormAddU({ ...formAddU, pass: (e.target.value) })}></input>
                                    <label>Nombre</label>
                                    <input type='text' value={formAddU.nombre} onChange={(e) => setFormAddU({ ...formAddU, nombre: (e.target.value) })}></input>
                                    <label>Cargo</label>
                                    <select defaultValue={""} onChange={(e) => setFormAddU({ ...formAddU, cargo: (e.target.value) })}>
                                        <option disabled value={""}>Elige el cargo del usuario a agregar</option>
                                        <option>Funcionario</option>
                                        <option>Administrativo</option>
                                        <option>Departamento</option>
                                    </select>
                                    <label>Tipo de licencia</label>
                                    <FormControl fullWidth >
                                        <Select
                                            multiple
                                            value={formAddU.lista_licencia || []}
                                            onChange={handleChangeLicencia}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, height: "20px" }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {licencias.map((lic) => (
                                                <MenuItem sx={{ height: "25px" }} key={lic} value={lic}>
                                                    {lic}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <label>Estado</label>
                                    <select value={Number(formAddU.estado)} onChange={(e) => setFormAddU({ ...formAddU, estado: (Number(e.target.value) === 1) ? true : false })}>
                                        <option value={1}>Activo</option>
                                        <option value={0}>Bloqueado</option>
                                    </select>
                                </form>
                            </>)}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            vistaActual === true ? handleAgregar() : handleAgregarUsuario()
                            setOpenModalAdd(false)
                        }}>
                            Agregar
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => {

                            setOpenModalAdd(false)
                        }}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/**Modal agrega mantencion vehiculo */}
            <Modal open={modalMantencion} onClose={() => setOpenModalMantencion(false)}>
                <ModalDialog variant="outlined" sx={{
                    width: { xs: '90%', sm: '500px', md: '700px' }
                }}>
                    <DialogTitle>
                        Agregar mantención a vehículo
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <label>Patente del vehiculo</label>
                        <select defaultValue={""} onChange={(e) => setFormMantencion({ ...formMantencion, patente: e.target.value })}>
                            <option value={""} disabled>Selecciona la patente a agregar mantención</option>
                            {vehiculos && vehiculos!.map((veh: Vehiculo) => (
                                <option key={veh.patente} value={veh.patente}>{veh.patente}</option>
                            ))}
                        </select>
                        <label>Último cambio de aceite</label>
                        <input type='date' name='fechaAceite' value={formMantencion.ultimo_cambio_aceite} onChange={(e) => setFormMantencion({ ...formMantencion, ultimo_cambio_aceite: e.target.value })}></input>
                        <label>Taller</label>
                        <input type='text' name='taller' value={formMantencion.taller} onChange={(e) => setFormMantencion({ ...formMantencion, taller: e.target.value })}></input>
                        <label>Última mantención</label>
                        <input type='date' name='fechaMantención' value={formMantencion.ultima_mantencion} onChange={(e) => setFormMantencion({ ...formMantencion, ultima_mantencion: e.target.value })}></input>
                        <label>Motivo o detalle de la mantención</label>
                        <textarea rows={5} style={{ overflowY: "auto", resize: "none" }} name='motivoMantencion' value={formMantencion.detalle_mantencion} onChange={(e) => setFormMantencion({ ...formMantencion, detalle_mantencion: e.target.value })}></textarea>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            handleAgregarMantencion(),
                                setOpenModalMantencion(false)
                        }}>
                            Agregar
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => setOpenModalMantencion(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/**Abrir modal vista recurso */}
            <Modal open={modalViewRecurso} onClose={() => openModalViewRecurso(false)}>
                <ModalDialog variant="outlined" sx={{
                    width: { xs: '90%', sm: '500px', md: '700px' }
                }}>
                    <DialogTitle>
                        {recursoShow && 'correo' in recursoShow ? (
                            `Vista de usuario: ${recursoShow.nombre}`
                        ) : recursoShow && 'patente' in recursoShow ? (
                            `Vista de vehículo: ${recursoShow.patente}`
                        ) : ("vista de recurso")}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {recursoShow && 'correo' in recursoShow ? (
                            <>
                                <p><strong>Nombre: </strong>{recursoShow.nombre}</p>
                                <p><strong>Licencia: </strong><span>{recursoShow.lista_licencia.join(",")}</span>
                                </p>
                                <p><strong>Cargo: </strong>{recursoShow.cargo}</p>
                                <p><strong>Estado: </strong>{Number(recursoShow.estado) === 0 ? "Bloqueado" : "Activo"}</p>
                            </>
                        ) :
                            recursoShow && 'patente' in recursoShow ?
                                (<>
                                    <p><strong>Patente: </strong>{recursoShow.patente}</p>
                                    <p><strong>Modelo: </strong>{recursoShow.modelo}</p>
                                    <p><strong>Kilometraje: </strong>{recursoShow.kms_actual}</p>
                                    <Mantenciones patenteBuscada={recursoShow.patente} />

                                </>) : "datos no encontrados"}
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
                        {recursoEdit && 'patente' in recursoEdit ?
                            (<>
                                <form style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Patente</label>
                                    <input value={recursoEdit.patente} type='text' disabled ></input>
                                    <label>Modelo</label>
                                    <input value={recursoEdit.modelo} type='text' disabled></input>
                                    <label>kilometraje actual</label>
                                    <input value={formV.kms_actual} type='number' onChange={(e) => setFormV({ ...formV, kms_actual: Number(e.target.value) })}></input>
                                    <label>Estado</label>
                                    <select defaultValue={formV.estado} onChange={(e) => setFormV({ ...formV, estado: e.target.value as "DISPONIBLE" | "EN REPARACION" | "EN RUTA" | "DADO DE BAJA" })}>
                                        <option>DISPONIBLE</option>
                                        <option>EN RUTA</option>
                                        <option>EN REPARACION</option>
                                        <option>DADO DE BAJA</option>
                                    </select>
                                </form>
                            </>)
                            : recursoEdit && 'correo' in recursoEdit ?
                                (<>
                                    <form style={{ display: "flex", flexDirection: "column" }}>
                                        <label>Correo</label>
                                        <input value={recursoEdit.correo} type='email' placeholder='nombre.apellido@mail.com' disabled></input>
                                        <label>Nombre</label>
                                        <input value={recursoEdit.nombre} type='text' disabled></input>
                                        <label>Cargo</label>
                                        <select defaultValue={recursoEdit.cargo} disabled>
                                            <option>Funcionario</option>
                                            <option>Administrativo</option>
                                        </select>
                                        <label>Tipo de licencia</label>
                                        <FormControl fullWidth >
                                            <Select
                                                multiple
                                                value={formU.lista_licencia || []}
                                                onChange={handleChangeLicenciaEdit}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, height: "20px" }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {licencias.map((lic) => (
                                                    <MenuItem sx={{ height: "25px" }} key={lic} value={lic}>
                                                        {lic}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <label>Estado</label>
                                        <select value={formU.estado ? "Activo" : "Bloqueado"} defaultValue={Number(recursoEdit.estado) === 1 ? "Activo" : "Bloqueado"} onChange={(e) => setFormU({ ...formU, estado: (e.target.value === "Activo" ? true : false) })}>
                                            <option>Activo</option>
                                            <option>Bloqueado</option>
                                        </select>
                                    </form>
                                </>) : <>Error</>}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            handleEditVehiculo()
                            openModalEdit(false)
                        }}>
                            Aplicar cambios
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => {

                            openModalEdit(false)
                        }}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>


        </>

    )
}
export default recursosAdmin