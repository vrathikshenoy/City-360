import { Button } from '@/components/ui/button'
import { Bath, BedDouble, MapPin, Ruler, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
function toSentenceCase(str) {
  return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
}


function MarkerListingItem({item,closeHandler}) 
{
  return (
    <div>
            <div className=' 
            rounded-lg cursor-pointer w-[180px]'>
                <X onClick={()=>closeHandler()} />
                    <Image src={item.listingImages[0].url}
                    width={800}
                    height={150}
                    className='rounded-lg w-[180px] object-cover h-[120px]'
                    />
                    <div className='flex mt-2 flex-col gap-2 p-2 bg-white '>
                        <h2 className='font-bold text-xl'>{toSentenceCase(item?.type)}</h2>
                        <h2 className='flex gap-2 text-sm text-gray-400 '>
                            <MapPin className='h-4 w-4'/>
                        {item.Location}</h2>
                        
                       <Link href={'/view-listing/'+item.id} className='w-full'>
                       <Button size="sm">View Detail</Button>
                        </Link> 
                    </div>
                </div>  
    </div>
  )
}

export default MarkerListingItem