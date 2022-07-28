import axios from 'axios'

const reverseAPI = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  params: {
    language: 'es',
    access_token: import.meta.env.VITE_APP_MAP_BOX_TOKEN
  }
})

export default reverseAPI