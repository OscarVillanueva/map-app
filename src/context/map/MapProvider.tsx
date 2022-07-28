import { useReducer, ReactNode, useContext, useEffect } from 'react';

// Dependencies
import { AnySourceData, LngLatBounds, Map, Marker, Popup } from 'mapbox-gl';
import polyline from '@mapbox/polyline';

// Types
import { DirectionsResponse } from '../../interfaces/directions';

// HTTP Clients
import { directionsAPI } from '../../apis';

// Context
import { MapContext } from './MapContext';
import { MapReducer } from './MapReducer';
import { PlacesContext } from '../';

export interface MapState {
  isMapReady: boolean,
  map ?: Map,
  markers: Marker[],
  isActiveRoute: boolean
}

const INITIAL_STATE = {
  isMapReady: false,
  map: undefined,
  markers: [],
  isActiveRoute: false,
}

type MapProviderProps = {
  children: ReactNode
}

export const MapProvider = ({ children }: MapProviderProps) => {

  const [state, dispatch] = useReducer(MapReducer, INITIAL_STATE)
  const { 
    places, 
    userLocation, 
    isMarkerPlace, 
    getMarkerDescription 
  } = useContext( PlacesContext )

  useEffect(() => {
    
    if (!state.map || isMarkerPlace) return

    // Quitamos los marcadores
    state.markers.forEach( marker => marker.remove() )

    const newMarkers: Marker[] = []

    for (const place of places) {
      
      const [ lng, lat ] = place.center
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text_es}</h6>
          <p>${place.place_name_es || place.place_name}</p>
        `)

      const newMarker = new Marker()
        .setPopup( popup )
        .setLngLat([ lng, lat ])
        .addTo( state.map )

      newMarkers.push(newMarker)

    }

    dispatch({ type: 'SET_MARKERS', payload: newMarkers })

  }, [places])

  /**
   * It sets the map state to the map passed in.
   * @param {Map} map - Map - The map object that you want to set.
   */
  const setMap = (map: Map) : void => {

    // Pop up describer
    const locationPopUp = new Popup()
      .setHTML(`
        <h4>Aquí estoy</h4>
        <p>En algún lugar del mundo</p>
      `)

    // Le agregamos un marcador
    new Marker({  color: '#61DAFB' })
      .setLngLat( map.getCenter() )
      .setPopup( locationPopUp )
      .addTo(map)

    dispatch({ type: 'SET_MAP', payload: map })
  }

  
  /**
   * It takes two coordinates, makes a request to the Mapbox API, and then draws a line on the map
   * @param start - [number, number]
   * @param end - [number, number]
   */
  const getRoute = async (start: [number, number], end: [number, number]) : Promise<any> => {
    
    try {

      const response = await directionsAPI.get<DirectionsResponse>(
        `/${start.join(',')};${end.join(',')}`
      )

      const { distance, duration, geometry } = response.data.routes[0]

      let kms = Math.round(distance / 1000).toFixed(2)
      let minutes = Math.floor(duration / 60)
      console.log({ kms, minutes })

      // Decodificamos la polyline6 a coords [lat, lng] 
      const coords = polyline.decode( geometry, 6 )

      // Arreglo para pasar de [lat, lng] -> [lng, lat]
      const reversedCoords: [number, number][] = []

      // Mover el mapa para poder contener el punto inicial
      const bounds = new LngLatBounds(start, start)

      for (const coord of coords) {
        
        const newCoord: [number, number] = [ coord[1], coord[0] ]
        bounds.extend(newCoord)
        reversedCoords.push(newCoord)

      }

      state.map?.fitBounds(bounds, { padding: 200 })

      // Polyline
      const sourceData : AnySourceData = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: reversedCoords
              }
            }
          ]
        }
      }

      if (state.map?.getLayer('RouteString')) {
        state.map.removeLayer('RouteString')
        state.map.removeSource('RouteString')
      }

      state.map?.addSource('RouteString', sourceData)
      state.map?.addLayer({
        id: 'RouteString',
        type: 'line',
        source: 'RouteString',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#61DAFB',
          'line-width': 3
        }
      })

      dispatch({ type: 'SET_IS_ACTIVE_ROUTE', payload: true })
      
    } catch (error) {
      console.log(error)
      return
    }
    
  }

  /**
   * It removes the route from the map
   * @returns A function that removes the active route from the map.
   */
  const removeActiveRoute = () : void => {
    
    if (!state.map?.getLayer('RouteString')) return 
    
    state.map.removeLayer('RouteString')
    state.map.removeSource('RouteString')

    dispatch({ type: 'SET_IS_ACTIVE_ROUTE', payload: false })

    state.map.flyTo({
      zoom: 14,
      center: userLocation
    })

  }

  const addMarker = (coords: { lng: number, lat: number }) : void => {
    
    if (!state.map) return 
    
    const marker = new Marker()
    marker.setLngLat(coords).addTo( state.map )

    // Lo agregamos al state de markers
    const newMarkers = state.markers.concat([ marker ])
    dispatch({ type: 'SET_MARKERS', payload: newMarkers })

    getMarkerDescription(coords.lng, coords.lat)
      .then(response => {

        const popup = new Popup()
        .setHTML(`
          <h6>${response.text_es}</h6>
          <p>${response.place_name_es || response.place_name}</p>
        `)

        marker.setPopup(popup)

      })
      .catch(console.log)

  }

  return (
    <MapContext.Provider value = {{
      ...state,
      addMarker,
      getRoute,
      removeActiveRoute,
      setMap,
    }} >
      { children }
    </MapContext.Provider>
  )
}
