## Hostinger Static Deployment

### Next.js Static Export Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Enable static export
  trailingSlash: true,        // Add trailing slash (required for Hostinger)
  skipTrailingSlashRedirect: true,
  distDir: 'out',             // Output directory

  images: {
    unoptimized: true,        // Required for static export
    // Or use external image optimization:
    // loader: 'custom',
    // loaderFile: './image-loader.js',
  },

  // Base path if not deploying to root
  // basePath: '',

  // Asset prefix for CDN (optional)
  // assetPrefix: 'https://cdn.thelocalcrafts.com',

  // Environment variables (public)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },
};

module.exports = nextConfig;
```

### Build & Deploy Commands

```bash
# Development
npm run dev

# Build for production (static export)
npm run build
# This generates the 'out' folder with all static files

# Preview the static build locally
npx serve out

# Deploy to Hostinger
# Option 1: FTP Upload
# Upload contents of 'out' folder to public_html

# Option 2: Git Deployment (if Hostinger Git is enabled)
# Push to connected repository

# Option 3: File Manager
# Zip 'out' folder, upload via Hostinger File Manager, extract to public_html
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build",
    "lint": "next lint",
    "deploy:hostinger": "npm run build && echo 'Upload out/ folder to Hostinger public_html'"
  }
}
```

### Hostinger File Structure

```
public_html/                      # Hostinger root directory
├── index.html                    # Homepage
├── 404.html                      # Custom 404 page
├── _next/                        # Next.js assets
│   ├── static/
│   │   ├── chunks/              # JS chunks
│   │   ├── css/                 # CSS files
│   │   └── media/               # Fonts, images
│   └── data/                    # Pre-rendered JSON data
├── products/
│   ├── index.html               # /products page
│   └── [slug]/
│       └── index.html           # /products/[slug] pages
├── categories/
│   └── [category]/
│       └── index.html
├── regions/
│   ├── punjab/
│   │   ├── index.html
│   │   └── multan/
│   │       └── index.html
│   └── sindh/
│       └── ...
├── artisans/
│   └── index.html
├── admin/                        # Admin panel (SPA)
│   └── index.html
├── artist/                       # Artist panel (SPA)
│   └── index.html
├── images/                       # Static images
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── .htaccess                     # Apache configuration
```

### .htaccess Configuration (Required for Hostinger)

```apache
# .htaccess - Place in public_html root

# Enable rewrite engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www (or add www - choose one)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Handle client-side routing for SPA sections (admin, artist panels)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/admin [NC]
RewriteRule ^ /admin/index.html [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/artist [NC]
RewriteRule ^ /artist/index.html [L]

# Handle trailing slashes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ /$1/ [L,R=301]

# Custom 404 page
ErrorDocument 404 /404.html

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On

  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"

  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"

  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"

  # HTML (short cache for updates)
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### Dynamic Data Strategy (Without API Routes)

Since static export cannot use API routes, all data operations happen client-side:

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

```

```typescript
// hooks/useProducts.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(50);

        if (filters?.category) {
          query = query.eq('category', filters.category);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;

        setProducts(data as Product[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters?.category]);

  return { products, loading, error };
}
```

### Static Page Generation with Dynamic Data

```typescript
// app/products/page.tsx
'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { LoadingSkeleton } from '@/components/ui/Skeleton';

export default function ProductsPage() {
  const [filters, setFilters] = useState({});
  const { products, loading, error } = useProducts(filters);

  if (loading) return <LoadingSkeleton count={12} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container py-4">
      <h1>All Products</h1>
      <ProductFilters onChange={setFilters} />
      <ProductGrid products={products} />
    </div>
  );
}
```

### Pre-rendering Static Pages

For SEO-critical pages, generate static HTML at build time:

```typescript
// app/crafts/[craft]/page.tsx
import { supabase } from '@/lib/supabase/server'; // Supabase server client

// Generate static params at build time
export async function generateStaticParams() {
  // This runs at build time only
  const crafts = ['blue-pottery', 'ajrak', 'peshawari-chappal', 'sindhi-embroidery',
                  'truck-art', 'camel-skin-lamp', 'chiniot-woodwork', 'hunza-embroidery',
                  'balochi-mirror-work', 'kashmiri-shawl'];

  return crafts.map((craft) => ({
    craft: craft,
  }));
}

// Static page content
export default function CraftPage({ params }: { params: { craft: string } }) {
  return (
    <CraftPageClient craft={params.craft} />
  );
}
```

### SEO for Static Export

```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://thelocalcrafts.com'),
  title: {
    default: 'The Local Crafts | Pakistani Handicrafts Online',
    template: '%s | The Local Crafts',
  },
  description: 'Discover authentic Pakistani handicrafts...',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thelocalcrafts.com',
    siteName: 'The Local Crafts',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Sitemap Generation (Build Script)

```typescript
// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs';

const BASE_URL = 'https://thelocalcrafts.com';

const staticPages = [
  '',
  '/products',
  '/categories',
  '/artisans',
  '/about',
  '/contact',
  '/faq',
];

const craftPages = [
  '/crafts/blue-pottery',
  '/crafts/ajrak',
  '/crafts/peshawari-chappal',
  // ... more crafts
];

const regionPages = [
  '/regions/punjab',
  '/regions/punjab/multan',
  '/regions/sindh',
  '/regions/sindh/karachi',
  // ... more regions
];

function generateSitemap() {
  const allPages = [...staticPages, ...craftPages, ...regionPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync('out/sitemap.xml', sitemap);
  console.log('Sitemap generated!');
}

generateSitemap();
```

### Deployment Checklist for Hostinger

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Create `.env.local` with all Supabase credentials
- [ ] Verify all NEXT_PUBLIC_SUPABASE_ variables are set
- [ ] Test Supabase connection locally

### 2. Build Process
- [ ] Run `npm run build` (creates 'out' folder)
- [ ] Verify no build errors
- [ ] Check 'out' folder structure
- [ ] Run `npx serve out` to test locally

### 3. Hostinger Setup
- [ ] Login to Hostinger hPanel
- [ ] Navigate to File Manager → public_html
- [ ] Backup existing files (if any)
- [ ] Delete old files from public_html

### 4. Upload Files
- [ ] Zip the 'out' folder contents
- [ ] Upload zip to public_html via File Manager
- [ ] Extract zip in public_html
- [ ] Verify file structure is correct

### 5. Configuration
- [ ] Upload .htaccess file to public_html root
- [ ] Set correct file permissions (644 for files, 755 for folders)
- [ ] Configure SSL certificate (Let's Encrypt)
- [ ] Set up domain DNS if needed

### 6. Post-Deployment
- [ ] Test homepage loads correctly
- [ ] Test navigation between pages
- [ ] Test 404 page
- [ ] Test admin panel routing
- [ ] Test Supabase connection (login, products)
- [ ] Test WhatsApp integration
- [ ] Run Lighthouse audit
- [ ] Submit sitemap to Google Search Console

### 7. Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure Google Analytics
- [ ] Test on mobile devices
- [ ] Test on different browsers


### Hostinger-Specific Limitations & Solutions

| Limitation | Solution |
|------------|----------|
| No Node.js server | Static export + Supabase client SDK |
| No API routes | Direct Supabase PostgREST calls |
| No ISR | Client-side data fetching with SWR/Supabase |
| No middleware | Client-side auth checks (static only) |
| No server components | Convert to client components (static only) |
| Image optimization | Use `unoptimized: true` or Supabase Storage CDN |
| No edge functions | Supabase Edge Functions (separate) |

### Optional: Supabase Edge Functions (Separate Deployment)

For server-side operations that can't be done client-side:

```typescript
// supabase/functions/order-notification/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record } = await req.json()
  
  // Send email notification
  // Update artisan stats
  // etc.

  return new Response(JSON.stringify({ message: 'Notification sent' }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```
