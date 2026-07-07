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
