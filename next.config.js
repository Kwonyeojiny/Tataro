/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['upload.wikimedia.org', 'i.namu.wiki'],
  },
};

module.exports = nextConfig;
