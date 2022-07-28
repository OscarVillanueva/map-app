import { PlacesState } from "./PlacesProvider";
import { Feature } from '../../interfaces/places';

type PlacesAction = 
  | { type: 'SET_LOCATION', payload: [ number, number ] }
  | { type: 'SET_MARKER_PLACE', payload: Feature }
  | { type: 'SET_PLACES_LOADING' }
  | { type: 'SET_PLACES', payload: Feature[] }
  | { type: 'TOGGLE_LOADING_PLACES' }

export const placesReducer = (state: PlacesState, action: PlacesAction) : PlacesState => {
  
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        isLoading: false,
        userLocation: action.payload
      }

    case 'SET_PLACES': 
      return {
        ...state,
        isLoadingPlaces: false,
        isMarkerPlace: false,
        places: action.payload
      }

    case 'SET_PLACES_LOADING':
      return {
        ...state,
        isLoadingPlaces: true,
        places: []
      }

    case 'TOGGLE_LOADING_PLACES':
      return {
        ...state,
        isLoadingPlaces: !state.isLoadingPlaces
      }

    case 'SET_MARKER_PLACE': 
      return {
        ...state,
        isMarkerPlace: true,
        places: [ action.payload, ...state.places ]
      }
  
    default: 
      return { ...state }
  }

}