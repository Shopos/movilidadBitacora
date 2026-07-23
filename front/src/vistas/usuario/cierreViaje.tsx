import { useNavigate } from "react-router-dom"
import { useState, useEffect, type ChangeEvent } from "react"
import NavBar from "../../componentes/navBar.tsx"
import ImageUploader from "../../componentes/imageUploader.tsx"
import "../../estilos/cierreViaje.css"
import type { Viaje, ViajeInputFin } from "../../types/tipoSistema.ts"

import { Modal, ModalDialog, DialogTitle, Divider, DialogContent, DialogActions, Button } from "@mui/joy"
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAuth } from "../../context/AuthContext.tsx"
import { getViajeProceso, patchFin, resolverSubidaImagen } from "../../utils/auxiliar.ts"
import { useAlerta } from "../../context/AlertaContext.tsx"

function cierreViaje() {
    //inputs de recoleccion y cierre final con dialogo de confirmacion
    //es posible cancelar y volver al estado de viajeProceso si es necesario
    //al finalizar cambia los estados del viaje y vehiculo asociados
    const { usuario } = useAuth()
    const {showAlerta} = useAlerta()
    const navigate = useNavigate()
    const volverProceso = () => navigate("/viajeProceso")


    const [archivo,setArchivo] = useState<File|null>(null)
    const [archivoComprobante,setArchivoComprobante] = useState<File|null>(null)
    const [previewFin,setPreviewFin] = useState<string|null>(null)
    const [previewComprobante,setPreviewComprobante] = useState<string|null>(null)

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [modalFoto, setOpenModalFoto] = useState<boolean>(false)
    const [modalFoto2, setOpenModalFoto2] = useState<boolean>(false)
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
    const timeNow = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    const [errorKms, setErrorKms] = useState<string | null>(null)
    const [errorDate, setErrorDate] = useState<string | null>(null)
    /* Si el usuario tiene activo y permitido el acceso a su localizacion, recupera su latitud y longitud final para 
    almacenar estos valores en la BD*/
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            setDataGPS({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
    }, [])

    /**Metodo para obtener el viaje en proceso del usuario */
    useEffect(() => {
        const getID = async () => {
            try {
                if (usuario) {
                    const response = await getViajeProceso(usuario.id)
                    if (response && Object.keys(response).length > 0) {
                        setViajeID(response)
                    } else {
                        setViajeID(null)
                    }
                }
            } catch (e) {
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
                ultima_modificacion: `${date} ${timeNow}`,
                fecha_hora_fin: `${date} ${timeNow}`,
                estado_viaje: "Terminado",
                //lat_fin_real: dataGPS.lat,
                //lng_fin_real:dataGPS.lng,
            }))
        }

    }

/** Manejo de subida de información al finalizar un viaje */
const handleSendDataFin = async () => {
    if (!archivo || !viajeID) {
        showAlerta("Debes incluir a lo menos la foto del tablero", "warning")
        return
    }
    const resFin = await resolverSubidaImagen(viajeID.id_viaje, 'foto-fin', archivo)

    if (!resFin?.ok) {
        showAlerta(resFin?.message || "Error al subir la foto del tablero", "error")
        return
    }
    if (previewFin) {
        URL.revokeObjectURL(previewFin);
    }

    if (archivoComprobante) {
        const resComprobante = await resolverSubidaImagen(viajeID.id_viaje, 'foto-comprobante', archivoComprobante)

        if (!resComprobante?.ok) {
            showAlerta(`La foto del tablero se guardó, pero hubo un error con el comprobante: ${resComprobante?.message}`, "warning")
        } else if (previewComprobante) {
            URL.revokeObjectURL(previewComprobante);
        }
    }
    await updateDatoFin();
}
    const sleep = (ms: number):Promise<void>=>new Promise((resolve)=> setTimeout(resolve,ms))
    /* Metodo para almacenar los datos en BD, esto solo se ejecuta si el valor de estado_viaje pasa a Falso
    esto ocurriendo en el caso de dar terminado el viaje
    Una vez subido estos datos se envia el formulario final a actualizar dicho viaje en BD
    */
    useEffect(() => {
        const patch = async () => {
            if (formFin.estado_viaje === "Terminado") {
                //se envia update
                await patchFin(viajeID!.id_viaje, formFin)
                showAlerta("Viaje cerrado correctamete, regresando al menú principal","success")
                localStorage.removeItem("idViaje")
                await sleep(3000)
                
                navigate("/menuUsuario")
            }
        }
        patch()
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

    /**Verifica que el kilometraje enviado desde el input no sea menor al kilometraje inicial del vehiculo */
    const handleKMS = (e: ChangeEvent<HTMLInputElement>) => {
        const valueNum = Number(e.currentTarget.value);
        const kmsInicial = viajeID?.kms_inicial || 0;


        if (valueNum < kmsInicial && valueNum !== 0) {
            setErrorKms(`¡Error! Debe ser mayor o igual a ${kmsInicial} kms.`);
            setFormFin((prev) => ({ ...prev, kms_fin: valueNum }));
        } else {

            setFormFin((prev) => ({ ...prev, kms_fin: valueNum }));
            setErrorKms(null);
        }
    };

    /*
    Vista fin cierre bitacora
        >inputs que recolectan la informacion de cierre
        >Check por si se realiza carga de combustible -> 
            >1 --> Señala que si se realizo y se pide informacion
            >0 --> Quedan vacios
        >Se pide confirmacion para cerrar el proceso-->se guardan los datos finales y viaje queda en estado false indicando que el viaje ya no esta activo
    */
    return (
        <div>
            <NavBar type={0} texto="" />
            <div className="formularioFin">
                <div className="gridInput">
                    <div className="itemInput">
                        <label>Llegada</label>
                        {/**Fecha hora llegada < fecha hora inicio */}
                        <input
                            style={{ borderColor: errorKms ? 'red' : '' }}
                            name="time"
                            type="time"
                            value={timeNow}
                            disabled
                        >
                        </input>
                        {errorDate && (
                            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                {errorDate}</span>
                        )}
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
                {!previewFin && (
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                            <button style={{marginTop:"15%",backgroundColor:"#306D29", color:"white", borderRadius:"20px", border:"#306D29",height:"4vh",width:"100%"}} onClick={()=>setOpenModalFoto2(true)}>Subir imagen tablero</button>
                        </div>)}
                    {previewFin && (
                        <div>
                            <img src={previewFin} alt="tablero-fin" style={{width:"50vh",objectFit:'cover'}}></img>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                                <p style={{fontSize:'0.8rem',color:'#555'}}>Foto tablero lista</p>
                                <button style={{fontSize:"0.75rem",color:"#e53935",background:'none',border:'none',cursor:'pointer'}}   onClick={()=>{
                                        URL.revokeObjectURL(previewFin)
                                        setPreviewFin(null)
                                        setArchivo(null)
                                    }}>Quitar</button>
                            </div>
                        </div>
                    )}
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

                {formFin.carga_combustible && !previewComprobante && (
                    <>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                            <p>Comprobante</p>
                            <button style={{marginTop:"15%",backgroundColor:"#306D29", color:"white", borderRadius:"20px", border:"#306D29",height:"4vh",width:"100%"}} onClick={() => setOpenModalFoto(true)}>sube tu Comprobante aquí</button>
                        </div>
                    </>
                )}
                {previewComprobante && (
                    <div>
                        <img style={{width:"50vh",objectFit:'cover'}} src={previewComprobante} alt="comprobante"></img>
                        <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                            <p style={{fontSize:'0.8rem',color:'#555'}}>Foto tablero lista</p>
                                    <button style={{fontSize:"0.75rem",color:"#e53935",background:'none',border:'none',cursor:'pointer'}} onClick={()=>{
                                        URL.revokeObjectURL(previewComprobante)
                                        setPreviewComprobante(null)
                                        setArchivoComprobante(null)
                                    }}>Quitar</button>
                        </div>
                    </div>
                )}

            </div>
            <div className="gridButton">
                <button className="botonPasoFin" onClick={() => volverProceso()}>Volver</button>
                <button className="botonPasoFin2" onClick={() => setOpenModal(true)}>Finalizar viaje</button>
            </div>

            {/*Dialog para confirmar el envio final del viaje*/}
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

            {/*Metodo para la subida de imagenes -> se debe limpiar el comentario de la propiedad capture para utilizar la camara de dispositivos mobiles
            si se mantiene comentada obliga a usar el sistema de archivos del dispositivo*/}
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
                        {viajeID && (
                            <ImageUploader
                                label="Captura de comprobante combustible"
                                capture="environment"
                                onArchivoReady={(file,url) =>{
                                    if(previewComprobante){
                                        URL.revokeObjectURL(previewComprobante)
                                    }
                                    setArchivoComprobante(file)
                                    setPreviewComprobante(url)
                                    setOpenModalFoto(false)
                                }}
                                onCancelar={()=>setOpenModalFoto(false)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => setOpenModalFoto(false)}>
                            Continuar
                        </Button>
                        <Button variant="plain" color="danger" onClick={() => setOpenModalFoto(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/**Lo mismo que el metodo anterior pero centrada a la captura del tablero */}
            <Modal open={modalFoto2} onClose={() => setOpenModalFoto2(false)}>
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
                        {viajeID && (
                            <ImageUploader
                                capture="environment"
                                label="Captura de tablero vehículo"
                                //capture="environment"
                                onArchivoReady={(file,url)=>{
                                    if(previewFin){
                                        URL.revokeObjectURL(previewFin)
                                    }
                                    setArchivo(file)
                                    setPreviewFin(url)
                                    setOpenModalFoto2(false)
                                }}
                                onCancelar={()=>setOpenModalFoto2(false)}
                            />
                        )}
                    </DialogContent>
                </ModalDialog>
            </Modal>


        </div>
    )
}
export default cierreViaje