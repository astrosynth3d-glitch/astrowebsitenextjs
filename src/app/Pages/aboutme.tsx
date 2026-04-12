"use client";

import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { fetchSanityData } from "@/lib/sanity";
import "./Style/aboutme.css";

// ✅ Move query OUTSIDE (fixes useEffect warning)
const query = `*[_type == "about"][0]{
  systemLabel,
  headline,
  subheadline,
  description,
  quote,
  skills
}`;

interface AboutData {
  systemLabel: string;
  headline: string;
  subheadline: string;
  description: PortableTextBlock[];
  quote: string;
  skills: string[];
}

export default function AboutMe() {
  const [content, setContent] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSanityData<AboutData>(query);
      setContent(data);
      setLoading(false);
    };

    fetchData();

    // 🔄 Live updates every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fallbacks
  const displayLabel = content?.systemLabel || "System.Profile";
  const displayHeadline =
    content?.headline || "3D Generalist · Character Artist ·";
  const displaySubheadline =
    content?.subheadline || "Professional Tech Magpie";
  const displayQuote =
    content?.quote ||
    "Always curious, always learning—I'm the kind of artist who dives deep into both pipelines and pixels.";
  const tools =
    content?.skills || [
      "Unreal Engine",
      "Blender",
      "ZBrush",
      "Maya",
      "Substance 3D",
    ];

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center p-6 md:p-12"
    >
      <div className="relative z-10 w-full max-w-4xl p-8 md:p-14 rounded-4xl premium-liquid-card">

        {/* Label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-[#22d3ee]"></div>
          <span className="text-[#22d3ee] text-xs font-bold tracking-[0.3em] uppercase">
            {displayLabel}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8 tracking-tight ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {displayHeadline}
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#22d3ee] to-[#a855f7]">
            {displaySubheadline}
          </span>
        </h1>

        {/* Description */}
        <div
          className={`space-y-6 text-gray-300 text-base md:text-lg leading-relaxed font-light ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {content?.description ? (
            <PortableText value={content.description} />
          ) : (
            <p>Loading...</p>
          )}

          {/* Quote (✅ fixed warning) */}
          <div className="my-8 border-l-[3px] border-[#22d3ee]/80 pl-6 py-2">
            <p className="italic text-gray-400 font-normal">
              &ldquo;{displayQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-12 flex flex-wrap gap-4">
          {tools.map((tool, index) => (
            <span
              key={index}
              className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-gray-200 tracking-wide hover:bg-white/10 hover:border-[#22d3ee]/50 transition-all duration-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}