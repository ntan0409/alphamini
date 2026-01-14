/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // cho phép tất cả hostname
      },
    ],
  },
};

module.exports = nextConfig;
