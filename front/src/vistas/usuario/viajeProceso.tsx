import { useNavigate } from "react-router-dom"
import NavBar from "../../componentes/navBar.tsx"
import { useState,useEffect } from "react"

import Routing from "../../componentes/routing.tsx" /*Componente para marcar la ruta entre inicio y destino en mapa*/
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from "leaflet"

import "../../estilos/viajeProceso.css"

import NoCrashOutlinedIcon from '@mui/icons-material/NoCrashOutlined';

/*
    datos de las latitudes y longitudes en localStorage
*/
type GPS={
    lat:number,
    lng:number
}

interface prop{
    points: GPS[]
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

function viajeProceso(){
    //Ventana que muestra el estado del viaje, solo permite cerrar el viaje al pulsar el boton
    //Se deja debajo un recolector de coordenadas gps para determinar ruta
    //-->Envia a cierreViaje donde se recolectan datos finales y da por cerrado la recoleccion de datos
    const navigate = useNavigate()
    const finViaje = () => navigate("/cierreViaje")
    const punto1:GPS={lat:-34.695231, lng:-71.316510}
    const punto2:GPS={lat:-34.639533, lng:-71.366009}
    const points = [punto1,punto2]


    const createCustomIcon = (color:string) => {
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

   

    return(
        <>
            <NavBar type={0} texto=""/>
            <div className="cuerpoProceso">
                <div className="grupoIconMsg">  
                    <h2>Viaje en proceso</h2>
                    <NoCrashOutlinedIcon fontSize="large"/>
                </div>
                <div className="mapaProceso">
                    <MapContainer center={[punto1.lat,punto1.lng]} zoom={18}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>'
                                    subdomains="abcd"
                                    minZoom={8}
                                    maxZoom={18}
                                />
                                <Marker
                                    position={[punto2.lat, punto2.lng]}
                                    draggable={false} 
                                    icon={createCustomIcon("#3b40cf")}
                                />
                                <Marker
                                    position={[punto1.lat, punto1.lng]}
                                    draggable={false} 
                                    icon={createCustomIcon('#57A450')}
                                >
                                </Marker>
                                
                                <FitBounds points={points}></FitBounds>

                                <Routing point1={punto1} point2={punto2} />

                            </MapContainer>
                </div>
                <div className="anunciosProceso">
                    <p>Manten la vista en el camino, una vez finalizado el viaje continua el proceso de bitácora</p>
                </div>
                
                <button className="botonTerminar" onClick={()=>finViaje()}>terminar viaje</button>
            </div>
        </>
    )
}
export default viajeProceso