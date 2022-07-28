import axios from 'axios'

const directionsAPI = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  params: {
    alternatives: false,
    geometries: 'polyline6',
    overview: 'simplified',
    steps: false,
    access_token: import.meta.env.VITE_APP_MAP_BOX_TOKEN
  }
})

export default directionsAPI