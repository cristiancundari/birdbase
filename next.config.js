/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images-na.ssl-images-amazon.com"],
  },
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
};

module.exports = nextConfig;
