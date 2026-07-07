## Technical Implementation Specs (v2.0)

### 1. The Open Source "Shield" (BunkerWeb & CrowdSec)
- **BunkerWeb**: Acts as a security-first Next-Gen WAF. Handles HTTPS termination, anti-bot protection, and automatic Let's Encrypt SSL.
- **CrowdSec Integration**: Detects and blocking malicious IPs (content scrapers, brute force) across the entire stack.
- **Workflow**: 
  - Install BunkerWeb via Docker/Portainer.
  - Link `admin.thelocalcrafts.com` and `thelocalcrafts.com` via proxy rules.
  - Enable "Hardened Mode" for the Admin panel.

### 2. Multi-Modal Hub (Open Source AI Workflow)
- **Text (Llama 3)**: Hosted on a separate GPU instance or via Supabase Edge Functions. Handles story generation and description cleanup.
- **Audio (Piper/Bark)**: Converts artisan stories to high-quality MP3s stored in Supabase buckets.
- **Image (BLIP-2)**: Automatically generates alt-text and labels for new product uploads to boost vision-model AEO scores.

### 3. Real-time Artisan Presence
- Use **Supabase Realtime** to show "Currently at the Workshop" indicators on artisan profiles when they are active in their artist panel.
- Implement a "Live Whisper" feature—artisans can leave raw voice status updates (Urdu) which are auto-translated (English) for global followers.

### 4. RBAC Middleware (Vercel)
Refined middleware to handle specialized permissions:
```typescript
const PERMISSIONS = {
  admin: ['view_analytics', 'approve_artisan', 'manage_payouts', 'edit_all'],
  artisan: ['create_product', 'view_own_earnings', 'update_story'],
  customer: ['place_order', 'write_review', 'tip_artisan']
};
```
- **Custom Claims**: Roles injected into Supabase JWT (via `/api/auth/role` hook) to ensure zero-latency RBAC at the edge.
