"use client";

import { useEffect, useState, useRef } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { fetchSanityData } from "@/lib/sanity";
import "./Style/aboutme.css";

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
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSanityData<AboutData>(query);
        setContent(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    };
    card.addEventListener('mousemove', handleMove);
    return () => card.removeEventListener('mousemove', handleMove);
  }, []);

  const displayLabel = content?.systemLabel || "SYSTEM.PROFILE";
  const displayHeadline = content?.headline || "3D Generalist · Character Artist";
  const displaySubheadline = content?.subheadline || "Professional Tech Magpie";
  const displayQuote = content?.quote || "Always curious, always learning—I'm the kind of artist who dives deep into both pipelines and pixels.";
  const tools = content?.skills || ["Unreal Engine", "Blender", "Maya", "Substance 3D", "ZBrush"];

  return (
    <section 
      className="about-section"
      aria-labelledby="about-heading"
      lang="en"
    >
      <div className="about-container">
        <div className="about-glow" aria-hidden="true" />
        
        <div 
          ref={cardRef}
          className="premium-liquid-card"
          role="region"
          aria-label="About profile"
        >
          <header className="about-header">
            <div className="about-header-left">
              <span className="header-line" aria-hidden="true" />
              <span className="header-label">
                {displayLabel}
              </span>
            </div>
            
            <div 
              className="status-indicator"
              role="status"
              aria-live="polite"
              aria-label="Profile status: Active"
            >
              <span className="status-dot" aria-hidden="true" />
              <span>ACTIVE</span>
            </div>
          </header>

          <div className="about-main">
            <h1 id="about-heading" className="about-title">
              <span className="title-main">{displayHeadline}</span>
              <span className="title-sub">{displaySubheadline}</span>
            </h1>

            <div className="about-text-scrim">
              {isLoading ? (
                <div role="status" aria-label="Loading about content">
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" style={{width: '90%'}} />
                  <div className="skeleton skeleton-text" style={{width: '95%'}} />
                  <div className="skeleton skeleton-text" style={{width: '85%'}} />
                </div>
              ) : (
                <div className="prose-content">
                  <PortableText value={content?.description || []} />
                </div>
              )}

              <blockquote className="about-quote">
                <p>&ldquo;{displayQuote}&rdquo;</p>
              </blockquote>
            </div>
          </div>

          <aside className="about-sidebar" aria-labelledby="tools-heading">
            <div className="glass-inner-panel">
              <h2 id="tools-heading" className="tools-heading">
                Tools & Tech
              </h2>
              
              <ul className="tools-list" role="list">
                {tools.map((tool) => (
                  <li key={tool} role="listitem">
                    <button 
                      type="button"
                      className="glass-tag"
                      aria-label={`Skill: ${tool}`}
                    >
                      {tool}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}