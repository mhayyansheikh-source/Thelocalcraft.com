# The Local Crafts | thelocalcrafts.com
## Multi-Vendor E-Commerce Platform
## Complete Implementation Plan for Pakistani Handicrafts Marketplace

---

## Table of Contents

### Deployment Architecture
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack) - Hybrid Architecture
3. [Hostinger Static Deployment](#hostinger-static-deployment) - Client Website
4. [Vercel Admin & Artist Panel](#vercel-admin--artist-panel-deployment) - Admin/Artist Panels
5. [AI Visibility & GEO Strategy](#ai-visibility--geo-strategy) - LLM Optimization

### Business & Research
6. [Competitor Analysis](#competitor-analysis)
7. [SEO Strategy & Keywords](#seo-strategy--keywords)
8. [Pakistan Craft Regions](#pakistan-craft-regions)
9. [Market Analysis & Opportunity](#market-analysis--opportunity)
10. [Consumer Trust & Conversion Strategy](#consumer-trust--conversion-strategy)

### Design & UX
11. [Color Palette System](#color-palette-system)
12. [UX Best Practices](#ux-best-practices-for-handicraft-marketplace)
13. [Mobile Commerce Strategy](#mobile-commerce-strategy)

### Technical Implementation
14. [Silo File Structure](#silo-file-structure)
15. [Database Schema](#database-schema)
16. [WhatsApp Cart Integration](#whatsapp-cart-integration)
17. [Panel Features](#panel-features)
18. [SEO Implementation](#seo-implementation)
19. [Performance & Technical Optimization](#performance--technical-optimization)
20. [Advanced Features & AI Integration](#advanced-features--ai-integration)
21. [Premium Experience & Social Impact](#premium-experience--social-impact)
22. [Technical Implementation Specs (v2.0)](#technical-implementation-specs-v20)

### Marketing & Launch
23. [Enhanced SEO Keywords](#enhanced-seo-keywords)
24. [Social Media Marketing Strategy](#social-media-marketing-strategy)
25. [Payment & Logistics Strategy](#payment--logistics-strategy)
26. [Implementation Phases](#implementation-phases)
27. [Sources & References](#sources--references)
28. [User Guides & Documentation](#user-guides--documentation)
    - 28.1 [How to use Client website?](#how-to-use-client-website)
    - 28.2 [How to use Admin website?](#how-to-use-admin-website)
    - 28.3 [How to use Artisan website?](#how-to-use-artisan-website)

---

## Project Overview

**Mission**: Create Pakistan's premier multi-vendor marketplace connecting local artisans with global buyers, preserving cultural heritage while empowering craftspeople economically.

**Key Differentiators**:
- Geo-tagged artisan profiles (province → city → area → landmark)
- Story-driven product listings (artisan background, craft history)
- AEO-optimized (Answer Engine Optimization for voice search)
- Local SEO for each craft region
- Multi-language support (English, Urdu)

---

## Tech Stack

### Hybrid Deployment Architecture (Two Separate Apps)

| Component | Technology | Hosting | Domain |
|-----------|------------|---------|--------|
| **Client Website** | Next.js 14+ (Static Export) | **Hostinger** (public_html) | thelocalcrafts.com |
| **Admin + Artist Panels** | Next.js 14+ (Full Stack) | **Vercel** | admin.thelocalcrafts.com |

---

### App 1: Client Website (Hostinger - Static)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+ (Static Export) | SEO-optimized static pages |
| Styling | Bootstrap 5 + SCSS (Texture-Infused) | Immersive premium aesthetic |
| Security | **Open Source Shield** | BunkerWeb & CrowdSec Protection |
| AR/3D | Model-Viewer / WebXR | "View in Room" AR capability |
| Audio | **Piper/Bark** (Open Source) | AI Voice story narration |
| Search | Supabase Search / Filter | Product search |
| Payments | COD + Impact Fund Tipping | Support for artisans |

**Pages Included:**
- Homepage, Products, Categories, Crafts, Regions
- Artisan profiles, Stories/Blog
- Cart, Checkout (COD), Account
- About, Contact, FAQ, Search, **How-to Guide**

---

### App 2: Admin & Artist Panels (Vercel - Full Stack)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+ (App Router) | Full SSR/RSC capabilities |
| Backend | Next.js API Routes | Server-side operations |
| Database | Supabase (PostgreSQL) | Secure server-side DB access |
| Auth | Supabase Auth + Middleware | Role-based access (Admin/Artist) |
| Storage | Supabase Storage | Secure file uploads |
| Functions | Supabase Edge Functions | Background tasks, webhooks |

**Admin Panel Features (12+ pages):**
- Dashboard, Products, Orders, Artisans
- Customers, Categories, Regions
- Reports (Sales, Analytics), Content Management
- Settings (COD, WhatsApp, Shipping, SEO), **Admin User Guide**

**Artist Panel Features (12+ pages):**
- Dashboard (with Market Insight Analytics), Onboarding, Products (CRUD)
- Orders, Earnings, Profile, Story Editor, Settings, **Artisan User Guide**
- **AI Tool**: Voice/Rough text to product description generator
- **QR Manager**: Generate and print provenance QR codes


---

### Shared Supabase Services

| Service | Technology | Shared Across |
|---------|------------|---------------|
| Database | Supabase (Postgres + pgvector) | Both apps (Semantic Search) |
| Auth | Supabase Auth (Custom Claims) | Single user system + RBAC |
| Storage | Supabase Storage | Shared media bucket |
| Functions | Supabase Edge Functions | AI processing, webhooks |
| Security | BunkerWeb + CrowdSec | WAF & Bot Defense |
| AI | Llama 3 / Whisper / Piper | Open Source AI Stack |
| XR | WebXR / Google Model-Viewer | Augmented Reality components |
| Analytics | Google Analytics 4 | Unified tracking |

---

### Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ENHANCED HYBRID ARCHITECTURE (v2.0)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [GLOBAL USERS]                 [CDN EDGE]               [ADMINS/ARTISTS]   │
│         │                            │                           │          │
│         ▼                            ▼                           ▼          │
│  ┌────────────────┐        ┌──────────────────┐       ┌─────────────────┐   │
│  │   HOSTINGER    │        │    BUNKERWEB     │       │     VERCEL      │   │
│  │ (Client Web)   │◄───────┤  (WAF / Proxy)   ├──────►│ (Admin/Artist)  │   │
│  └───────┬────────┘        └────────┬─────────┘       └────────┬────────┘   │
│          │                          │                          │            │
│          │           ┌──────────────▼──────────────┐           │            │
│          └──────────►│      SUPABASE BACKEND       │◄──────────┘            │
│                      ├─────────────────────────────┤                        │
│                      │  ✓ Postgres (pgvector)      │                        │
│                      │  ✓ Real-time Listeners      │                        │
│                      │  ✓ Storage (3D/Video)       │                        │
│                      │  ✓ RLS Security Policies    │                        │
│                      │  ✓ Edge Functions (AI)      │                        │
│                      └──────────────┬──────────────┘                        │
│                                     │                                       │
│          ┌──────────────────────────┴──────────────────────────┐            │
│          ▼                          ▼                          ▼            │
│  ┌────────────────┐        ┌──────────────────┐       ┌─────────────────┐   │
│  │   LLAMA 3      │        │   PIPER/BARK     │       │  WHATSAPP API   │   │
│  │ (Content AI)   │        │  (Voice Stories)  │       │ (Order Engine)  │   │
│  └────────────────┘        └──────────────────┘       └─────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Why Two Separate Apps?

| Aspect | Client Site (Hostinger) | Admin/Artist (Vercel) |
|--------|------------------------|----------------------|
| **Purpose** | Public storefront | Management dashboard |
| **Users** | Customers (public) | Admin & Artists only |
| **SEO** | Critical (static pages) | Not needed |
| **Cost** | $3-10/month | Free tier available |
| **Performance** | CDN-cached static | Dynamic SSR |
| **Features** | Read-heavy, browsing | Write-heavy, CRUD |
| **Security** | Client-side auth | Server-side middleware |
| **Deployment** | Manual upload | Git push auto-deploy |
| **API Routes** | Not supported | Full support |
| **Server Actions** | Not supported | Full support |

---

### Domain Configuration

```
MAIN DOMAIN (Hostinger):
thelocalcrafts.com          → Hostinger public_html (A Record)
www.thelocalcrafts.com      → Redirect to thelocalcrafts.com

SUBDOMAIN (Vercel):
admin.thelocalcrafts.com    → Vercel (CNAME Record)

DNS RECORDS:
┌─────────────────────────────────────────────────────────────┐
│ Type   │ Name      │ Value                    │ TTL        │
├────────┼───────────┼──────────────────────────┼────────────┤
│ A      │ @         │ [Hostinger IP]           │ 3600       │
│ CNAME  │ www       │ @                        │ 3600       │
│ CNAME  │ admin     │ cname.vercel-dns.com     │ 3600       │
└─────────────────────────────────────────────────────────────┘
```

---

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

```markdown
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
```

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

---

## Vercel Admin & Artist Panel Deployment

### Project Structure (Separate Repository)

```
thelocalcrafts-admin/              # Separate Git repository
├── .github/
│   └── workflows/
│       └── deploy.yml             # Auto-deploy on push
│
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   │
│   ├── admin/                     # Admin Panel (12+ pages)
│   │   ├── layout.tsx             # Admin layout with sidebar
│   │   ├── page.tsx               # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx           # Product list
│   │   │   ├── new/page.tsx       # Add product
│   │   │   └── [id]/page.tsx      # Edit product
│   │   ├── orders/
│   │   │   ├── page.tsx           # Order list
│   │   │   └── [id]/page.tsx      # Order details
│   │   ├── artisans/
│   │   │   ├── page.tsx           # Pending approvals
│   │   │   ├── approved/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── customers/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── regions/page.tsx
│   │   ├── reports/
│   │   │   ├── sales/page.tsx
│   │   │   ├── artisans/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── content/
│   │   │   ├── pages/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   └── banners/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── cod/page.tsx
│   │       ├── whatsapp/page.tsx
│   │       ├── shipping/page.tsx
│   │       └── seo/page.tsx
│   │
│   ├── artist/                    # Artist Panel (8+ pages)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Dashboard
│   │   ├── onboarding/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── earnings/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── story/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── api/                       # API Routes (Full Support)
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/
│   │   │   ├── route.ts           # GET, POST
│   │   │   └── [id]/route.ts      # GET, PUT, DELETE
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── artisans/route.ts
│   │   ├── upload/route.ts        # File upload handler
│   │   ├── reports/route.ts
│   │   └── webhooks/
│   │       └── route.ts           # External webhooks
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── admin/                     # Admin-specific components
│   │   ├── Sidebar.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── OrderTable.tsx
│   │   ├── ProductForm.tsx
│   │   └── ...
│   ├── artist/                    # Artist-specific components
│   │   ├── Sidebar.tsx
│   │   ├── EarningsChart.tsx
│   │   └── ...
│   └── ui/                        # Shared UI components
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts              # Supabase Server Client
│   │   └── client.ts              # Supabase Client SDK
│   ├── auth/
│   │   └── middleware.ts          # Auth middleware
│   └── utils/
│
├── middleware.ts                  # Next.js Middleware for auth
├── next.config.js
├── package.json
├── vercel.json
└── .env.local
```

### next.config.js (Vercel - Full Features)

```javascript
// next.config.js for Admin/Artist Panel
/** @type {import('next').NextConfig} */
const nextConfig = {
  // NO output: 'export' - use full Next.js features

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLIENT_URL: 'https://thelocalcrafts.com',
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
```

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_CLIENT_URL": "https://thelocalcrafts.com"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://thelocalcrafts.com" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### Supabase Server Client Setup

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Secret key

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

### Middleware for Role-Based Auth

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  try {
    // Verify session using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { role } = await response.json();

    // Admin routes - only admin
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/artist', request.url));
    }

    // Artist routes - admin or artist
    if (pathname.startsWith('/artist') && !['admin', 'artist'].includes(role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/artist/:path*'],
};
```

### API Route Example (Server-Side Supabase)

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET all products (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: products, error } = await query.limit(limit);

    if (error) throw error;

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const auth = await verifyAuth(request);
    if (!auth || !['admin', 'artist'].includes(auth.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const productRef = await adminDb.collection('products').add({
      ...data,
      artisanId: auth.role === 'artist' ? auth.uid : data.artisanId,
      status: auth.role === 'admin' ? 'published' : 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      id: productRef.id,
      message: 'Product created successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
```

### Server Actions (App Router)

```typescript
// app/admin/products/actions.ts
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';

export async function approveProduct(productId: string) {
  await adminDb.collection('products').doc(productId).update({
    status: 'published',
    approvedAt: new Date(),
  });

  revalidatePath('/admin/products');
  return { success: true };
}

// lib/actions/products.ts
export async function deleteProduct(productId: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  
  revalidatePath('/admin/products');
  return { success: true };
}

export async function bulkApproveProducts(productIds: string[]) {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ status: 'published', approved_at: new Date().toISOString() })
    .in('id', productIds);

  if (error) throw error;
  
  revalidatePath('/admin/products');
  return { success: true, count: productIds.length };
}
```

### Vercel Environment Variables

```bash
# .env.local (Vercel Dashboard → Settings → Environment Variables)

# Supabase Client SDK (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Supabase Server SDK (Secret)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_CLIENT_URL=https://thelocalcrafts.com
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://admin.thelocalcrafts.com
```

### Vercel Deployment Steps

```markdown
## Deploy Admin Panel to Vercel

### 1. Create Vercel Account
- Go to vercel.com
- Sign up with GitHub

### 2. Import Repository
- Click "Add New" → "Project"
- Import thelocalcrafts-admin repository
- Select Framework: Next.js

### 3. Configure Project
- Root Directory: ./
- Build Command: npm run build
- Output Directory: .next

### 4. Add Environment Variables
- Add all variables from .env.local
- Make sure FIREBASE_PRIVATE_KEY is properly escaped

### 5. Configure Domain
- Go to Project Settings → Domains
- Add: admin.thelocalcrafts.com
- Add CNAME record in Hostinger DNS:
  - Type: CNAME
  - Name: admin
  - Value: cname.vercel-dns.com

### 6. Deploy
- Click "Deploy"
- Vercel auto-deploys on every push to main

### 7. Verify
- [ ] admin.thelocalcrafts.com loads
- [ ] Login works
- [ ] Supabase connection works
- [ ] Admin can see dashboard
- [ ] Artist can access artist panel
```

### Vercel Deployment Checklist

```markdown
## Vercel Admin Panel Checklist

### Pre-Deployment
- [ ] Supabase credentials (URL/Key) ready
- [ ] Service account JSON downloaded
- [ ] All environment variables documented

### Vercel Setup
- [ ] GitHub repository connected
- [ ] Environment variables added
- [ ] Domain configured (admin.thelocalcrafts.com)

### DNS Configuration (Hostinger)
- [ ] CNAME record added for 'admin' subdomain
- [ ] SSL certificate active
- [ ] DNS propagation complete (up to 48 hours)

### Post-Deployment Testing
- [ ] Login page accessible
- [ ] Admin login works with correct role
- [ ] Artist login works with correct role
- [ ] Unauthorized users redirected
- [ ] Products CRUD works
- [ ] Orders display correctly
- [ ] Image upload works
- [ ] Real-time updates work

### Security
- [ ] Middleware protecting routes
- [ ] API routes require authentication
- [ ] Supabase RLS policies updated
- [ ] CORS configured for client domain
```

---

## Competitor Analysis

### Top 11 Competitors (SERP Analysis)

| # | Website | Strengths | Weaknesses | Traffic Est. |
|---|---------|-----------|------------|--------------|
| 1 | **vceela.com** | Artisan matching, 97K+ artisans, Crafts Map, workshops | Complex navigation | High |
| 2 | **hutch.pk** | Clean Shopify design, regional collections, affordable pricing | Limited categories | Medium |
| 3 | **sindhcrafts.com** | Sindh specialization, WooCommerce filters, authentic products | Single region focus | Medium |
| 4 | **made-in-pak.com** | Eco-friendly focus, WhatsApp integration, multi-currency | Limited artisan stories | Medium |
| 5 | **crafts-emporium.com** | 10-day guarantee, WhatsApp ordering, free shipping >10K | Limited categories, no artisan stories | Low-Medium |
| 6 | **craftshome.pk** | Low prices, variety | Basic UX | Medium |
| 7 | **pakistanicrafts.com** | Multi-region crafts, bundle offers, 7-day returns | Slow site, no artisan profiles | Low |
| 8 | **artcraft.pk** | Multan blue pottery specialist, eco-friendly, international shipping | Single craft focus | Medium |
| 9 | **pakcraftstore.com** | Islamic art focus, niche market | Limited scope | Low |
| 10 | **waoohandicrafts.com** | Luxury wooden products, Sheesham specialization | Single category | Low |
| 11 | **etsy.com/market/pakistani_handicraft** | Global reach, trust factor | High competition, fees | Very High |

### Competitor Keywords Extracted

**High-Value Primary Keywords**:
- pakistani handicrafts
- buy handicrafts pakistan
- handmade crafts pakistan
- pakistani artisan products
- traditional pakistani crafts

**Product-Specific Keywords**:
- blue pottery multan
- ajrak sindh online
- peshawari chappal buy
- truck art pakistan
- camel skin lamp
- sindhi embroidery
- balochi mirror work
- hunza embroidery
- chiniot woodwork
- kashmiri shawls pakistan

**Long-Tail Keywords**:
- buy authentic pakistani handicrafts online
- handmade gifts from pakistan
- traditional sindhi ajrak buy online
- multan blue pottery free shipping
- pakistani artisan jewelry handmade
- eco-friendly pakistani crafts
- wedding gifts pakistani handicrafts
- home decor pakistani traditional

**Local SEO Keywords**:
- handicrafts near [city]
- artisan crafts [province]
- local craftsmen [area]
- handmade products [landmark]

---

### Detailed Competitor Analysis

#### 1. ArtCraft.pk

| Attribute | Details |
|-----------|---------|
| **Focus** | Blue Pottery & Traditional Home Décor |
| **Location** | Multan, Punjab |
| **Strengths** | Authentic Multani blue pottery, eco-friendly emphasis, cultural heritage focus |
| **Color Scheme** | Primary: #00199b (deep blue), Accent: #1334ff, Neutral: #f5f5f5 |

**Product Categories:**
- Blue Pottery (tea sets, plates, bowls, vases)
- Wall Hangings & Mugs
- Candle Holders
- Woodwork Pieces
- Calligraphy Art
- Embroidered Pieces
- Corporate Gifts (custom)

**Key Features:**
- Nationwide + International shipping
- Sustainability & artisan support messaging
- Local business schema markup
- Montserrat typography

**Contact:** +923023747654 | info@artcraft.pk

**Learnings for The Local Crafts:**
- Strong regional identity (Multan specialization)
- Blue color scheme reflects product focus
- Eco-friendly messaging resonates with buyers

---

#### 2. PakistaniCrafts.com

| Attribute | Details |
|-----------|---------|
| **Focus** | Multi-category Wooden Handicrafts |
| **Location** | Faisalabad, Pakistan |
| **Strengths** | Wide variety, regional craft diversity, bundle offers |
| **Color Scheme** | Primary: #f8bb53 (golden), Accent: #af1414 (red), Text: #333333 |

**Product Categories:**
- Home Decor (Clocks, Flower Pots, Wall Art, Quran Rehal, Table Lamps, Tissue Boxes)
- Kitchenware (Utensils, Bread Roller, Hot Pot, Dinner Plates, Dry Fruit Boxes)
- Furniture (Coffee Tables, Stools, Home & Office)
- Traditionals (Multani & Sindhi Crafts)
- Covers (Sofa, LED, Fridge, Water Dispenser)
- Jewelry Boxes
- Bundle Offers
- Kaptaan Chappal

**Pricing Range:**
- Entry: PKR 2,056 (Wooden Plates)
- Mid: PKR 16,500–25,850 (Furniture Sets)
- Premium: PKR 82,500–99,000 (Wooden Cupboards)

**Key Features:**
- 7-day return policy
- 3-4 working day delivery
- Money back guarantee
- Quick view functionality
- Bundle discounts (up to 30%)
- Revolution Slider for products

**Regional Crafts Highlighted:**
- Multani Crafts
- Sindhi Crafts (hand embroidery, kilim)
- Swati Artwork
- Lacquer Art

**Learnings for The Local Crafts:**
- Bundle offers drive higher cart values
- Regional craft categorization aids discovery
- Golden/warm colors suit craft aesthetic

---

#### 3. Crafts-Emporium.com

| Attribute | Details |
|-----------|---------|
| **Focus** | Premium Wooden Handicrafts |
| **Location** | Rawalpindi, Pakistan |
| **Strengths** | Quality positioning, strong guarantees, WhatsApp support |
| **Color Scheme** | Earth tones, natural wood aesthetics, neutral backgrounds |

**Product Categories:**
- Watch Boxes (39 products)
- Tables (4 products)
- Restaurant Platters (5 products)
- Kitchen Items (34 products) - Spice Boxes, Wooden Hotpots, Dry Fruit Boxes
- Jewelry Boxes (11 products)
- Home Decor (71 products)

**Pricing Range:**
- Entry: PKR 890 (wooden platters)
- Mid: PKR 3,200–7,490
- Premium: PKR 12,000+
- Discounts: 13%–66% on select items

**Key Features:**
- 100% Money Back Guarantee (10 days)
- Free delivery on orders > PKR 10,000
- WhatsApp ordering: 0330 1580676
- Live chat support
- Drilldown mobile navigation

**Contact:** 051 8436630 | SF10, 2nd Floor, Nadra/Passport Building, Rawalpindi

**Learnings for The Local Crafts:**
- WhatsApp integration is essential (already planned)
- Free shipping threshold drives larger orders
- Strong guarantee messaging builds trust
- Watch boxes & jewelry boxes are popular niches

---

### Competitive Advantage Matrix

| Feature | ArtCraft | PakistaniCrafts | Crafts-Emporium | **The Local Crafts** |
|---------|----------|-----------------|-----------------|----------------------|
| Multi-vendor | No | No | No | **Yes** |
| Artisan Profiles | No | No | No | **Yes** |
| Regional Pages | Limited | Yes | No | **Yes (All Pakistan)** |
| WhatsApp Order | No | No | Yes | **Yes** |
| COD | Unknown | Yes | Yes | **Yes** |
| Artisan Stories | No | No | No | **Yes** |
| Craft History | No | No | No | **Yes** |
| Multi-language | No | No | No | **Yes (EN/UR)** |
| Mobile App | No | No | No | **Future** |

---

## Pakistan Craft Regions

### Province-wise Craft Mapping

#### 1. PUNJAB

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Multan** | Hussain Agahi Bazaar | Blue Pottery, Camel Skin Lamps, Khussa, Embroidery | multan blue pottery, multani khussa, camel lamp multan |
| **Chiniot** | Chiniot Furniture Market | Wood Carving, Rosewood Furniture, Lacquer Art | chiniot furniture, wood carving chiniot |
| **Bahawalpur** | Shahi Bazaar | Khussa, Embroidery, Pottery | bahawalpur khussa, bahawalpur crafts |
| **Lahore** | Anarkali, Liberty | Carpets, Leather Goods, Jewelry | lahore handicrafts, anarkali market crafts |
| **Gujranwala** | Main Bazaar | Metalwork, Jewelry | gujranwala brass work |
| **Sialkot** | Industrial Area | Sports Goods, Leather | sialkot leather crafts |
| **Faisalabad** | Ghanta Ghar | Textiles, Embroidery | faisalabad textiles |

#### 2. SINDH

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Karachi** | Empress Market, Saddar | Rilli, Ajrak, Blue Pottery, Sindhi Topi | karachi handicrafts, sindhi crafts karachi |
| **Hyderabad** | Shahi Bazaar | Lacquer Bangles, Embroidery, Ajrak | hyderabad bangles, sindhi embroidery |
| **Hala** | Hala Town | Hala Pottery, Glazed Tiles, Kashi Work | hala pottery, hala tiles pakistan |
| **Thatta** | Makli Necropolis Area | Stone Carving, Tile Work | thatta crafts, makli stone work |
| **Tharparkar** | Mithi, Nagarparkar | Rilli Quilts, Mirror Work, Embroidery | tharparkar rilli, thar embroidery |
| **Sukkur** | Main Bazaar | Sindhi Caps, Ajrak | sukkur handicrafts |
| **Nawabshah** | Craft Centers | Embroidery, Applique | nawabshah embroidery |

#### 3. KHYBER PAKHTUNKHWA (KPK)

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Peshawar** | Qissa Khwani Bazaar, Misgaran Bazaar | Peshawari Chappal, Brass Work, Carpets | peshawari chappal, peshawar brass, qissa khwani crafts |
| **Swat** | Mingora, Saidu Sharif | Wood Carving, Marble Work, Embroidery | swat woodwork, swat marble |
| **Charsadda** | Craft Villages | Pottery, Embroidery | charsadda pottery |
| **Dir** | Upper/Lower Dir | Woodwork, Textiles | dir handicrafts |
| **Chitral** | Chitral Bazaar | Woolen Products, Shu (Felt Boots) | chitral shawls, chitral felt crafts |
| **Mardan** | Local Markets | Embroidery, Textiles | mardan embroidery |

#### 4. BALOCHISTAN

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Quetta** | Kandahari Bazaar | Balochi Embroidery, Mirror Work, Carpets | quetta handicrafts, balochi embroidery, kandahari bazaar |
| **Chaman** | Border Markets | Leather Sandals, Carpets | chaman leather crafts |
| **Gwadar** | Coastal Area | Shell Crafts, Fishing Nets | gwadar shell crafts |
| **Ziarat** | Juniper Area | Woolen Products, Embroidery | ziarat woolens |
| **Turbat** | Makran Region | Needlework, Embroidery | turbat embroidery makran |
| **Khuzdar** | Craft Centers | Carpet Weaving, Metalwork | khuzdar carpets |

#### 5. GILGIT-BALTISTAN

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Gilgit** | Gilgit Bazaar | Gemstone Jewelry, Woolen Products | gilgit gemstones, gilgit handicrafts |
| **Hunza** | Karimabad, Baltit Fort Area | Hunza Embroidery, Wooden Bowls, Walnut Products | hunza embroidery, hunza walnut crafts |
| **Skardu** | Skardu Bazaar | Gemstones, Woolen Shawls | skardu gemstones, skardu shawls |
| **Ghizer** | Gahkuch | Woolen Products, Embroidery | ghizer handicrafts |
| **Nagar** | Nagar Valley | Traditional Embroidery | nagar valley crafts |

#### 6. AZAD JAMMU & KASHMIR

| City/Area | Landmark/Bazaar | Crafts | Keywords |
|-----------|-----------------|--------|----------|
| **Muzaffarabad** | Main Bazaar | Kashmiri Shawls, Woodwork | muzaffarabad shawls, kashmiri crafts |
| **Mirpur** | Craft Centers | Embroidery, Pottery | mirpur handicrafts |
| **Rawalakot** | Poonch Area | Woolen Products | rawalakot woolens |
| **Kotli** | Local Markets | Textiles | kotli textiles |

---

## Craft Categories (Complete List)

### Textiles & Fabrics
- Ajrak (Sindh) - Block-printed fabric
- Rilli/Rallis - Patchwork quilts
- Phulkari - Floral embroidery
- Chunri - Tie-dye fabric
- Pashmina Shawls
- Sussi Cloth
- Khadi Cloth
- Khaddar

### Embroidery Styles
- Sindhi Embroidery
- Balochi Mirror Work
- Hunza Embroidery
- Hazara Embroidery
- Cross-Stitch
- Kashmiri Crewel

### Pottery & Ceramics
- Multan Blue Pottery (Kashi)
- Hala Pottery
- Terracotta Pottery
- Glazed Tiles

### Leather Crafts
- Peshawari Chappal
- Multani Khussa
- Kohati Chappal
- Camel Skin Lamps
- Leather Bags

### Woodwork
- Chiniot Carved Furniture
- Swat Wood Carving
- Haripur Woodwork
- Lacquer Art

### Metalwork
- Peshawar Brass Work
- Copper Utensils
- Silver Jewelry
- Tribal Jewelry

### Stone & Gems
- Onyx Products
- Marble Carving
- Gemstone Jewelry (Gilgit)
- Salt Products (Khewra)

### Decorative Arts
- Truck Art
- Calligraphy
- Miniature Paintings
- Papier-mâché

### Home Décor
- Carpets & Rugs
- Wall Hangings
- Lamps & Lanterns
- Cushion Covers
- Table Runners

---

## Color Palette System

### Primary Palette (Brand Colors)

Based on competitor analysis and craft aesthetics:

```scss
// Primary - Warm Terracotta (Heritage & Craft)
$primary-50: #FEF3E8;
$primary-100: #FCE4CC;
$primary-200: #F9C99A;
$primary-300: #F5A862;
$primary-400: #F08B3A;
$primary-500: #C25500; // Main brand color (from your current site)
$primary-600: #9A3D00;
$primary-700: #7A2F00;
$primary-800: #5C2300;
$primary-900: #3D1700;

// Secondary - Deep Indigo (Ajrak Inspired)
$secondary-50: #EEF2FF;
$secondary-100: #E0E7FF;
$secondary-200: #C7D2FE;
$secondary-300: #A5B4FC;
$secondary-400: #818CF8;
$secondary-500: #1E3A5F; // Ajrak blue
$secondary-600: #172E4D;
$secondary-700: #12243D;
$secondary-800: #0D1A2D;
$secondary-900: #08101D;

// Accent - Artisan Gold
$accent-50: #FFFBEB;
$accent-100: #FEF3C7;
$accent-200: #FDE68A;
$accent-300: #FCD34D;
$accent-400: #FBBF24;
$accent-500: #D4A012;
$accent-600: #B8860B;
$accent-700: #92400E;
$accent-800: #78350F;
$accent-900: #451A03;

// Neutrals - Warm Grays
$neutral-50: #FAFAF9;
$neutral-100: #F5F5F4;
$neutral-200: #E7E5E4;
$neutral-300: #D6D3D1;
$neutral-400: #A8A29E;
$neutral-500: #78716C;
$neutral-600: #57534E;
$neutral-700: #44403C;
$neutral-800: #292524;
$neutral-900: #1C1917;

// Semantic Colors
$success: #059669;
$warning: #D97706;
$error: #DC2626;
$info: #0284C7;
```

### Usage Guidelines

| Element | Color | Usage |
|---------|-------|-------|
| Primary CTA Buttons | $primary-500 | Buy Now, Add to Cart |
| Secondary Buttons | $secondary-500 | Learn More, View Details |
| Links | $primary-600 | Text links |
| Headers | $neutral-800 | Page titles |
| Body Text | $neutral-700 | Main content |
| Backgrounds | $neutral-50, white | Page backgrounds |
| Cards | white, $neutral-100 | Product cards |
| Accents | $accent-500 | Badges, ratings, highlights |
| Success States | $success | Order confirmed |
| Error States | $error | Validation errors |

---
thelocalcrafts/
├── .github/workflows/          # CI/CD (ci.yml, deploy.yml)
├── public/                     # Static assets
│   ├── images/{logo,hero,categories,icons}
│   ├── fonts/
│   └── robots.txt, sitemap.xml, manifest.json
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (client)/           # 15+ client pages (products, categories, crafts, regions, etc.)
│   │   ├── (auth)/             # 4 auth pages
│   │   ├── [admin/              # 12+ admin pages
│   │   ├── artist/]             # 8 artist panel pages
│   │   └── api/                # 8 API routes
│   │
│   ├── components/             # 50+ components
│   │   ├── ui/                 # 10 base UI components
│   │   ├── layout/             # Header, Footer, Sidebar, Breadcrumb
│   │   ├── products/           # 9 product components
│   │   ├── artisan/            # 4 artisan components
│   │   ├── cart/               # 5 cart components (incl. CartToWhatsApp)
│   │   ├── checkout/           # 5 checkout components
│   │   ├── home/               # 7 home components (incl. CraftMap)
│   │   ├── seo/                # 4 SEO components (incl. AEO/Semantic)
│   │   ├── ai/                 # 3 AI-specific components
│   │   └── common/             # 5 common components
│   │
│   ├── lib/                    # Libraries
│   │   ├── supabase/           # 5 Supabase modules
│   │   ├── hooks/              # 7 custom hooks
│   │   ├── context/            # 3 context providers
│   │   ├── utils/              # 5 utility files
│   │   └── services/           # 6 service files
│   │
│   ├── styles/                 # SCSS files
│   ├── types/                  # 6 TypeScript type files
│   └── data/                   # 3 JSON data files
│
├── scripts/                    # 3 build scripts
└── config files                # package.json, tsconfig.json, etc.


## Silo File Structure

```
thelocalcrafts/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── public/
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── categories/
│   │   └── icons/
│   ├── fonts/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (client)/                 # Client-facing pages (grouped)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # /products - All products
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # /products/[slug] - Product detail
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx          # /categories
│   │   │   │   └── [category]/
│   │   │   │       ├── page.tsx      # /categories/blue-pottery
│   │   │   │       └── [subcategory]/
│   │   │   │           └── page.tsx  # /categories/pottery/blue-pottery
│   │   │   │
│   │   │   ├── crafts/               # SEO Landing Pages by Craft Type
│   │   │   │   ├── page.tsx
│   │   │   │   ├── blue-pottery/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ajrak/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── peshawari-chappal/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── sindhi-embroidery/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── truck-art/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [...craft]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── regions/              # Local SEO - Geographic Pages
│   │   │   │   ├── page.tsx          # /regions - All regions
│   │   │   │   │
│   │   │   │   ├── punjab/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── multan/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── hussain-agahi-bazaar/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── chiniot/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── lahore/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── bahawalpur/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── sindh/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── karachi/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── hyderabad/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── hala/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── tharparkar/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── kpk/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── peshawar/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── qissa-khwani-bazaar/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── swat/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── balochistan/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── quetta/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── chaman/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── gilgit-baltistan/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── hunza/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── skardu/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   └── kashmir/
│   │   │   │       ├── page.tsx
│   │   │   │       └── muzaffarabad/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── artisans/             # Artisan Profiles
│   │   │   │   ├── page.tsx          # /artisans - Directory
│   │   │   │   └── [artisanId]/
│   │   │   │       └── page.tsx      # /artisans/[id] - Profile
│   │   │   │
│   │   │   ├── stories/              # Content Marketing / Blog
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── account/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── wishlist/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── search/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/                    # Admin Panel
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Edit product
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── artisans/
│   │   │   │   ├── page.tsx          # Pending approvals
│   │   │   │   ├── approved/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── customers/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── regions/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── sales/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── artisans/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx
│   │   │   ├── content/
│   │   │   │   ├── pages/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── banners/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── cod/
│   │   │       │   └── page.tsx      # COD settings
│   │   │       ├── whatsapp/
│   │   │       │   └── page.tsx      # WhatsApp order settings
│   │   │       ├── shipping/
│   │   │       │   └── page.tsx
│   │   │       └── seo/
│   │   │           └── page.tsx
│   │   │
│   │   ├── artist/                   # Artist/Vendor Panel
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── earnings/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── story/
│   │   │   │   └── page.tsx          # Artisan story editor
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   └── route.ts
│   │   │   ├── artisans/
│   │   │   │   └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts          # Create COD order
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── whatsapp/
│   │   │   │   └── route.ts          # Generate WhatsApp order link
│   │   │   └── notifications/
│   │   │       └── route.ts          # Order notifications
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── globals.scss
│   │
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   ├── Badge/
│   │   │   ├── Toast/
│   │   │   ├── Skeleton/
│   │   │   ├── Pagination/
│   │   │   └── Rating/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   └── CartIcon.tsx
│   │   │   ├── Footer/
│   │   │   │   └── Footer.tsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── ArtistSidebar.tsx
│   │   │   └── Breadcrumb/
│   │   │       └── Breadcrumb.tsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── ProductQuickView.tsx
│   │   │   ├── ProductReviews.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   └── WhatsAppOrderBtn.tsx  # Order on WhatsApp button
│   │   │
│   │   ├── artisan/
│   │   │   ├── ArtisanCard.tsx
│   │   │   ├── ArtisanProfile.tsx
│   │   │   ├── ArtisanStory.tsx
│   │   │   └── ArtisanProducts.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartToWhatsApp.tsx    # Send entire cart to WhatsApp
│   │   │   └── CartActions.tsx       # Bulk cart actions
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ShippingForm.tsx
│   │   │   ├── CODOption.tsx         # Cash on Delivery
│   │   │   ├── WhatsAppCheckout.tsx  # Complete order via WhatsApp
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── CategoryShowcase.tsx
│   │   │   ├── RegionHighlights.tsx
│   │   │   ├── ArtisanSpotlight.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   │
│   │   ├── seo/
│   │   │   ├── JsonLd.tsx
│   │   │   ├── MetaTags.tsx
│   │   │   └── CanonicalUrl.tsx
│   │   │
│   │   └── common/
│   │       ├── ImageUpload.tsx
│   │       ├── RichTextEditor.tsx
│   │       ├── RegionSelector.tsx
│   │       ├── CraftTypeSelector.tsx
│   │       └── PriceDisplay.tsx
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useOrders.ts
│   │   │   ├── useArtisan.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useWhatsAppOrder.ts   # WhatsApp order hook
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CartContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── helpers.ts
│   │   │   ├── seo.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── services/
│   │       ├── productService.ts
│   │       ├── orderService.ts
│   │       ├── artisanService.ts
│   │       ├── whatsappService.ts    # WhatsApp cart & order messaging
│   │       ├── cartToWhatsApp.ts     # Generate cart summary for WhatsApp
│   │       └── emailService.ts
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _typography.scss
│   │   ├── _bootstrap-overrides.scss
│   │   ├── components/
│   │   │   ├── _buttons.scss
│   │   │   ├── _cards.scss
│   │   │   └── _forms.scss
│   │   └── pages/
│   │       ├── _home.scss
│   │       ├── _product.scss
│   │       └── _dashboard.scss
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── artisan.ts
│   │   └── region.ts
│   │
│   └── data/
│       ├── regions.json              # All Pakistan regions data
│       ├── crafts.json               # Craft types taxonomy
│       └── seo-content.json          # Pre-written SEO content
│
├── scripts/
│   ├── seed-regions.ts               # Seed region data
│   ├── generate-sitemap.ts
│   └── optimize-images.ts
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js                # If using Tailwind alongside Bootstrap
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema (Postgres / Supabase)

### Table Structure (SQL)

```typescript
// users/{userId}
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'customer' | 'artist' | 'admin';
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

### Supabase Core Configurations (SQL)

```sql
-- 1. Enable pgvector & Semantic Search
create extension if not exists vector;

-- Add embedding column to products for 'Vibe Discovery'
alter table products add column embedding vector(1536);

-- Similarity search function
create or replace function match_products (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (id uuid, title text, similarity float)
language sql stable as $$
  select id, title, 1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- 2. Unified Identity & RBAC (Custom Claims)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'artisan', 'customer')) default 'customer'
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'customer');
  update auth.users set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', '"customer"'
  ) where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```


// artisans/{artisanId}
interface Artisan {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  bio: string;
  story: string;                    // Rich text - artisan's journey
  avatar: string;
  coverImage: string;

  // Location (for Local SEO)
  location: {
    province: string;               // 'punjab' | 'sindh' | 'kpk' | 'balochistan' | 'gilgit-baltistan' | 'kashmir'
    city: string;
    area?: string;
    landmark?: string;
    coordinates?: GeoPoint;
  };

  craftTypes: string[];             // ['blue-pottery', 'camel-skin']

  // Verification & Status
  status: 'pending' | 'approved' | 'suspended';
  verified: boolean;
  verificationDocs: string[];

  // Stats
  totalProducts: number;
  totalSales: number;
  rating: number;
  reviewCount: number;

  // Mastery & Impact
  masteryTier: 'apprentice' | 'artisan' | 'master';
  impactStats: {
    toolsFunded: number;
    apprenticesTrained: number;
    communityProjects: string[];
  };


  // Bank Details (encrypted)
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  };

  // Social
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };

  createdAt: string;                // ISO Timestamptz
  updatedAt: string;                // ISO Timestamptz
}

// products/{productId}
interface Product {
  id: string;
  artisanId: string;
  artisanName: string;              // Denormalized for queries

  // Basic Info
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Categorization
  category: string;
  subcategory?: string;
  craftType: string;
  tags: string[];

  // Location (inherited from artisan, can override)
  origin: {
    province: string;
    city: string;
    area?: string;
  };

  // Pricing
  price: number;
  compareAtPrice?: number;
  currency: 'PKR';

  // Inventory
  sku: string;
  stock: number;
  trackInventory: boolean;

  // Media
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  video?: string;
  arModelUrl?: string;               // .glb path for AR View in Room


  // Variants (optional)
  hasVariants: boolean;
  variants?: {
    id: string;
    name: string;              // e.g., "Size", "Color"
    options: {
      value: string;
      price?: number;
      stock?: number;
      sku?: string;
    }[];
  }[];

  // Shipping
  weight: number;                   // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass: 'standard' | 'fragile' | 'oversized';

  // Status
  status: 'draft' | 'pending' | 'published' | 'rejected';
  featured: boolean;

  // Stats
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;

  createdAt: string;                // ISO Timestamptz
  updatedAt: string;                // ISO Timestamptz
  publishedAt?: string;             // ISO Timestamptz

  // Advanced Enhancements
  qrCodeUrl?: string;               // Digital Provenance link
  embedding?: number[];              // Vector embedding for Semantic Search
  analytics: {
    views: number;
    wishlistCount: number;
    cartAdds: number;
  };
  impactTip: number;                 // Direct-to-Artisan tip amount

}

// orders/{orderId}
interface Order {
  id: string;
  orderNumber: string;              // TLC-2024-XXXXX
  customerId: string;
  customerEmail: string;

  // Items (denormalized)
  items: {
    productId: string;
    artisanId: string;
    title: string;
    image: string;
    variant?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];

  // Shipping
  shippingAddress: Address;
  shippingMethod: string;
  shippingCost: number;

  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: 'PKR';

  // Payment & Order Method
  paymentMethod: 'cod';               // Cash on Delivery only
  orderChannel: 'website' | 'whatsapp';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  whatsappOrderId?: string;           // If ordered via WhatsApp

  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

  // Tracking
  trackingNumber?: string;
  trackingUrl?: string;

  // Notes
  customerNote?: string;
  adminNote?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// reviews/{reviewId}
interface Review {
  id: string;
  productId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  verified: boolean;                // Verified purchase
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

// categories/{categoryId}
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  order: number;
  productCount: number;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
}

// regions/{regionId}
interface Region {
  id: string;
  type: 'province' | 'city' | 'area' | 'landmark';
  name: string;
  slug: string;
  parentId?: string;
  description: string;
  image?: string;
  crafts: string[];                 // Craft types found here
  artisanCount: number;
  productCount: number;

  // SEO Content
  metaTitle: string;
  metaDescription: string;
  longDescription: string;          // Rich SEO content

  // Coordinates for map
  coordinates?: GeoPoint;

  isActive: boolean;
}

// crafts/{craftId}
interface Craft {
  id: string;
  name: string;
  slug: string;
  category: string;                 // 'textiles', 'pottery', 'leather', etc.
  description: string;
  history: string;                  // Rich content about craft history
  process: string;                  // How it's made
  image: string;
  gallery: string[];
  regions: string[];                // Where this craft is found

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  productCount: number;
  artisanCount: number;
  isActive: boolean;
}
```

---

## WhatsApp Cart Integration

### Overview
Customers can add multiple products to cart and send the entire order to WhatsApp with one click. This eliminates the need for online payment processing while providing a seamless ordering experience.

### WhatsApp Message Format

```
🛒 *New Order from The Local Crafts*
━━━━━━━━━━━━━━━━━━━━━━

📦 *Order Items:*

1. Blue Pottery Vase (Large)
   Qty: 2 × PKR 2,500 = PKR 5,000

2. Sindhi Ajrak Shawl
   Qty: 1 × PKR 3,200 = PKR 3,200

3. Peshawari Chappal (Size 42)
   Qty: 1 × PKR 1,800 = PKR 1,800

━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* PKR 10,000
🚚 *Shipping:* PKR 200
━━━━━━━━━━━━━━━━━━━━━━
✨ *Total:* PKR 10,200
━━━━━━━━━━━━━━━━━━━━━━

👤 *Customer:* [Name]
📱 *Phone:* [Phone]
📍 *Address:* [Delivery Address]

💳 *Payment:* Cash on Delivery (COD)

🔗 View order: thelocalcrafts.com/order/TLC-2024-XXXXX
```

### Implementation Code

```typescript
// services/cartToWhatsApp.ts

interface CartItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  customer?: CustomerInfo,
  shipping: number = 200
): string {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shipping;

  let message = `🛒 *New Order from The Local Crafts*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📦 *Order Items:*\n\n`;

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}`;
    if (item.variant) message += ` (${item.variant})`;
    message += `\n   Qty: ${item.quantity} × PKR ${item.price.toLocaleString()} = PKR ${itemTotal.toLocaleString()}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Subtotal:* PKR ${subtotal.toLocaleString()}\n`;
  message += `🚚 *Shipping:* PKR ${shipping.toLocaleString()}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ *Total:* PKR ${total.toLocaleString()}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (customer?.name) message += `👤 *Customer:* ${customer.name}\n`;
  if (customer?.phone) message += `📱 *Phone:* ${customer.phone}\n`;
  if (customer?.address) message += `📍 *Address:* ${customer.address}\n\n`;

  message += `💳 *Payment:* Cash on Delivery (COD)`;

  return message;
}

export function openWhatsAppWithCart(
  items: CartItem[],
  customer?: CustomerInfo,
  phoneNumber: string = '923001234567' // Store WhatsApp number
): void {
  const message = generateWhatsAppMessage(items, customer);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
```

### Cart Component with WhatsApp Button

```tsx
// components/cart/CartToWhatsApp.tsx

'use client';

import { useCart } from '@/lib/hooks/useCart';
import { openWhatsAppWithCart } from '@/lib/services/cartToWhatsApp';

export function CartToWhatsApp() {
  const { items, subtotal } = useCart();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    openWhatsAppWithCart(
      items.map(item => ({
        id: item.id,
        name: item.title,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price
      }))
    );
  };

  return (
    <button
      onClick={handleWhatsAppOrder}
      disabled={items.length === 0}
      className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
    >
      <svg><!-- WhatsApp Icon --></svg>
      Order on WhatsApp
    </button>
  );
}
```

### Store WhatsApp Number Configuration

```typescript
// lib/utils/constants.ts

export const STORE_CONFIG = {
  whatsappNumber: '923001234567',  // Primary store WhatsApp
  whatsappBusinessName: 'The Local Crafts',
  freeShippingThreshold: 10000,    // PKR
  defaultShippingCost: 200,        // PKR
};
```

### Admin Settings for WhatsApp

In the Admin Panel, store owners can configure:
- Primary WhatsApp number
- Backup WhatsApp number
- Auto-reply message template
- Order notification preferences
- Business hours for WhatsApp support

---

## Panel Features

### Admin Panel Features

#### Dashboard
- Total revenue (daily/weekly/monthly/yearly)
- Order statistics & charts
- New artisan applications
- Low stock alerts
- Top selling products
- Revenue by region
- User acquisition metrics

#### Product Management
- View all products (with filters)
- Approve/reject pending products
- Feature products on homepage
- Bulk actions (approve, reject, delete)
- Product analytics

#### Order Management
- Order list with status filters
- Order details & timeline
- Update order status
- Refund processing
- Export orders (CSV/Excel)
- Shipping label generation

#### Artisan Management
- Pending applications queue
- Approved artisans list
- Artisan verification
- Mastery Tier assignment (Apprentice → Master)
- Commission management (Tier-based)
- Payout processing (incl. Impact Fund transfers)
- Performance reports


#### Customer Management
- Customer list
- Customer details & order history
- Customer support tickets

#### Content Management
- Homepage banners
- Category management
- Region pages content
- Craft type pages content
- Blog/Stories management
- FAQ management
- Static pages (About, Contact, Terms)

#### SEO Settings
- Meta tags templates
- Sitemap generation
- Schema markup settings
- Canonical URL rules
- Redirect management
- robots.txt editor

#### Settings
- General settings
- COD & WhatsApp order settings
- B2B Inquiry management
- Craftpedia Content Moderation
- Shipping zones & rates
- Tax settings
- Email templates
- Notification settings
- **Technical/Admin User Guide** (Internal documentation)

---

### Artist Panel Features

#### Dashboard
- Total earnings (+ Impact Fund totals)
- Mastery Tier Status
- Pending orders
- Product views
- Rating overview
- Quick actions


#### Onboarding
- Business registration form
- Location selection (province → city → area)
- Craft type selection
- Document upload (CNIC, Bank)
- Story/bio editor
- Profile photo upload

#### Product Management
- Add new product
- Edit products
- Image upload (with auto-optimization)
- Inventory management
- Variant management
- Pricing & discounts

#### Order Management
- New orders notification
- Order acceptance
- Shipping updates
- Order history

#### Earnings & Payouts
- Earnings dashboard
- Transaction history
- Payout requests
- Bank details management

#### Profile & Story
- Edit profile info
- Update artisan story
- Social links
- Gallery management

#### Analytics
- Product performance
- Customer insights
- Sales trends
- **Artisan Manual & Guide** (How to build heritage presence)

---

### Client (Customer) Features

#### Browse & Discover
- Homepage with featured products
- Category browsing
- Region exploration
- Craft type exploration
- Artisan discovery
- Search with filters

#### Product Experience
- Product gallery with zoom
- **3D/AR View in Room** – Visualize product in physical space
- **AI Voice Story** – Listen to the artisan's narrative
- Size/variant selection
- Add to cart
- **Quick WhatsApp Order** - Order single product directly on WhatsApp
- Wishlist
- Share product (including WhatsApp share)
- Read reviews
- Ask question


#### Cart & Checkout
- Cart management (add, remove, update quantities)
- Apply coupons
- Address management
- **Cash on Delivery (COD)** - Primary payment method
- **Send Cart to WhatsApp** - One-click button to send entire cart with all products to WhatsApp
- Order tracking

#### WhatsApp Order Flow
1. Customer adds multiple products to cart
2. Customer clicks "Order on WhatsApp" button
3. System generates formatted message with:
   - All cart items (name, quantity, price)
   - Total amount
   - Customer details (if logged in)
4. Opens WhatsApp with pre-filled message
5. Customer sends message to store number
6. Store confirms order via WhatsApp

#### Account
- Order history
- Wishlist
- Saved addresses
- Review management
- Account settings
- **Immersive User Guide** (How to experience the platform)

---

## Advanced Features & AI Integration

### 1. AI-Powered "Story to Product" Engine
- **Workflow**: Artist uploads Urdu voice note/text → Supabase Edge Function → Gemini Flash 1.5 (Multimodal) → Professional English Description + SEO Tags.
- **Tone**: Heritage-focused, poetic, and trust-building.

### 2. AEO & Semantic Search (pgvector)
- **Semantic Search**: Users search for "earthy tones" or "wedding footwear" to find Ajrak/Khussa via vector embeddings.
- **AEO (Answer Engine Optimization)**: Automated FAQ generation for Perplexity/ChatGPT indexing using structured JSON-LD.

### 3. Digital Provenance (QR Codes)
- **Feature**: Unique QR code generated for every physical product ship.
- **Landing Page**: Scannable link leading to the specific artisan's story, a video of the craft process, and an authenticity certificate.

### 4. Image Pipeline Optimization
- **Solution**: Supabase Storage Transformations + Next.js `unoptimized: true` (for static) + BlurHash.
- **Impact**: Instant 100/100 Lighthouse score on mobile by serving WebP/AVIF dynamically.

### 5. Multi-Currency & Global Logistics
- **Dynamic Pricing**: IP-based currency switching (USD, GBP, EUR) for global diaspora.
- **Logistics**: Automated weight-based international shipping calculations (DHL/FedEx integration tiers).

### 6. Interactive "Craft Map"
- **UX Component**: Custom SVG interactive map of Pakistan.
- **Functionality**: Region-wise craft discovery (Hover over Multan → Show Blue Pottery).

### 7. Artisan Analytics Dashboard
- **Insights**: Heatmaps of user interest, regional trend alerts (e.g., "High demand for Ajrak in Karachi"), and stock prediction.

### 8. Enhanced Security & Anti-Scraping
- **Protection**: Supabase RLS (Row Level Security) + Rate Limiting on public APIs to prevent data harvesting of artisan details.

---

## Premium Experience & Social Impact

### 1. "Texture-Infused" UI Design System
- **Concept**: High-resolution textures from the crafts (the grain of Chinioti wood, the weave of Ajrak, the glaze of pottery) used as subtle CSS overlays and background patterns.
- **Impact**: Moves beyond "flat" e-commerce into a tactile, premium experience that honors the physical nature of the products.

### 2. "Direct-to-Artisan" Social Impact Fund
- **Concept**: A checkout feature allowing customers to skip the middleman and "Tip the Maker" or contribute to a "Tooling Fund" (for better looms, raw materials, etc.).
- **Transparency**: Artisan profiles feature an "Impact Counter" (e.g., *"This artisan has funded 2 new pottery wheels through community support"*).

### 3. Immersive Commerce: Web-AR "View in Room"
- **Concept**: Use standard web AR (Model-Viewer) to let customers virtually "place" large items like vases, lamps, or furniture in their homes using their phone cameras.
- **Impact**: Reduces return rates for high-ticket items and provides a "wow" factor for premium buyers.

### 4. Multimodal Stories: AI Voice Narration
- **Concept**: High-quality AI-generated audio (using ElevenLabs-style voices) for every artisan story.
- **Impact**: Users can listen to the history of a craft while browsing the gallery, increasing "Time on Page" and enhancing accessibility.

### 5. "The Craftpedia" - Collaborative Wiki
- **Concept**: A moderated community encyclopedia documenting the history, tools, and technical processes of every craft in Pakistan.
- **Impact**: Creates a massive SEO Moat, positioning the brand as the world's primary authority on Pakistani handicrafts.

### 6. Artisan "Live-Feed" (Short-form Video)
- **Concept**: A vertical, "Instagram Story" style feed on the homepage featuring 15–30 second "Behind the Scenes" videos uploaded directly by artisans.
- **Trust**: Connects the customer directly to the workshop and proves the authenticity of the "handmade" claim.

### 7. B2B / Wholesale "Commission" Portal
- **Concept**: A dedicated workflow for interior designers, corporate gifters, and boutique hotels.
- **Features**: Includes a "Request Custom Commission" button, allowing B2B clients to specify dimensions or colors for bulk orders.

### 8. Artisan "Mastery" Tiers
- **Concept**: A gamified hierarchy (Apprentice → Artisan → Master) based on years of experience, heritage preservation, and customer feedback.
- **Incentive**: "Masters" receive a specialized verification badge, lower commission rates, and priority placement in the AI search results.

---

## Technical Implementation Specs (v2.0)

### 1. The Open Source "Shield" (BunkerWeb & CrowdSec)
- **Gateway**: Self-hosted BunkerWeb (Nginx-based) for SSL, WAF (OWASP CRS), and Edge Caching.
- **Bot Defense**: CrowdSec "Bouncer" integrated with BunkerWeb logs to block scrapers in real-time.
- **Config Snippet**:
```yaml
services:
  bunkerweb:
    image: bunkerity/bunkerweb:latest
    environment:
      - SERVER_NAME=thelocalcrafts.com admin.thelocalcrafts.com
      - AUTO_LETS_ENCRYPT=yes
      - USE_ANTIBOT=captcha
      - USE_CROWDSEC=yes
      - CACHE_TYPE=nginx
```

### 2. Multi-Modal Hub (Open Source AI Workflow)
- **Engine**: Llama 3 (via Groq) for rapid English translation + Piper/Bark (Hugging Face) for audio.
- **Edge Function**:
```typescript
// supabase/functions/process-artisan-story/index.ts
serve(async (req) => {
  const { artisanId, rawUrduText } = await req.json();
  const llama = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { "Authorization": `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: "llama3-70b-8192", messages: [...] })
  });
  const { choices } = await llama.json();
  const tts = await fetch(HF_ENDPOINT, { 
    method: "POST", body: JSON.stringify({ inputs: choices[0].message.content }) 
  });
  // Upload to Supabase Storage...
  return new Response(JSON.stringify({ success: true }));
});
```

### 3. Real-time Artisan Presence
- **Feature**: Static Hostinger site uses Supabase Presence to show live workshop status.
- **Component**:
```typescript
export function StatusBadge({ artisanId }) {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    const ch = supabase.channel(`status-${artisanId}`)
      .on('presence', { event: 'sync' }, () => {
        setIsOnline(Object.keys(ch.presenceState()).length > 0);
      }).subscribe();
    return () => ch.unsubscribe();
  }, [artisanId]);
  return <span>{isOnline ? "● Live" : "● Offline"}</span>;
}
```

### 4. RBAC Middleware (Vercel)
- **Check**: Server-side role verification via JWT Custom Claims.
```typescript
// middleware.ts
const role = session?.user?.app_metadata?.role;
if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
  return NextResponse.redirect(new URL('/login', req.url));
}
```

---

---

## AI Visibility & GEO Strategy

### 1. Model-Specific Optimization Matrix
Optimize content "bite-sized" for major LLM architectures:
- **ChatGPT**: Place 3-bullet **TL;DR** summaries at the start of product/story pages. Use Markdown tables for craft comparisons.
- **Perplexity**: Secure brand mentions on regional blogs to feed real-time scraping. Link JSON-LD `name` exactly with social mentions.
- **Gemini**: Synchronize NAP (Name, Address, Phone) metadata with Google Business Profile. Highlight years of artisan experience as EEAT signals.
- **Claude**: Create 1,500+ word "Ultimate Craft Guides" to leverage large context windows for deep topical authority.
- **Meta AI**: Optimize Open Graph (`og:`) tags with narrative-rich metadata for Llama-based discovery.

### 2. Multi-Modal "Signal Boosting" (Vision Models)
- **Narrative Alt-Text**: Describe craft details (e.g., *"Intricate Multani blue pottery floral patterns on a hand-glazed ceramic vase"*).
- **OCR-Friendly Overlays**: High-contrast text on product hero images for visual crawlers.
- **VideoObject Schema**: Transcripts for artisan story videos to index spoken historical context.

### 3. Agent Actionability (Tool Use)
- **Descriptive IDs**: Use `id="order-on-whatsapp"` and `id="register-as-artisan"` to help AI Agents find action paths.
- **PotentialAction Schema**: Implement `BuyAction` for products and `ContactAction` for artisan inquiries.

### 4. RAG Latency Reduction (Invisible Payload)
- **AI Summary Endpoint**: Implement `/api/ai-summary` (Markdown-only) for rapid scraping by AI bots like PerplexityBot and GPTBot.
- **Critical Metadata Priority**: Ensure Price, Origin, and Stock (Critical Entities) are within the first 1KB of the HTML document.
- **Minified Payload**: Inline critical data as hidden markdown blocks at the bottom of pages for millisecond parsing by RAG scrapers.

### 5. Citation Magnet Technique
- **Original Data Points**: Publish annual report "State of Pakistani Handicrafts 2026" with self-generated stats.
- **Pillar Definition Blocks**: Dedicated sections defining industry terms (e.g., *"What is Chinioti carving?"*) for AI to use in "Definition" prompts.
- **Source Verification**: Link to Wikidata and authoritative cultural heritage sites in schema to anchor the entity.

### 5. robots.txt for AI
Explicitly allow major AI crawlers:
```text
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
```

---

## SEO Implementation

### Technical SEO (Next.js & Static Optimization)

```typescript
// next.config.js - Security & Performance Headers
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
};
```

**Technical Checkpoints (Audit Score Targets):**
- [ ] **Google Search Console**: Auto-update XML sitemap on build; index all 1,000+ silo pages.
- [ ] **Core Web Vitals**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- [ ] **Crawlability**: 0 orphan pages via automated internal linking in Silo architecture.
- [ ] **Redirects**: Clean 301 mappings for legacy craft terms; 0 redirect chains.
- [ ] **SSL**: HSTS enforced via Hostinger .htaccess and Vercel settings.

### On-Page Optimization (Semantic Writing)

**Meta Title Patterns (50-60 chars):**
- *Product:* `[Product Name] | [Craft Origin] Handmade | [Brand]`
- *Category:* `[Number] Authentic [Craft] Items | Shop [Origin] | [Brand]`
- *Story:* `The History of [Craft] | [Artist Name] Story | [Year]`

**Meta Description Rules (150-155 chars):**
- *Formula:* `[Entity] [verb] [value/benefit] [stat]. [Secondary entity] [action] [outcome]. [CTA with number].`
- *Example:* `TheLocalCrafts delivers authentic Multani Blue Pottery directly from local kilns. Discover 50+ unique designs crafted by master artisans. Shop 100% handmade legacy.`

**Heading Hierarchy:**
- **H1:** Focus on Primary Entity + Region (e.g., *Artisanal Ajrak from Bhit Shah*)
- **H2:** Semantic Support (e.g., *How our Ajrak is naturally dyed?*)
- **H3:** Detailed Attributes (e.g., *Organic Indigo Fermentation Process*)
```

### Comprehensive Schema Suite (JSON-LD)

**Organization & WebSite:**
- Implement `Organization` on homepage with `sameAs` array linking to Wikidata, Facebook, Instagram, and official government cultural registries.
- Use `WebSite` with `SearchAction` for internal search engine exposure.

**Product & Offer:**
- Full `Product` schema with `itemCondition`, `sku`, `brand`, and `offers.priceCurrency` (PKR/USD switchable).
- Integrate `AggregateRating` and `Review` schema for social proof citation.

**LocalBusiness & Geo (Regional Pages):**
- Use `LocalBusiness` for each regional silo (e.g., Multan, Hala).
- Link specific `GeoCoordinates` and `hasMap` URLs to anchor the craft to its physical origin for Gemini/Google Maps.

**AEO / FAQ Schema:**
- Use `FAQPage` on all product and craft-category pages to dominate "People Also Ask" and LLM snippets.
- Structure: Question (User prompt) → Answer (Concise entity-first result).

**Provenance & Video:**
- `VideoObject` for artisan story videos (with full transcripts).
- `PotentialAction` schema (BuyAction, ContactAction) for AI Agent trigger points.

### Local SEO & EEAT Strategy

1. **Regional Landing Pages (Programmatic SEO)**: Use silo URLs (`/regions/punjab/multan`) with unique, AI-assisted content for 50+ Pakistani cities.
2. **EEAT Signals**: Artist profiles displaying years in craft, family lineage, and physical workshop location.
3. **NAP Consistency**: Synchronize Name, Address, Phone across website footer, Contact page, Google Business Profile, and LocalBusiness schema.
4. **Local Authority Pillar**: Link to local cultural festivals and regional tourism boards to build "Source of Truth" authority.
5. **Backlink Strategy**: Pitch "Traditional Pakistani Crafts" stories to local news blogs (Dawn, Tribune) and international craft journals.

### AEO (Answer Engine Optimization) & Semantic Content
1. **Conversational Headings**: H2 tags as natural user prompts (e.g., *"Where to find authentic ajrak in Hala?"*).
2. **The 100-Word Rule**: Provide the definitive answer in the **first 100 words** of every page for LLM "citation magnets".
3. **Semantic Clusters**: Group content into "Pillar" pages (Craft types) → "Cluster" pages (Specific variants) → "Support" pages (Care guides).
4. **Auditory Flow**: Short, phonetic sentences optimized for Siri, Alexa, and ChatGPT Voice Mode.
5. **Knowledge Web**: Link Every Story (Informational Intent) → Product (Transactional Intent).

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)
- [ ] Project setup (Next.js, Supabase, Bootstrap)
- [ ] Authentication system
- [ ] Database schema implementation
- [ ] Basic component library
- [ ] Admin layout & navigation

### Phase 2: Core Features (Weeks 4-6)
- [ ] Product CRUD
- [ ] Category management
- [ ] Artisan registration & approval
- [ ] Basic search functionality
- [ ] Cart & wishlist

### Phase 3: E-Commerce (Weeks 7-9)
- [ ] Checkout flow
- [ ] COD checkout flow
- [ ] **WhatsApp Cart Integration**
  - [ ] Cart-to-WhatsApp message generator
  - [ ] "Order on WhatsApp" button in cart
  - [ ] Formatted message with all products
  - [ ] Customer info pre-fill (if logged in)
  - [ ] Admin WhatsApp number configuration
- [ ] Order management
- [ ] Email notifications
- [ ] Invoice generation

### Phase 4: Advanced Features & Optimization (Weeks 10-12)
- [ ] **AI & Multimodal**
  - [ ] Voice note to text generator (Gemini Flash integration)
  - [ ] ElevenLabs AI Voice Story narration setup
- [ ] **Immersive Discovery**
  - [ ] Supabase pgvector setup for semantic search
  - [ ] 3D Model pipeline & WebXR "View in Room" interface
  - [ ] **Craft Map**: Interactive SVG map of Pakistan regions
- [ ] **Social Impact**
  - [ ] Impact Fund wallet architecture
  - [ ] Artisan Mastery Tier logic & badge system

### Phase 5: Premium Polish (Weeks 13-14)
- [ ] **Content & Community**
  - [ ] Craftpedia (Wiki) module deployment
  - [ ] Artisan Live-Feed (Short-video) integration
  - [ ] B2B Inquiry Portal setup
  - [ ] **On-platform User Guides** (Client, Admin, and Artisan specific pages)
- [ ] **SEO & Optimization**
  - [ ] Regional pages with AI-generated unique content
  - [ ] Image transformation pipeline (Supabase + BlurHash)
  - [ ] Multi-currency support (PKR to USD/GBP/EUR)

### Phase 6: Global Launch & Security (Weeks 15-16)
- [ ] Performance audit (Lighthouse 100 on Mobile)
- [ ] Security audit (RLS Policies & Rate Limiting)
- [ ] Cross-browser mobile testing
- [ ] Official global launch & marketing rollout

---

## Market Analysis & Opportunity

### Pakistan E-Commerce Market Overview (2024-2029)

| Metric | 2024 | 2029 (Projected) | CAGR |
|--------|------|------------------|------|
| Market Size | US$7.7 Billion | US$20.4 Billion | 17-22% |
| E-commerce Users | 6.9 Million | 14 Million | ~15% |
| ARPU (Avg Revenue/User) | US$770 | ~US$1,000+ | 5-7% |
| Internet Penetration | 45.7% | ~60% | Growing |
| Registered Merchants | 427% growth (2019-2023) | - | Rapid |

**Key Insight**: Pakistan's e-commerce has seen 457% volume increase between 2019-2023. The market is entering rapid growth phase with favorable government policies providing tax incentives and financing options.

### Global Handicrafts Market Context

| Metric | Value | Source |
|--------|-------|--------|
| Global Market Size (2023) | US$708.08 Billion | Grand View Research |
| Projected Size (2030) | US$983.12 Billion | Grand View Research |
| CAGR | 13.1% | Industry Reports |

**Opportunity**: The Local Crafts is positioned in a high-growth intersection of Pakistani e-commerce boom + global handicrafts demand.

### Target Market Segments

| Segment | Description | Size | Priority |
|---------|-------------|------|----------|
| **Urban Pakistani Buyers** | Karachi, Lahore, Islamabad residents seeking authentic local crafts | 4-5M potential | High |
| **Overseas Pakistanis** | Diaspora wanting cultural connection | 9M+ worldwide | High |
| **International Buyers** | Global customers interested in Pakistani handicrafts | Growing | Medium |
| **Corporate/B2B** | Companies seeking cultural gifts, office decor | Niche | Medium |
| **Wedding/Event Buyers** | Customers seeking traditional items for occasions | Seasonal | High |

---

## Mobile Commerce Strategy

### Mobile-First Imperative

| Statistic | Value | Implication |
|-----------|-------|-------------|
| Mobile Shopping Rate | **80%** of online shoppers buy via mobile | Mobile-first design mandatory |
| Monthly Active Mobile Shoppers | 16.6 Million (July 2024) | Huge mobile audience |
| Smartphone Penetration | Rapidly growing | Increasing m-commerce potential |

### Mobile UX Requirements

1. **Touch-Optimized Interface**
   - Minimum 44x44px touch targets
   - Swipeable product galleries
   - Bottom navigation for thumb reach
   - Floating "Order on WhatsApp" button

2. **Performance Targets**
   - First Contentful Paint: < 1.5s
   - Largest Contentful Paint: < 2.5s
   - Time to Interactive: < 3s
   - Use Next.js Image optimization
   - Lazy load below-fold content

3. **Mobile-Specific Features**
   - Click-to-call for customer support
   - One-tap WhatsApp ordering
   - Mobile wallet integration (JazzCash/Easypaisa)
   - Simplified checkout (3 steps max)
   - Persistent cart across devices

4. **Progressive Web App (PWA)**
   - Installable on home screen
   - Offline product browsing
   - Push notifications for orders
   - Fast subsequent loads

### Responsive Breakpoints

```scss
$breakpoints: (
  'xs': 0,        // Mobile phones
  'sm': 576px,    // Large phones
  'md': 768px,    // Tablets
  'lg': 992px,    // Desktops
  'xl': 1200px,   // Large desktops
  'xxl': 1400px   // Extra large
);

// Mobile-first approach
// Base styles for mobile, progressive enhancement for larger screens
```

---

## Payment & Logistics Strategy

### Payment Landscape Analysis

| Payment Method | Market Share | User Base | Implementation Priority |
|----------------|--------------|-----------|------------------------|
| **Cash on Delivery (COD)** | 75% of e-commerce | Dominant | ✅ Primary |
| **JazzCash** | Growing | 40M+ users | Future Phase |
| **Easypaisa** | Growing | 35M+ users | Future Phase |
| **Bank Transfer** | Limited | - | Optional |
| **Credit/Debit Cards** | Low penetration | - | Not recommended initially |

**Strategic Decision**: COD + WhatsApp ordering is the optimal approach for Pakistan's market where 7 out of 10 consumers prefer COD.

### Digital Wallet Growth (Future Integration)

> "Pakistan is undergoing a digital payment transformation. In the last three months of 2024, retail digital payments grew 12%. Pakistanis made over 3 billion transactions worth Rs154 trillion ($554 billion)."

**Phase 2 Integration Plan** (After initial launch):
- JazzCash integration for pre-payment discounts (5% off)
- Easypaisa integration
- Mobile wallet accounts now exceed 80 million in Pakistan

### Logistics Partners Analysis

| Courier | Strengths | Coverage | COD Support | Recommendation |
|---------|-----------|----------|-------------|----------------|
| **Leopards Courier** | Largest COD network, dedicated cargo aircraft, 800+ express centres, 1500+ locations | Nationwide | ✅ Excellent | Primary Partner |
| **TCS** | Night-air loop for premium service, established brand, insurance options | Major cities + | ✅ Good | Secondary Partner |
| **M&P** | Growing network, competitive pricing | Urban areas | ✅ Yes | Backup |
| **PostEx** | Invoice factoring for merchant liquidity | Urban | ✅ Yes | Alternative |

### Shipping Strategy

```typescript
// Shipping Configuration
const SHIPPING_CONFIG = {
  partners: {
    primary: 'leopards',
    secondary: 'tcs'
  },
  zones: {
    tier1: ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad'],
    tier2: ['multan', 'peshawar', 'quetta', 'hyderabad', 'gujranwala'],
    tier3: ['other_cities'],
    remote: ['gilgit', 'skardu', 'chitral', 'turbat']
  },
  rates: {
    tier1: 200,   // PKR - 2-3 days
    tier2: 250,   // PKR - 3-4 days
    tier3: 300,   // PKR - 4-5 days
    remote: 450,  // PKR - 5-7 days
    fragile: 100  // Additional for fragile items
  },
  freeShippingThreshold: 5000, // PKR
  codCharge: 0,  // No extra COD charge (absorb in margins)
  estimatedDelivery: {
    tier1: '2-3 business days',
    tier2: '3-4 business days',
    tier3: '4-5 business days',
    remote: '5-7 business days'
  }
};
```

### Logistics Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Remote area delays | Partner with multiple couriers, set realistic expectations |
| Urban congestion | Same-day delivery for Tier 1 cities (premium option) |
| COD cash collection | Use Leopards' established COD network |
| Fragile items | Dedicated "fragile" shipping class, insurance option |
| Returns handling | Clear 7-day return policy, prepaid return labels |

---

## Consumer Trust & Conversion Strategy

### Trust Barriers in Pakistani E-Commerce

Based on research, key trust barriers include:

| Barrier | % Impact | Mitigation Strategy |
|---------|----------|---------------------|
| Fake e-stores/scams | High | Verified artisan badges, video testimonials |
| Product quality concerns | High | High-quality photos, customer reviews, HD videos |
| Payment security fears | High | COD as primary option eliminates this |
| Delivery reliability | Medium | Real-time tracking, estimated delivery dates |
| Return process uncertainty | Medium | Clear return policy, hassle-free process |
| No physical inspection | Medium | 360° product views, detailed descriptions, live chat |

### Trust-Building Features

```
1. ARTISAN VERIFICATION SYSTEM
   ├── CNIC verification (identity)
   ├── Business registration (optional)
   ├── Video interview/call
   ├── Sample product verification
   └── "Verified Artisan" badge display

2. SOCIAL PROOF ELEMENTS
   ├── Customer reviews with photos
   ├── "X people bought this today"
   ├── "Verified Purchase" badges on reviews
   ├── Artisan story & workshop photos
   └── Instagram feed integration

3. TRANSPARENCY FEATURES
   ├── Real-time inventory status
   ├── Order tracking with map
   ├── Artisan direct contact (optional)
   ├── Behind-the-scenes craft videos
   └── Clear pricing (no hidden fees)

4. CUSTOMER SUPPORT
   ├── WhatsApp support (primary)
   ├── Live chat during business hours
   ├── FAQ section with search
   ├── Video tutorials
   └── 24-48 hour response guarantee
```

### Conversion Optimization Checklist

| Element | Best Practice | Implementation |
|---------|---------------|----------------|
| Product Images | 4-6 high-quality images per product | Auto-compress, WebP format |
| Add to Cart | Prominent, above the fold | Sticky button on mobile |
| Trust Badges | Near price & CTA | "Secure COD", "Verified Artisan" |
| Reviews | Display prominently | Star rating in product cards |
| Urgency | Show stock levels | "Only 3 left in stock" |
| WhatsApp CTA | Always visible | Floating button, green color |
| Load Time | Under 3 seconds | Next.js optimization, CDN |

### Customer Journey Optimization

```
AWARENESS → CONSIDERATION → PURCHASE → RETENTION
    ↓              ↓              ↓           ↓
  SEO/Ads      Product Pages   WhatsApp    Email/WhatsApp
  Social       Artisan Stories  COD         Loyalty Points
  Content      Reviews         Easy Cart    Re-engagement
```

---

## Social Media Marketing Strategy

### Platform Priority Matrix

| Platform | Priority | Audience | Content Type | Goal |
|----------|----------|----------|--------------|------|
| **Instagram** | ✅ Primary | 1B+ users, visual-first | Product photos, Reels, Stories | Brand awareness, sales |
| **Facebook** | ✅ Primary | Community-driven | Marketplace, Groups, Ads | Local reach, community |
| **Pinterest** | ✅ High | 335M users, discovery-based | Product pins, boards | SEO, discovery |
| **TikTok** | Medium | Gen Z, viral potential | Behind-the-scenes, trends | Viral reach |
| **WhatsApp** | ✅ Core | Direct sales | Status, broadcasts | Orders, support |
| **YouTube** | Medium | Long-form content | Craft tutorials, stories | SEO, authority |

### Instagram Strategy

**Posting Schedule**:
- Feed posts: 4-5 times/week
- Stories: Daily (craft process, BTS)
- Reels: 3-4 times/week (short, engaging)
- Live: Weekly (artisan interviews)

**Hashtag Strategy**:
```
HIGH-USE (500K-10M):
#handicrafts #handmade #artisan #homedecor #pakistan

MEDIUM-USE (50K-500K):
#pakistaniart #bluepottery #sindhiblockprint #traditionalcraft

NICHE (10K-50K):
#multanipottery #ajraksindh #peshawarchappal #hunzaembroidery

BRANDED:
#thelocalcrafts #craftedwithlove #pakistanartisans
```

**Content Pillars**:
1. **Product Showcases** (40%) - Beautiful product photography
2. **Artisan Stories** (25%) - Human connection, craft process
3. **Educational** (15%) - How crafts are made, history
4. **User Generated** (15%) - Customer photos, reviews
5. **Behind the Scenes** (5%) - Packaging, team, operations

### Pinterest Strategy

**Board Structure**:
- Pakistani Blue Pottery
- Sindhi Embroidery & Ajrak
- Traditional Home Decor
- Peshawari Leather Crafts
- Wedding & Gift Ideas
- Artisan Spotlights
- DIY & Craft Inspiration

**Pin Optimization**:
- Rich Pins enabled
- Keyword-rich descriptions
- Vertical images (2:3 ratio)
- Link to product pages
- Pin consistently (15-25 pins/day)

### Content Calendar Template

| Day | Instagram Feed | Stories | Pinterest | Facebook |
|-----|---------------|---------|-----------|----------|
| Mon | Product feature | Poll/Quiz | 5 product pins | Product share |
| Tue | Artisan spotlight | BTS video | 5 home decor pins | Artisan story |
| Wed | Reel (process) | Customer UGC | 5 gift idea pins | Tips/Educational |
| Thu | Lifestyle shot | Product tags | 5 regional pins | Community post |
| Fri | Collection highlight | Sale/Promo | 5 trending pins | Weekend promo |
| Sat | Customer review | Live/Q&A | 3 pins | Event/Cultural |
| Sun | Inspirational | Weekly recap | 3 pins | Engagement post |

### Email Marketing Strategy

> "If you're serious about your handmade business, you need a website and an email list. These are avenues that YOU control."

**Email Sequences**:

1. **Welcome Series** (5 emails)
   - Welcome + 10% off first order
   - Brand story & mission
   - Top artisan introductions
   - Popular products showcase
   - How to shop guide

2. **Abandoned Cart** (3 emails)
   - 1 hour: Reminder
   - 24 hours: Social proof + urgency
   - 48 hours: Final offer (free shipping)

3. **Post-Purchase** (4 emails)
   - Order confirmation
   - Shipping update
   - Delivery confirmation + review request
   - 14 days: Complementary products

4. **Re-engagement** (3 emails)
   - 30 days inactive: New arrivals
   - 60 days: Special offer
   - 90 days: Win-back campaign

---

## Enhanced SEO Keywords

### Primary Keywords (High Volume, High Competition)

| Keyword | Est. Monthly Searches | Competition | Target Page |
|---------|----------------------|-------------|-------------|
| pakistani handicrafts | 5,000-10,000 | High | Homepage |
| buy handicrafts pakistan | 2,000-5,000 | Medium | Products page |
| handmade crafts pakistan | 2,000-5,000 | Medium | Categories |
| pakistani artisan products | 1,000-2,500 | Medium | Artisans page |
| traditional pakistani crafts | 1,000-2,500 | Medium | Crafts page |

### Product-Specific Keywords (Medium Volume, Lower Competition)

| Category | Keywords | Target Pages |
|----------|----------|--------------|
| **Blue Pottery** | multan blue pottery, kashi pottery pakistan, blue pottery vase, blue pottery plates, authentic multan pottery | /crafts/blue-pottery |
| **Ajrak** | sindhi ajrak online, ajrak fabric buy, ajrak shawl, block print ajrak, authentic sindh ajrak | /crafts/ajrak |
| **Footwear** | peshawari chappal online, khusa pakistan, kohati chappal, traditional pakistani shoes, handmade leather sandals | /crafts/footwear |
| **Embroidery** | sindhi embroidery, balochi mirror work, hunza embroidery, phulkari buy online, kashmiri crewel | /crafts/embroidery |
| **Home Decor** | pakistani home decor, truck art decor, camel skin lamp, wooden handicrafts, traditional wall art | /categories/home-decor |

### Long-Tail Keywords (Low Volume, High Intent)

```
BUYING INTENT:
- buy authentic pakistani handicrafts online with delivery
- where to buy multan blue pottery in pakistan
- original sindhi ajrak free shipping pakistan
- handmade peshawari chappal online order
- pakistani wedding gifts handicrafts

INFORMATIONAL (for blog/content):
- how is multan blue pottery made
- history of sindhi ajrak pakistan
- what is balochi mirror work embroidery
- traditional crafts of gilgit baltistan
- famous handicrafts from each province of pakistan

LOCAL SEO:
- handicrafts shop near me karachi
- buy handmade crafts lahore
- multan pottery store islamabad
- sindhi embroidery shops hyderabad
- traditional gifts shop peshawar
```

### Voice Search / AEO Keywords

Optimize for question-based queries:

| Question | Featured Snippet Target |
|----------|------------------------|
| What are traditional Pakistani handicrafts? | Homepage / About page |
| Where can I buy authentic blue pottery from Multan? | Blue pottery category |
| How is Sindhi Ajrak made? | Ajrak craft page |
| What is the best gift from Pakistan? | Gift guide blog post |
| How much does Peshawari Chappal cost? | Product page / FAQ |
| What handicrafts is Sindh famous for? | Sindh region page |
| Where to buy Pakistani crafts online? | Homepage |

### Keyword Implementation Matrix

| Page Type | Primary Keyword | Secondary Keywords | LSI Keywords |
|-----------|----------------|--------------------|--------------|
| Homepage | pakistani handicrafts | handmade pakistan, artisan crafts | authentic, traditional, cultural |
| Category | [category] pakistan | buy [category] online | handcrafted, genuine, original |
| Product | [product] [region] | [product] price pakistan | handmade, artisan, traditional |
| Region | [region] handicrafts | crafts from [region] | artisans, workshop, famous for |
| Artisan | [artisan] [craft] | [region] artisan | master craftsman, traditional |

---

## UX Best Practices for Handicraft Marketplace

### Multi-User Experience Balance

| User Type | Primary Needs | UX Focus |
|-----------|--------------|----------|
| **Buyers** | Easy discovery, trust, seamless checkout | Search, filters, WhatsApp CTA, reviews |
| **Artisans** | Simple listing, order management, earnings | Dashboard, bulk upload, analytics |
| **Admin** | Overview, approvals, insights | Real-time data, batch actions, reports |

### Key UX Principles

1. **Personalization**
   - Personalized homepage based on browsing history
   - "Recently Viewed" section
   - "Recommended for You" based on purchases
   - Region-specific product suggestions

2. **Discovery Experience**
   - Visual category browsing (not just text)
   - "Shop by Region" map interface
   - "Shop by Craft Type" with craft stories
   - Curated collections (seasonal, trending)

3. **Product Presentation**
   - Gallery-style product pages
   - Craft origin story on each product
   - "Meet the Artisan" section
   - Size/dimension visuals
   - Material & care information

4. **Simplified User Flows**
   ```
   OPTIMAL PURCHASE FLOW (max 4 steps):

   Product Page → Add to Cart → Cart Review → WhatsApp Order
        ↓              ↓             ↓              ↓
    All info      One-click    Edit qty      Pre-filled
    visible       action       Clear CTA     message
   ```

5. **Trust Indicators Throughout**
   - Header: "Authentic Pakistani Handicrafts"
   - Product: Verified artisan badge
   - Cart: "Secure COD Payment"
   - Checkout: "Money-back guarantee"
   - Footer: Customer testimonials

### Navigation Structure

```
PRIMARY NAVIGATION:
┌─────────────────────────────────────────────────────────────┐
│ [Logo]   Shop ▼   Regions ▼   Artisans   Stories   [🔍] [🛒] │
└─────────────────────────────────────────────────────────────┘

SHOP MEGA MENU:
┌────────────────────────────────────────────────────────────────────┐
│ By Category          │ By Craft              │ Featured            │
│ ───────────────────  │ ─────────────────────  │ ─────────────────── │
│ Home Decor           │ Blue Pottery          │ New Arrivals        │
│ Fashion & Accessories│ Ajrak & Textiles      │ Best Sellers        │
│ Jewelry              │ Embroidery            │ Sale Items          │
│ Kitchen & Dining     │ Leather Crafts        │ Gift Sets           │
│ Art & Wall Decor     │ Woodwork              │                     │
│ Gifts                │ Truck Art             │ [Shop All →]        │
└────────────────────────────────────────────────────────────────────┘

REGIONS MEGA MENU:
┌────────────────────────────────────────────────────────────────────┐
│ Punjab         │ Sindh          │ KPK           │ More             │
│ ───────────── │ ──────────────  │ ────────────── │ ─────────────── │
│ Multan         │ Karachi        │ Peshawar       │ Balochistan     │
│ Chiniot        │ Hyderabad      │ Swat           │ Gilgit-Baltistan│
│ Lahore         │ Hala           │ Charsadda      │ Azad Kashmir    │
│ Bahawalpur     │ Tharparkar     │ Chitral        │                 │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile Navigation

```
BOTTOM TAB BAR (Mobile):
┌─────────────────────────────────────────────┐
│   🏠      🔍       🛒       ❤️      👤    │
│  Home   Search   Cart   Wishlist  Account │
└─────────────────────────────────────────────┘

FLOATING WHATSAPP BUTTON:
[Always visible, bottom-right, above tab bar]
```

---

## Performance & Technical Optimization

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Image optimization, CDN, SSR |
| FID (First Input Delay) | < 100ms | Code splitting, lazy loading |
| CLS (Cumulative Layout Shift) | < 0.1 | Fixed image dimensions, font preload |
| TTFB (Time to First Byte) | < 600ms | Edge caching, Vercel CDN |

### Image Optimization Strategy

```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['firebasestorage.googleapis.com'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

// Product image requirements
const IMAGE_SPECS = {
  primary: { width: 1200, height: 1200, format: 'webp', quality: 85 },
  thumbnail: { width: 400, height: 400, format: 'webp', quality: 80 },
  gallery: { width: 800, height: 800, format: 'webp', quality: 85 },
};
```

### Caching Strategy

```
STATIC ASSETS:
- Images: 1 year (immutable)
- CSS/JS: 1 year (hashed filenames)
- Fonts: 1 year (immutable)

DYNAMIC CONTENT:
- Product pages: 1 hour (ISR)
- Category pages: 30 minutes (ISR)
- Homepage: 10 minutes (ISR)
- Cart/Checkout: No cache

API RESPONSES:
- Product list: 5 minutes (SWR)
- Search results: 2 minutes
- User data: No cache
```

---

## Sources & References

### Competitor Research
- [Vceela](https://vceela.com/) - Leading artisan marketplace
- [Hutch.pk](https://hutch.pk/collections/handicrafts) - Shopify-based crafts store
- [Sindh Crafts](https://sindhcrafts.com/) - Sindh specialization
- [Made In Pak](https://made-in-pak.com/) - Premium handicrafts
- [Crafts Emporium](https://crafts-emporium.com/) - Traditional crafts
- [Pakistani Crafts](https://pakistanicrafts.com/) - Multi-region sourcing
- [Crafts Home](https://craftshome.pk/) - Budget-friendly options

### Craft Research
- [Pakistani Craft - Wikipedia](https://en.wikipedia.org/wiki/Pakistani_craft)
- [Graana - Handicrafts of Pakistan](https://www.graana.com/blog/handicrafts-of-pakistan/)
- [Truly Pakistan - Traditional Handicrafts](https://trulypakistan.net/traditional-handicrafts-of-pakistan/)
- [Multani Blue Art](https://multaniblueart.com/handicrafts-of-pakistan/)

### Color Palette Research
- [Rose Benedict Design - Earthy Palettes](https://rosebenedictdesign.com/2025/01/31/earthy-color-palettes/)
- [Piktochart - Earth Color Palettes](https://piktochart.com/tips/earthy-color-palette)
- [Webflow - Best Color Combinations](https://webflow.com/blog/best-color-combinations)

---

### Market Research Sources (2024-2025)

**E-commerce Market Data**:
- [PCMI - E-commerce Projections for Pakistan](https://paymentscmi.com/insights/pakistan-ecommerce-market-data/)
- [Statista - eCommerce Pakistan Market Forecast](https://www.statista.com/outlook/emo/ecommerce/pakistan)
- [GlobeNewswire - Pakistan B2C Ecommerce Report 2025](https://www.globenewswire.com/news-release/2026/01/29/3228348/28124/en/Pakistan-B2C-Ecommerce-Report-2025-A-20-Billion-Market-by-2029-Size-Forecast-by-Value-and-Volume-Across-80-KPIs.html)
- [China Economic Net - Pakistan E-commerce Market](http://en.ce.cn/Insight/202412/17/t20241217_39237963.shtml)

**Payment & Digital Wallets**:
- [NORBr - Payment Methods in Pakistan](https://norbr.com/library/payworldtour/payment-methods-in-pakistan/)
- [xStak - Best Payment Gateways in Pakistan 2025](https://www.xstak.com/blog/payment-gateways-in-pakistan)
- [TechByAdnan - JazzCash vs EasyPaisa 2025](https://techbyadnan.com/jazzcash-vs-easypaisa/)
- [Paradigm Shift - Digital Payment Adoption](https://www.paradigmshift.com.pk/digital-payment-adoption/)

**Logistics & Shipping**:
- [Mordor Intelligence - Pakistan CEP Market Report 2030](https://www.mordorintelligence.com/industry-reports/pakistan-courier-express-and-parcel-cep-market)
- [Leopards Courier Official](https://www.leopardscourier.com/business/ecommerce-economy)
- [Visual Pakistan - Top Courier Companies](https://visualpakistan.com/courier-companies-in-pakistan/)

**Consumer Behavior**:
- [PMC/NIH - Trust, Risk, Security in E-commerce](https://pmc.ncbi.nlm.nih.gov/articles/PMC11044045/)
- [Springer - Trust and Commitment in Pakistan Online Shopping](https://link.springer.com/article/10.1186/s40497-019-0166-2)
- [ResearchGate - Online Shopping Trends Pakistan](https://www.researchgate.net/publication/368085781_EFFECTS_OF_ONLINE_SHOPPING_TRENDS_ON_CONSUMER-BUYING_BEHAVIOR_AN_EMPIRICAL_STUDY_OF_PAKISTAN)
- [MDPI - Social Media Influencers & Consumer Behavior Pakistan](https://www.mdpi.com/2071-1050/16/14/6079)

**UX & Marketplace Design**:
- [Qubstudio - Marketplace UI/UX Best Practices](https://qubstudio.com/blog/marketplace-ui-ux-design-best-practices-and-features/)
- [Shipturtle - Handmade Crafts Marketplace](https://www.shipturtle.com/blog/create-handmade-crafts-and-artisan-goods-marketplace)
- [Eastern Peak - How to Build Marketplace like Etsy](https://easternpeak.com/blog/how-to-build-a-handicraft-online-marketplace-like-etsy/)
- [Purrweb - Marketplace UX Design for Conversion](https://www.purrweb.com/blog/marketplace-ux-ui-design/)
- [ContentSquare - Ecommerce UX Framework](https://contentsquare.com/guides/ecommerce-ux/)

**Social Media Marketing**:
- [Craft Professional - Social Media Marketing for Crafts](https://www.craftprofessional.com/social-media-marketing-simplified.html)
- [Yazati - Best Social Media Platforms for Handmade Crafts](https://blog.yazati.com/the-best-social-media-platforms-to-sell-handmade-crafts/)
- [American Craft Council - Social Media Strategies](https://www.craftcouncil.org/post/social-media-strategies-craft-artists)
- [Creative Hive - Instagram Marketing for Handmade](https://www.creativehiveco.com/instagram-marketing-for-handmade-business/)
- [ZigPoll - Digital Marketing for Handmade Crafts](https://www.zigpoll.com/content/what-are-some-effective-digital-marketing-strategies-tailored-for-handmade-craft-businesses-aiming-to-increase-their-online-sales)

**Mobile Commerce**:
- [Oberlo - Mobile Commerce Growth Statistics](https://www.oberlo.com/statistics/mobile-commerce-sales)
- [Invesp - Global Mobile Commerce Statistics](https://www.invespcro.com/blog/mobile-commerce-statistics/)
- [Cropink - Mobile Commerce Statistics 2025](https://cropink.com/mobile-commerce-statistics)
- [SellersCommerce - Mobile Commerce Statistics 2025](https://www.sellerscommerce.com/blog/mobile-commerce-statistics/)

---

## User Guides & Documentation

### 28.1 How to use Client website?
The client website (`thelocalcrafts.com`) is designed for maximum discovery and immersive shopping.

1.  **Exploring Crafts**:
    *   **Homepage**: Scroll through the "Artisan Live-Feed" to see real-time craft creation videos.
    *   **Craft Map**: Use the interactive map of Pakistan to discover crafts by region (e.g., tap on Multan for Blue Pottery).
    *   **Search**: Use semantic search (e.g., "earthy tones", "heritage gifts") to find items based on "vibe" rather than just keywords.
2.  **Product Experience**:
    *   **AR View**: Click "View in Room" on furniture or large decor items to place them in your space using your phone's AR.
    *   **AI Stories**: Click "Listen to Story" to hear a professionally narrated background of the craft and the artisan behind it.
    *   **Provenace**: Scan the QR code on any product received to view its digital certificate of authenticity and the maker's profile.
3.  **Checkout Flow**:
    *   **Cart**: Add items and select "Order on WhatsApp" for instant communication with the platform administrators.
    *   **Impact Fund**: Optionally add an "Impact Tip" to support the artisan's workshop directly.

### 28.2 How to use Admin website?
The Admin Panel (`admin.thelocalcrafts.com`) is the central hub for marketplace operations.

1.  **Artisan Moderation**:
    *   **Applications**: Review pending artisan registrations, verify lineage/identity docs, and approve accounts.
    *   **Mastery Tiers**: Manually upgrade artisans from "Apprentice" to "Master" based on their heritage preservation contributions.
2.  **Catalog Management**:
    *   **Product Audit**: Review and approve product listings generated by artisans.
    *   **Craftpedia**: Moderate community submissions for the craft encyclopedia to ensure historical accuracy.
3.  **Operations & Growth**:
    *   **B2B Portal**: Manage wholesale and custom commission requests from interior designers and corporate buyers.
    *   **Analytics**: View heatmaps of global demand and regional craft trends.
    *   **Security**: Monitor CrowdSec logs and adjust WAF rules via the BunkerWeb integration link.

### 28.3 How to use Artisan website?
The Artisan Panel is optimized for mobile-first workshop management.

1.  **Setup & Onboarding**:
    *   **Profile**: Create your story. Mention your family's heritage and workshop location for better SEO (EEAT).
    *   **Impact Stats**: Monitor your Impact Fund balance—funds contributed by customers for your tools or apprentices.
2.  **Listing Products**:
    *   **AI Description**: Upload a photo and record a raw voice note in Urdu describing the item. The AI will generate a professional English product listing.
    *   **Live-Feed**: Record and upload 30-second "Behind the Scenes" clips of your process to build trust with buyers.
3.  **Processing Orders**:
    *   **QR Codes**: For every order, download and print the unique Provenance QR code to include in the packaging.
    *   **Tracking**: Update order status as you prepare and ship the items.

---

*Plan created: January 2026*
*Last updated: February 2026*
*Enhanced with v2.0 Open Source Architecture: February 2026*
