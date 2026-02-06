'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Use same departments as before but can expand
const DEPARTMENTS = [
  { id: 1, name: 'General', icon: 'M4.5 12.75l6 6 9-13.5' },
  { id: 2, name: 'Cardiology', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  { id: 3, name: 'Dermatology', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { id: 4, name: 'Neurology', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { id: 5, name: 'Pediatrics', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'doctors'>('ai');
  const [prompt, setPrompt] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  useEffect(() => {
    // Fetch mock doctors from API
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await fetch('http://localhost:3001/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-primary-100 z-50 px-4 md:px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-lg md:text-xl font-serif font-bold text-primary-900 leading-tight">MediHut CarePlan</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('doctors')}
            className="hidden sm:inline-block text-sm font-medium text-primary-900 hover:text-primary-700 transition"
          >
            Find Doctors
          </button>
          <Link href="/auth/signin" className="hidden sm:inline-block text-sm font-medium text-primary-900 hover:text-primary-700 transition">Sign In</Link>
          <Link href="/auth/signup" className="primary-button text-xs md:text-sm py-2 px-3 md:px-4 shadow-sm hover:shadow-md">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 pt-28 md:pt-32 pb-20">
        {/* Hero Header */}
        <div className="px-6 text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <h1 className="text-4xl md:text-6xl font-serif text-primary-900 mb-4 md:mb-6 leading-tight">
            Healthcare, <span className="text-primary-500 italic">simplified</span>.
          </h1>
          <p className="text-lg md:text-xl text-primary-600 max-w-2xl mx-auto leading-relaxed">
            Experience the future of medicine. Chat with AI for instant advice or book top specialists in seconds.
          </p>
        </div>

        {/* Central Interactions */}
        <div className="px-4 md:px-6 max-w-4xl mx-auto pb-8">
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-full border border-primary-100 shadow-sm flex items-center">
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-primary-900 text-white shadow-md transform scale-105' : 'text-primary-500 hover:text-primary-900'
                  }`}
              >
                Spark AI
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'doctors' ? 'bg-primary-900 text-white shadow-md transform scale-105' : 'text-primary-500 hover:text-primary-900'
                  }`}
              >
                Find Doctor
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'ai' ? (
              <div className="clean-card bg-white p-6 md:p-10 text-center border border-primary-100 shadow-xl mx-auto max-w-full sm:max-w-xl transition-all hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-pulse ring-4 ring-blue-50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-2">How can I help you today?</h2>
                <p className="text-primary-400 text-sm mb-6">Ask me anything about your health.</p>

                <div className="max-w-lg mx-auto relative mb-6">
                  <form onSubmit={(e) => { e.preventDefault(); alert('AI functionality coming soon!'); }}>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your symptoms..."
                      className="w-full pl-5 pr-12 py-4 rounded-xl border border-primary-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base transition-all bg-primary-50 focus:bg-white"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition shadow-sm active:scale-95">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </form>
                </div>

                {/* Suggested Prompts */}
                <div className="flex flex-wrap justify-center gap-2">
                  {['Headache & Fever', 'Skin Rash', 'Stomach Pain', 'Anxiety'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setPrompt(item)}
                      className="px-3 py-1.5 bg-white border border-primary-200 rounded-full text-xs font-medium text-primary-600 hover:border-primary-400 hover:bg-primary-50 transition shadow-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search doctors by name or specialty..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-primary-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base transition-all bg-white"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Departments Filter - Hidden Scrollbar */}
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                  <button
                    onClick={() => setSelectedSpecialty('All')}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${selectedSpecialty === 'All'
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'bg-white border border-primary-100 text-primary-700 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                  >
                    All Specialties
                  </button>
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedSpecialty(dept.name === 'General' ? 'General Physician' : dept.name)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${selectedSpecialty === (dept.name === 'General' ? 'General Physician' : dept.name)
                          ? 'bg-primary-900 text-white border-primary-900'
                          : 'bg-white border border-primary-100 text-primary-700 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>

                {/* Doctors Grid */}
                {loadingDoctors ? (
                  <div className="text-center py-10 text-primary-500">Loading specialists...</div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-primary-500 text-lg">No doctors found matching your criteria.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); }}
                      className="mt-4 text-primary-700 underline hover:text-primary-900"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {filteredDoctors.map((doctor) => (
                      <Link href={`/doctors/${doctor.id}`} key={doctor.id} className="clean-card p-4 md:p-5 flex items-start space-x-4 md:space-x-5 hover:shadow-lg transition-all cursor-pointer bg-white group hover:-translate-y-1">
                        <img
                          src={doctor.image_url}
                          alt={doctor.full_name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-primary-900 group-hover:text-primary-700 truncate">{doctor.full_name}</h3>
                              <p className="text-primary-500 font-medium text-sm">{doctor.specialty}</p>
                            </div>
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700 flex-shrink-0">
                              <span>★ {doctor.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-primary-400 mt-2 line-clamp-2">{doctor.bio}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="font-bold text-primary-900">₹{doctor.consultation_fee}</span>
                            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full group-hover:bg-primary-900 group-hover:text-white transition-colors">Book Now</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
