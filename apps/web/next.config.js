/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: '../../',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
