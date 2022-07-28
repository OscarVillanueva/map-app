import React from 'react'

// Assets
import logo from '../../assets/react.svg'

export const MainLogo = () => {
  return (
    <img 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '80px',
        zIndex: 999,
      }}
      src = { logo } 
      alt = 'react logo'
    />
  )
}
