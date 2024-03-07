/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images-na.ssl-images-amazon.com"],
  },
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
};

module.exports = nextConfig;
