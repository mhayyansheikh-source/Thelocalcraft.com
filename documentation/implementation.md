# The Local Crafts | Implementation Details
## Advanced Hybrid Architecture (v2.0)

This document provides technical implementation details for the 5 strategic architectural enhancements for the Pakistani Handicrafts Marketplace.

---

### 1. The Open Source "Shield" (BunkerWeb & CrowdSec)

**Objective**: Deploy a self-hosted, security-first proxy stack to provide a Web Application Firewall (WAF), Bot Protection, and Global Acceleration using Open Source software.

#### Implementation Components:
1.  **BunkerWeb (Gateway/WAF)**:
    *   **Role**: Handles SSL (Let's Encrypt), Reverse Proxy, and OWASP Core Rule Set (CRS) to block SQLi, XSS, and LFI.
    *   **Setup**: Deploy via Docker on a central VPS (e.g., DigitalOcean/Hetzner).
    *   **Mapping**: 
        *   `thelocalcrafts.com` → BunkerWeb → Hostinger (Static Origin)
        *   `admin.thelocalcrafts.com` → BunkerWeb → Vercel (Panel Origin)
2.  **CrowdSec (Bot & Scraper Defense)**:
    *   **Role**: Replaces "Bot Fight Mode." Analyzes BunkerWeb logs to detect and block aggressive scrapers, brute-force attacks, and toxic IPs using a collaborative community list.
    *   **Action**: Installs as a "Bouncer" on the BunkerWeb instance to drop malicious packets at the network layer.
3.  **Nginx FastCGI/Varnish Caching**:
    *   **Config**: Implement `proxy_cache` on the BunkerWeb layer to mirror Hostinger's static output.
    *   **Impact**: Ensures millisecond response times by serving the "TheLocalCrafts" catalog directly from the BunkerWeb cache.

#### Security Configuration (BunkerWeb Environment):
```yaml
# docker-compose.yml snippet
services:
  bunkerweb:
    image: bunkerity/bunkerweb:latest
    environment:
      - SERVER_NAME=thelocalcrafts.com admin.thelocalcrafts.com
      - AUTO_LETS_ENCRYPT=yes
      - USE_ANTIBOT=captcha   # Interactive challenge for suspicious bots
      - USE_CROWDSEC=yes      # Link with CrowdSec for IP reputation
      - USE_MODSECURITY=yes   # Enable WAF rules
      - MODSECURITY_CRS=yes   # Enable OWASP Core Rule Set
      - CACHE_TYPE=nginx      # Enable edge caching for static catalog
```

---

### 2. pgvector & Semantic Data Layer (Supabase)

**Objective**: Enable vector-based similarity search to power "discovery by vibe" (e.g., finding items with "earthy tones" or "cultural heritage").

#### Technical Setup (SQL):
```sql
-- Enable the pgvector extension
create extension if not extension vector;

-- Add embedding column to products table
alter table products add column embedding vector(1536); -- For OpenAI or Gemini embeddings

-- Create a search function
create or replace function match_products (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  similarity float
)
language sql stable
as $$
  select
    products.id,
    products.title,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```

---

### 3. The Multimodal Processing Hub (Open Source AI Stack)

**Objective**: Securely handle AI processing for voice-to-text, translation, and narration using high-performance open-source models (Llama 3, Whisper, Piper).

#### Workflow (Supabase Edge Function with Open Source Inference):
```typescript
// supabase/functions/process-artisan-story/index.ts
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const { artisanId, rawUrduText } = await req.json()

  // 1. Logic & SEO via Llama 3 (using Groq for 300+ tokens/sec inference)
  const llamaResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a cultural heritage expert. Translate Urdu to English and optimize for SEO." },
        { role: "user", content: `Translate and optimize this craft story: ${rawUrduText}` }
      ]
    })
  })
  
  const { choices } = await llamaResponse.json()
  const englishStory = choices[0].message.content

  // 2. TTS via Open Source Piper/Bark (Hugging Face Inference Endpoint)
  // Provides cost-effective, emotive narration without per-character fees
  const ttsResponse = await fetch(Deno.env.get("HF_TTS_ENDPOINT"), {
    method: "POST",
    headers: { "Authorization": `Bearer ${Deno.env.get("HF_API_TOKEN")}` },
    body: JSON.stringify({ inputs: englishStory })
  })

  // 3. Upload Result to Supabase Storage
  const audioBlob = await ttsResponse.blob()
  const storagePath = `stories/${artisanId}.mp3`
  
  // Storage upload and DB reference update logic...

  return new Response(JSON.stringify({ 
    success: true, 
    translatedText: englishStory 
  }), { status: 200 })
})
```

---

### 4. Real-time "Artisan Status" Bridge

**Objective**: Make the static Hostinger frontend feel alive using real-time presence indicators.

#### Client-side Implementation:
```typescript
// src/components/artisan/StatusBadge.tsx (Hostinger Client)
import { supabase } from "@/lib/supabase/client"

export function StatusBadge({ artisanId }) {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const channel = supabase.channel(`artisan-status-${artisanId}`)
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setIsOnline(Object.keys(state).length > 0)
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [artisanId])

  return (
    <span className={isOnline ? "text-success" : "text-muted"}>
      {isOnline ? "● Artisan Online" : "● Offline"}
    </span>
  )
}
```

---

### 5. Unified Identity Anchor (Custom Claims)

**Objective**: Use a single Supabase Auth instance with roles to control access between the static storefront and the managed panels.

#### Database Trigger for Roles:
```sql
-- Create a table for profiles with roles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'artisan', 'customer')) default 'customer'
);

-- Function to handle new user and set custom claim in JWT
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer');
  
  -- Update auth.users raw_app_meta_data to include the role
  update auth.users 
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"customer"'
  )
  where id = new.id;
  
  return new;
end;
$$ language plpgsql security definer;
```

#### Vercel Middleware Check:
```typescript
// middleware.ts (Vercel Admin Panel)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const role = session?.user?.app_metadata?.role

  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
```
