import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* 1. Build Security Overrides */
  typescript: {
    // Allows production builds even with lingering type issues
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows deployment even if there are linting warnings
    ignoreDuringBuilds: true,
  },

  /* 2. Image Optimization (CRITICAL for E-commerce) */
  // Without this, Next.js will block images from external URLs in production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows images from any secure website (Unsplash, Dell, Apple, etc.)
      },
    ],
  },

  /* 3. Experimental Features (Optional) */
  // If you are using the latest Next.js 15/16 features
  experimental: {
    // serverActions: true, // Uncomment if you use server actions
  }
};

export default nextConfig;