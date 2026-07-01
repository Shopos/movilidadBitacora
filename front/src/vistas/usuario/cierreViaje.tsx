import { useNavigate } from "react-router-dom"
import { useState, useEffect, type ChangeEvent } from "react"
import NavBar from "../../componentes/navBar.tsx"
import "../../estilos/cierreViaje.css"
import type { Viaje, ViajeInputFin } from "../../tipos/tipoSistema.ts"

import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { isMobile } from "react-device-detect"
import { useAuth } from "../../context/AuthContext.tsx"
import { getViajeID, patchFin } from "../../utils/auxiliar.ts"


function cierreViaje() {
    //inputs de recoleccion y cierre final con dialogo de confirmacion
    //es posible cancelar y volver al estado de viajeProceso si es necesario
    //al finalizar cambia los estados del viaje y vehiculo asociados
    const { usuario } = useAuth()
    const navigate = useNavigate()
    const volverProceso = () => navigate("/viajeProceso")

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [modalFoto, setOpenModalFoto] = useState<boolean>(false)
    const [formFin, setFormFin] = useState<ViajeInputFin>({
        cantidad_combustible: 0,
        carga_combustible: false,
        fecha_hora_fin: "",
        //lat_fin_real:0,
        //lng_fin_real:0,
        modificado_por: "",
        ultima_modificacion: "",
        obs_viaje: "",
        kms_fin: 0,
        estado_viaje: "En proceso"
    })
    const [check, setCheck] = useState(false)
    const [time, setTime] = useState("")
    const [dataGPS, setDataGPS] = useState({
        lat: 0, lng: 0
    })
    const [viajeID, setViajeID] = useState<Viaje | null>(null)
    const d = new Date()
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const [errorKms,setErrorKms] = useState<string|null>(null)
    /* Si el usuario tiene activo y permitido el acceso a su localizacion, recupera su latitud y longitud final para 
    almacenar estos valores en la BD*/
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            setDataGPS({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
    }, [])


    useEffect(() => {
        const getID = async () => {
            try {
                if (usuario) {
                    const response = await getViajeID(usuario.id)
                    if (response && Object.keys(response).length > 0) {
                        //console.log(response[0].id_viaje)
                        setViajeID(response[0])
                    } else {
                        setViajeID(null)
                    }
                }
            } catch (e) {
                console.error(" Error listando viaje usuario ")
                setViajeID(null)
            }
        }
        getID()
    }, [usuario])

    /*Metodo para actualizar los datos antes del envio de estos a la BD */
    const updateDatoFin = async () => {

        if (formFin) {
            setFormFin((prevData) => ({
                ...prevData,
                modificado_por: usuario!.nombre,
                ultima_modificacion: `${date} ${time}`,
                fecha_hora_fin: `${date} ${time}`,
                estado_viaje: "Terminado",
                //lat_fin_real: dataGPS.lat,
                //lng_fin_real:dataGPS.lng,
            }))
        }

    }


    const handleSendDataFin = async () => {
        await updateDatoFin()
    }

    /* Metodo para almacenar los datos en BD, esto solo se ejecuta si el valor de estado_viaje pasa a Falso
    esto ocurriendo en el caso de dar terminado el viaje
    Una vez subido estos datos se envia el formulario final a actualizar dicho viaje en BD
    */
    useEffect(() => {
        if (formFin.estado_viaje === "Terminado") {
            console.log(formFin)
            console.log(viajeID!.id_viaje)
            //se envia update
            //patchFin(viajeID!.id_viaje,formFin)
            //localStorage.removeItem("idViaje")
            //navigate("/menuUsuario")
        }
    }, [formFin])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormFin((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleCheck = () => {
        setCheck(!check)
        setFormFin((prev) => ({
            ...prev,
            carga_combustible: !formFin.carga_combustible
        }))
    }

    const handleKMS = (e: ChangeEvent<HTMLInputElement>) => {
        const valueNum = Number(e.currentTarget.value);
        const kmsInicial = viajeID?.kms_inicial || 0;

        setFormFin((prev) => ({ ...prev, kms_fin: valueNum }));

        if (valueNum < kmsInicial && valueNum !== 0) {
            setErrorKms(`¡Error! Debe ser mayor o igual a ${kmsInicial} kms.`);
        } else {
            setErrorKms(null);
        }
    };

    /*
    Vista fin cierre bitacora
        >inputs que recolectan la informacion de cierre
        >Check por si se realiza carga de combustible -> 
            >1 --> Señala que si se realizo y se pide informacion
            >0 --> Quedan vacios

            
        >VERIFICAR PREVIO ENVIO DE INFORMACION QUE EL VALOR INGRESADO AL KMS FINAL DEBE SER MAYOR O IGUAL AL KMS INICIAL


        >Se pide confirmacion para cerrar el proceso-->se guardan los datos finales y viaje queda en estado false indicando que el viaje ya no esta activo
    */
    return (
        <div>
            <NavBar type={0} texto="" />
            <div className="formularioFin">
                <div className="gridInput">
                    <div className="itemInput">
                        <label>Llegada</label>
                        <input name="time" type="time" value={time} onChange={(e) => setTime(e.target.value)}></input>
                    </div>
                    <div className="itemInput">
                        <label>Kilometraje final</label>
                        <input
                            type="number"
                            name="kms_fin"
                            min={viajeID?.kms_inicial || 0}
                            value={formFin.kms_fin || 0}
                            onChange={handleKMS}
                            style={{ borderColor: errorKms ? 'red' : '' }} 
                        ></input>
                        {errorKms && (
                            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                {errorKms}
                            </span>
                        )}
                    </div>
                </div>
                <div className="argumento">
                    <label>Comentarios</label>
                    <textarea placeholder="En el viaje ocurrio..." name="obs_viaje" value={formFin.obs_viaje} onChange={handleChange}></textarea>
                </div>
                <div className="selectInput">
                    <div className="itemInputSelect">
                        <label>Carga combustible</label>
                        <input name="carga_combustible" onChange={() => handleCheck()}
                            value={check ? "true" : "false"} type="checkbox"></input>
                    </div>
                    {formFin.carga_combustible ?
                        (<div className="itemInputSelect">
                            <label>Cantidad</label>
                            <input type="number" value={formFin.cantidad_combustible} name="cantidad_combustible" onChange={handleChange}></input>
                        </div>) :
                        (
                            <></>
                        )
                    }
                </div>

                {formFin.carga_combustible ? (
                    <>
                        <div className="displayModal">
                            <p>Comprobante</p>
                            <button onClick={() => setOpenModalFoto(true)}>sube tu Comprobante aquí</button>
                        </div>
                    </>
                ) : (<></>)}

            </div>
            <div className="gridButton">
                <button className="botonPasoFin" onClick={() => volverProceso()}>Volver</button>
                <button className="botonPasoFin2" onClick={() => setOpenModal(true)}>Finalizar viaje</button>
            </div>


            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        ¿Estas seguro de finalizar el viaje?
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Al hacerlo no podras ingresar más datos al viaje actual.
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => {
                            handleSendDataFin()
                        }}>
                            Finalizar viaje
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => setOpenModal(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>


            <Modal open={modalFoto} onClose={() => setOpenModalFoto(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <CameraAltIcon />
                        Comenzar captura de datos por cámara
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Asegura de aceptar los permisos para acceder a tu cámara y poder capturar la imagen
                    </DialogContent>
                    <Divider />
                    <DialogContent>
                        <div>Acceso a cámara</div>
                        <div>
                            <p>Puedes subir una existente aquí</p>
                            <input type="file" accept="image/*" name="comprobante"></input>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => setOpenModalFoto(false)}>
                            Capturar
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => setOpenModalFoto(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>


        </div>
    )
}
export default cierreViaje