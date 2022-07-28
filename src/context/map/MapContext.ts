import { createContext } from 'react';
import { Map, Marker } from 'mapbox-gl';

interface MapContextProps {
  isActiveRoute: boolean,
  isMapReady: boolean,
  map ?: Map,
  markers: Marker[],
  addMarker: (coords: { lng: number, lat: number }) => void
  getRoute: (start: [number, number], end: [number, number]) => Promise<any>
  removeActiveRoute: () => void,
  setMap: (map: Map) => void,
}

export const MapContext = createContext({} as MapContextProps)