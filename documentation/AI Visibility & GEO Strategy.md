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
