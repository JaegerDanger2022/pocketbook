import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build plain HTML/CSS/JS into `out/` so Firebase Hosting can serve it. No server needed.
  output: "export",
  // `/add` is written as `/add/index.html`, which static hosts serve cleanly.
  trailingSlash: true,
  // The built-in image optimizer needs a server, so turn it off.
  images: { unoptimized: true },
};

export default nextConfig;
