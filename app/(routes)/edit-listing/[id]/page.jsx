"use client"
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { redirect, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import FileUpload from '../_components/FileUpload'
import { Loader } from 'lucide-react'
import { useFormik } from 'formik'
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

function EditListing({ params }) {
    const { user } = useUser();
    const router = useRouter();
    const [listing, setListing] = useState({});
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user && verifyUserRecord();
    }, [user]);

    const verifyUserRecord = async () => {
        const { data, error } = await supabase
            .from('listing')
            .select('*,listingImages(listing_id,url)')
            .eq('createdBy', user?.primaryEmailAddress.emailAddress)
            .eq('id', params.id);
        if (data && data.length > 0) {
            console.log(data)
            setListing(data[0]);
        } else {
            router.replace('/')
        }
    }

    const formik = useFormik({
        initialValues: {
            type: listing?.type || '',
            description: listing?.description || '',
            profileImage: user?.imageUrl,
            fullName: user?.fullName
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log(values);
            onSubmitHandler(values);
        },
    });

    const onSubmitHandler = async (formValue) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('listing')
            .update(formValue)
            .eq('id', params.id)
            .select();

        if (data) {
            console.log(data);
            toast('Listing updated and Published');
            setLoading(false);
        }
        if (error) {
            console.error('Error updating listing:', error);
            toast('Error updating listing');
            setLoading(false);
            return;
        }

        for (const image of images) {
            setLoading(true)
            const file = image;
            const fileName = Date.now().toString();
            const fileExt = fileName.split('.').pop();
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('listingImages')
                .upload(`${fileName}`, file, {
                    contentType: `image/${fileExt}`,
                    upsert: false
                });

            if (uploadError) {
                setLoading(false)
                toast('Error while uploading images')
            } else {
                const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
                const { data: insertData, error: insertError } = await supabase
                    .from('listingImages')
                    .insert([
                        { url: imageUrl, listing_id: params?.id }
                    ])
                    .select();

                if (insertData) {
                    setLoading(false);
                }
                if (insertError) {
                    setLoading(false)
                    console.error('Error inserting image data:', insertError);
                }
            }
            setLoading(false);
        }
    }

    const publishBtnHandler = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('listing')
            .update({ active: true })
            .eq('id', params?.id)
            .select();
    
        if (data) {
            setLoading(false);
            toast('Listing published!');
            router.push("/waste"); // Redirect to /waste after publishing
        }
        if (error) {
            setLoading(false);
            console.error('Error publishing listing:', error);
            toast('Error publishing listing');
        }
    };
    

    return (
        <div className='px-10 md:px-36 my-10'>
            <h2 className='font-bold text-2xl'>Enter some more details about your listing</h2>

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <div className='p-5 border rounded-lg shadow-md grid gap-7 mt-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                            <div className='flex gap-2 flex-col'>
                                <h2 className='text-gray-500'>Do you want to Add Waste?</h2>
                                <RadioGroup
                                    value={formik.values.type}
                                    onValueChange={(v) => formik.setFieldValue('type', v)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="dry" id="dry" />
                                        <Label htmlFor="dry" className="text-lg">Dry</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="wet" id="wet" />
                                        <Label htmlFor="wet" className="text-lg">Wet</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="chemical" id="chemical" />
                                        <Label htmlFor="chemical" className="text-lg">chemical</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="unsegregated" id="unsegregated" />
                                        <Label htmlFor="unsegregated" className="text-lg">unsegregated</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="plastic" id="plastic" />
                                        <Label htmlFor="plastic" className="text-lg">plastic</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div className='grid  grid-cols-1  gap-10'>
                            <div className='flex gap-2 flex-col'>
                                <h2 className='text-gray-500'>Description</h2>
                                <Textarea
                                    placeholder=""
                                    name="description"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className='font-lg text-gray-500 my-2'>Upload Property Images</h2>
                            <FileUpload
                                setImages={(value) => setImages(value)}
                                imageList={listing.listingImages}
                            />
                        </div>
                        <div className='flex gap-7 justify-end'>
                            <Button disabled={loading} variant="outline" className="text-primary border-primary" type="submit">
                                {loading ? <Loader className='animate-spin' /> : 'Save'}
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" disabled={loading} className="">
                                        {loading ? <Loader className='animate-spin' /> : 'Save & Publish'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Do you really want to publish the listing?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => publishBtnHandler()}>
                                            {loading ? <Loader className='animate-spin' /> : 'Continue'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditListing