import { useContext } from 'react'
import { MapContext, PlacesContext } from '../../context'

export const BtnRemoveRoute = () => {

  const { removeActiveRoute } = useContext( MapContext )

  const handleClick = () : void => {
    
    removeActiveRoute()

  }

  return (
    <button
      className='btn btn-danger'
      onClick={ handleClick }
    >
      Quitar Ruta
    </button>
  )
}
