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
