'use client';
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Link from 'next/link';
import { User, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Style/contact.css';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mlgoazjr");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    /* Removed: bg-[#050505], selection:bg-cyan-500/30, and overflow-x-hidden */
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-10">
      
      {/* REMOVED: hero-glow div to follow "Remove only the background" */}

      {/* Linktree Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link 
          href="https://linktr.ee/sudeepghosh" 
          target="_blank"
          rel="noopener noreferrer"
          className="linktree-btn flex items-center gap-2 px-6 py-2 rounded-lg mb-8 transition-all hover:scale-105 active:scale-95 border border-cyan-400/20 bg-cyan-400/5"
        >
          <ExternalLink size={14} className="text-cyan-400" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400">Visit My Linktree</span>
        </Link>
      </motion.div>

      {/* Contact Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="contact-card w-full max-w-2xl p-6 md:p-12 rounded-4xl relative border border-white/5 backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white contact-title"
          >
            Contact Me
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-cyan-400 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          ></motion.div>
        </div>

        <AnimatePresence mode="wait">
          {state.succeeded ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest">Message Sent!</h2>
              <p className="text-gray-400 mt-2">I&#39;ll get back to you as soon as possible.</p>
              <button 
                type="button"
                onClick={() => window.location.reload()} 
                className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
              >
                Send another?
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: 'name', label: 'Name', icon: <User size={12}/>, type: 'text', placeholder: 'Enter your name' },
                { id: 'email', label: 'Email Address', icon: <Mail size={12}/>, type: 'email', placeholder: 'email@example.com' },
              ].map((input) => (
                <motion.div key={input.id} variants={itemVariants} className="input-group">
                  {/* Fixed ESLint: Added htmlFor for label association */}
                  <label htmlFor={input.id} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-400/70 mb-2 font-bold">
                    {input.icon} {input.label}
                  </label>
                  <input
                    id={input.id}
                    type={input.type}
                    name={input.id}
                    required
                    placeholder={input.placeholder}
                    className="contact-input w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-cyan-400/50 outline-none transition-all"
                  />
                  {input.id === 'email' && <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />}
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="input-group">
                {/* Fixed ESLint: Added htmlFor for label association */}
                <label htmlFor="message" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-400/70 mb-2 font-bold">
                  <MessageSquare size={12} /> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className="contact-input w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-cyan-400/50 outline-none transition-all resize-none"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={state.submitting}
                className="w-full contact-submit-btn py-5 rounded-xl font-black text-xs uppercase tracking-[0.4em] transition-all disabled:opacity-50"
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}