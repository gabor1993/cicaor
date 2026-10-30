import type { NextConfig } from "next";
import { validateBuildEnv } from "./src/lib/build-env";

validateBuildEnv(process.env);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // The default image loader needs a Node server, which a static export does not have.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
