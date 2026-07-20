/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@companio/ui', '@companio/db'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
