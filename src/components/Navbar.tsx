'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
            <div className="px-4 md:px-12 py-4 flex items-center justify-between transition-all duration-500">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-red-600 text-2xl md:text-3xl font-bold tracking-tighter uppercase cursor-pointer">
                        NONTONYUK
                    </Link>

                    <div className="hidden md:flex flex-row gap-6 text-sm text-gray-300">
                        <Link href="/" className="hover:text-white cursor-pointer transition">Home</Link>
                        <Link href="/series" className="hover:text-white cursor-pointer transition">Series</Link>
                        <Link href="/movies" className="hover:text-white cursor-pointer transition">Movies</Link>
                        <Link href="/new" className="hover:text-white cursor-pointer transition">New & Popular</Link>
                        <Link href="/list" className="hover:text-white cursor-pointer transition">My List</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-white">
                    {/* Search Bar - Improved styling */}
                    <div className={`flex items-center bg-black/80 border border-white/20 rounded-full px-3 py-1 transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 opacity-100 ring-2 ring-white/20' : 'w-8 bg-transparent border-none opacity-80'}`}>
                        <Search
                            className={`w-5 h-5 cursor-pointer hover:text-white transition ${isSearchOpen ? 'text-white' : 'text-gray-300'}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                        <input
                            type="text"
                            placeholder="Titles, people, genres"
                            className={`bg-transparent border-none focus:outline-none text-sm ml-2 text-white placeholder-gray-400 transition-all duration-300 ${isSearchOpen ? 'w-full opacity-100 scale-100' : 'w-0 opacity-0 scale-95'}`}
                            style={{ appearance: 'none' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />

                    {/* Netflix Logo Avatar */}
                    <div className="w-8 h-8 rounded overflow-hidden cursor-pointer relative">
                        <img
                            src="/n-logo.png"
                            alt="Profile"
                            className="object-contain w-full h-full p-1 bg-black border border-white/20 rounded"
                        />
                    </div>

                    <div className="md:hidden cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Fixed Position (Right aligned) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-16 right-4 w-48 bg-[#141414]/95 backdrop-blur-md border border-gray-800 rounded-md shadow-2xl flex flex-col py-2 z-50">
                    <Link href="/" className="px-4 py-3 hover:bg-white/10 hover:text-white text-gray-300 text-sm transition font-medium">Home</Link>
                    <Link href="/series" className="px-4 py-3 hover:bg-white/10 hover:text-white text-gray-300 text-sm transition font-medium">Series</Link>
                    <Link href="/movies" className="px-4 py-3 hover:bg-white/10 hover:text-white text-gray-300 text-sm transition font-medium">Movies</Link>
                    <Link href="/new" className="px-4 py-3 hover:bg-white/10 hover:text-white text-gray-300 text-sm transition font-medium">New & Popular</Link>
                    <Link href="/list" className="px-4 py-3 hover:bg-white/10 hover:text-white text-gray-300 text-sm transition font-medium">My List</Link>
                </div>
            )}
        </nav>
    );
}
