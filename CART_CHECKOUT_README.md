# Cart and Checkout Implementation

This document explains the cart and checkout functionality implemented for the Falco Peak website.

## Features Implemented

### 1. Cart State Management
- **CartContext**: React context for managing cart state globally
- **Persistent Storage**: Cart items are saved to localStorage
- **Real-time Updates**: Cart count updates in navigation
- **Toast Notifications**: User feedback for cart actions

### 2. Cart UI Components
- **CartDrawer**: Slide-out cart drawer accessible from navigation
- **ProductSelectionModal**: Modal for selecting size, color, and quantity
- **Cart Operations**: Add, remove, update quantities, clear cart

### 3. Checkout Process
- **Checkout Page**: Complete checkout form with shipping information
- **Stripe Integration**: Secure payment processing via Stripe Checkout
- **Order Confirmation**: Success page with order details and tracking

### 4. Stripe Payment Integration
- **Checkout Sessions**: Server-side API route for creating Stripe sessions
- **Secure Payments**: All payments processed securely through Stripe
- **Success/Cancel Handling**: Proper redirects after payment completion

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Optional: Stripe Webhook Secret (for handling webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Stripe Setup Instructions

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: 
   - Go to Dashboard > Developers > API Keys
   - Copy your Publishable Key and Secret Key
   - Add them to your `.env.local` file
3. **Test Mode**: Use test keys (starting with `pk_test_` and `sk_test_`) for development
4. **Webhook Setup** (Optional): Set up webhooks for production to handle payment events

## File Structure

```
├── contexts/
│   └── CartContext.tsx          # Cart state management
├── components/
│   ├── CartDrawer.tsx           # Cart drawer component
│   └── ProductSelectionModal.tsx # Product selection modal
├── app/
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── order-confirmation/
│   │   └── page.tsx            # Order confirmation page
│   └── api/
│       └── create-checkout-session/
│           └── route.ts        # Stripe checkout API
└── .env.local                  # Environment variables
```

## Usage

### Adding Items to Cart
```tsx
import { useCart } from '../contexts/CartContext'

const { addToCart } = useCart()

// Add product with size and color selection
addToCart(product, quantity, size, color)

// Add product without size/color (direct add)
addToCart(product)
```

### Cart Operations
```tsx
const { 
  state, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  openCart,
  closeCart 
} = useCart()

// Access cart state
console.log(state.items)        // Cart items
console.log(state.totalItems)   // Total quantity
console.log(state.totalPrice)   // Total price
console.log(state.isOpen)       // Cart drawer open state
```

## Testing

### Test Cards (Stripe Test Mode)
Use these test card numbers for testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

### Test Flow
1. Add items to cart
2. Click cart icon to open drawer
3. Click "Proceed to Checkout"
4. Fill out shipping information
5. Click "Pay" button
6. Use test card information
7. Complete payment
8. View order confirmation

## Production Considerations

1. **Environment Variables**: Use live Stripe keys for production
2. **Webhooks**: Set up Stripe webhooks for order fulfillment
3. **Error Handling**: Implement proper error handling for failed payments
4. **Order Management**: Create backend system for order tracking
5. **Inventory**: Implement inventory management
6. **Email Notifications**: Set up order confirmation emails
7. **Analytics**: Track conversion rates and cart abandonment

## Security Notes

- Never expose secret keys in client-side code
- Always validate payment data on the server
- Use HTTPS in production
- Implement proper error handling
- Validate all user inputs

## Support

For issues or questions about the cart and checkout implementation, please refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Context](https://reactjs.org/docs/context.html)
