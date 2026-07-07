/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only use 'export' when building for static hosting (Hostinger) via `STATIC_EXPORT=true`
    output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
    trailingSlash: true,        // Add trailing slash (required for Hostinger)
    skipTrailingSlashRedirect: true,
    distDir: 'out',             // Output directory

    images: {
        unoptimized: true,        // Required for static export
    },

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
