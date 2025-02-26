/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['upload.wikimedia.org', 'i.namu.wiki', 'kr.object.ncloudstorage.com'],
  },
};

module.exports = nextConfig;
