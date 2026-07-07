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


### Vercel Deployment Checklist

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
