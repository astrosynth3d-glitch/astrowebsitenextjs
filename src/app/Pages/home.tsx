"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchSanityData } from "@/lib/sanity";
import "./Style/home.css";

const query = `*[_type == "homepage"][0]{
  headline1,
  headline2,
  subHeadline1,
  subHeadline2
}`;

interface HomeData {
  headline1: string;
  headline2: string;
  subHeadline1: string;
  subHeadline2: string;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function HomePage() {
  const [content, setContent] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Clean Hydration pattern to prevent SSR mismatch
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSanityData<HomeData>(query);
        setContent(data);
      } catch (error) {
        console.error("Failed to fetch sanity data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const displayHeadline1 = content?.headline1 || "ASTROSYNTH";
  const displayHeadline2 = content?.headline2 || "LOGS";
  const displaySub1 =
    content?.subHeadline1 ||
    "A high-tech portfolio for a 3D generalist capturing an artistic journey";
  const displaySub2 =
    content?.subHeadline2 || "through digital logs and cinematic visuals.";

  const reduceMotion = isMounted ? shouldReduceMotion : false;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: reduceMotion ? 0 : 0.5, duration: 0.4, ease: "easeOut" },
    },
    hover: reduceMotion ? {} : { scale: 1.02 },
    tap: reduceMotion ? {} : { scale: 0.98 },
  };

  return (
    <div className="hero-root">
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="hero-badge-wrapper">
          <div className="hero-badge">
            <div className="badge-dot-container">
              <span className="badge-glow" />
              <span className="badge-core" />
            </div>
            <span className="badge-label">Recording My Journey</span>
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="hero-headline">
          <span
            className={`headline-primary ${isLoading ? "animate-pulse" : ""}`}
          >
            {displayHeadline1}
          </span>
          <span className="headline-secondary">{displayHeadline2}</span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="hero-divider"
          aria-hidden="true"
        />

        <motion.p variants={itemVariants} className="hero-subheadline">
          {displaySub1}
          <span className="subheadline-highlight">{displaySub2}</span>
        </motion.p>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link href="/#portfolio" className="hero-cta group">
            <span>Explore Portfolio</span>
            <ArrowRight
              size={18}
              className="cta-icon group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}