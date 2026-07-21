
import { useEffect, useState } from "react"
import NavBar from "../../componentes/navBar"
import { Table, Select, Option } from "@mui/joy"
import { TablePagination } from "@mui/material"
import { useAuth } from "../../context/AuthContext"

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type Audit = {
    tabla_afectada: string,
    accion: string,
    cambiado_por: string,
    fecha_cambio: string,
    valor_new:any,
    valor_old:any
}

function menuAudit() {
    const { token } = useAuth()
    const [cargando, setCargando] = useState(false)
    const [logFiltro, setLogFiltro] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [filtroTabla, setFiltroTabla] = useState("")
    const [filtroAccion, setFiltroAccion] = useState("")


    useEffect(() => {
        const cargar = async () => {
            setCargando(true)
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    size: String(rowsPerPage),
                    ...(filtroTabla ? { tabla: filtroTabla } : {}),
                    ...(filtroAccion ? { accion: filtroAccion } : {})
                })

                const res = await fetch(`${API}/auditorias?${params}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (!res.ok) throw new Error("Error en la petición")

                const data = await res.json()
                console.log(data)
                setLogFiltro(data.registros || [])
                setTotal(data.total || 0)
            } catch (error) {
                console.error("Error cargando auditorías:", error)
            } finally {
                setCargando(true)
            }
        }

        cargar()
    }, [page, rowsPerPage, filtroTabla, filtroAccion, token])


    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const adaptarAccion=(accion:string)=>{
        switch(accion){
            case "LOGIN": return "Inicio Sesión" 
            case "INSERT": return "Agregación"
            case "UPDATE": return "Actualización"
            case "DELETE": return "Borrado"
        }
    }

    return (
        <>
            <NavBar type={1} texto="Auditoria" />
            <div style={{display:"flex", flexDirection:"row", padding:"2vh"}}>
                <p style={{marginRight:"1vh"}}>Tabla a mostrar:</p>
                <Select sx={{marginRight:"3vh"}} aria-placeholder="Tablas" value={filtroTabla} onChange={(_, v) => setFiltroTabla(v || "")}>
                    <Option value={""}>Todas las tablas</Option>
                    <Option value={"usuarios"}>Usuarios</Option>
                    <Option value={"vehiculos"}>Vehiculos</Option>
                    <Option value={"viajes"}>Bitácoras</Option>
                    <Option value={"mantenciones"}>Mantenciones</Option>
                    <Option value={"solicitudes_viaje"}>Solicitudes</Option>
                </Select>
                <p style={{marginRight:"1vh"}}>Acciones a mostrar:</p>
                <Select aria-placeholder="Acciones" value={filtroAccion} onChange={(_, v) => setFiltroAccion(v || "")}>
                    <Option value={""}>Todas las acciones</Option>
                    <Option value={"LOGIN"}>Inicio Sesión</Option>
                    <Option value={"UPDATE"}>Cambios</Option>
                    <Option value={"INSERT"}>Agregaciones</Option>
                    <Option value={"DELETE"}>Borrado</Option>
                </Select>
            </div>
            {cargando ?
                (<>
                    <div className="tablaAuditoria">
                        <Table hoverRow borderAxis="y" sx={
                            {
                                '& tr:nth-of-type(odd)': { backgroundColor: '#FBF5DD' },
                                '& tr:nth-of-type(even)': { backgroundColor: '#E7E1B1' },
                                '& td': { textAlign: 'left', paddingLeft: 1.9 },
                                '& th': { backgroundColor: "#bad8b6" }
                            }

                        }>
                            <thead>
                                <tr>
                                    <th>Tabla</th>
                                    <th>Acción</th>
                                    <th>Cambiado por</th>
                                    <th>Fecha</th>
                                    <th>Antes</th>
                                    <th>Después</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logFiltro && logFiltro.map((adt: Audit) => (
                                    <tr>
                                        <td>{adt.tabla_afectada}</td>
                                        <td>{adaptarAccion(adt.accion)}</td>
                                        <td>{adt.cambiado_por==="CONSOLA" ? "Sistema":adt.cambiado_por}</td>
                                        <td>{`${adt.fecha_cambio.slice(0,10)} ${adt.fecha_cambio.slice(11,19)}`}</td>
                                        <td>
                                            <pre style={{whiteSpace: 'pre-wrap', fontSize:'0.7rem'}}>
                                                {adt.valor_old === null ? "":JSON.stringify(adt.valor_old, null, 1)}
                                            </pre>
                                        </td>
                                        <td>
                                            <pre style={{whiteSpace: 'pre-wrap', fontSize:'0.7rem'}}>
                                                {adt.valor_new === null ? "":JSON.stringify(adt.valor_new,null,1)}
                                            </pre>
                                        </td>
                                    </tr>
                                ))}
                                {logFiltro.length === 0  /** && Filtros */ && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "5%" }}>No hay registros por mostrar</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Registros totales"}
                            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                            sx={{
                                '& .MuiTablePagination-actions': { width: '8wv' }
                            }}
                        />
                    </div>
                </>) :
                (<>
                    ...Cargando
                </>)}
        </>
    )
}
export default menuAudit