# Full-Stack School Dashboard (React + Laravel)

This project contains:

- Frontend in repository root (`src/`, React + Vite)
- Backend in `IT15_BACKEND-main/` (Laravel REST API + Sanctum auth)

## Features

- User authentication (register/login/logout/me)
- Dashboard charts (monthly enrollment, course distribution, attendance patterns)
- Weather integration (current weather + 5-day forecast)
- Loading states, validation feedback, and error handling
- Responsive dashboard UI

## Tech Stack

- Frontend: React, React Router, Recharts, Axios, Bootstrap
- Backend: Laravel 12, Sanctum, Eloquent ORM
- Database: MySQL or PostgreSQL

## Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer 2+
- MySQL or PostgreSQL

## Backend Setup

1. Open backend directory:

  - `cd IT15_BACKEND-main`

2. Install dependencies:

  - `composer install`

3. Create env file:

  - `copy .env.example .env`

4. Configure `.env`:

  - `DB_CONNECTION=mysql` (or `pgsql`)
  - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
  - `FORCE_HTTPS=false` (set true in production)
  - `WEATHER_API_KEY=` (optional)

5. Generate app key:

  - `php artisan key:generate`

6. Run migrations + seeders:

  - `php artisan migrate --seed`

7. Start backend server:

  - `php artisan serve`

Backend URL: `http://127.0.0.1:8000`

Seeded login:

- Email: `student@example.com`
- Password: `password`

## Frontend Setup

1. From repository root:

  - `npm install`

2. Create env file:

  - `copy .env.example .env`

3. Run frontend:

  - `npm start`
  - or `npm run dev`

Frontend URL: `http://localhost:5173`

## Security Notes

- Tokens are sent via Bearer Authorization header
- Inputs are sanitized/validated in frontend + backend
- CORS is configured in `IT15_BACKEND-main/config/cors.php`
- Optional HTTPS enforcement is available with `FORCE_HTTPS=true`

## API Endpoints

### Public

- `POST /api/register`
- `POST /api/login`
- `GET /api/weather/current` (throttled)
- `GET /api/weather/forecast` (throttled)

### Protected (Bearer token)

- `POST /api/logout`
- `GET /api/me`
- `GET|POST|PUT|PATCH|DELETE /api/students`
- `GET|POST|PUT|PATCH|DELETE /api/courses`
- `GET|POST|PUT|PATCH|DELETE /api/programs`
- `GET|POST|PUT|PATCH|DELETE /api/subjects`
- `GET|POST|PUT|PATCH|DELETE /api/school-days`
- `GET /api/dashboard`
