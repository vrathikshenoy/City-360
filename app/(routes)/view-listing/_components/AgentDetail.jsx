import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function AgentDetail({ listingDetail }) {
  const handleSendMessage = () => {
    if (listingDetail?.email) {
      window.location.href = `mailto:${listingDetail.email}`;
    } else {
      alert('Email address is not available.');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row gap-5 items-center justify-between 
    p-5 rounded-lg shadow-md border my-6'>
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
        <Image 
          src={listingDetail?.profileImage}
          alt='profileImage'
          width={60}
          height={60}
          className='rounded-full'
        />
        <div className='text-center sm:text-left'>
          <h2 className='text-lg font-bold'>{listingDetail?.fullName}</h2>
          <h2 className='text-gray-500'>{listingDetail?.createdBy}</h2>
        </div>
      </div>
      <Button onClick={handleSendMessage} className='mt-4 sm:mt-0'>Send Message</Button>
    </div>
  )
}

export default AgentDetail
