'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
    const { user, signOut } = useAuthStore();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    useEffect(() => {
        if (user) {
            const fetchAppointments = async () => {
                setLoadingAppointments(true);
                try {
                    const res = await fetch(`http://localhost:3001/api/appointments/patient/${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setAppointments(data);
                    }
                } catch (e) {
                    console.error('Failed to fetch appointments', e);
                } finally {
                    setLoadingAppointments(false);
                }
            };
            fetchAppointments();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center p-4">
                <p className="mb-4 text-primary-900">Please sign in to view your profile.</p>
                <Link href="/auth/signin" className="primary-button py-2 px-6">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sand-50 pb-20">
            <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-primary-100 z-50 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-serif font-bold text-primary-900">MediHut</span>
                </Link>
                <button onClick={handleSignOut} className="text-sm font-medium text-red-600 hover:text-red-700">Sign Out</button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pt-10">
                <div className="clean-card bg-white p-8 mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-serif font-bold text-primary-900">
                            {user.full_name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-primary-900">{user.full_name}</h1>
                            <p className="text-primary-500">{user.email}</p>
                            <p className="text-sm text-primary-400 mt-1">{user.phone} • {user.blood_group}</p>
                        </div>
                    </div>
                    <button className="secondary-button text-xs py-2 px-4">Edit Profile</button>
                </div>

                <div className="mb-6 flex space-x-8 border-b border-primary-200">
                    {['Appointments', 'Medical Records', 'Settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === tab.toLowerCase()
                                ? 'text-primary-900'
                                : 'text-primary-400 hover:text-primary-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-900 rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'appointments' && (
                    <div className="space-y-4">
                        {loadingAppointments ? (
                            <div className="text-center py-10 text-primary-500">Loading appointments...</div>
                        ) : appointments.length === 0 ? (
                            <div className="clean-card bg-white p-10 text-center">
                                <p className="text-primary-500 mb-4">No appointments yet.</p>
                                <Link href="/" className="primary-button inline-block py-2 px-6">Book Appointment</Link>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="clean-card bg-white p-6 flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary-50 rounded-xl text-primary-900">
                                            <span className="text-xs font-bold uppercase">
                                                {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-bold">
                                                {new Date(apt.appointment_date).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-primary-900">{apt.time_slot}</h3>
                                            <p className="text-sm text-primary-500">{apt.reason || 'General Consultation'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${apt.status === 'confirmed' ? 'text-green-700 bg-green-50' :
                                            apt.status === 'completed' ? 'text-gray-700 bg-gray-50' :
                                                'text-red-700 bg-red-50'
                                            }`}>
                                            {apt.status}
                                        </span>
                                        {apt.status === 'confirmed' && apt.meet_link && (
                                            <a
                                                href={apt.meet_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="primary-button py-2 px-4 text-xs"
                                            >
                                                Join Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
