/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // YouTube thumbnails only
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
