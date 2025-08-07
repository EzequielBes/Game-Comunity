/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/icons', '@chakra-ui/next-js'],
};

export default nextConfig;
