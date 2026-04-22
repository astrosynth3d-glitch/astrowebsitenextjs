'use client';

import React, { useSyncExternalStore } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Link from 'next/link';
import { User, Mail, MessageSquare, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import './Style/contact.css';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ContactPage() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || "";
  const [state, handleSubmit] = useForm(formspreeId);
  const linktreeUrl = process.env.NEXT_PUBLIC_LINKTREE_URL || "#";
  
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const shouldReduceMotion = useReducedMotion();
  const prefersReduced = isMounted ? shouldReduceMotion : false;

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
  };

  const glassCardVariants: Variants = {
    hidden: { opacity: 0, scale: prefersReduced ? 1 : 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <div className="contact-root min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="z-20"
      >
        <Link
          href={linktreeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-linktree group flex items-center gap-3 px-8 py-3 rounded-full mb-8 transition-all duration-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus:outline-none"
        >
          <ExternalLink size={16} className="text-cyan-300 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
          <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-cyan-100 group-hover:text-cyan-200">My Linktree</span>
          <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-400/40 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:scale-125 transition-transform"></span>
          </span>
        </Link>
      </motion.div>

      <motion.div
        variants={glassCardVariants}
        initial="hidden"
        animate="visible"
        className="contact-card w-full max-w-3xl p-6 md:p-10 lg:p-12 relative"
      >
        <div className="text-center mb-10">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter bg-linear-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
          >
            Contact Me
          </motion.h1>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80px", opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.3, duration: 0.6, ease: "easeOut" }}
            className="h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4 rounded-full"
            aria-hidden="true"
          />
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-sm md:text-base mt-5 tracking-wide font-light"
          >
            Have a project in mind? Let&apos;s bring it to life.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {state.succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-center py-10 px-4 rounded-2xl bg-white/2 backdrop-blur-sm border border-white/5"
              role="alert"
            >
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <CheckCircle size={36} className="text-black" />
              </div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-cyan-300 to-white bg-clip-text text-transparent uppercase tracking-wider">
                Message Sent
              </h2>
              <p className="text-gray-200 mt-3 text-lg font-light">Thank you for reaching out. I&apos;ll reply soon.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-8 text-sm text-cyan-300 uppercase tracking-widest hover:text-white transition-all duration-300 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-cyan-400 p-2 rounded-lg"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="input-group">
                  <label htmlFor="name" className="input-label">
                    <User size={14} aria-hidden="true" /> Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="contact-input"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="input-error" />
                </motion.div>

                <motion.div variants={itemVariants} className="input-group">
                  <label htmlFor="email" className="input-label">
                    <Mail size={14} aria-hidden="true" /> Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="hello@example.com"
                    className="contact-input"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="input-error" />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="input-group">
                <label htmlFor="message" className="input-label">
                  <MessageSquare size={14} aria-hidden="true" /> Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Share your thoughts..."
                  className="contact-input resize-none"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="input-error" />
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={prefersReduced ? {} : { scale: 1.01 }}
                whileTap={prefersReduced ? {} : { scale: 0.99 }}
                type="submit"
                disabled={state.submitting}
                className="contact-submit-btn w-full group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {state.submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      <span>Send Message</span>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}