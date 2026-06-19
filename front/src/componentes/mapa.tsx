import 'leaflet/dist/leaflet.css';
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import {useEffect} from 'react';
import Routing from "./routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/
import "../estilos/mapa.css"
type GPS = {
    lat: number,
    lng: number
}
interface prop{
    points: GPS[]
}
export interface propsComponent{
    puntoI: GPS,
    puntoD:GPS,
    interaction: boolean
}

/*Componente mapa muestra los puntos Inicio y Destino
Inicio con Marker color Azul
Destino con Marker color Verde

la funcion FitBounds centra la vista del mapa para ajustarse al medio de los dos puntos al igual del zoom necesario para mostrar dichos puntos
*/
function mapaProp({puntoD, puntoI,interaction}:propsComponent) {
    /*Funcion para dar colores especificos a los Marker de leaflet y poder diferenciar punto de inicio y destino */
    const points = [puntoI,puntoD]
    const createCustomIcon = (color: string) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
                background-color: ${color};
                width: 24px;
                height: 24px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                position: absolute;
                left: -12px;
                top: -12px;
                border: 2px solid white;
                "></div>`,
            iconAnchor: [0, 12]
        })
    }

    function FitBounds ({ points }: prop){
        const map = useMap()
        

        useEffect(()=>{
            const bound = points.map(p=> [p.lat,p.lng]as[number,number])
            if(points.length > 0 ){
                map.fitBounds(bound,{
                    padding:[50,50],
                    maxZoom:15,
                })
            }
            
        },[map,points])
        return null
    }

    return (
        <div className="leaflet-container-mapa">
            <MapContainer center={[puntoD.lat, puntoD.lng]} zoom={18}
            dragging={interaction}
            zoomControl={interaction}
            doubleClickZoom={interaction}
            touchZoom={interaction}
            className="leaflet-container-mapa"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                    subdomains="abcd"
                    minZoom={8}
                    maxZoom={18}
                />
                <Marker
                    position={[puntoI.lat, puntoI.lng]}
                    draggable={false}
                    icon={createCustomIcon("#3b40cf")}
                />
                <Marker
                    position={[puntoD.lat, puntoD.lng]}
                    draggable={false}
                    icon={createCustomIcon('#57A450')}
                >
                </Marker>
                <FitBounds points={points}></FitBounds>
                <Routing point1={puntoI} point2={puntoD} />
            </MapContainer>
        </div>
    )
}
export default mapaProp