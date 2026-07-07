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
