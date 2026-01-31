# Falco Peak Website – Structure & Currency Reference

This document maps the full site structure, file connections, and every place that uses currency (for USD → SEK migration and structural changes).

---

## 1. Tech Stack & Entry Points

| Item | Details |
|------|---------|
| **Framework** | Next.js 14 (App Router) |
| **Database** | PostgreSQL via Prisma |
| **Auth** | NextAuth (admin + customer sessions) |
| **Payments** | Stripe (card, Apple Pay, Google Pay) + Swish (SEK) |
| **i18n** | i18next (en, sv, es, am + fallbacks) |
| **Styling** | Tailwind CSS, `globals.css` |

**Root layout** (`app/layout.tsx`):
- Wraps app with: `SessionProvider` → `ProductProvider` → `I18nProvider` → `CartProvider`
- Renders: `{children}`, `CartDrawer`, `Toaster`
- Fonts: Inter, Poppins

---

## 2. App Structure & Routes

```
app/
├── layout.tsx              # Root layout (providers, CartDrawer, Toaster)
├── page.tsx               # Home: Hero, About, Features, Products, Newsletter, Footer
├── globals.css
│
├── account/                # Customer area (middleware: requires customer session)
│   ├── page.tsx            # Dashboard + recent orders
│   ├── addresses/page.tsx
│   ├── orders/page.tsx
│   └── wishlist/page.tsx
│
├── admin/                  # Admin area (middleware: requires admin session)
│   ├── layout.tsx          # AdminShell + sidebar
│   ├── page.tsx            # Dashboard (stats, recent products/orders)
│   ├── login/              # Admin login (no auth required)
│   ├── products/           # List, new, edit/[id]
│   ├── orders/page.tsx
│   ├── customers/page.tsx
│   ├── analytics/page.tsx
│   └── settings/page.tsx
│
├── api/                    # All API routes
│   ├── auth/[...nextauth]/route.ts
│   ├── auth/register/route.ts
│   ├── products/route.ts, products/[id]/route.ts
│   ├── orders/route.ts, orders/[id]/route.ts, orders/customer/route.ts
│   ├── checkout/route.ts
│   ├── create-payment-intent/route.ts   # Stripe PaymentIntent (amount in cents/öre)
│   ├── create-checkout-session/route.ts
│   ├── apple-payment/route.ts, google-payment/route.ts, swiss-payment/route.ts
│   ├── addresses/route.ts, addresses/[id]/route.ts
│   ├── wishlist/route.ts
│   ├── customers/route.ts, customers/[id]/route.ts
│   ├── analytics/route.ts
│   ├── settings/route.ts
│   └── upload/route.ts
│
├── auth/
│   ├── login/page.tsx, register/page.tsx, error/page.tsx
│
├── checkout/page.tsx       # Checkout form + order summary (requires session)
├── order-confirmation/page.tsx
│
├── shop/                   # ShopLayout = Navigation + children
│   ├── layout.tsx
│   ├── page.tsx            # Main shop landing
│   ├── new/page.tsx
│   ├── sport/page.tsx
│   ├── [...slug]/page.tsx  # Catch-all product/slug
│   ├── [category]/         # men | women | kids
│   │   ├── page.tsx
│   │   └── [subcategory]/  # shoes | sportswear
│   │       ├── page.tsx
│   │       └── [type]/page.tsx, [type]/[productId]/page.tsx
│   ├── men/, women/, kids/  # Category pages + shoes/sportswear subpages
│   ├── shoes/             # shoes/page, shoes/men|women|kids, [productId]
│   └── sportswear/        # sportswear/page, sportswear/men|women|kids, [productId]
│
├── story/, story/falco-p/, story/wing-p/
├── privacy/page.tsx, terms/page.tsx, cookies/page.tsx
└── test/, test-session/
```

---

## 3. Data Flow & Connections

### 3.1 Product data
- **Source of truth**: PostgreSQL `Product` (Prisma). Products are **not** in `data/products.ts` (array is empty).
- **ProductContext** (`contexts/ProductContext.tsx`): Fetches from `GET /api/products`, maps to `Product` (from `data/products.ts` type).
- **CartContext** (`contexts/CartContext.tsx`): Stores `CartItem[]` (product + quantity, size, color). Persisted in `localStorage` key `falco-cart`. Uses `Product` from `data/products.ts`.
- **Cart** → Checkout: Checkout page reads `state.items` and `state.totalPrice`, sends to `POST /api/checkout` and to PaymentForm.

### 3.2 Orders
- **Create**: `POST /api/checkout` (after payment). Creates `Order` + `OrderItem`s. Amounts stored as Float (no currency field).
- **Read**: `GET /api/orders` (admin), `GET /api/orders/customer` (customer). Order confirmation uses `GET /api/orders?orderNumber=...`.

### 3.3 Auth
- **lib/auth.ts**: NextAuth config, admin vs customer credentials, JWT with `type: 'admin' | 'customer'`.
- **middleware.ts**: Protects `/admin/*` (except login) and `/account/*`; redirects to login if wrong token type.

### 3.4 Payments
- **Stripe**: `create-payment-intent` expects `amount` in **smallest unit** (cents for USD, öre for SEK). Default `currency: 'usd'`.
- **PaymentForm**: For card/Apple/Google sends `amount: Math.round(totalAmount * 100)` and `currency: 'usd'`. For Swish sends SEK with a conversion (e.g. `totalAmount * 10.5`).
- **Checkout API**: Stores `subtotal`, `tax`, `total` as numbers (no currency in DB).

---

## 4. Prisma Schema (relevant models)

- **Product**: `price` (Float), `originalPrice` (Float?)
- **Order**: `subtotal`, `shippingCost`, `tax`, `discount`, `total` (all Float)
- **OrderItem**: `price` (Float)
- **Coupon**: `discountValue`, `minOrderAmount`, `maxDiscount` (Float)
- **Setting**: key/value (e.g. `currency` in admin settings)

No currency code is stored; everything is numeric. For SEK you can either store SEK amounts everywhere or add a `currency` field later.

---

## 5. Currency Usage Map (USD → SEK)

All places that **display** or **use** currency (symbol $, USD, or “dollars”). For SEK you will replace `$` with `kr` or `SEK` and adjust thresholds.

### 5.1 Frontend – Product & cart prices (display as $ today)

| File | What to change |
|------|----------------|
| `components/CartDrawer.tsx` | `${item.product.price}` → SEK format; `${state.totalPrice.toFixed(2)}` → SEK |
| `components/Products.tsx` | `${product.price}`, `${product.originalPrice}` → SEK |
| `components/ProductSelectionModal.tsx` | If price is shown, switch to SEK |

### 5.2 Frontend – Shop pages (product grids & PDPs)

All of these show `$product.price` and/or `$product.originalPrice` and/or “On orders $1800 and over”:

- `app/shop/[category]/[subcategory]/[type]/page.tsx`
- `app/shop/[category]/[subcategory]/[type]/[productId]/page.tsx`
- `app/shop/women/page.tsx`, `women/shoes/page.tsx`, `women/sportswear/page.tsx`
- `app/shop/men/` (same pattern)
- `app/shop/kids/` (same pattern)
- `app/shop/shoes/page.tsx`, `shoes/men/page.tsx`, `shoes/women/page.tsx`, `shoes/kids/page.tsx`
- `app/shop/shoes/men/[productId]/page.tsx` (and women, kids)
- `app/shop/sportswear/page.tsx`, `sportswear/men|women|kids/page.tsx` and `[productId]`
- `app/shop/sport/page.tsx`

**Free shipping copy** (today: “On orders $1800 and over”):  
If you switch to SEK, use one threshold in SEK (e.g. 20 000 kr) and replace in all these files (or via a shared constant/translation).

### 5.3 Checkout & order confirmation

| File | What to change |
|------|----------------|
| `app/checkout/page.tsx` | All `$...toFixed(2)` (subtotal, total); “Free shipping on orders $1800 and over” |
| `app/order-confirmation/page.tsx` | `$item.price`, `$order.subtotal`, `$order.shipping`, `$order.tax`, `$order.total`; “On all orders over $50” → SEK equivalent |

### 5.4 Account area

| File | What to change |
|------|----------------|
| `app/account/page.tsx` | `$order.total.toFixed(2)` |
| `app/account/orders/page.tsx` | All order totals, subtotals, tax, shipping, line item totals |
| `app/account/wishlist/page.tsx` | `$item.product.price`, `$item.product.originalPrice` |

### 5.5 Admin

| File | What to change |
|------|----------------|
| `app/admin/page.tsx` | `$stats.totalRevenue`, `$product.price` |
| `app/admin/orders/page.tsx` | `$totalRevenue`, `$order.total`, `$selectedOrder.subtotal/tax/total`, item totals |
| `app/admin/products/page.tsx` | `$product.price`, `$product.originalPrice`, modal prices |
| `app/admin/customers/page.tsx` | `$stats.totalRevenue`, `$stats.averageOrderValue`, `$customer.totalSpent`, order totals |
| `app/admin/analytics/page.tsx` | All `$value`, `$segment.revenue`, `$product.revenue`, `$activity.amount` |
| `app/admin/settings/page.tsx` | Default `currency: 'USD'`; dropdown “USD ($)” → add/select “SEK (kr)” |

### 5.6 Payment form & APIs (logic + display)

| File | What to change |
|------|----------------|
| `components/PaymentForm.tsx` | `currency: 'usd'` → `'sek'` for Stripe; `totalAmount * 100` = öre for SEK; Payment Request (Apple/Google) currency; “Pay $…” → “Pay … kr”; Swish block: already SEK but today converts from USD – if site is SEK-native, use `totalAmount` as SEK and send öre (×100). |
| `app/api/create-payment-intent/route.ts` | `currency = 'usd'` → default `'sek'`; amount is already in smallest unit (caller must send öre for SEK). |
| `app/api/create-checkout-session/route.ts` | `currency: 'usd'` → `'sek'` if using Sessions. |
| `app/api/apple-payment/route.ts` | `currency || 'USD'` → SEK if needed. |
| `app/api/google-payment/route.ts` | Same as Apple. |
| `app/api/swiss-payment/route.ts` | Already SEK; remove USD conversion when site is SEK-native. |
| `app/api/settings/route.ts` | Default `currency: 'USD'` → `'SEK'` (or read from DB). |

### 5.7 Other

- **scripts/convert-to-sek.js**: Converts DB product prices USD→SEK (exchange rate 11.25). Run only once if you migrate existing DB to SEK; after that, all new prices are in SEK.
- **locales**: No currency keys in `en.json`/`sv.json` yet; you can add e.g. `currency_symbol`, `free_shipping_over`, `order_over` for reuse.

---

## 6. Suggested approach for USD → SEK

1. **Single source of truth for currency**
   - Add a small **currency config** (e.g. `lib/currency.ts` or env `NEXT_PUBLIC_CURRENCY=SEK`) and a **formatPrice(amount)** helper used everywhere (so you can switch symbol and decimals in one place).
2. **Database**
   - Either run `convert-to-sek.js` once to convert existing product/order amounts to SEK, or add a `currency` column and keep legacy USD while new data is SEK. Recommendation: store everything in SEK and use `formatPrice` so display is consistent.
3. **Stripe**
   - Switch to `currency: 'sek'` and send amount in **öre** (integer). Update create-payment-intent, PaymentForm (card + Payment Request), and Apple/Google Pay APIs.
4. **Swish**
   - Stop converting from USD; treat cart total as SEK and send öre (×100).
5. **Copy**
   - Replace “$1800” free-shipping threshold with one SEK value (e.g. 20 000 kr) in a constant or locale; replace “On all orders over $50” on order-confirmation with SEK equivalent.
6. **Admin settings**
   - Set default currency to SEK; optionally keep USD in dropdown for reporting.

---

## 7. File Dependency Overview

```
layout.tsx
  → SessionProvider, ProductProvider, I18nProvider, CartProvider, CartDrawer, Toaster

ProductContext  → GET /api/products
CartContext     → localStorage falco-cart, Product (data/products type)
Checkout        → Cart state, POST /api/checkout, PaymentForm → create-payment-intent

PaymentForm     → create-payment-intent (card), apple-payment, google-payment, swiss-payment
StripeElementsProvider → wraps PaymentForm (Stripe.js)

Shop pages      → ProductContext or direct API; Navigation (shop layout)
Admin pages     → Admin layout + sidebar; APIs: orders, products, customers, analytics, settings
Account pages   → Session + APIs: orders/customer, addresses, wishlist

middleware      → Protects /admin/*, /account/* by session type
lib/auth.ts     → NextAuth config, admin/customer types
prisma/schema.prisma → All persisted models
```

---

You can use this document for structural changes and as the checklist for the USD → SEK migration. If you tell me your preferred approach (e.g. “single formatPrice + SEK everywhere”), I can outline exact code changes file by file next.
