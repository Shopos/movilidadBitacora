import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import "leaflet-geosearch/dist/geosearch.css"
import { useEffect } from "react"
import { useMap } from "react-leaflet"


interface Props{
    onResult:(lat:number,lng:number,destino:string)=>void
}
/*Componente para la busqueda de locaciones dentro del mapa
*Se usa el provedor de OpenStreetMaps para el prototipo del sistema, se puede cambiar el provedor a otro si es necesario
*/
function geocodeBuscador({onResult}:Props){
    const map = useMap()
    useEffect(()=>{
    
        const control = GeoSearchControl({
            provider: new OpenStreetMapProvider({
                params:{
                'accept-language': 'es',
                countrycodes:'cl',
                addressdetails:1,
                limit: 3
            }
            }),
            style:"bar",
            showMarker:false,
            autoClose:true,
            keepResult:true,
            searchLabel:"Buscar calle o lugar"
        })

        map.addControl(control)
        const handleResultado = (event:any) =>{
            const result = event.location
            console.log(result.label)
            onResult(event.location.y,event.location.x,result.label)
        }
        map.on("geosearch/showlocation",handleResultado)
        
        return()=>{
            map.removeControl(control)
            map.off("geosearch/showlocation",handleResultado)
        }
    },[map,onResult])
    return null
}

export default geocodeBuscador