// Static export for GitHub Pages. BASE_PATH is set by the GitHub Actions workflow
// (e.g. "/song-roulette"); locally it is empty so `npm run dev` works at "/".
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true, // /history/ -> history/index.html, which Pages serves correctly
  images: { unoptimized: true }, // the image optimizer needs a server
};

export default nextConfig;
