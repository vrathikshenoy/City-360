import { Bath, BedDouble, MapPin, Ruler, Search } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import GoogleAddressSearch from './GoogleAddressSearch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Listing({ listing, handleSearchClick, searchedAddress, setCoordinates }) {
  const [address, setAddress] = useState();
  const [searchedLabel, setSearchedLabel] = useState();

  const handleSearch = () => {
    handleSearchClick();
    setSearchedLabel(address?.label);
  };
  function toSentenceCase(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  }
  

  return (
    <div>
      <div className='p-3 flex gap-6'>
        <GoogleAddressSearch
          selectedAddress={(v) => {
            searchedAddress(v);
            setAddress(v);
          }}
          setCoordinates={(v) => setCoordinates(v)}
        />
        <Button className="flex gap-2" onClick={handleSearch}>
          <Search className='h-4 w-4' />
          Search
        </Button>
      </div>

      {searchedLabel && (
        <div className='px-3 my-5'>
          <h2 className='text-xl'>
            Found <span className='font-bold'>{listing?.length}</span> Result in <span className='text-primary font-bold'>{searchedLabel}</span>
          </h2>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {listing?.length > 0 ? (
          listing.map((item, index) => (
            <Link href={'/view-listing/' + item.id} key={index}>
              <div className='p-3 hover:border hover:border-primary rounded-lg cursor-pointer'>
                <Image
                  src={item.listingImages[0].url}
                  width={800}
                  height={150}
                  className='rounded-lg object-cover h-[170px]'
                />
                <div className='flex mt-2 flex-col gap-2'>
                  <h2 className='font-bold text-xl'>{toSentenceCase(item?.type)+" Waste"}</h2>
                  <h2 className='flex gap-2 text-sm text-gray-400 '>
                    <MapPin className='h-4 w-4' />
                    {item.Location}
                  </h2>
                </div>
              </div>
            </Link>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
            <div key={index} className='h-[230px] w-full bg-slate-200 animate-pulse rounded-lg'></div>
          ))
        )}
      </div>
    </div>
  );
}

export default Listing;
