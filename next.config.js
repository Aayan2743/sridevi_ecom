/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors in build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TS errors if any
  },
  output: "export", // ✅ Enables static export (creates /out)
  images: {
    unoptimized: true, // ✅ Prevents image optimization error on static hosting
  },
  trailingSlash: true, // ✅ Ensures every route like /admin → /admin/index.html
  webpack: (config) => {
    config.module.rules.push({
      test: /\.b64$/,
      type: "asset/source",
    });
    return config;
  },
};

module.exports = nextConfig;
