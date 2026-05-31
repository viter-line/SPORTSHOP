/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.107', '127.0.0.1', 'localhost', '10.10.6.37'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Два зірочки означають "будь-який домен"
      },
    ],
  },

  // Ваші існуючі редиректи (якщо є)
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
