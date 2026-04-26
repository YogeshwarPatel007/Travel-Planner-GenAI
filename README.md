# TripGenie — AI-Powered Travel Itinerary Planner

> Plan a full trip in under 2 minutes. Tell it where you want to go, how many days, your budget — and the AI builds a complete day-by-day itinerary with real hotels, restaurants, and activities.

**Live Demo:** [travel-planner-gen-ai.vercel.app](https://travel-planner-gen-ai.vercel.app)

---

## What it does

- Generates a complete day-by-day travel itinerary using Anthropic Claude Haiku
- Supports trips from 1 to 30 days with consistent, structured output
- Four budget tiers — Minimum, Mid-range, Luxury, Ultra Luxury — with real cost estimates
- Hotel suggestions with direct links to Google, Booking.com, and MakeMyTrip
- Restaurant suggestions per day based on your meal preference
- Edit and regenerate any trip without going back to the planner
- Save trips to a personal dashboard, mark favourites, download as PDF
- Full user authentication with JWT and bcrypt

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| AI Model | Anthropic Claude Haiku (`claude-haiku-4-5`) |
| Auth | JWT (7-day expiry) + bcrypt (12 rounds) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

```
tripgenie/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # signup, login, getMe, updateProfile
│   │   └── tripController.js     # generateTrip, saveTrip, getTrips, deleteTrip, toggleFavorite
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # bcrypt pre-save hook, comparePassword method
│   │   └── Trip.js               # userId ref, Mixed type for itinerary JSON
│   ├── routes/
│   │   ├── auth.js               # /api/auth/*
│   │   └── trip.js               # /api/trip/* (all protected)
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # CORS, middleware, DB connect
│
└── frontend/
    ├── cypress/
    │   ├── e2e/
    │   │   ├── landing.cy.js
    │   │   ├── auth.cy.js
    │   │   ├── dashboard.cy.js
    │   │   └── planner.cy.js
    │   └── support/
    │       └── commands.js       # cy.login() command
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js    # global auth state
    │   ├── pages/
    │   │   ├── LandingPage.js
    │   │   ├── LoginPage.js
    │   │   ├── SignupPage.js
    │   │   ├── PlannerPage.js    # 4-step form
    │   │   ├── ItineraryPage.js  # AI result + budget tiers + edit panel
    │   │   ├── DashboardPage.js
    │   │   └── TripDetailPage.js
    │   ├── components/ui/
    │   │   ├── Navbar.js
    │   │   └── LoadingSpinner.js
    │   ├── utils/
    │   │   └── api.js            # axios instance with JWT interceptor
    │   └── App.js                # routing + ProtectedRoute
    ├── cypress.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### 1. Clone the repo

```bash
git clone https://github.com/vaibhavKadam0011/Travel-Planner-GenAI.git
cd Travel-Planner-GenAI
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-trip-planner
JWT_SECRET=your_jwt_secret_key_here
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev       # with nodemon (auto-restart)
# or
npm start         # without nodemon
```

Backend runs at `http://localhost:5000`

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register new user, returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Required | Get current user from token |
| PUT | `/api/auth/profile` | Required | Update display name |

### Trips

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/trip/generate` | Required | Generate AI itinerary via Claude |
| POST | `/api/trip/save` | Required | Save itinerary to MongoDB |
| GET | `/api/trip/get` | Required | Get all trips for logged-in user |
| GET | `/api/trip/:id` | Required | Get single trip (must be owner) |
| DELETE | `/api/trip/:id` | Required | Delete trip (must be owner) |
| PATCH | `/api/trip/:id/favorite` | Required | Toggle isFavorite |
| GET | `/api/health` | Public | Health check |

---

## Environment Variables

### Backend (required)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `PORT` | Server port (default 5000) |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `https://your-app.vercel.app`) |

### Frontend (required)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API URL (e.g. `https://your-backend.onrender.com/api`) |

---

## Running Tests

### GUI Tests (Cypress)

```bash
cd frontend

# Open Cypress GUI
npx cypress open

# Run headlessly
npx cypress run
```

Before running, update `cypress/support/commands.js` with your test account credentials:

```js
Cypress.Commands.add('login', () => {
  cy.visit('/login')
  cy.get('input[type="email"]').type('your@email.com')
  cy.get('input[type="password"]').type('yourpassword')
  cy.contains('Sign In').click()
  cy.url().should('include', '/dashboard')
})
```

**Test coverage:**

| File | Tests | What it covers |
|---|---|---|
| `landing.cy.js` | 6 | Page loads, navigation, auth redirects |
| `auth.cy.js` | 6 | Form fields, validation, protected routes |
| `dashboard.cy.js` | 4 | Welcome message, stats, NaN check |
| `planner.cy.js` | 4 | Page load, travel modes, solo auto-select |
| **Total** | **20** | **100% pass rate** |

---

## Deployment

### Backend — Render

1. Connect your GitHub repo to [render.com](https://render.com)
2. Create a new **Web Service**
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from the table above
7. Set `CLIENT_URL` to your Vercel frontend URL

### Frontend — Vercel

1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Framework preset: **Create React App**
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
5. Also add `CI=false` and `DISABLE_ESLINT_PLUGIN=true` to avoid build errors

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after idle can take 30-50 seconds to wake up.

---

## How the AI Generation Works

The trip generation uses a pre-structured JSON template sent to Claude Haiku. Instead of asking Claude to freely write a plan, we send an empty JSON skeleton with every field set to `""` or `0` and tell Claude to fill every blank.

Short field names (`t` instead of `time`, `a` instead of `activity`) reduce token usage by ~1000 tokens on a 10-day trip — this is what makes 30-day itineraries possible within the 8192 token limit.

After the response, a normalise function converts compact field names back to descriptive ones before the frontend receives the data.

---

## Team

| Name | Role |
|---|---|
| Vaibhav Kadam (202511037) | Group Leader — Backend, AI integration, deployment |
| Patel Yogeshwar (202511019) | Frontend — PlannerPage, ItineraryPage, edit panel |
| Kishan Chopda (202511014) | Frontend — LandingPage, Dashboard, routing |

**Course:** IT-568 — GenAI for Software Engineering
**Institution:** Northumbria University
**April 2026**

---

## License

This project was built for academic purposes as part of the IT-568 course.
