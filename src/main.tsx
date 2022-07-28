import React from 'react'
import ReactDOM from 'react-dom/client'
import mapBoxGL from 'mapbox-gl'

import { MapsApp } from './MapsApp';

if (!navigator.geolocation) {
  alert('Tu navegador no tiene opción de geolocation')
  throw new Error("Tu navegador no tiene opción de geolocation");
}

mapBoxGL.accessToken = import.meta.env.VITE_APP_MAP_BOX_TOKEN;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>
)
