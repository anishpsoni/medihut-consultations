'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

// Mock Doctor - in real app fetch from API
const FETCH_DOCTOR_URL = 'http://localhost:3001/api/doctors/';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bookedAppointment, setBookedAppointment] = useState<any>(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`${FETCH_DOCTOR_URL}${params.doctorId}`);
                if (res.ok) {
                    const data = await res.json();
                    setDoctor(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [params.doctorId]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            // Send only DTO-allowed fields + patientId
            const res = await api.createAppointment({
                doctor_id: (params.doctorId as string),
                appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                time_slot: '10:00 AM',
                reason: 'General Consultation',
                patientId: user?.id || 'guest_user_123',
            });
            setBookedAppointment(res);
        } catch (error) {
            console.error(error);
            alert('Booking failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-sand-50 flex items-center justify-center">Loading...</div>;
    if (!doctor) return <div className="min-h-screen bg-sand-50 flex items-center justify-center">Doctor not found</div>;

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
            </nav>

            <div className="max-w-3xl mx-auto px-6 pt-10">
                <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="clean-card bg-white p-6">
                        <h2 className="text-lg font-semibold mb-4 text-primary-900">Booking Summary</h2>
                        <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
                            <img src={doctor.image_url} alt={doctor.full_name} className="w-16 h-16 rounded-xl object-cover" />
                            <div>
                                <h3 className="font-medium text-primary-900">{doctor.full_name}</h3>
                                <p className="text-sm text-primary-500">{doctor.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-primary-700">
                            <div className="flex justify-between">
                                <span>Consultation Fee</span>
                                <span>₹{doctor.consultation_fee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service Charge (5%)</span>
                                <span>₹{(doctor.consultation_fee * 0.05).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
                                <span>Total</span>
                                <span>₹{doctor.consultation_fee + Math.round(doctor.consultation_fee * 0.05)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details (Mock) */}
                    <div className="clean-card bg-white p-6">
                        <h2 className="text-lg font-semibold mb-4 text-primary-900">Payment Details</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                            <div>
                                <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="clean-input w-full"
                                    pattern="[0-9\s]{13,19}"
                                    maxLength={19}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
                                    }}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="clean-input w-full"
                                        pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                                        maxLength={5}
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            let value = target.value.replace(/[^0-9]/g, '');
                                            if (value.length >= 2) {
                                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                            }
                                            target.value = value;
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="clean-input w-full"
                                        pattern="[0-9]{3,4}"
                                        maxLength={4}
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9]/g, '');
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full primary-button py-3 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Processing...' : `Pay ₹${doctor.consultation_fee + Math.round(doctor.consultation_fee * 0.05)}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Success Modal */}
                {bookedAppointment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-primary-600 mb-6">Your appointment with {doctor.full_name} is scheduled.</p>

                            <div className="bg-primary-50 p-4 rounded-xl mb-6 text-left">
                                <p className="text-xs font-bold text-primary-500 uppercase mb-1">Join via Google Meet</p>
                                <a href={bookedAppointment.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium underline break-all hover:text-blue-800">
                                    {bookedAppointment.meet_link}
                                </a>
                            </div>

                            <Link href="/profile" className="primary-button w-full block py-3">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
