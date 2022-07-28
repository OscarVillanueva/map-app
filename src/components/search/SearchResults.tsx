import { useContext, useState } from 'react'

// Types
import { Feature } from '../../interfaces/places';

// Context
import { MapContext, PlacesContext } from '../../context'

// Context
import { LoadingPlaces } from '../utils';

export const SearchResults = () => {

  const [activeID, setActiveID] = useState('')

  const { places, isLoadingPlaces, userLocation, removePlace } = useContext( PlacesContext )
  const { map, getRoute } = useContext( MapContext )

  const handlePlaceClick = (place: Feature) : void => {
    
    const [ lng, lat ] = place.center

    map?.flyTo({
      zoom: 14,
      center: [ lng, lat ]
    })

    setActiveID( place.id )

  }

  const getRouteToPlace = (place: Feature) : void => {
    
    if (!userLocation) return

    const [ lng, lat ] = place.center

    getRoute(userLocation, [ lng, lat ])

  }

  return isLoadingPlaces 
  ? (
    <LoadingPlaces />
  ) 
  : (
    <ul className={`list list-group ${places.length === 0 ? 'd-none' : 'd-block mt-3'}`}>
      {places.map(place => (
        <li 
          key={place.id}
          className={`list-group-item list-group-item-action pointer 
            ${ activeID === place.id ? 'active' : ''}`
          }
          onClick={ () => handlePlaceClick(place) }
        >
          <h6>{ place.text_es || place.text }</h6>
          <p
            style={{ fontSize: '12px' }} 
            className={`${ activeID === place.id ? 'text-reset' : 'text-muted'}`}
          >
            { place.place_name }
          </p>
          <div className="d-flex justify-content-between">
            <button
              className={`btn ${ activeID === place.id ? 'btn-dark' : 'btn-outline-primary'} btn-sm`}
              onClick = { (e) => {
                e.stopPropagation()
                getRouteToPlace(place) 
              }}
            >
              Direcciones
            </button>
            <button
              className={`btn ${ activeID === place.id ? 'btn-warning' : 'btn-outline-danger'} btn-sm`}
              onClick = { (e) => {
                e.stopPropagation()
                removePlace(place.id)
              }}
            >
              Quitar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
