import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    emotion: {
      sourceMap: false,
      autoLabel: "never",
    },
  },
};

export default nextConfig;
