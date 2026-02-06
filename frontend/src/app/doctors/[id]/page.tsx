'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Types (Mocking here for simplicity, ideally imported)
interface Doctor {
    id: string;
    full_name: string;
    specialty: string;
    qualification: string;
    experience_years: number;
    bio: string;
    image_url: string;
    rating: number;
    review_count: number;
    consultation_fee: number;
    available: boolean;
    languages: string[];
}

export default function DoctorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    useEffect(() => {
        // Fetch mock data from our new backend API
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/doctors/${params.id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setDoctor(data);
                // Set mock initial date
                setSelectedDate(new Date().toISOString().split('T')[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [params.id]);

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both a date and a time slot.');
            return;
        }
        // Navigate to checkout with selected params
        router.push(`/checkout/${params.id}?date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`);
    };

    if (loading) {
        return <div className="min-h-screen bg-sand-50 flex items-center justify-center">Loading...</div>;
    }

    if (!doctor) {
        return <div className="min-h-screen bg-sand-50 flex items-center justify-center">Doctor not found</div>;
    }

    return (
        <div className="min-h-screen bg-sand-50 pb-20">
            {/* Navbar (Same as Home) */}
            <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-primary-100 z-50 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-serif font-bold text-primary-900">MediHut</span>
                </Link>
                <Link href="/doctors" className="text-sm font-medium text-primary-900 hover:text-primary-700">Find Doctors</Link>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="clean-card bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                            <img
                                src={doctor.image_url}
                                alt={doctor.full_name}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-sm"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900">{doctor.full_name}</h1>
                                        <p className="text-primary-600 font-medium text-lg">{doctor.specialty}</p>
                                        <p className="text-primary-400 text-sm mt-1">{doctor.qualification} • {doctor.experience_years}+ Years Experience</p>
                                    </div>
                                    {doctor.available && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Available Today
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center mt-4 space-x-4">
                                    <div className="flex items-center">
                                        <span className="text-yellow-400 text-lg">★</span>
                                        <span className="ml-1 font-bold text-primary-900">{doctor.rating}</span>
                                        <span className="ml-1 text-primary-400 text-sm">({doctor.review_count} Reviews)</span>
                                    </div>
                                    <div className="h-4 w-px bg-primary-100"></div>
                                    <div className="text-sm text-primary-500">
                                        Speaks: {doctor.languages.join(', ')}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {['Video Consult', 'Clinic Visit'].map((type) => (
                                        <span key={type} className="px-3 py-1 rounded-lg border border-primary-200 text-primary-700 text-xs font-medium">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="clean-card bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-serif font-bold text-primary-900 mb-4">About Doctor</h2>
                            <p className="text-primary-700 leading-relaxed">
                                {doctor.bio}
                            </p>
                        </div>

                        <div className="clean-card bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-serif font-bold text-primary-900 mb-4">Patient Reviews</h2>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b border-primary-50 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                                                    {i === 1 ? 'JD' : 'AS'}
                                                </div>
                                                <span className="font-medium text-sm text-primary-900">{i === 1 ? 'John Doe' : 'Alice Smith'}</span>
                                            </div>
                                            <span className="text-xs text-primary-400">2 days ago</span>
                                        </div>
                                        <p className="text-sm text-primary-600">
                                            Excellent doctor! Very patient and explained everything clearly. Highly recommended.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking */}
                    <div className="lg:col-span-1">
                        <div className="clean-card bg-white p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-serif font-bold text-primary-900 text-lg">Book Appointment</h3>
                                <span className="text-lg font-bold text-primary-900">₹{doctor.consultation_fee}</span>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-primary-800 uppercase tracking-wide mb-2">Select Date</label>
                                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {[0, 1, 2, 3, 4].map((offset) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + offset);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = selectedDate === dateStr;

                                        return (
                                            <button
                                                key={offset}
                                                onClick={() => setSelectedDate(dateStr)}
                                                className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center border transition-all ${isSelected
                                                    ? 'bg-primary-900 border-primary-900 text-white'
                                                    : 'border-primary-100 text-primary-700 hover:border-primary-300'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                <span className="text-lg font-bold">{date.getDate()}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-primary-800 uppercase tracking-wide mb-2">Available Slots</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM', '06:00 PM', '07:30 PM'].map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`text-sm py-2 rounded-lg border text-center transition-all ${selectedTime === time
                                                ? 'bg-primary-900 border-primary-900 text-white'
                                                : 'border-primary-100 text-primary-600 hover:border-primary-300'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleBooking} className="w-full primary-button py-3 text-base">
                                Confirm Booking
                            </button>
                            <p className="text-center text-xs text-primary-400 mt-4">
                                No cancellation fee if cancelled 2 hours before.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
