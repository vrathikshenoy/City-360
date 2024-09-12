import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'
import MarkerListingItem from './MarkerListingItem';

function MarkerItem({item}) {
    const [selectedListing, setSelectedListing] = useState();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (item.coordinates && typeof item.coordinates === 'string') {
            const [lat, lng] = item.coordinates.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                setPosition({ lat, lng });
            } else {
                console.error("Invalid coordinates string:", item.coordinates);
            }
        } else if (item.coordinates && typeof item.coordinates === 'object') {
            setPosition(item.coordinates);
        } else {
            console.error("Invalid coordinates for item:", item);
        }
    }, [item]);

    if (!position) {
        return null;
    }

    return (
        <MarkerF
            position={position}
            onClick={() => setSelectedListing(item)}
             icon={{
                    url: '/pin.png',
                    scaledSize: {
                        width: 60,
                        height: 60
                    }
                }}
        >
            {selectedListing && (
                <OverlayView
                    position={position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div>
                        <MarkerListingItem 
                            closeHandler={() => setSelectedListing(null)}
                            item={selectedListing} 
                        />
                    </div>
                </OverlayView>
            )}
        </MarkerF>
    )
}

export default MarkerItem