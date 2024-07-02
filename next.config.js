/** @type {import('next').NextConfig} */
const nextConfig = {
  //  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/geo_bucket_1/**",
      },
    ],
  },
};

module.exports = nextConfig;
