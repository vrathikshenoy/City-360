"use client";
import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import GoogleMapSection from "./GoogleMapSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function ListingMapView({ types }) {
  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState();
  const [coordinates, setCoordinates] = useState({ lat: 12.9141, lng: 74.8560 }); // Default coordinates for Mangaluru

  useEffect(() => {
    getLatestListing();
  }, [types]);

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(
        `*,listingImages(
                url,
                listing_id
            )`
      )
      .eq("active", true)
      .in("type", types)
      .order("id", { ascending: false });

    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server Side Error");
    }
  };

  const handleSearchClick = async () => {
    console.log(searchedAddress);
    const searchTerm = searchedAddress?.value?.structured_formatting?.main_text;

    const { data, error } = await supabase
      .from("listing")
      .select(
        `*,listingImages(
                url,
                listing_id
            )`
      )
      .eq("active", true)
      .in("type", types)
      .like("Location", "%" + searchTerm + "%")
      .order("id", { ascending: false });
    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server Side Error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="flex-1">
        <Listing
          listing={listing}
          handleSearchClick={handleSearchClick}
          searchedAddress={(v) => setSearchedAddress(v)}
          setCoordinates={setCoordinates}
        />
        <div className="mt-4">
          <Link href="/add-new-listing">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Post Waste Site
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative flex-1">
        <GoogleMapSection listing={listing} coordinates={coordinates} />
      </div>
    </div>
  );
}

export default ListingMapView;
