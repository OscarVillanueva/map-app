import { useContext } from 'react'
import { MapContext, PlacesContext } from '../../context'

export const BtnCenterLocation = () => {

  const { isMapReady, map } = useContext( MapContext )
  const { userLocation } = useContext( PlacesContext )

  const handleClick = () : void => {
    
    if (!isMapReady || !userLocation) return 

    map?.flyTo({
      zoom: 14,
      center: userLocation
    })

  }

  return (
    <button 
      className='btn btn-primary'
      onClick={ handleClick }
    >
      Mi Ubicación
    </button>
  )
}
