<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- BEGIN:project-overview -->
# Project Overview: EcoTrack AI

**EcoTrack AI** is a Next.js-based web application designed to help users track their carbon footprint and achieve sustainability goals through a personalized, AI-powered experience. The application combines data-driven tracking, gamification, and motivational psychology to encourage environmentally responsible behavior.

## 🚀 Key Features

- **Multi-Modal Carbon Footprint Tracking**: Users can track their environmental impact across four key areas:
  - **Transport**: Fuel consumption, public transit, flights
  - **Energy**: Home electricity usage
  - **Food**: Dietary choices (meat, vegetarian, vegan)
  - **Lifestyle**: Shopping habits and waste generation

- **AI-Powered Insights**:
  - **Smart Calculator**: Estimates footprint based on user inputs with real-time feedback
  - **Personalized Recommendations**: Tailored suggestions for reducing impact based on individual habits
  - **Progress Analysis**: Visualizes trends and highlights areas for improvement

- **Goal Setting & Gamification**:
  - **SMART Goal Creation**: Users can set specific, measurable, achievable, relevant, and time-bound goals
  - **Progress Tracking**: Visual dashboards show progress toward goals with clear metrics
  - **Motivational Rewards**: Points, badges, and streaks to encourage consistent behavior

- **Interactive Data Visualization**:
  - **Trend Charts**: Daily, weekly, and monthly footprint visualizations
  - **Comparison Metrics**: Benchmarks against national averages and personal bests
  - **Impact Metrics**: Translates CO₂ savings into relatable equivalents (trees planted, flights avoided)

- **Authentication & Personalization**:
  - **Secure Login**: Email/password and OAuth (Google, GitHub)
  - **Profile Management**: Personalized settings and preferences
  - **Data Privacy**: Clear data handling policies and user control

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives, custom GlassCard components
- **State Management**: Zustand for global state (goals, settings)
- **Data Fetching**: React Server Components (RSC) with Server Actions
- **Charting**: Recharts for data visualization

### Backend
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js (credentials + OAuth providers)
- **API Layer**: Server Actions for CRUD operations
- **Validation**: Zod for server-side data validation
- **Security**: CSRF protection, secure cookie management

## 🔄 Data Flow

1. **User Interaction**: User inputs data through forms or calculators
2. **Server Actions**: Server Actions validate data using Zod schemas
3. **Database Operations**: Prisma Client handles database transactions
4. **State Management**: Zustand store updates UI state
5. **Re-renders**: React Server Components re-render with new data
6. **Visualization**: Recharts renders charts and graphs

## 🎨 Design System

### Color Palette
- **Primary**: Teal/Cyan gradients (brand accent)
- **Neutrals**: Slate grayscale for text and backgrounds
- **Feedback**: Semantic colors (red for issues, green for success)
- **Dark Mode**: Full dark mode support with inverted colors

### Component Library
- **GlassCard**: Frosted glass effect with subtle shadows
- **Buttons**: Primary, secondary, and destructive variants
- **Inputs**: Form inputs with focus states and validation
- **Charts**: Clean, modern visualizations with tooltips

## 🧪 Testing

### Unit Tests
- **Vitest**: Test utilities and helpers
- **Testing Library**: DOM testing for components
- **JSDOM**: Node.js environment for testing

### Validation Testing
- **Zod Schemas**: Test data validation rules for all inputs
- **E2E Validation**: Test calculator input → footprint output flow

## 🚀 Development Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Run tests
npm test
```

## 📊 Key Metrics

- **Response Time**: <200ms API response target
- **Bundle Size**: Optimized for performance
- **Test Coverage**: Comprehensive validation coverage
- **User Engagement**: Gamification to increase retention

## 🔐 Security Features

- **Input Validation**: All data validated server-side
- **CSRF Protection**: Built-in with NextAuth.js
- **Secure Cookies**: HttpOnly, Secure flags for session management
- **Data Privacy**: Transparent data handling practices

## 🎯 Sustainability Impact

- **Awareness**: Educates users on carbon footprint sources
- **Behavior Change**: Encourages sustainable choices through gamification
- **Measurement**: Quantifies impact of lifestyle changes
- **Motivation**: Positive reinforcement for eco-friendly actions
<!-- END:project-overview -->
