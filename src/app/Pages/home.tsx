"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sanityClient } from '@/lib/sanity';
import './Style/home.css';

// Define the shape of your Sanity data
interface HomeData {
  headline1: string;
  headline2: string;
  subHeadline1: string;
  subHeadline2: string;
}

export default function HomePage() {
  const [content, setContent] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSanityData = async () => {
      try {
        // Query fetches the first document of type 'homepage'
        // Ensure the field names here match the 'name' properties in your Sanity schema
        const query = `*[_type == "homepage"][0]{
          headline1,
          headline2,
          subHeadline1,
          subHeadline2
        }`;
        
        const data = await sanityClient.fetch(query);
        setContent(data);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSanityData();
  }, []);

  // Fallbacks ensure the UI looks good even if Sanity data is still loading or fails
  const displayHeadline1 = content?.headline1;
  const displayHeadline2 = content?.headline2;
  const displaySub1 = content?.subHeadline1;
  const displaySub2 = content?.subHeadline2;

  return (
    <div className="relative min-h-screen text-white font-sans antialiased flex flex-col items-center justify-center z-0 transition-opacity duration-500">
      
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        
        {/* Liquid Glass Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="premium-liquid-badge px-6 py-3 rounded-full mb-10 flex items-center gap-3 cursor-pointer group"
          role="status"
          aria-label="Status: Recording My Journey"
        >
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-60 animate-ping group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          </div>
          
          <span className="text-xs font-black tracking-[0.3em] uppercase text-cyan-50 group-hover:text-cyan-300 transition-colors duration-300">
            Recording My Journey
          </span>
        </motion.div>

        {/* Title Section */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`text-6xl sm:text-7xl md:text-9xl font-black mb-8 italic uppercase leading-[0.85] tracking-tighter cursor-default ${isLoading ? 'animate-pulse' : ''}`}
        >
          <span className="block text-white drop-shadow-2xl transition-transform hover:scale-[1.02] duration-700 ease-out">
            {displayHeadline1}
          </span>
          <span className="block mt-4 hollow-text select-none transition-all duration-700 hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
            {displayHeadline2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className={`max-w-2xl text-gray-400 text-base md:text-xl font-light leading-relaxed text-balance ${isLoading ? 'animate-pulse' : ''}`}
        >
          {displaySub1}
          <span className="text-gray-200 block mt-2 font-medium">
            {displaySub2}
          </span>
        </motion.p>
      </main>
    </div>
  );
}