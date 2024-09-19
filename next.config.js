/** @type {import("next").NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.barberi.app",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "foodyman.s3.amazonaws.com",
        port: "",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "barberi.app",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
