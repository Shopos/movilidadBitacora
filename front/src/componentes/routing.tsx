import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface GPS {
  lat: number;
  lng: number;
  alt?: number; 
}
interface RouteData {
  distance: number;
  duration: number;
}
interface RoutingProps {
  point1: GPS;
  point2: GPS;
  option: boolean;
  color?: string;
  setRouteInfo?: (info: RouteData) => void;
}

function Routing({ point1, point2, setRouteInfo, option, color = "#24A0ED" }: RoutingProps) {
  const map = useMap();
  const [gpsStart, setGpsStart] = useState<L.LatLng | null>(null);
  
  // Usamos una referencia para el marcador del GPS para poder moverlo o quitarlo fácilmente
  const gpsMarkerRef = useRef<L.Marker | null>(null);

  const gpsIcon = L.divIcon({
    className: 'custom-gps-marker',
    html: `<div style="
      background-color: #007AFF; 
      width: 14px; 
      height: 14px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 0 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [20,20],
    iconAnchor: [10, 10]
  });

  useEffect(() => {
    if (!option) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = L.latLng(latitude, longitude);
        
        setGpsStart(newCoords);
        map.setView(newCoords, map.getZoom()); // Mantiene el zoom actual del usuario

        if (gpsMarkerRef.current) {
          gpsMarkerRef.current.setLatLng(newCoords);
        } else {
          gpsMarkerRef.current = L.marker(newCoords, { icon: gpsIcon }).addTo(map);
        }
      },
      (error) => console.error("Error de GPS:", error.message),
      { 
        enableHighAccuracy: true, 
        maximumAge: 0,
        timeout: 10000 
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (gpsMarkerRef.current) {
        gpsMarkerRef.current.remove();
        gpsMarkerRef.current = null;
      }
    };
  }, [option, map]);

  useEffect(() => {
    if (!map) return;

    let startPoint: L.LatLng | null = null;
    if (option) {
      if (!gpsStart) return; 
      startPoint = gpsStart;
    } else {
      if (!point1) return;
      startPoint = L.latLng(point1.lat, point1.lng);
    }

    const endPoint = L.latLng(point2.lat, point2.lng);

    const routingControl = L.Routing.control({
      waypoints: [startPoint, endPoint],
      plan: L.Routing.plan([startPoint, endPoint], {
        createMarker: () => false 
      }),
      showAlternatives: false,
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: color, opacity: 0.8, weight: 6 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      }
    })
    .on('routesfound', (e) => {
      const routes = e.routes;
      if (routes && routes[0]) {
        const summary = routes[0].summary;
        const distanceKms = parseFloat((summary.totalDistance / 1000).toFixed(1));
        const timesMinutes = Math.round(summary.totalTime / 60);

        if (setRouteInfo) {
          setRouteInfo({ distance: distanceKms, duration: timesMinutes });
        }
      }
    })
    .addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, point1.lat, point1.lng, point2.lat, point2.lng, gpsStart, option, color, setRouteInfo]);

  return null;
}

export default Routing;
