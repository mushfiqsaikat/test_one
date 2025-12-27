import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">
                                AutoMax<span className="text-primary-400">AI</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-md">
                            Experience the future of customer support with our AI-powered assistant. Get instant, accurate answers 24/7.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link href="/#features" className="hover:text-primary-400 transition-colors">Features</Link></li>
                            <li><Link href="/#pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="hover:text-primary-400 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary-400 transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-primary-400 transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center">
                    <p>&copy; {new Date().getFullYear()} AutoMax AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
