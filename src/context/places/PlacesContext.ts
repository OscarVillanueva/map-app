import { createContext } from 'react';
import { Feature } from '../../interfaces/places';

export interface PlacesContextProps {
  isLoading: boolean,
  userLocation ?: [number, number],
  isLoadingPlaces: boolean,
  places: Feature[],
  isMarkerPlace: boolean,
  removePlace: (id: string) => void,
  searchPlacesByTerm: (query: string) => Promise<Feature[]>
  getMarkerDescription: (lng: number, lat: number) => Promise<Feature>
}

export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps)
