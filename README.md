# alboraq

متجر إلكتروني (E-commerce) للبراق للاتصالات — الوكيل المعتمد لمنتجات Samsung في سوريا.
Full-stack e-commerce store with a **Laravel 12 REST API** backend and a **React + Vite** frontend (Arabic / RTL, animated UI).

## Structure

```
.
├── backend/    # Laravel 12 API (Sanctum auth) — Controller → Service → Resource → Request
└── frontend/   # React + Vite + Tailwind + Framer Motion (RTL)
```

## Features

- Products, categories, search, filtering & sorting
- User auth (register / login / logout) via Laravel Sanctum
- **Role-based access** (admin / support / customer) via **Spatie Permission**
- Favorites (wishlist), shopping cart, order checkout & order history
- **Live customer ↔ support chat** with image attachments (**Spatie Media Library**), polling, and a support dashboard
- **Product reviews & ratings**
- **Discount coupon codes** at checkout
- Animated, responsive Arabic RTL interface

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Customer | `test@example.com` | `password` |
| Support agent | `support@alboraq.com` | `password` |
| Admin | `admin@alboraq.com` | `password` |

**Coupon codes:** `WELCOME10` (10% off), `EID20` (20% off orders ≥ 5,000,000), `SAVE50K` (500,000 off orders ≥ 2,000,000)

## Backend setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env          # then set your APP_KEY / DB settings
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8001
```

API base URL: `http://localhost:8001/api`

**Demo account:** `test@example.com` / `password`

### Main endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/register`, `/api/login` | public |
| GET | `/api/categories`, `/api/products` | public |
| GET | `/api/products/{slug}` | public |
| GET/POST/DELETE | `/api/favorites` | token |
| GET/POST/PUT/DELETE | `/api/cart` | token |
| GET/POST | `/api/orders` | token |

## Frontend setup (React)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

The API URL is configured in `frontend/.env` (`VITE_API_URL`).

## Tech stack

**Backend:** Laravel 12, Sanctum, SQLite (default) · **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Axios, React Router.
