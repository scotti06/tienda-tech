import type { NextConfig } from "next";

/** ngrok tunnel used for local HTTPS testing (Mercado Pago back_urls, etc.). */
const NGROK_HOST = "kebab-elite-fidgety.ngrok-free.dev";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow the ngrok origin to reach the dev server (HMR, _next assets, etc.).
  allowedDevOrigins: [NGROK_HOST, "*.ngrok-free.dev"],

  experimental: {
    // Checkout uses server actions; allow invocation from the ngrok origin.
    serverActions: {
      allowedOrigins: [NGROK_HOST, "*.ngrok-free.dev"],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: NGROK_HOST,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
