import type { NextConfig } from "next";

/** ngrok tunnel used for local HTTPS testing (Mercado Pago back_urls, etc.). */
const NGROK_HOST = "kebab-elite-fidgety.ngrok-free.dev";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow ngrok + LAN access during local development (phone / other devices).
  allowedDevOrigins: [
    NGROK_HOST,
    "*.ngrok-free.dev",
    "127.0.0.1",
    "192.168.1.95",
  ],

  experimental: {
    // Checkout uses server actions; allow invocation from the ngrok / LAN origin.
    serverActions: {
      allowedOrigins: [NGROK_HOST, "*.ngrok-free.dev", "192.168.1.95"],
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
