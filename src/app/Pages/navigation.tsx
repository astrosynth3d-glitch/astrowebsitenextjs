"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './Style/navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Main', href: '/#home' },
    { name: 'About Me', href: '/#about' },
    { name: 'Portfolio', href: '/#portfolio' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const menuVariants = {
    closed: { opacity: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.08, 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] as const
      }
    })
  };

  return (
    <nav className={`nav-hero ${scrolled ? 'nav-scrolled' : ''}`}>
      <Link href="/#home" className="nav-logo-hero group" aria-label="Home">
        <div className="logo-icon-hero">
          <div className="logo-outer-hero">
            <div className="logo-inner-hero"></div>
          </div>
        </div>
        <span className="logo-text-hero">
          Astrosynth<span className="logo-text-hero-light">-Logs</span>
        </span>
      </Link>
      
      <div className="nav-desktop-hero">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="nav-link-hero"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="nav-actions-hero">
        <Link 
          href="/#contact" 
          className="nav-contact-btn-hero"
        >
          <span>Contact</span>
          <span className="btn-shine-hero" aria-hidden="true" />
        </Link>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="nav-toggle-hero"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className={`toggle-line-hero ${isOpen ? 'open' : ''}`}></span>
          <span className={`toggle-line-hero ${isOpen ? 'open' : ''}`}></span>
          <span className={`toggle-line-hero ${isOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="nav-mobile-menu-hero"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="mobile-menu-content-hero">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  custom={i}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={itemVariants}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-link-hero"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                custom={navLinks.length}
                initial="closed"
                animate="open"
                exit="closed"
                variants={itemVariants}
              >
                <Link 
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="mobile-contact-btn-hero"
                >
                  Contact
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}