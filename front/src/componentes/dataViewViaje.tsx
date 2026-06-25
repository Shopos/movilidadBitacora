import { useState } from 'react'

import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,Button} from "@mui/joy"
import MapSharpIcon from '@mui/icons-material/MapSharp';
import LocalGasStationSharpIcon from '@mui/icons-material/LocalGasStationSharp';
import SpeedSharpIcon from '@mui/icons-material/SpeedSharp';

import type {Viaje} from "../tipos/tipoSistema"
import MapaPreview from "../componentes/mapa"

export interface prop{
    viajeSelected:Viaje
    modo:number
}

/**Componente para mostrar la informacion de una bitacora asociada a un viaje
 * 
 * La vista del mismo se adapto para asemejarse a la bitacora fisica actual
 * 
 */
function dataViewViaje({viajeSelected,modo}:prop ) {

    const [modalMapa,openModalMapa] = useState<boolean>(false)
    let kms_inicio = viajeSelected.kms_inicial 
    let kms_fin = viajeSelected.kms_fin
    let fechaInicio = viajeSelected.fecha_hora_inicio
    let fechaFin = viajeSelected.fecha_hora_fin
    return (
        <>
        {modo===0 ? 
        (
            <div className="modalDataBitacora">
            Bitácora vehículo
            <label style={{ display: "flex", flexDirection: "row", width: "100%" }}>Fecha: {fechaInicio.slice(0,10)}</label>
            <div className="modalDataItemRow">
                <div className="item">
                    <label>Vehículo:  </label>{viajeSelected?.vehiculo}
                </div>
                <div className="item">
                    <label>Patente Vehículo: </label>{viajeSelected?.patente}
                </div>
            </div>
            <div className="modalDataItemRow">
                <label>Salida: {fechaInicio.slice(11,19)}</label>
                <label>KMS: {kms_inicio}</label>
                <label>Llegada: </label>{viajeSelected.fecha_hora_fin ? (<>{fechaFin.slice(0,10)}<span>{fechaFin.slice(11,19)}</span></>):("-")}
                <label>KMS:  {kms_fin}</label>
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>Destino: </span>{viajeSelected.destino}
                </div>
                <div className="modalDataItemRow">
                    <span>Funcionario: </span>{viajeSelected?.nombre_funcionario}
                </div>
                <div className="modalDataItemRow">
                    <span>Motivo: </span>{viajeSelected?.motivo}
                </div>
            </div>
            <div className="modalDataItemRow">
                <span>Carga combustible: </span>{viajeSelected?.carga_combustible ? "Si":"No"}
                <span>Cantidad: </span>{viajeSelected.carga_combustible ? viajeSelected?.cantidad_carga : "No carga combustible"}
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>Observaciones: </span>{viajeSelected?.obs_viaje}
                </div>
                <div>
                    <span>Estado del viaje: </span>{viajeSelected?.estado_viaje == true ? "En proceso" : "Terminado"}
                </div>
            </div>
            <div style={{display:"flex",flexDirection:"row", gap:"0.5%", marginTop:"1%"}}>
                <Button startDecorator={<SpeedSharpIcon/>}>Comprobante tablero</Button>
                {viajeSelected.carga_combustible ? 
                (<Button startDecorator={<LocalGasStationSharpIcon />}>Comprobante carga</Button>):(<></>)
                }
                <Button startDecorator={<MapSharpIcon />} onClick={() => openModalMapa(true)}>
                    Mapa de la ruta seguida
                </Button>
            </div>


             
        </div> ) 
        : (
            <div className="modalDataBitacora">
            Edición de bitácora
            <label style={{ display: "flex", flexDirection: "row", width: "100%" }}>Fecha: {fechaInicio.slice(0,10)}</label>
            <div className="modalDataItemRow">
                <div className="item">
                    <label>Vehículo:  </label>{viajeSelected?.vehiculo}
                </div>
                <div className="item">
                    <label>Patente Vehículo: </label>{viajeSelected?.patente}
                </div>
            </div>
            <div className="modalDataItemRow">
                <label>Salida: {fechaInicio.slice(11,19)}</label>
                <label>KMS: {kms_inicio}</label>
                <label>Llegada: </label>{viajeSelected.fecha_hora_fin ? (<>{fechaFin.slice(0,10)}<span>{fechaFin.slice(11,19)}</span></>):("-")}
                <label>KMS:  {kms_fin}</label>
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>Destino: </span>{viajeSelected?.destino}
                </div>
                <div className="modalDataItemRow">
                    <span>Funcionario: </span>{viajeSelected?.nombre_funcionario}
                </div>
                <div className="modalDataItemRow">
                    <span>Motivo: </span>{viajeSelected?.motivo}
                </div>
            </div>
            <div className="modalDataItemRow">
                <span>Carga combustible: </span>{viajeSelected?.carga_combustible ? "Si":"No"}
                <span>Cantidad: </span>{viajeSelected.carga_combustible ? viajeSelected?.cantidad_carga : "No carga combustible"}
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>Observaciones: </span>{viajeSelected?.obs_viaje}
                </div>
                <div>
                    <span>Estado del viaje: </span>{viajeSelected.estado_viaje === true ? "En proceso" : "Terminado"}
                </div>
            </div>
            <div className="rowButtons-modal">
                <Button startDecorator={<SpeedSharpIcon/>}>Comprobante tablero</Button>
                {viajeSelected.carga_combustible ? 
                (<Button startDecorator={<LocalGasStationSharpIcon />}>Comprobante carga</Button>):(<></>)
                }
                <Button startDecorator={<MapSharpIcon />} onClick={() => openModalMapa(true)}>
                    Mapa de la ruta seguida
                </Button>
            </div> 
            </div>
        )}

         <Modal  open={modalMapa} onClose={() => openModalMapa(false)} >
            <ModalDialog variant="outlined" size="lg" >
                <DialogTitle>
                    Viaje 
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ minWidth:"90%"}}>
                   
                    {viajeSelected?.lat_inicio!== null && viajeSelected?.lng_inicio!== null && viajeSelected?.lat_fin!== null && viajeSelected?.lng_fin!== null &&(
                        <MapaPreview puntoI={{ lat: viajeSelected!.lat_inicio, lng: viajeSelected!.lng_inicio }} puntoD={{ lat: viajeSelected!.lat_fin, lng: viajeSelected!.lng_fin }} interaction={true} />
                    )}
                   
                </DialogContent>
            </ModalDialog>
        </Modal>  
        </>
    )
}
export default dataViewViaje