/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wft/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.fbcdn.net' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.twimg.com' },
    ],
  },
};

export default nextConfig;
