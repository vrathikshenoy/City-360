'use client'

import React, { useEffect, useState } from 'react'
import { GoogleMap, Marker, OverlayView, useJsApiLoader } from '@react-google-maps/api'

const mapContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

const locations = [
  { name: 'Fiza Mall', lat: 12.857437834993725, lng: 74.83829321273929 },
  { name: 'CC', lat: 12.871502196055115, lng: 74.84287349505024 },
  { name: 'Bharat Mall', lat: 12.88614774999606, lng: 74.84081170005791 },
  { name: 'Pabbas', lat: 12.886516527991049, lng: 74.83833551640305 },
  { name: 'Sulthan Bathery', lat: 12.890629432220123, lng: 74.82088344953667 },
  { name: 'Alloy', lat: 12.87321518234544, lng: 74.84610669819288 },
  { name: 'Nipe', lat: 12.867963556185469, lng: 74.89671408862026 },
  { name: 'Mangaldevi', lat: 12.85016816968392, lng: 74.84531440779557 },
  { name: 'Kudroli', lat: 12.87924096146884, lng: 74.832871577134 },
  { name: 'Sri Krishna Dhyan Kendra', lat: 12.79820989744836, lng: 74.95496479457499 },
  { name: 'Bengre Beach', lat: 12.863595557886612, lng: 74.82084240084104 },
  { name: 'Ullal Beach', lat: 12.810831267886158, lng: 74.84131833225764 },
  { name: 'Tannirbhavi', lat: 12.895936025738726, lng: 74.8146464383002 },
  { name: 'Adyar Falls', lat: 12.874676647936523, lng: 74.93361532381321 },
  { name: 'Mangalore Jn', lat: 12.866566987930534, lng: 74.87909389051768 },
  { name: 'Mangalore Central', lat: 12.86387315640361, lng: 74.84321780768639 },
  { name: 'Statebank Bus Stand', lat: 12.864181265207302, lng: 74.83704929688662 },
  { name: 'KSRTC', lat: 12.88584550261482, lng: 74.84189695217428 },
  { name: 'KS Hegde', lat: 12.80794855524291, lng: 74.88810817709236 },
  { name: 'KMC', lat: 12.860425400976881, lng: 74.84853063169207 },
]

const MapWithMarkers = () => {
  const [map, setMap] = useState(null)

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  })

  const center = locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 37.782, lng: -122.445 }

  if (!isMapLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading map...</p>
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
        {locations.map((location, index) => (
          <React.Fragment key={index}>
            <Marker
              position={{ lat: location.lat, lng: location.lng }}
              icon={{
                url: '/jgj.png',
                scaledSize: {
                  width: 40,
                  height: 40,
                },
              }}
            />
            <OverlayView
              position={{ lat: location.lat, lng: location.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
             <div
    className="px-1 py-2 -mt-16 text-sm flex items-center font-semibold text-yellow-300  rounded-md shadow-md whitespace-nowrap"
    style={{ textShadow: '1px 1px 2px black' }}
  >{location.name}
    </div>
            </OverlayView>
          </React.Fragment>
        ))}
      </GoogleMap>
    </main>
  )
}

export default MapWithMarkers