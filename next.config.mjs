/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google
      "avatars.githubusercontent.com", // GitHub
      "s.gravatar.com", // Auth0 default fallback
    ],
  },
};

export default nextConfig;
