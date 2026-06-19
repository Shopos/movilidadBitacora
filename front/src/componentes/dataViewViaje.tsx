import { useState } from 'react'

import { Modal, ModalDialog, DialogTitle,Divider,DialogContent} from "@mui/joy"

import type {Viaje} from "../tipos/tipoSistema"
import MapaPreview from "../componentes/mapa"

export interface prop{
    viajeSelected:Viaje|null
}

/**Componente para mostrar la informacion de una bitacora asociada a un viaje
 * 
 * La vista del mismo se adapto para asemejarse a la bitacora fisica actual
 * 
 */
function dataViewViaje({viajeSelected}:prop ) {

    const [modalMapa,openModalMapa] = useState<boolean>(false)

    return (
        <div className="modalDataBitacora">
            Bitácora vehículo
            <label style={{ display: "flex", flexDirection: "row", width: "100%" }}>Fecha:</label>
            <div className="modalDataItemRow">
                <div className="item">
                    <label>Vehículo:  </label>{"modelo vehiculo"}
                </div>
                <div className="item">
                    <label>Patente Vehículo: </label>{viajeSelected?.patente}
                </div>
            </div>
            <div className="modalDataItemRow">
                <label>Salida: </label>{viajeSelected?.fecha_hora_inicio}
                <label>KMS: </label> {viajeSelected?.kms_inicio}
                <label>Llegada: </label>{viajeSelected?.fecha_hora_fin}
                <label>KMS:</label> {viajeSelected?.kms_fin}
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
                <span>CARGA COMBUSTIBLE: </span>{viajeSelected?.carga_combustible ? "SI":"NO"}
                <span>CANTIDAD: </span>{viajeSelected?.cantidad_combustible}
            </div>
            <div className="modalDataItemCol">
                <div className="modalDataItemRow">
                    <span>OBSERVACIONES: </span>{viajeSelected?.obs_viaje}
                </div>
                <div>
                    <span>ESTADO VIAJE: </span>{viajeSelected?.estado_viaje == true ? "EN PROCESO" : "TERMINADO"}
                </div>
            </div>
            <div className="rowTwoCol">
                <div>Comprobante tablero</div>
                <div>Comprobante carga</div>
                <div style={{ width: "100%" }} onClick={() => openModalMapa(true)}>
                    {viajeSelected?.lat_inicio!== null && viajeSelected?.lng_inicio!== null && viajeSelected?.lat_fin!== null && viajeSelected?.lng_fin!== null &&(
                        <MapaPreview puntoI={{ lat: viajeSelected!.lat_inicio, lng: viajeSelected!.lng_inicio }} puntoD={{ lat: viajeSelected!.lat_fin, lng: viajeSelected!.lng_fin }} interaction={false} />
                    )}
                </div>
            </div>


            <Modal  open={modalMapa} onClose={() => openModalMapa(false)} >
            <ModalDialog variant="outlined" size="lg" >
                <DialogTitle>
                    Viaje {viajeSelected?.id_viaje}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ minWidth:"90%",minHeight:"90vh"}}>
                   
                    {viajeSelected?.lat_inicio!== null && viajeSelected?.lng_inicio!== null && viajeSelected?.lat_fin!== null && viajeSelected?.lng_fin!== null &&(
                        <MapaPreview puntoI={{ lat: viajeSelected!.lat_inicio, lng: viajeSelected!.lng_inicio }} puntoD={{ lat: viajeSelected!.lat_fin, lng: viajeSelected!.lng_fin }} interaction={false} />
                    )}
                   
                </DialogContent>
            </ModalDialog>
        </Modal>    
        </div>
    )
}
export default dataViewViaje