import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 430, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [48, 64, 80, 96, 160, 240, 320],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};
export default nextConfig;
