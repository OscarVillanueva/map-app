import { useContext } from 'react'

// Contexts
import { MapContext } from '../../context'

// Components
import { BtnCenterLocation } from './BtnCenterLocation'
import { BtnRemoveRoute } from './BtnRemoveRoute'

export const MapActions = () => {

  const { isActiveRoute } = useContext( MapContext )

  return (
    <div
      className='d-flex flex-column'
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999,
        gap: '1rem'
      }}
    >
      <BtnCenterLocation />

      { isActiveRoute && (
        <BtnRemoveRoute />
      )}
    </div>
  )
}
