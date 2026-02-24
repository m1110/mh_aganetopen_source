/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  env: {
    INTROSPECT_CONVERSATION_V2_ENABLED: process.env.INTROSPECT_CONVERSATION_V2_ENABLED,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'introspect-v2-8p13xkvkc-camburley-s-team.vercel.app',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'stripe-camo.global.ssl.fastly.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};
