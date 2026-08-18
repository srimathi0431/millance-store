# Millance Store

**Everything You Need. One Trusted Store.**

A premium multi-vendor marketplace built with React, Vite, and TypeScript.

## 🚀 Features

- **Mobile-First Design** - Fully responsive for all devices
- **Premium UI** - Modern white theme with smooth animations
- **13 Home Sections** - Complete marketplace experience
- **Fast Performance** - Optimized with Vite and lazy loading
- **Type-Safe** - Built with TypeScript
- **Mock Data** - Frontend-only, no backend required

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Lucide React** - Icons
- **CSS3** - Styling with custom properties

## 🎨 Design System

### Colors
- Background: `#F8F9FB`
- Cards: `#FFFFFF`
- Primary: `#111827`
- Accent: `#2563EB`
- Success: `#10B981`
- Offer: `#EF4444`

### Features
- Border Radius: `20px`
- Soft shadows
- Smooth animations
- Glassmorphism effects

## 🏗️ Project Structure

```
millance-store/
├── components/
│   ├── common/           # Reusable components
│   │   └── ProductCard
│   └── home/             # Home page sections
│       ├── HeroBanner
│       ├── Categories
│       ├── FlashSale
│       ├── TodaysDeals
│       ├── FeaturedStores
│       ├── ProductSlider
│       ├── TopBrands
│       ├── CustomerReviews
│       └── DownloadApp
├── layouts/
│   ├── Header
│   ├── Footer
│   └── MainLayout
├── pages/
│   └── Home
├── constants/
│   ├── theme.ts         # Design system
│   └── mockData.ts      # Sample data
├── types/              # TypeScript definitions
├── styles/             # Global styles
└── assets/            # Images and icons
```

## 🎯 Home Page Sections

1. **Sticky Header** - Logo, search, cart, wishlist, profile
2. **Hero Banner** - Auto-sliding carousel with 6 banners
3. **Categories** - 12 categories with horizontal scroll
4. **Flash Sale** - Countdown timer with products
5. **Today's Deals** - Grid of best deals
6. **Featured Stores** - Beautiful store cards
7. **Trending Products** - Horizontal slider
8. **Best Sellers** - Popular products
9. **New Arrivals** - Latest products
10. **Top Brands** - Premium brand cards
11. **Customer Reviews** - Testimonials
12. **Download App** - QR code and store links
13. **Footer** - Links, contact, social media

## 🚦 Getting Started

### Installation

```bash
cd millance-store
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📱 Navigation

- **Home** - Main marketplace
- **Categories** - Browse by category
- **Stores** - All vendor stores
- **Offers** - Special deals
- **Become Seller** - Seller registration
- **Orders** - Order history
- **Wishlist** - Saved items
- **Cart** - Shopping cart
- **Profile** - User account

## 🎨 Key Components

### ProductCard
Displays product with:
- Image
- Name, description
- Price, discount
- Rating, reviews
- Seller info
- Add to cart button
- Wishlist button

### Header
- Sticky navigation
- Delivery location
- Search bar
- Category links
- Action icons (Orders, Wishlist, Cart, Notifications, Profile)
- Mobile menu

### Footer
- Company links
- Help center
- Policies
- Seller info
- Contact details
- Social media
- Payment methods

## 📊 Mock Data

All sections use mock data from `constants/mockData.ts`:
- 6 Hero banners
- 12 Categories
- Flash sale with 3 products
- 8 Products for various sections
- 6 Featured stores
- 4 Customer reviews
- 8 Top brands

## 🎯 Performance

- Lazy loading images
- Skeleton loading states
- Optimized animations
- Efficient re-renders
- Code splitting ready

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- **Frontend Only** - No backend integration
- **Mock Data** - All data is static
- **Production Ready** - Clean, scalable code
- **Existing Project** - Does not affect other modules

## 🔮 Future Enhancements

These sections will be added later:
- Nearby Stores
- Continue Shopping
- Recently Viewed
- Recommended For You

## 📄 License

Part of the Millance project ecosystem.

---

Built with ❤️ for the Millance Store platform
