'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock Data
const DEPARTMENTS = [
  { id: 1, name: 'General', icon: 'M4.5 12.75l6 6 9-13.5' }, // Placeholder paths, will replace with proper SVGs
  { id: 2, name: 'Cardiology', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  { id: 3, name: 'Dermatology', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { id: 4, name: 'Neurology', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { id: 5, name: 'Pediatrics', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
];

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    available: true,
  },
  {
    id: 2,
    name: 'Dr. James Chen',
    specialty: 'Dermatologist',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    available: true,
  },
  {
    id: 3,
    name: 'Dr. Emily Brooks',
    specialty: 'General Physician',
    rating: 4.7,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    available: false,
  },
];

export default function HomePage() {
  const [selectedDept, setSelectedDept] = useState('General');

  return (
    <div className="min-h-screen bg-sand-50 pb-20">
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-primary-100 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-xl font-serif font-bold text-primary-900">MediHut</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin" className="text-sm font-medium text-primary-900 hover:text-primary-700">Sign In</Link>
          <Link href="/auth/signup" className="primary-button text-sm py-2 px-4 shadow-none">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-4 leading-tight">
          Better care designed <br /> just for <span className="text-primary-500">you</span>.
        </h1>
        <p className="text-primary-600 mb-8 max-w-lg text-lg">
          Your personalized treatment plan awaits. AI-powered consultations and top-tier doctors at your fingertips.
        </p>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {/* AI Bot Card */}
          <div className="clean-card bg-primary-900 text-white p-6 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Instant Consultation</h3>
              <p className="text-primary-200 text-sm mb-4">Chat with our AI for immediate medical advice.</p>
              <button className="bg-white text-primary-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-50 transition">
                Start Chat
              </button>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          </div>

          {/* Book Appointment Card */}
          <div className="clean-card bg-white p-6 group cursor-pointer border-primary-100 hover:border-primary-200">
            <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-900 mb-1">Schedule Visit</h3>
            <p className="text-primary-500 text-sm mb-4">Book an appointment with a specialist.</p>
            <button className="secondary-button text-sm py-2 px-6">
              Find Doctor
            </button>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="px-6 mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-serif text-primary-900">Departments</h2>
          <a href="#" className="text-sm text-primary-600 hover:text-primary-900">View all</a>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.name)}
              className={`flex-shrink-0 flex items-center space-x-2 px-5 py-3 rounded-full border transition-all ${selectedDept === dept.name
                  ? 'bg-primary-900 border-primary-900 text-white'
                  : 'bg-white border-primary-100 text-primary-700 hover:border-primary-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dept.icon} />
              </svg>
              <span className="font-medium whitespace-nowrap">{dept.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="px-6 pb-12">
        <h2 className="text-2xl font-serif text-primary-900 mb-6">Top Specialists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {DOCTORS.map((doctor) => (
            <div key={doctor.id} className="clean-card p-4 flex items-center space-x-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-primary-100"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-primary-900">{doctor.name}</h3>
                    <p className="text-sm text-primary-500">{doctor.specialty}</p>
                  </div>
                  {doctor.available && (
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                  )}
                </div>
                <div className="flex items-center mt-2 space-x-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium text-primary-700">{doctor.rating}</span>
                  <span className="text-xs text-primary-400">({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Badge */}
      <div className="fixed bottom-6 w-full text-center pointer-events-none">
        <span className="bg-white/90 backdrop-blur border border-primary-100 px-4 py-2 rounded-full text-xs font-medium text-primary-500 shadow-sm">
          Verified Medical Platform
        </span>
      </div>
    </div>
  );
}
