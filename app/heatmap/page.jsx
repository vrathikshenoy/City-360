'use client'

import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { GoogleMap, HeatmapLayer, useJsApiLoader } from '@react-google-maps/api'

const mapContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

const fetchCoordinates = async (setCoordinates) => {
  try {
    const { data, error } = await supabase
    .from('listing')
    .select('coordinates')
    .eq('active', true)

    if (error) {
      console.error('Error fetching coordinates:', error)
      return
    }

    const parsedCoordinates = data.map(item => {
      if (typeof item.coordinates === 'string') {
        const [lat, lng] = item.coordinates.split(',').map(Number)
        return isNaN(lat) || isNaN(lng) ? null : { lat, lng }
      } else if (typeof item.coordinates === 'object' && item.coordinates !== null) {
        return item.coordinates
      }
      return null
    }).filter(coord => coord !== null)

    setCoordinates(parsedCoordinates)
  } catch (error) {
    console.error('Error fetching coordinates:', error)
  }
}

const Heatmap = () => {
  const [coordinates, setCoordinates] = useState([])
  const [map, setMap] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('ldrs').then(ldrs => {
        ldrs.grid.register()
      })
    }
    fetchCoordinates(setCoordinates).then(() => setIsDataLoaded(true))
  }, [])

  const center = coordinates.length > 0 ? coordinates[0] : { lat: 37.782, lng: -122.445 }

  if (!isMapLoaded || !isDataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          {typeof window !== 'undefined' && (
            <l-grid
              size="60"
              speed="1.5"
              color="black"
            ></l-grid>
          )}
          <p className="mt-4 text-lg font-semibold text-gray-700">
            {!isMapLoaded ? "Loading map..." : "Loading data..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="w-screen h-screen">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={(map) => setMap(map)}
        mapTypeId="hybrid"
      >
        {map && (
          <HeatmapLayer
            data={coordinates.map((coord) => new window.google.maps.LatLng(coord.lat, coord.lng))}
            options={{
              radius: 20,
              opacity: 0.4,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        )}
      </GoogleMap>
    </main>
  )
}

export default Heatmap
