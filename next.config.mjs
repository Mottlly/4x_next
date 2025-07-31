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
};

export default nextConfig;
