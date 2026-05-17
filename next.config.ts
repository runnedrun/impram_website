import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "impram.net", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com", pathname: "/**" },
    ],
    localPatterns: [{ pathname: "/uploads/**" }],
  },
  async redirects() {
    return [
      {
        source: "/join-us-obsolete",
        destination: "/join-us/",
        permanent: true,
      },
      {
        source: "/join-us-obsolete/",
        destination: "/join-us/",
        permanent: true,
      },
      {
        source: "/shows-obsolete-2",
        destination: "/shows/",
        permanent: true,
      },
      {
        source: "/shows-obsolete-2/",
        destination: "/shows/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
