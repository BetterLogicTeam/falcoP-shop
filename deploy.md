# 🚀 Deployment Guide for Falco Peak Website

## 📦 Build for Static Hosting

Your Next.js project is now configured for static export. Follow these steps:

### 1. Build the Project
```bash
npm run build
```

### 2. Find Your Static Files
After building, your static files will be in the `out/` folder.

### 3. Deploy to Different Platforms

#### 🌐 **Namecheap Shared Hosting:**
1. Upload all contents from the `out/` folder to your `public_html/` directory
2. Make sure `index.html` is in the root of `public_html/`

#### 🚀 **Netlify:**
1. Drag and drop the `out/` folder to Netlify's deploy area
2. Or connect your GitHub repo and set build command to `npm run build`
3. Set publish directory to `out`

#### ⚡ **Vercel (Recommended for Next.js):**
1. Connect your GitHub repo
2. Vercel will automatically detect Next.js and deploy
3. No additional configuration needed

### 4. Important Notes

✅ **What Works:**
- All your pages and components
- EmailJS integration
- Static assets (images, videos)
- Client-side routing
- Responsive design

❌ **What Doesn't Work with Static Export:**
- Server-side API routes (but EmailJS handles your forms)
- Dynamic imports with SSR
- `getServerSideProps` (you're using client-side only)

### 5. File Structure After Build
```
out/
├── index.html          # Homepage
├── shop/
│   └── index.html     # Shop page
├── story/
│   └── index.html     # Story page
├── _next/             # Next.js assets
├── images/            # Your images
├── videos/            # Your videos
└── ...other files
```

## 🔧 Troubleshooting

If you get errors during build:
1. Make sure all images exist in `public/` folder
2. Check that all components use `'use client'` directive
3. Ensure no server-side code is used

## 📱 Testing Locally
```bash
# Build and serve locally to test
npm run build
npx serve out
```

Your website will work perfectly on any static hosting service!
