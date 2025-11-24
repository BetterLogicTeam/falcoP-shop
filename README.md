# Falco P Sportswear E-commerce Website

A modern, responsive e-commerce website built with Next.js, featuring a complete admin panel, payment integration, and elegant UI design.

## Features

- 🛍️ **Complete E-commerce Functionality**
  - Product catalog with categories and subcategories
  - Shopping cart with persistent state
  - Product selection modal with size/color options
  - Responsive product grid layout

- 💳 **Multiple Payment Methods**
  - Stripe credit card processing
  - Apple Pay integration
  - Google Pay integration
  - Swish (Swedish mobile payment)
  - Elegant payment form with dark theme

- 👨‍💼 **Admin Dashboard**
  - Product management (CRUD operations)
  - Customer management
  - Order analytics
  - Settings page
  - Image upload functionality

- 🎨 **Modern UI/UX**
  - Dark theme with premium styling
  - Responsive design for all devices
  - Smooth animations and transitions
  - Glass morphism effects
  - Tailwind CSS styling

- 🌐 **Internationalization**
  - Multi-language support with i18next
  - English and other language support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Payments**: Stripe, Apple Pay, Google Pay
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Internationalization**: i18next, react-i18next

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BetterLogicTeam/falcoP-shop.git
cd falcoP-shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── checkout/           # Checkout page
│   ├── shop/               # Shop pages
│   └── globals.css         # Global styles
├── components/              # Reusable components
│   ├── admin/              # Admin-specific components
│   ├── CartButton.tsx      # Cart button component
│   ├── CartDrawer.tsx      # Shopping cart drawer
│   ├── Navigation.tsx      # Main navigation
│   └── PaymentForm.tsx    # Payment form
├── contexts/               # React Context providers
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind configuration
```

## Key Components

### Payment Integration
- **Stripe**: Credit card processing with PCI compliance
- **Apple Pay**: Native iOS payment integration
- **Google Pay**: Android payment integration
- **Swish**: Swedish mobile payment integration

### Admin Panel
- Product management with image upload
- Customer data management
- Order analytics and reporting
- Settings configuration

### Shopping Experience
- Responsive product catalog
- Advanced filtering and search
- Shopping cart with persistent state
- Elegant checkout process

## API Routes

- `/api/create-payment-intent` - Stripe payment intent creation
- `/api/swiss-payment` - Swish payment processing
- `/api/apple-payment` - Apple Pay simulation
- `/api/google-payment` - Google Pay simulation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

Built with ❤️ for Falco P Sportswear