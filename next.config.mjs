/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google
      "avatars.githubusercontent.com", // GitHub
      "s.gravatar.com", // Auth0 default fallback
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js imports for Vercel builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Ensure proper module resolution for three-stdlib
    config.resolve.alias = {
      ...config.resolve.alias,
      three: require.resolve('three'),
    };

    return config;
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
