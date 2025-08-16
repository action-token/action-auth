/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow importing/transpiling code from outside this app directory (monorepo)
    externalDir: true,
  },
  // Ensure Turbopack/Next transpiles workspace packages that ship source
  transpilePackages: ["@repo/ui", "auth-client"],
};

export default nextConfig;
