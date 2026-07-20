/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@companio/ui', '@companio/db'],
}

module.exports = nextConfig
