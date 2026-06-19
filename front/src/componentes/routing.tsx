import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface GPS {
  lat: number;
  lng: number;
  alt?: number; 
}

interface RoutingProps {
  point1: GPS;
  point2: GPS;
}
/*Muestra la ruta entre dos puntos --> start dentro del plan siendo el punto inicial y end siendo el punto destino */
function Routing({ point1, point2 }: RoutingProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !point1 || !point2) return;

    const start = L.latLng(point1.lat, point1.lng);
    const end = L.latLng(point2.lat, point2.lng);

    const routingControl = L.Routing.control({
      waypoints: [start, end],
      plan: L.Routing.plan([start,end],{
        createMarker: (i:number,wp:any,nwps:number) => {return false}
      }),
      showAlternatives:false,
      routeWhileDragging: false,
      show: false,
      addWaypoints: true,
    }).addTo(map);
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, point1.lat, point1.lng, point2.lat, point2.lng]); 

  return null;
}

export default Routing;
