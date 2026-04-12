import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import { sanityClient } from '@/lib/sanity';
import './Style/aboutme.css';

interface AboutData {
  systemLabel: string;
  headline: string;
  subheadline: string;
  description: PortableTextBlock[];
  quote: string;
  skills: string[];
}

// 1. Make the component an async function
export default async function AboutMe() {
  
  // 2. Fetch data directly inside the component (No useEffect needed)
  const query = `*[_type == "about"][0]{
    systemLabel,
    headline,
    subheadline,
    description,
    quote,
    skills
  }`;
  
  let content: AboutData | null = null;

  try {
    // Next.js will await this fetch on the server before sending HTML to the browser
    content = await sanityClient.fetch(query);
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
  }

  // Fallbacks in case Sanity is missing data
  const displayLabel = content?.systemLabel || "System.Profile";
  const displayHeadline = content?.headline || "3D Generalist · Character Artist ·";
  const displaySubheadline = content?.subheadline || "Professional Tech Magpie";
  const displayQuote = content?.quote || "Always curious, always learning—I'm the kind of artist who dives deep into both pipelines and pixels.";
  const tools = content?.skills || ["Unreal Engine", "Blender", "ZBrush", "Maya", "Substance 3D"];

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center p-6 md:p-12">
      
      {/* 3. Replaced motion.div with a standard div. Framer Motion requires "use client" */}
      <div 
        className="relative z-10 w-full max-w-4xl p-8 md:p-14 rounded-4xl premium-liquid-card opacity-100"
      >
        {/* Pre-headline */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-[#22d3ee]"></div>
          <span className="text-[#22d3ee] text-xs font-bold tracking-[0.3em] uppercase">
            {displayLabel}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8 tracking-tight">
          {displayHeadline} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#22d3ee] to-[#a855f7]">
            {displaySubheadline}
          </span>
        </h1>

        {/* Body Text */}
        <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed font-light pr-0 md:pr-12">
          {content?.description ? (
            <PortableText value={content.description} />
          ) : (
            <>
              <p>
                A versatile and imaginative 3D Generalist with a focus on character art and a passion for exploring new tools and technologies. Skilled in sculpting, modeling, texturing, and real-time asset creation for games and interactive media.
              </p>
              <p>
                I thrive in both technical and creative workflows—constantly experimenting, adapting, and pushing boundaries to craft visually compelling and production-ready assets.
              </p>
            </>
          )}
          
          {/* Blockquote */}
          <div className="my-8 border-l-[3px] border-[#22d3ee]/80 pl-6 py-2">
            <p className="italic text-gray-400 font-normal">
              &quot;{displayQuote}&quot;
            </p>
          </div>
        </div>

        {/* Tool Tags */}
        <div className="mt-12 flex flex-wrap gap-4">
          {tools.map((tool, index) => (
            <span 
              key={index}
              className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-gray-200 tracking-wide hover:bg-white/10 hover:border-[#22d3ee]/50 transition-all duration-300 cursor-default"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}