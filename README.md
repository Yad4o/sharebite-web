# ShareBite Web

React 18 + TypeScript frontend for **ShareBite** — a platform that connects leftover food donors with recipients, delivered by community volunteers.

## Pages

| Route | Who sees it | Description |
|---|---|---|
| `/` | Everyone | Landing with role CTAs |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up with role selection |
| `/feed` | All users | Browse available food |
| `/food/:id` | All users | Food detail + request button |
| `/donor` | Donor | My posts + incoming requests |
| `/donor/upload` | Donor | Upload food with photo |
| `/recipient` | Recipient | My requests + tracking progress |
| `/delivery` | Delivery | Available jobs + my deliveries |
| `/notifications` | All users | Notification centre |

## Quick start

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Vite proxies all API calls to the backend at `http://localhost:8000`.

Start the backend first:

```bash
cd ../sharebite-api
docker-compose up
# or: uvicorn app.main:app --reload
```

## Role-based flow

```
Donor       → uploads food photo → post appears in Feed
Recipient   → requests food → donor gets notified
Delivery    → accepts request → picks up → marks delivered
Everyone    → gets real-time notifications at each step
```

## Tech stack

- React 18 + TypeScript
- Vite 5 + Tailwind CSS 3 (amber theme)
- react-router-dom v6 (protected routes)
- react-dropzone (image upload)
- Native fetch API (no axios)
- JWT stored in localStorage
