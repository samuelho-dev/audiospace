/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));
import withBundleAnalyzer from "@next/bundle-analyzer";
import { env } from "./src/env.mjs";

const bundleAnalyzerConfig = {
  enabled: env.ANALYZE === "TRUE",
  openAnalyzer: false,
};

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/ddhal4lbv/**",
      },
    ],
  },
};

export default withBundleAnalyzer(bundleAnalyzerConfig)(config);
