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
│   │   │   │   │   ├── swat/
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
│   │   ├── regions.json              # All Pakistan regions data
│   │   ├── crafts.json               # Craft types taxonomy
│   │   └── seo-content.json          # Pre-written SEO content
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
