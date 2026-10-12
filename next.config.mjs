/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'ui-avatars.com'],
    unoptimized: true,
  },
};

export default nextConfig;
