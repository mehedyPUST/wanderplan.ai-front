# 🌍 WanderPlan - AI Driven Travel Assistant

> **Live Demo:** [wanderplan-ai-front.vercel.app](https://wanderplan-ai-front.vercel.app)

WanderPlan is a full-stack, production-ready travel platform powered by **Agentic AI**. It provides personalized destination recommendations, AI-generated itineraries, and a floating AI chat assistant — all within a beautiful, responsive interface.

---

## 📋 Features

### 🤖 AI Features (3 Agentic AI Systems)
- **AI Smart Recommendation Engine** — Analyzes user preferences (budget, interests, travel style) and recommends personalized destinations using Groq LLM
- **AI Itinerary Generator** — Creates detailed day-by-day travel plans with adjustable length and streaming responses
- **AI Chat Assistant** — Floating chatbot powered by Groq AI for real-time travel assistance

### 🔐 Authentication
- Email/Password Registration & Login
- **Demo Login** (auto-fill credentials: `console@test.com` / `Test@123`)
- Google OAuth (configured)
- JWT-based httpOnly cookie authentication
- Protected routes with automatic redirect

### 📄 Core Pages
- **Home** — Hero slider, AI-curated featured destinations, stats, testimonials, newsletter
- **Explore** — Search, filter by category/price/rating, sort, pagination
- **Destination Details** — Image gallery, key info, wishlist, plan trip button
- **AI Recommendations** — Preference-based destination matching
- **Itineraries** — Create (with AI), manage, edit, delete
- **Wishlist** — Save and manage favorite destinations
- **Profile** — Update info, change password
- **Blog** — Travel articles and tips
- **About** — Mission, features, how it works

### 🎨 UI/UX
- 3 primary colors: Emerald, Amber, Teal
- Fully responsive (mobile, tablet, desktop)
- Framer Motion animations
- Skeleton loaders
- Floating AI chat widget
- Consistent card design

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS v4 | Utility-first styling |
| TanStack Query | Server state management |
| Framer Motion | Animations |
| React Hook Form + Zod | Form validation |
| Axios | API client |
| Lucide React / React Icons | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| TypeScript | Type safety |
| MongoDB (native driver) | Database |
| JWT (jsonwebtoken) | Authentication |
| Groq SDK | AI/LLM integration |
| Multer + ImgBB | Image upload |
| Vercel Serverless | Deployment |

---

