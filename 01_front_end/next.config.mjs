/** @type {import('next').NextConfig} */
const nextConfig = {
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