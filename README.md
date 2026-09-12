# DishDrop

DishDrop is a full-stack recipe community where cooks can publish recipes, browse by cuisine and category, and rate a recipe once with the option to update that rating later.

## Highlights

- Responsive recipe gallery for mobile, tablet, and desktop
- Authenticated recipe creation, editing, and owner-only deletion
- Persistent MongoDB ratings with one atomic vote per user and recipe
- Public rating summaries without exposing voter identifiers
- Loading, empty, error, and retry states for Render cold starts
- Keyboard-accessible filters, cards, modal, and rating controls

## Architecture

| Layer | Technology | Hosting |
| --- | --- | --- |
| Frontend | React, Vite, React Router | Vercel |
| API | Node.js, Express, Mongoose | Render |
| Database | MongoDB Atlas | AWS Stockholm region |

The application uses bearer-token authentication. The browser sends a JWT to the API, Express enforces ownership and validation, and Mongoose persists recipes and ratings in MongoDB Atlas. AWS is the Atlas infrastructure region; DishDrop does not configure AWS directly.

## Local development

Requirements: Node.js 20+ and access to a MongoDB database.

```bash
cd backend
cp .env.example .env
npm ci
npm start
```

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

The default frontend URL is `http://localhost:5173` and the default API port is `3000`.

## Environment variables

Backend:

- `MONGO_URL` — MongoDB connection string
- `JWT_SECRET` — strong signing secret; the server refuses to start without it
- `FRONTEND_URL` — canonical frontend URL, also used for password-reset links
- `CORS_ORIGINS` — optional comma-separated additional browser origins
- `EMAIL_USER` and `EMAIL_PASS` — mail transport credentials for password reset
- `PORT` — optional API port

Frontend:

- `VITE_API_URL` — public base URL of the Express API

Never commit `.env` files or secret values.

## Quality checks

Run these in both `frontend` and `backend`:

```bash
npm run lint
npm test
```

Build the production frontend with:

```bash
cd frontend
npm run build
```

## Rating behavior

Guests can view averages and vote counts but must log in to rate. An authenticated user has one rating per recipe; submitting another value updates the existing rating. The API accepts integers from 1 through 5 and returns only `averageRating`, `ratingCount`, and the current user's `userRating`.

## Deployment

- Deploy `frontend` to Vercel and set `VITE_API_URL`.
- Deploy `backend` to Render and configure the backend environment variables.
- Allow the production Vercel origin using `FRONTEND_URL` or `CORS_ORIGINS`.

No database migration is required for the rating hardening in this version.
