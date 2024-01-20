/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ hostname: "utfs.io" }],
    },
    webpack: true,
};

module.exports = nextConfig;
