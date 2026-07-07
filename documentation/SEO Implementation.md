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
