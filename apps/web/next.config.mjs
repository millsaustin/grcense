/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ["@grcense/ui", "@grcense/lib"]
};

export default nextConfig;
