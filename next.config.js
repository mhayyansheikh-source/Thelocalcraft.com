/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
    output: isStaticExport ? 'export' : undefined,
    trailingSlash: isStaticExport,
    skipTrailingSlashRedirect: isStaticExport,
    distDir: isStaticExport ? 'out' : undefined,

    ...(isStaticExport && {
        images: {
            unoptimized: true,
        },
    }),

    // Fix for ONNX Runtime / Xenova Transformers
    experimental: {
        serverComponentsExternalPackages: ['@xenova/transformers'],
    },

    // Environment variables (public)
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
};

module.exports = nextConfig;
