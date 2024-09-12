/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, // Disables the built-in image optimization
        domains: [
            'oxmjhfafozlafqrhhawl.supabase.co',
            'img.clerk.com',
            'res.cloudinary.com',
            'images.unsplash.com',
            'cdn.pixabay.com',
            'images.pexels.com'
        ] // Allows images from these domains to be used in the `next/image` component
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/:path*' // Forward requests to backend
            },
        ];
    }
};

export default nextConfig;
