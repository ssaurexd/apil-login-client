/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    JWT_SEED: 'hdf842id9923',
    API_HOST: 'https://ssaurexd-chat-server.herokuapp.com'
  }
}

module.exports = nextConfig
