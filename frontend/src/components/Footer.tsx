import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-serif font-bold">MediHut CarePlan</span>
                        </Link>
                        <p className="text-primary-200 text-sm leading-relaxed">
                            Your trusted partner for online medical consultations. Connect with top doctors securely from the comfort of your home.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-primary-200 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/doctors" className="text-primary-200 hover:text-white transition-colors">Find Doctors</Link></li>
                            <li><Link href="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-primary-200 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Specialities */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Specialities</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-primary-200 hover:text-white transition-colors">General Physician</a></li>
                            <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Dermatology</a></li>
                            <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Cardiology</a></li>
                            <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Pediatrics</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-3 text-primary-200">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>support@medihut.in</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>123 Medical Park, Tech City, Bangalore, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-400">
                    <p>&copy; {new Date().getFullYear()} MediHut CarePlan. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
