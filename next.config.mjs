/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google
      "avatars.githubusercontent.com", // GitHub
      "s.gravatar.com", // Auth0 default fallback
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // Ignore specific modules that cause the LuminanceFormat import issue
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^three-stdlib$/,
        contextRegExp: /postprocessing/,
      })
    );

    // Also ignore the specific problematic files
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /(GlitchPass|SSAOPass)\.js$/,
      })
    );

    return config;
  },
  // Force specific pages to be dynamic
  async redirects() {
    return [];
  },
  // Prevent static optimization for pages that need runtime data
  exportPathMap: async function (defaultPathMap) {
    // Remove game page from static generation
    const { '/game': removed, ...pathMap } = defaultPathMap;
    return pathMap;
  },
};

export default nextConfig;
