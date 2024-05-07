/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: '127.0.0.1' },
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'xrraiyxtanthtstytoxt.supabase.co' },
            { protocol: 'https', hostname: 'innercircle-iota.vercel.app' },
        ],
    },
};
export default nextConfig;
