# ScholarNest

ScholarNest is a student marketplace for finding and passing on useful second-hand items around campus. The current migration slice adds student-submitted listings, public discovery, listing review, and a marketplace-first storefront on top of the existing MERN application.

> Buy smarter. Sell what you no longer need. Keep your campus moving.

## Product surfaces

- `frontend/` — React storefront with marketplace homepage, paginated browse/search, listing details, student listing submission, authentication, and account listing status.
- `admin/` — React operations app with legacy catalog/order tools and a new student listing moderation queue.
- `backend/` — Express API with MongoDB/Mongoose, JWT auth, Cloudinary uploads, email delivery, and legacy Stripe/Razorpay order endpoints.

The app is in an active product migration. The new listing model and routes are separate from the original `Product`/cart/order model so existing records are not silently rewritten.

## Current marketplace flow

1. A student signs in or registers.
2. They submit a listing with photos and general campus location.
3. New submissions start as `pending_review`; drafts start as `draft`.
4. An admin reviews the listing at `/moderation` in the admin app and can approve or reject it with a reason.
5. Approved listings appear at `/browse` and `/listing/:listingId`.
6. A buyer can reserve an available item; MongoDB atomically switches it from `published` to `reserved`, preventing a second buyer from reserving it.
7. The buyer and seller arrange a public meetup and handle payment in person. The seller marks the item ready for handoff, then the buyer confirms the exchange, which marks the listing sold.

Public listings show a campus or general area, never a precise residential address. Uploads are limited to six image files, 8 MB each.

## Technology

- React 19, React Router, Vite, Tailwind CSS
- Express 4, Node.js ES modules
- MongoDB Atlas or local MongoDB with Mongoose
- JWT and bcryptjs
- Cloudinary for listing images
- Nodemailer with Brevo SMTP
- Razorpay and Stripe remain in the legacy checkout implementation

## Local setup

Use three terminals from the repository root.

### Backend

```sh
cd backend
npm install
npm run server
```

Create `backend/.env` with:

```dotenv
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URLS=http://localhost:5173,http://localhost:5174
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
```

`MONGODB_URI` is used with the database name `campusbazaar` by the current connection helper. Set secrets only in local environment files or your hosting provider; never commit them or place private keys in Vite variables.

### Storefront

```sh
cd frontend
npm install
```

Set `frontend/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=
```

Then run `npm run dev` (Vite defaults to port 5173).

### Admin

```sh
cd admin
npm install
```

Set `admin/.env` to the same `VITE_BACKEND_URL`, then run `npm run dev -- --port 5174`.

## Marketplace API

- `GET /api/listings` — published listings; supports `q`, `category`, `campus`, `condition`, `minPrice`, `maxPrice`, `sort`, and `page`.
- `GET /api/listings/:id` — published listing detail.
- `POST /api/marketplace-orders/reserve` — authenticated atomic reservation of an available listing.
- `GET /api/marketplace-orders/mine` and `POST /api/marketplace-orders/update` — buyer/seller exchange tracking and handoff confirmation.
- `POST /api/listings` — authenticated student submission (`multipart/form-data`, `images` field).
- `GET /api/listings/mine` — authenticated user's listings and review status.
- `GET /api/listings/moderation` — admin moderation queue.
- `POST /api/listings/moderate` — admin status change (`published`, `rejected`, `suspended`, `reserved`, or `sold`). Rejections accept `rejectionReason`.
- `GET /api/user/profile/:username` — public profile summary and public listings.

Existing `/api/product`, `/api/cart`, and `/api/order` APIs are retained for compatibility with the original catalog and checkout. New marketplace listing pages do not depend on loading the entire legacy product catalog.

## Data and migration

The marketplace introduces a `listing` collection instead of mutating legacy `product` documents. New listings include seller ownership, campus, condition, negotiability, images, moderation state, and timestamps. The `user` collection gains optional `username`, `campus`, and a consistently named email-verification flag while keeping the misspelled legacy flag for compatibility.

No migration script rewrites or deletes existing data. Legacy catalog items should be reviewed and manually re-created as student listings or migrated with a separately reviewed script that assigns a valid seller and campus. Do not expose old `product` records as student listings without verified ownership.

## Deployment notes

- Deploy `frontend/` and `admin/` as separate Vite sites; both include SPA rewrites for client-side routes.
- Deploy `backend/` to a Node-capable host and configure the environment variables above.
- Set `FRONTEND_URLS` to the exact comma-separated storefront and admin origins used in production.
- Use MongoDB Atlas, Cloudinary, and Brevo credentials from server-side secrets.
- The current Vercel API configuration may need adjustment for persistent sockets and background jobs if those are introduced.

## Known migration gaps

This is the foundation of the redesign, not the complete launch scope in the product brief. Saved listings, offer negotiation, real-time messaging, persistent notifications, campus administration, transaction-bound reviews, seller/buyer transaction dashboards, atomic purchase reservation, verified-payment webhooks/refunds, reports, audit logs, analytics, SEO metadata/sitemap, and full automated flow coverage still need implementation. The new listing detail page keeps those actions clearly unavailable rather than creating fake transactions.

The existing authentication still uses a single environment-configured admin identity, and student email verification is not yet enforced before listing. Production launch requires completing the remaining authorization, payment, moderation, and operational work above.

## Scripts

From each app directory:

- `npm run dev` — Vite development server (backend uses `npm run server`).
- `npm run build` — production frontend build.
- `npm run lint` — ESLint.
- Backend `npm start` — start the API with Node.

The backend package currently has no automated test suite.
