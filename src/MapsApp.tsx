import React from 'react'

// Context
import { MapProvider, PlacesProvider } from './context';

// Pages
import { Home } from './pages';

// Styles
import './styles/styles.css'

export const MapsApp = () => {
  return (
    <PlacesProvider>
      <MapProvider>
        <Home />
      </MapProvider>
    </PlacesProvider>
  )
}
