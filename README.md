# Virtual 360 Tour Service

A modern Next.js + Tailwind landing page and simple local CMS for managing 360 tour content.

## Features

- Responsive SaaS-style homepage with hero, industries, featured tours, benefits, and CTA
- Searchable tour library with category filtering and pagination
- Tour detail pages with embedded iframe viewers and related tours
- Category pages for education, hotels, serviced apartments, resorts, and real estate
- Admin login and dashboard for adding, editing, and deleting tours
- Local JSON-backed persistence in `data/tours.json`
- Optional thumbnail upload support to `public/uploads`
- SEO helpers via metadata, `robots.ts`, and `sitemap.ts`

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Default Admin Login

- Email: `admin@virtual360.vn`
- Password: `admin123`

You can override these with environment variables:

```bash
ADMIN_EMAIL=admin@virtual360.vn
ADMIN_PASSWORD=admin123
```

## Data Storage

- Tours are stored in `data/tours.json`
- Uploaded thumbnails are saved to `public/uploads`
- Sample embed links use the local demo viewer at `/viewer.html?scene=...`
