/** @type {import('next').NextConfig} */
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: isCapacitorBuild ? 'export' : undefined,
  images: {
    unoptimized: isCapacitorBuild ? true : false,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'graph.facebook.com' },
      { protocol: 'https', hostname: 'media.licdn.com' },
      { protocol: 'https', hostname: 'p16-sign.tiktokcdn-us.com' }
    ]
  }
};

export default nextConfig;
