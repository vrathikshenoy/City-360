import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import { Bath, BedDouble, MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
function toSentenceCase(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  }
  

function UserListing() {
    const {user} = useUser();
    const [listing, setListing] = useState();

    useEffect(() => {
        user && GetUserListing();
    }, [user])

    const GetUserListing = async () => {
        const {data, error} = await supabase
        .from('listing')
        .select(`*,listingImages(url,listing_id)`)
        .eq('createdBy', user?.primaryEmailAddress.emailAddress);
        setListing(data);
        console.log(data);
    }

    const deleteListing = async (listingId) => {
        // First, delete related images
        const { error: imageDeleteError } = await supabase
            .from('listingImages')
            .delete()
            .eq('listing_id', listingId);
    
        if (imageDeleteError) {
            console.error('Error deleting listing images:', imageDeleteError);
            return;
        }
    
        // Then, delete the listing
        const { error: listingDeleteError } = await supabase
            .from('listing')
            .delete()
            .eq('id', listingId);
    
        if (listingDeleteError) {
            console.error('Error deleting listing:', listingDeleteError);
        } else {
            // Refresh the listing after successful deletion
            GetUserListing();
        }
    }

    return (
        <div>
            <h2 className='font-bold text-2xl'>Manage your listing</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {listing && listing.map((item, index) => (
                    <div key={item.id} className='p-3 hover:border hover:border-primary rounded-lg cursor-pointer relative'>
                        <h2 className='bg-primary m-1 rounded-lg text-white absolute px-2 text-sm p-1'>{item.active ? 'Published' : 'Draft'}</h2>
                        <Image src={item?.listingImages[0] ?
                            item?.listingImages[0]?.url
                            : '/placeholder.svg'
                        }
                        width={800}
                        height={150}
                        className='rounded-lg object-cover h-[170px]'
                        alt={item.type}
                        />
                        <div className='flex mt-2 flex-col gap-2'>
                            <h2 className='font-bold text-xl'>{toSentenceCase(item?.type)+ " Waste"}</h2>
                            <h2 className='flex gap-2 text-sm text-gray-400 '>
                                <MapPin className='h-4 w-4'/>
                                {item.Location}
                            </h2>
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button 
                               type="button"
                                variant="destructive" 
                                size="sm" 
                                className="mt-2"
                            >
                                <Trash className='h-4 w-4 mr-2'/>
                                Delete Listing
                            </Button>
                            </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Ready to Delete?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Do you really want to delete wastesite?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteListing(item.id)}>
                                           Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserListing