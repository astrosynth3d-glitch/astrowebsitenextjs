"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './Style/navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Updated hrefs to point to IDs on the main page for smooth scrolling
  const navLinks = [
    { name: 'Main', href: '/#home' },
    { name: 'About Me', href: '/#about' },
    { name: 'Portfolio', href: '/#portfolio' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 nav-container">
      {/* Logo Section - Background glows removed */}
      <Link href="/#home" className="flex items-center gap-4 group cursor-pointer z-50">
        <div className="relative">
          <div className="w-10 h-10 bg-cyan-400 rotate-45 flex items-center justify-center transition-transform duration-700 group-hover:rotate-225 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="w-4 h-4 bg-black"></div>
          </div>
        </div>
        <span className="font-bold tracking-tighter text-2xl bg-linear-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
          Astrosynth-Logs
        </span>
      </Link>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="nav-link text-[12px] lg:text-[13px] font-bold tracking-[0.25em] uppercase px-6 py-2.5"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Action Button & Mobile Toggle */}
      <div className="flex items-center gap-6">
        <Link 
          href="/#contact" 
          className="hidden sm:flex items-center justify-center btn-liquid text-white px-8 py-3 rounded-full font-bold text-[11px] lg:text-[12px] uppercase tracking-[0.25em]"
        >
          Contact
        </Link>

        {/* Hamburger Menu Icon - Accessibility fixed for ESLint */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          className="md:hidden flex flex-col gap-2 z-50 p-2 focus:outline-none"
        >
          <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-screen bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.name}
              >
                <Link 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-black tracking-[0.3em] uppercase hover:text-cyan-400 transition-colors italic"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            
            <Link 
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="btn-liquid text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-[0.3em]"
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}