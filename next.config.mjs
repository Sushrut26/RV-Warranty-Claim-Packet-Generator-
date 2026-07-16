/** @type {import('next').NextConfig} */

// For a normal Vercel/local run, leave these unset — the app serves at "/".
// For the GitHub Pages build, the deploy workflow sets:
//   STATIC_EXPORT=true
//   NEXT_PUBLIC_BASE_PATH=/RV-Warranty-Claim-Packet-Generator-
// so the app is exported as static files served from that repo subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isExport = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: "export" } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
