import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/',           
        destination: '/login', 
        permanent: false,      
      },
    ]
  },
};

export default nextConfig;
