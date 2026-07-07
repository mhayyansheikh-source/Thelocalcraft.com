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
```

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


```typescript
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
