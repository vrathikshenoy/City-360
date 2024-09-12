// CustomLoader.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicPlane = dynamic(() => import('ldrs').then((module) => module.Plane), {
  ssr: false, // Ensure that this component is not included in SSR
});

const CustomLoader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadLdrs = async () => {
      try {
        const ldrsModule = await import('ldrs');
        if (ldrsModule && ldrsModule.default) {
          // Assuming ldrs exports a default React component
          const LdrsComponent = ldrsModule.default;
          // Use LdrsComponent appropriately
        } else {
          console.error('ldrs module does not export a default component');
        }
      } catch (error) {
        console.error('Error loading ldrs:', error);
      }
    };
  
    loadLdrs();
  }, []);
  if (!isClient) return null; // Render nothing on the server side

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <DynamicPlane
        size={80}
        color="#3498db"
        speed={1.2}
      />
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading waste listings...</p>
    </div>
  );
};

export default CustomLoader;
