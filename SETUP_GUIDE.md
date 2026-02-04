# MediHut Setup Guide

This guide will help you set up the MediHut Teleconsultation Platform from scratch.

## Step 1: Supabase Setup (Required)

### 1.1 Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: MediHut (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier works perfectly
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to be ready

### 1.2 Get Your Credentials

Once project is created:

1. Go to **Settings** (left sidebar)
2. Click **API** tab
3. You'll see:
   - **Project URL**: This is your `SUPABASE_URL`
   - **Project API keys**:
     - **anon public**: This is your `SUPABASE_ANON_KEY`
     - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**Save these three values - you'll need them soon!**

### 1.3 Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `/app/scripts/setup-database.sql` from this project
4. Copy all the SQL content
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

**Your database is now ready!**

## Step 2: Razorpay Setup (For Payments)

### 2.1 Create Razorpay Account

1. Visit [https://razorpay.com](https://razorpay.com)
2. Click **"Sign Up"**
3. Fill in business details and sign up
4. Verify your email

### 2.2 Get API Keys

1. Log in to Razorpay Dashboard
2. Go to **Settings** > **API Keys**
3. Click **"Generate Test Keys"** (for development)
4. You'll see:
   - **Key Id**: This is your `RAZORPAY_KEY_ID`
   - **Key Secret**: This is your `RAZORPAY_KEY_SECRET`

**Save both keys!**

> **Note**: Use Test Mode for development. Switch to Live Mode only for production.

## Step 3: Backend Configuration

### 3.1 Update Environment Variables

1. Open `/app/backend/.env` in a text editor
2. Replace the placeholder values with your actual credentials:

```env
# Server Configuration
PORT=8001
NODE_ENV=development

# Supabase Configuration (IMPORTANT - Replace these!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

# JWT Configuration (can keep default for development)
JWT_SECRET=medihut_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=7d

# Razorpay Configuration (Replace these!)
RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google Meet
GOOGLE_MEET_DOMAIN=meet.google.com
```

3. Save the file

### 3.2 Start Backend

```bash
cd /app/backend

# Dependencies are already installed
# If you need to reinstall:
# yarn install

# Start in development mode
yarn start:dev
```

You should see:
```
🚀 MediHut Backend is running on: http://localhost:8001/api
```

**Keep this terminal running!**

## Step 4: Frontend Configuration

### 4.1 Update Environment Variables

1. Open `/app/frontend/.env` in a text editor
2. Replace with your actual values:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001/api

# Supabase Configuration (Same as backend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
```

3. Save the file

### 4.2 Start Frontend

Open a **new terminal** (keep backend running):

```bash
cd /app/frontend

# Dependencies are already installed
# If you need to reinstall:
# yarn install

# Start development server
yarn dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

## Step 5: Test the Application

### 5.1 Open the App

Open your browser and go to: **http://localhost:3000**

You should see the MediHut landing page!

### 5.2 Create Test Accounts

#### Create a Patient Account

1. Click **"Get Started"** or **"Sign Up"**
2. Fill in:
   - Full Name: Test Patient
   - Email: patient@test.com
   - Password: password123
   - Role: **Patient**
3. Click **"Create account"**
4. You'll be redirected to patient dashboard

#### Create a Doctor Account

1. Sign out (if signed in)
2. Go to Sign Up
3. Fill in:
   - Full Name: Dr. Test Doctor
   - Email: doctor@test.com
   - Password: password123
   - Role: **Doctor**
4. Click **"Create account"**

**Note**: Doctor needs to be verified by admin before appearing in patient's doctor list.

#### Create an Admin Account (Manual)

1. Go to your Supabase dashboard
2. Click **Authentication** (left sidebar)
3. Create a new user with email: admin@test.com
4. Go to **SQL Editor**
5. Run this query (replace `USER_ID` with the actual user ID from Authentication):

```sql
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'USER_ID_FROM_AUTH_TAB',  -- Replace with actual user ID
  'admin@test.com',
  'Admin User',
  'admin'
);
```

6. Now you can sign in as admin

### 5.3 Complete a Full Flow

1. **As Admin**:
   - Sign in as admin
   - Go to "Pending Doctors"
   - Verify the doctor you created

2. **As Doctor**:
   - Sign in as doctor
   - Complete doctor profile
   - Set availability slots

3. **As Patient**:
   - Sign in as patient
   - Browse doctors
   - Book an appointment
   - Make payment (use Razorpay test cards)
   - Wait for doctor to confirm

4. **As Doctor**:
   - Accept the appointment
   - Start consultation
   - Use Google Meet link
   - Chat with patient
   - Write prescription

5. **As Patient**:
   - View prescription
   - See consultation history

## Common Issues & Solutions

### Issue: "Failed to create Supabase client"

**Solution**: 
- Double-check your `SUPABASE_URL` and keys in `.env` files
- Make sure there are no extra spaces or quotes
- Ensure your Supabase project is active

### Issue: "Socket connection failed"

**Solution**:
- Make sure backend is running on port 8001
- Check `FRONTEND_URL` in backend `.env` is correct
- Clear browser cache and restart

### Issue: "Payment failed"

**Solution**:
- Use Razorpay test mode keys
- Use test card: 4111 1111 1111 1111
- Any future date for expiry
- Any CVV

### Issue: Backend won't start

**Solution**:
```bash
cd backend
rm -rf node_modules
yarn install
yarn start:dev
```

### Issue: Frontend shows errors

**Solution**:
```bash
cd frontend
rm -rf node_modules .next
yarn install
yarn dev
```

## Razorpay Test Cards

For testing payments in development:

**Success**:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**Failure**:
- Card: 4000 0000 0000 0002

## Next Steps

1. **Customize** the platform with your branding
2. **Add more specialties** for doctors
3. **Enhance** the UI/UX
4. **Test** all features thoroughly
5. **Deploy** to production (see Deployment Guide)

## Production Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Switch Razorpay to Live Mode
- [ ] Update all URLs to production domains
- [ ] Enable HTTPS
- [ ] Set up proper error monitoring
- [ ] Configure backups for Supabase
- [ ] Review and enhance RLS policies
- [ ] Add rate limiting
- [ ] Set up email notifications
- [ ] Test all payment flows
- [ ] Ensure GDPR/HIPAA compliance

## Support

If you encounter issues:

1. Check the logs in your terminal
2. Review this guide carefully
3. Check Supabase logs in dashboard
4. Verify all environment variables
5. Make sure all services are running

---

Happy Building! 🚀
