/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: [
      'i.imgur.com',
      'imgur.com',
      'example.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  }
};

export default config;
