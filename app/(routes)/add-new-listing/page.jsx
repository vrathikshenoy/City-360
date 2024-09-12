"use client"
import React, { useState, useEffect, useRef } from 'react'
import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const { user } = useUser();
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, []);

    const initializeMap = () => {
        const defaultLocation = { lat: 0, lng: 0 };
        const map = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 13,
        });
    
        const marker = new google.maps.Marker({
            map: map,
            draggable: true,
        });
    
        markerRef.current = marker;
    
        map.addListener('click', (e) => {
            placeMarkerAndPanTo(e.latLng, map);
        });
    
        marker.addListener('dragend', (e) => {
            placeMarkerAndPanTo(marker.getPosition(), map);
        });
    
        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    placeMarkerAndPanTo(pos, map);
                },
                () => {
                    // Handle geolocation error
                }
            );
        }
    };

    const placeMarkerAndPanTo = (latLng, map) => {
        const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
        const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
        
        const position = new google.maps.LatLng(lat, lng);
        
        markerRef.current.setPosition(position);
        map.panTo(position);
        setCoordinates({ lat, lng });
        getAddressFromLatLng(position);
    };

    const getAddressFromLatLng = (latLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    setSelectedAddress({
                        label: results[0].formatted_address,
                        value: results[0]
                    });
                }
            }
        });
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        if (address && address.value.geometry) {
            const location = address.value.geometry.location;
            const latLng = {
                lat: location.lat(),
                lng: location.lng()
            };
            setCoordinates(latLng);
            placeMarkerAndPanTo(latLng, mapRef.current);
        }
    };

    const nextHandler = async () => {
        setLoader(true);
        const { data, error } = await supabase
            .from('listing')
            .insert([
                {
                    Location: selectedAddress.label,
                    coordinates: `${coordinates.lat},${coordinates.lng}`,
                    createdBy: user?.primaryEmailAddress.emailAddress
                },
            ])
            .select();

        if (data) {
            setLoader(false);
            console.log("New Data added,", data);
            toast("New Address added for listing");
            router.replace('/edit-listing/' + data[0].id);
        }
        if (error) {
            setLoader(false);
            console.error('Error', error);
            toast("Server side error");
        }
    };

    return (
        <div className='mt-8 md:mx-56 lg:mx-80'>
            <div className='p-8 flex flex-col gap-5 items-center justify-center'>
                <h2 className='font-bold text-3xl'>Add Waste Site</h2>
                <div className='p-10 rounded-lg border w-full shadow-md flex flex-col gap-5'>
                    <h2 className='text-gray-500 text-lg'>Enter Address or pin location on the map</h2>
                    <GoogleAddressSearch
                        selectedAddress={handleAddressSelect}
                        setCoordinates={setCoordinates}
                    />
                    <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
                    <Button
                        disabled={!selectedAddress || !coordinates || loader}
                        onClick={nextHandler}
                    >
                        {loader ? <Loader className='animate-spin' /> : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddNewListing;