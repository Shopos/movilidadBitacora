import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import NavBar from "../../componentes/navBar.tsx"
import '../../estilos/menuUsuario.css'
import type { Vehiculo, Viaje } from "../../types/tipoSistema.ts"
import { useAuth } from "../../context/AuthContext.tsx"
import getVehiculos, { getViajeProceso, getViajeUsuarioEspera } from "../../utils/auxiliar.ts"
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/joy"
import { useAlerta } from "../../context/AlertaContext.tsx"
/*Vista del menu del usuario
        >Iniciar viaje para comenzar proceso de documentacion bitacora
        >Ver mis viajes para navegar a vista de viajes del usuario
    */
function menuUsuario() {
    const { showAlerta } = useAlerta()
    const navigate = useNavigate()
    const { usuario } = useAuth()
    const verViajes = () => navigate("/viajesUsuario");
    const [viajeEspera, setViajeEspera] = useState<Viaje[]>([])
    const [cargando, setCargando] = useState(false)
    const [viajeVuelta, setViajeVuelta] = useState(false)
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
    /* Verificar si existe un viaje en espera para dicho usuario, si existe mostrar tarjeta con boton para redirigir a iniciarViaje */
    useEffect(() => {
        const getViajeUsuario = async () => {
            try {
                if (usuario) {
                    const response = await getViajeUsuarioEspera(usuario?.id)
                    const veh = await getVehiculos()
                    if (response && Object.keys(response).length > 0 && Object.keys(veh).length > 0) {
                        showAlerta("Tienes un viaje en espera", "info")
                        setVehiculos(veh)
                        setViajeEspera(response) //
                        setCargando(true)
                    } else {
                        setViajeEspera([])
                    }
                }
            } catch (e) {
                console.error(" Error listando viaje usuario ")
                setViajeEspera([])
            }
        }
        getViajeUsuario()
    }, [usuario, cargando])

    //Funcion para verificar el estado de la patente -> si el elemento.patente existe en la lista de vehiculos y dicho elemento esta en estado "DISPONIBLE"
    //retorna T caso contrario F
    function checkPatenteDis(patente: string): boolean {
        if (vehiculos) {
            return !vehiculos.some((veh) => veh.patente === patente && veh.estado === "DISPONIBLE")
        }
        return false
    }

    useEffect(() => {
        if (viajeEspera.find(vje => vje.modo === "vuelta")) {
            setViajeVuelta(true)
        }
    }, [viajeEspera])

    const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

    /*Verifica si usuario tiene un viaje iniciado "En proceso", si eso es cierto envia a viajeProceso */
    useEffect(() => {
        const verificaViajeProceso = async () => {
            if (usuario) {
                const response = await getViajeProceso(usuario.id)
                if (response !== null) {
                    showAlerta("Tienes un viaje en proceso, rederigiendo a la vista de proceso", "warning")
                    await sleep(4000)
                    //show alerta
                    navigate("/viajeProceso")
                }
            }
        }
        verificaViajeProceso()
    }, [usuario])


    /* Al accionar boton de Card para comenzar viaje se almacena en localStorage id_viaje para futuras consultas
    y se redirige a inicioViaje */
    const manejarViajeEspera = (id: number) => {
        if (id) {
            localStorage.setItem("idViaje", String(id))
            navigate("/inicioViaje")
        }
    }

    /**Funcion para comparar fechas 
     * 
     * Verifica si ambas fechas recomendadas son nulas, caso verdadero retorna las posiciones normales
     * -Verifica si la hora 'a' es nula retornando que la fecha 'b' va antes
     * -Verifica si la hora 'b' es nula retornando que la fecha 'a' va antes
     * -Verifica ambas fechas verificando y retornando que fecha tendria prioridad
    */
    const compararFechas = (a: Viaje, b: Viaje): number => {
        if (!a.hora_recomendada && !b.hora_recomendada) {
            return 0
        }
        if (!a.hora_recomendada) {
            return 1
        }
        if (!b.hora_recomendada) {
            return -1
        }
        return new Date(a.hora_recomendada).getTime() - new Date(b.hora_recomendada).getTime()
    }
    /**Ordena los viajes del usuarios dependiendo de el modo del viaje y las fechas recomendadas
     *   -Prioridad 1-> Viajes modo vuelta -> SI existe un viaje queda arriba de todos los demas y no permite iniciar un nuevo viaje 
     *   -Prioridad 2-> Viajes con horas recomendadas -> SI tiene una fecha recomendad, se ordenan por prioridad -> Fechas más actuales quedan arriba
     *   -Prioridad 3-> Viajes sin hora -> Quedan al fondo de la lista -> Viajes sin una prioridad real, el usuario determina el inicio
     */
    const viajeOrdenado = [...viajeEspera].sort((a, b) => {
        const porModo = Number(b.modo === "vuelta") - Number(a.modo === "vuelta")
        if (porModo !== 0) {
            return porModo
        }
        return compararFechas(a, b)
    })

    return (
        <div>
            <NavBar type={0} texto="" />
            <div className="containerBotones">
                {viajeEspera && viajeEspera.length > 0 ?
                    (<div style={{ width: "100%", maxWidth: "85vw", height: "50vh", overflow: "auto", boxSizing: "border-box" }}>
                        {viajeOrdenado.map((vje) => (

                            <div className="containerCard">
                                <Card
                                    variant="outlined"
                                    className="cardViaje"
                                    sx={{
                                        backgroundColor: vje.modo === "vuelta" ? "#e6db88" : "#E7E1B1",
                                        boxShadow: 'sm',
                                        transition: 'transform 0.2s, box-shadow 0.2s', 
                                        '&:hover': {
                                            boxShadow: 'md',
                                            transform: 'translateY(-2px)' 
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography level="h1">Tienes un viaje en espera</Typography>
                                        <Typography level="h3">Viaje a {vje.destino}</Typography>
                                        {vje.hora_recomendada && <Typography level="body-md">Hora agendada: {vje.hora_recomendada.slice(0, 10) + "  " + vje.hora_recomendada.slice(11, 19)}</Typography>}
                                        <Typography level="body-md">Vehiculo: {vje!.vehiculo}</Typography>
                                        <Typography level="body-md">Patente: {vje!.patente}</Typography>
                                    </CardContent>
                                    <CardActions sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-end"
                                    }}>
                                        {vje.modo === "vuelta" && <IconButton variant="solid" color="primary" onClick={() => manejarViajeEspera(vje.id_viaje)}>Comenzar viaje</IconButton>}
                                        {!viajeVuelta && !checkPatenteDis(vje.patente) && <IconButton variant="solid" color="primary" onClick={() => manejarViajeEspera(vje.id_viaje)}>Comenzar viaje</IconButton>}
                                    </CardActions>
                                </Card>
                            </div>
                        ))}

                    </div>) :
                    (<>No tienes viajes de momento</>)}
                <button onClick={() => verViajes()}>
                    <h2>Ver mis viajes</h2>
                </button>
            </div>
            <div className="spacer"></div>

        </div>
    )
}
export default menuUsuario