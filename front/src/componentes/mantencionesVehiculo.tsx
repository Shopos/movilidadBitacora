import type { mantencionProp, Mantencion } from "../tipos/tipoSistema"
import { useEffect, useState } from 'react'
import { getMantencionesVehiculo } from "../utils/auxiliar"
import "../estilos/mantencionesVehiculo.css"

const getListaMantencionesVehiculo = async (patente: string) => {
    try {
        const respuesta: Mantencion[] = await getMantencionesVehiculo(patente)
        if (respuesta) {
            return respuesta
        }
    } catch (e) {
        console.error({ msg: "error buscando las mantenciones del vehiculo" })
    }
    return []
}

/* Componente para mostrar la informacion de las mantenciones de un vehiculo en particular
    Este componente trabaja en conjunto con el modal de mostrar informacion de un vehiculo, por tanto
    muestra las mantenciones de dicho vehiculo en particular
*/

function mantencionesVehiculo({ patenteBuscada }: mantencionProp) {

    const [mantenciones, setMantenciones] = useState<Mantencion[]>()
    const [cargando, setCargando] = useState<boolean>(false)

    useEffect(() => {
        
        const setData = async() =>{
            setCargando(true)
            const data  = await getListaMantencionesVehiculo(patenteBuscada)
            if(data){
                setMantenciones(data)
            }
            setCargando(false)
        }
        setData()
    }, [patenteBuscada])


    if (cargando) {
        return <>Cargando mantenciones...</>
    }
    if (!mantenciones || mantenciones.length === 0) {
        return <>No se encontraron mantenciones</>
    }
    return (
        <div className="listaMantenciones">
            {mantenciones.map((mnt: Mantencion) => (
                <div key={mnt.id_mantencion} className="mantencionItem" style={{ marginBottom: '15px' }}>
                    <label>Mantención N°{mnt.id_mantencion}</label>
                    <br/>
                    <label>Última mantención: {mnt.ultima_mantencion.slice(0,10)}</label>                    
                    <label>Último cambio de aceite: {mnt.ultimo_cambio_aceite.slice(0,10)}</label>
                    <label>Taller: {mnt.taller}</label>
                    <label>Detalles: {mnt.detalle_mantencion}</label>
                </div>
            ))}
        </div>
    )

}

export default mantencionesVehiculo