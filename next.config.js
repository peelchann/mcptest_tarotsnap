/** @type {import('next').NextConfig} */

// Common configuration for all environments
const commonConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.edelwyn.com'], // Allow images from edelwyn.com for tarot cards
  }
};

// Environment-specific configuration
const nextConfig = (phase, { defaultConfig }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  
  if (isDev) {
    return {
      ...commonConfig,
      // Development-specific settings
      poweredByHeader: true,
      reactStrictMode: true,
    };
  }
  
  if (isProd) {
    return {
      ...commonConfig,
      // Production-specific settings
      poweredByHeader: false,
      compress: true,
      productionBrowserSourceMaps: false,
    };
  }
  
  // Default config
  return commonConfig;
};

module.exports = nextConfig; 