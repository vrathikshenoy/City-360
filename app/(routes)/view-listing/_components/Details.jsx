import React, { useEffect, useState } from 'react';
import GoogleMapSection from '@/app/_components/GoogleMapSection';
import { Button } from '@/components/ui/button';
import { Bath, BedDouble, CarFront, Drill, Home, LandPlot, MapPin, Share , Trash} from 'lucide-react';
import AgentDetail from './AgentDetail';

function Details({ listingDetail }) {
  const [position, setPosition] = useState(null);
  function toSentenceCase(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  }
  

  useEffect(() => {
    if (!listingDetail) return; // Add this check

    if (listingDetail.coordinates && typeof listingDetail.coordinates === 'string') {
      const [lat, lng] = listingDetail.coordinates.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition({ lat, lng });
      } else {
        console.error('Invalid coordinates string:', listingDetail.coordinates);
      }
    } else if (listingDetail.coordinates && typeof listingDetail.coordinates === 'object') {
      setPosition(listingDetail.coordinates);
    } else {
      console.error('Invalid coordinates for item:', listingDetail);
    }
  }, [listingDetail]);

  if (!listingDetail) return null; // Add this early return

  return (
    <div className='my-6 flex gap-2 flex-col'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-3xl'> {toSentenceCase(listingDetail.type) + ' Waste'}</h2>
          <h2 className='text-gray-500 text-lg flex gap-2'>
            <MapPin />
            {listingDetail.Location}
          </h2>
        </div>
        <Button className='flex gap-2'>
          <Share /> Share
        </Button>
      </div>
      <hr />
      <div className='mt-4 flex flex-col gap-3'>
        <h2 className='font-bold text-2xl'>Key Features</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <h2 className='flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center'>
          <Trash />
            {listingDetail.type}
          </h2>
        </div>
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-2xl'>Discription</h2>
        <p className='text-gray-600'>{listingDetail.description}</p>
      </div>
      <div>
        <h2 className='font-bold text-2xl'>Find On Map</h2>
        {position && (
          <GoogleMapSection
            coordinates={position}
            listing={[listingDetail]}
          />
        )}
      </div>
      <div>
        <h2 className='font-bold text-2xl'>Contact Agent</h2>
        <AgentDetail listingDetail={listingDetail} />
      </div>
    </div>
  );
}

export default Details;