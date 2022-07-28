import { FC, ReactNode, useReducer, useEffect } from 'react'
import { PlacesContext } from "./PlacesContext"
import { placesReducer } from './PlacesReducer'
import { getUserLocation } from '../../helpers/getUserLocation';
import { reverseAPI, searchAPI } from '../../apis';
import { PlacesResponse, Feature } from '../../interfaces/places';

export interface PlacesState {
  isLoading: boolean,
  userLocation ?: [ number, number ],
  isLoadingPlaces: boolean,
  places: Feature[],
  isMarkerPlace: boolean,
}

const INITIAL_STATE : PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
  isMarkerPlace: false
}

type PlacesProviderProps = {
  children ?: ReactNode
}

export const PlacesProvider: FC<PlacesProviderProps> = ({ children }) => {

  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE)

  useEffect(() => {
    
    getUserLocation()
      .then( lngLat => dispatch({ type: 'SET_LOCATION', payload: lngLat }) )

  }, [])

  const searchPlacesByTerm = async (query: string) : Promise<Feature[]> => {
    
    if (!query.trim() || !state.userLocation) {
      dispatch({ type: 'SET_PLACES', payload: [] })
      return []
    }

    dispatch({ type: 'SET_PLACES_LOADING' })

    try {
      
      const response = await searchAPI.get<PlacesResponse>(`/${query}.json`, {
        params: {
          proximity: state.userLocation.join(',')
        }
      })
  
      dispatch({ type: 'SET_PLACES', payload: response.data.features })
  
      return response.data.features

    } catch (error) {
      console.log(error)
      return []
    }

  }

  const getMarkerDescription = async (lng: number, lat: number) : Promise<Feature> =>{
    try {
      
      dispatch({ type: 'TOGGLE_LOADING_PLACES' })

      const response = await reverseAPI.get<PlacesResponse>(`/${lng},${lat}.json`)
  
      const address = response.data.features[0]
  
      if (!address) throw new Error("");
  
      dispatch({ type: 'SET_MARKER_PLACE', payload: address })

      return address

    } catch (error) {

      throw new Error("");

    } finally {
      dispatch({ type: 'TOGGLE_LOADING_PLACES' })
    }
  }

  const removePlace = (id: string) : void => {
    
    const newPlaces = state.places.filter( place => place.id !== id )
    dispatch({ type: 'SET_PLACES', payload: newPlaces })

  }

  return (
    <PlacesContext.Provider value = {{
      ...state,
      searchPlacesByTerm,
      getMarkerDescription,
      removePlace
    }}>
      { children }
    </PlacesContext.Provider>
  )
}
