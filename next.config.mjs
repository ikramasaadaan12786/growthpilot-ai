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
  },
  async rewrites() {
    return [
      {
        source: '/tiktok-developers-site-verification=:token.html',
        destination: '/api/tiktok-verification?token=:token&format=html',
      },
      {
        source: '/tiktok-developers-site-verification.html',
        destination: '/api/tiktok-verification?format=html',
      },
      {
        source: '/tiktok_verify_:token.html',
        destination: '/api/tiktok-verification?token=:token&format=html',
      },
      {
        source: '/tiktok-verification.txt',
        destination: '/api/tiktok-verification?format=text',
      },
      {
        source: '/.well-known/tiktok-developers-site-verification',
        destination: '/api/tiktok-verification?format=text',
      },
      {
        source: '/.well-known/tiktok-verification.json',
        destination: '/api/tiktok-verification?format=json',
      }
    ];
  }
};

export default nextConfig;
