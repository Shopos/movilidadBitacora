import { useState } from 'react'

import { Modal, ModalDialog, DialogTitle,Divider,DialogContent,Button} from "@mui/joy"
import MapSharpIcon from '@mui/icons-material/MapSharp';
import LocalGasStationSharpIcon from '@mui/icons-material/LocalGasStationSharp';
import SpeedSharpIcon from '@mui/icons-material/SpeedSharp';

import "../estilos/dataViewViaje.css"

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
    return (
        <>
        {modo===0 ? 
        (
            <div className="modalDataBitacora">
            Bitácora vehículo
            <label style={{ display: "flex", flexDirection: "row", width: "100%" }}>Fecha: {viajeSelected.fecha_hora_inicio ? viajeSelected.fecha_hora_inicio.slice(0,10):"-"}</label>
            <div className="modalDataItemRow">
                <div className="item">
                    <label>Vehículo:  </label>{viajeSelected?.vehiculo}
                </div>
                <div className="item">
                    <label>Patente Vehículo: </label>{viajeSelected?.patente}
                </div>
            </div>
            <div className="modalDataItemRow">
                <label>Salida: {viajeSelected.fecha_hora_inicio ? viajeSelected.fecha_hora_inicio.slice(11,19) : "-" }</label>
                <label>KMS: {viajeSelected.kms_inicial}</label>
                <label>Llegada: </label>{viajeSelected.fecha_hora_fin ? (<>{viajeSelected.fecha_hora_fin.slice(0,10)}<span>{viajeSelected.fecha_hora_fin.slice(11,19)}</span></>):("-")}
                <label>KMS:  {viajeSelected.kms_fin ? viajeSelected.kms_fin : 0}</label>
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
                    <span>Estado del viaje: </span>{viajeSelected?.estado_viaje ? "En proceso" : "Terminado"}
                </div>
            </div>
            <div className='modalDataItemCol'>
                <Button startDecorator={<SpeedSharpIcon/>}>Comprobante tablero</Button>
                {viajeSelected.carga_combustible ? 
                (<Button startDecorator={<LocalGasStationSharpIcon />}>Comprobante carga</Button>):(<></>)
                }
                <Button startDecorator={<MapSharpIcon />} onClick={() => openModalMapa(true)}>
                    Mapa de la ruta seguida
                </Button>
            </div>


             
        </div> ) 
        : 
        /*Editar bitacora
            -> viaje en espera
                -Vehiculo
                -Funcionario (Disponible ? -En espera- : -Disponible-)
                -Destino
                -Motivo
            -> viaje terminado
                -!Vehiculo usado
                -!Funcionario 
                -!Destino
                *Motivo, observaciones (-deja rastro)

        */
        (

            <div className="modalDataBitacora">
            Edición de bitácora
            <label style={{ display: "flex", flexDirection: "row", width: "100%" }}>Fecha: {viajeSelected?.fecha_hora_inicio ? viajeSelected?.fecha_hora_inicio.slice(0,10):'-'}</label>
            <div className="modalDataItemRow">
                <div className="item">
                    <label>Vehículo:  </label>{viajeSelected?.vehiculo}
                </div>
                <div className="item">
                    <label>Patente Vehículo: </label>{viajeSelected?.patente}
                </div>
            </div>
            <div className="modalDataItemRow">
                <label>Salida: {viajeSelected?.fecha_hora_inicio ? viajeSelected?.fecha_hora_inicio.slice(11,19) : "-"}</label>
                <label>KMS: {viajeSelected?.kms_inicial ? viajeSelected.kms_inicial : 0}</label>
                <label>Llegada: </label>{viajeSelected?.fecha_hora_fin ? (<>{viajeSelected.fecha_hora_fin.slice(0,10)}<span>{viajeSelected.fecha_hora_fin.slice(11,19)}</span></>):("-")}
                <label>KMS:  {viajeSelected?.kms_fin ? viajeSelected.kms_fin : 0}</label>
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
                <span>Cantidad: </span>{viajeSelected?.carga_combustible ? viajeSelected?.cantidad_carga : "No carga combustible"}
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>Observaciones: </span>{viajeSelected?.obs_viaje}
                </div>
                <div>
                    <span>Estado del viaje: </span>{viajeSelected?.estado_viaje}
                </div>
            </div>
            <div className="rowButtonsView">
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