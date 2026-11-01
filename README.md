# BarberPro / TrimNow / BookMyBarber

Premium barber booking platform with modern UI/UX, full backend integration, and production-ready architecture.

## Project Structure

- `backend/` - Express.js API server, MongoDB schemas, Firebase auth integration, Stripe payments.
- `frontend/` - Next.js 14 app with premium design, Framer Motion animations, responsive booking flows.

## Features

- Landing page with animated hero, services, reviews, and CTA.
- Firebase authentication with email, Google login, and JWT session management.
- Role-based access: user, barber, admin.
- Barber shop discovery with search and filters.
- Booking system, home service option, and payment integration.
- Admin dashboard, barber panel, notifications, wallet and coupons.
- AI hairstyle suggestions and barber recommendations.
- Cloudinary image upload support.

## Local Setup

### Backend

1. `cd backend`
2. `npm install`
3. Create a `.env` file using `.env.example`
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file using `.env.local.example`
4. `npm run dev`

## Environment Variables

### backend/.env.example

```
PORT=5000
MONGO_URI=your_mongo_atlas_uri
JWT_SECRET=supersecretjwtkey
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### frontend/.env.local.example

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Deployment

- Frontend: Deploy `frontend/` on Vercel.
- Backend: Deploy `backend/` on Render or Railway.
- Set real `MONGO_URI`, `STRIPE_*`, `CLOUDINARY_*`, and Firebase secrets in your host environment.

## Notes

- Firebase handles email verification and password reset flows.
- Use Stripe webhooks to sync payment status.
- Cloudinary stores barber shop and AI-uploaded images.

---

This app is designed to feel like a funded startup product with polished visuals, page transitions, and a real fullstack booking system.
