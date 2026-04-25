# 🌍 WanderAI — AI-Powered Trip Planner

A full-stack travel planning web app that uses **Google Gemini AI** to generate complete, personalized travel itineraries including day-wise schedules, hotel suggestions, food recommendations, and budget breakdowns.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| AI | Google Gemini 1.5 Flash API |
| Auth | JWT + bcrypt |
| Animations | CSS animations + Framer Motion |

---

## 📁 Project Structure

```
ai-trip-planner/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Signup, login, profile
│   │   └── tripController.js     # Gemini AI + CRUD trips
│   ├── middleware/
│   │   └── auth.js               # JWT auth middleware
│   ├── models/
│   │   ├── User.js               # User schema + bcrypt
│   │   └── Trip.js               # Trip schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth/*
│   │   └── trip.js               # /api/trip/*
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Navbar.js
│   │   │       └── LoadingSpinner.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── PlannerPage.js
│   │   │   ├── ItineraryPage.js
│   │   │   └── TripDetailPage.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+ ([nodejs.org](https://nodejs.org))
- MongoDB installed locally ([mongodb.com/try/download/community](https://www.mongodb.com/try/download/community))
- Google Gemini API Key ([aistudio.google.com](https://aistudio.google.com))

---

### Step 1 — Clone / Extract the Project

```bash
unzip ai-trip-planner.zip
cd ai-trip-planner
```

---

### Step 2 — Setup the Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-trip-planner
JWT_SECRET=your_super_secret_key_here_make_it_long
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> 🔑 **Get Gemini API Key**: Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), sign in with Google, and create a free API key.

Start the backend:
```bash
npm run dev        # Development (with nodemon auto-reload)
# OR
npm start          # Production
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Setup the Frontend

Open a **new terminal**:
```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000** 🎉

---

### Step 4 — Setup MongoDB Compass (Optional GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using: `mongodb://localhost:27017`
3. You'll see the `ai-trip-planner` database appear after your first signup
4. Collections: `users`, `trips`

---

## 🌐 API Endpoints

### Auth Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Trip Routes (all require JWT)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/trip/generate` | Generate AI itinerary |
| POST | `/api/trip/save` | Save a trip |
| GET | `/api/trip/get` | Get all user trips |
| GET | `/api/trip/:id` | Get single trip |
| DELETE | `/api/trip/:id` | Delete a trip |
| PATCH | `/api/trip/:id/favorite` | Toggle favorite |

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-trip-planner` |
| `JWT_SECRET` | Secret key for JWT signing | Any long random string |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIzaSy...` |

---

## 🧠 How Gemini AI Integration Works

1. User fills the trip planner form
2. Frontend sends POST to `/api/trip/generate`
3. Backend builds a structured prompt with all trip details
4. Prompt is sent to `gemini-1.5-flash` model
5. Gemini returns a structured JSON itinerary
6. Frontend parses and renders the beautiful card-based UI
7. User can save the trip to MongoDB with one click

---

## 🎨 Features

- ✅ JWT Authentication (signup / login / session persistence)
- ✅ AI-generated day-wise itineraries via Gemini
- ✅ Time-wise schedule with activity details
- ✅ Hotel recommendations with ratings & pricing
- ✅ Budget breakdown with visual progress bars
- ✅ Food recommendations for every meal
- ✅ Packing list & travel tips
- ✅ Save trips to MongoDB
- ✅ Dashboard with all saved trips
- ✅ Favorite/unfavorite trips
- ✅ Delete trips
- ✅ Fully responsive (mobile + desktop)
- ✅ Beautiful loading animations
- ✅ Password strength indicator
- ✅ Skeleton loading UI

---

## 🐛 Troubleshooting

**MongoDB connection failed?**
- Ensure MongoDB service is running: `sudo systemctl start mongod` (Linux) or start MongoDB via MongoDB Compass
- Check MONGO_URI in `.env`

**Gemini API error?**
- Verify your GEMINI_API_KEY is correct and active
- Free tier has rate limits; wait a moment and retry

**CORS errors?**
- Backend runs on port 5000, frontend on 3000
- The `"proxy": "http://localhost:5000"` in frontend `package.json` handles this in development

---

## 📦 Build for Production

```bash
# Build frontend
cd frontend
npm run build

# The build/ folder can be served statically
# Or deploy backend + build/ on a server like Railway, Render, etc.
```

---

Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI
