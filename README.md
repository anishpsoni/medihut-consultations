# MediHut Teleconsultation Platform

A full-stack teleconsultation platform built with NestJS, Next.js, and Supabase.

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time Chat**: Socket.io
- **Payments**: Razorpay
- **Video**: Google Meet integration

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- Yarn package manager
- A Supabase account (free tier works)
- A Razorpay account (for payments)

## 🚀 Quick Start

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and create

#### Get Your Credentials
After project creation, go to Settings > API:
- Copy `Project URL` (SUPABASE_URL)
- Copy `anon public` key (SUPABASE_ANON_KEY)
- Copy `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

#### Create Database Tables

Run the SQL script in `/app/scripts/setup-database.sql` in your Supabase SQL Editor.

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
yarn install

# Update .env with your credentials

# Start in development mode
yarn start:dev
```

Backend will run on: `http://localhost:8001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
yarn install

# Update .env with your credentials

# Start development server
yarn dev
```

Frontend will run on: `http://localhost:3000`

## 🎯 Features

### For Patients
- Browse verified doctors by specialty
- Book appointments with available time slots
- Make secure payments via Razorpay
- Join video consultations (Google Meet)
- Real-time chat with doctors
- View and download digital prescriptions
- View consultation history

### For Doctors
- Create professional profile
- Set availability and time slots
- Manage appointments
- Join video consultations
- Real-time chat with patients
- Write digital prescriptions

### For Admins
- Dashboard with platform statistics
- Verify doctor credentials
- Manage users
- View platform analytics

## 📁 Project Structure

```
medihut/
├── backend/          # NestJS backend
├── frontend/         # Next.js frontend
├── scripts/          # Setup scripts
└── README.md         # This file
```

## 🚀 Deployment

Deploy to Vercel:

```bash
# Frontend
cd frontend && vercel

# Backend
cd backend && vercel
```

Update environment variables in Vercel dashboard.

---

Built with ❤️ using NestJS, Next.js, and Supabase
