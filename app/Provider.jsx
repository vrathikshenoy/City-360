"use client";
import React, { useState } from 'react';
import Header from './_components/Header';
import { LoadScript } from '@react-google-maps/api';
import CustomLoader from './CustomLoader';

function Provider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        libraries={['places', 'visualization']}
        loadingElement={<CustomLoader />}  // Custom loader component
        onLoad={() => setIsLoaded(true)}   // Set isLoaded to true when the script is loaded
      >
       <Header/>
        <div >
          {isLoaded ? children : <CustomLoader />} 
        </div>
      </LoadScript>
    </div>
  );
}

export default Provider;
