import { useContext, useRef, useLayoutEffect, useEffect, useState } from 'react';

// Dependencies
import { Map } from 'mapbox-gl'

// Context
import { MapContext, PlacesContext } from '../context';

// Components
import { Loading, MapActions, SearchBar, MainLogo } from './';

type Coords = {
  lat: number,
  lng: number
}

export const MapView = () => {

  const [markerPosition, setMarkerPosition] = useState<Coords | null>(null)

  // Context
  const { setMap, addMarker, isMapReady, map } = useContext( MapContext )
  const { isLoading, userLocation } = useContext( PlacesContext )

  // Referencia al contenedor del mapa
  const mapContainer = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {

    if (!isLoading) {

      prepareMap()

    }

  }, [isLoading])

  useEffect(() => {
    
    if (map) map.on('dblclick', e => {
      e.preventDefault()
      setMarkerPosition(e.lngLat)
    })

  }, [isMapReady])

  useEffect(() => {
    
    if (markerPosition) addMarker( markerPosition )

  }, [markerPosition])

  const prepareMap = () : void => {
    
    const newMap = new Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 14
    });
      
    setMap(newMap)

  }

  return isLoading 
  ? ( 
    <Loading /> 
  ) 
  :(
    <div 
      ref={ mapContainer }
      style = {{
        height: '100vh',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100vw',
      }}  
    >
      
      <MapActions />
      <MainLogo />
      <SearchBar />
    </div>
  )
}
