"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { X, ArrowUpRight, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import "./Style/Portfolio.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaItem = {
  _type: "image" | "file";
  asset?: {
    url: string;
    mimeType?: string;
  };
};

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  softwareUsed: string;
  media?: MediaItem[];
};

// ─── Sanity Query ─────────────────────────────────────────────────────────────

const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(_createdAt desc) {
  _id,
  title,
  description,
  softwareUsed,
  "media": media[] {
    _type,
    "asset": asset-> {
      url,
      mimeType
    }
  }
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isVideoFile = (url: string, mime?: string) =>
  url.endsWith(".mp4") || url.endsWith(".webm") || mime?.includes("video");

const getPreviewMedia = (item: PortfolioItem) => {
  if (!item.media?.length) return null;
  const image = item.media.find((m) => !isVideoFile(m.asset?.url ?? "", m.asset?.mimeType));
  if (image?.asset?.url) return { url: image.asset.url, isVideo: false };
  const video = item.media.find((m) => isVideoFile(m.asset?.url ?? "", m.asset?.mimeType));
  if (video?.asset?.url) return { url: video.asset.url, isVideo: true };
  return null;
};

const getMediaCount = (item: PortfolioItem) => {
  const images = item.media?.filter((m) => !isVideoFile(m.asset?.url ?? "", m.asset?.mimeType)).length ?? 0;
  const videos = item.media?.filter((m) => isVideoFile(m.asset?.url ?? "", m.asset?.mimeType)).length ?? 0;
  return { images, videos, total: images + videos };
};

// ─── Magnetic Card ────────────────────────────────────────────────────────────

function MagneticCard({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [4, -4]);
  const rotateY = useTransform(x, [-30, 30], [-4, 4]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ─── Media Lightbox ───────────────────────────────────────────────────────────

function MediaLightbox({
  media,
  initialIndex,
  onClose,
}: {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const current = media[index];

  const prev = useCallback(() => setIndex((i) => (i - 1 + media.length) % media.length), [media.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % media.length), [media.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  if (!current?.asset?.url) return null;
  const isVideo = isVideoFile(current.asset.url, current.asset.mimeType);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-[95vw] h-[95vh] flex items-center justify-center"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video 
            src={current.asset.url} 
            controls 
            autoPlay 
            className="max-w-full max-h-full rounded-2xl object-contain outline-none shadow-2xl" 
          />
        ) : (
          <Image
            src={current.asset.url}
            alt="Expanded view"
            fill
            sizes="95vw"
            priority
            className="object-contain rounded-2xl drop-shadow-2xl"
          />
        )}

        {media.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 lightbox-nav-btn z-10" aria-label="Previous">
              <ChevronLeft size={22} />
            </button>
            <button onClick={next} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 lightbox-nav-btn z-10" aria-label="Next">
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === index ? "bg-cyan-400 w-5" : "bg-white/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button onClick={onClose} className="absolute top-2 right-2 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-cyan-400/30 transition z-10">
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────

function ProjectModal({ 
  project, 
  onClose,
  onNext,
  onPrev,
  hasNextPrev 
}: { 
  project: PortfolioItem; 
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNextPrev?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const validMedia = (project.media ?? []).filter((m) => !!m.asset?.url);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // If lightbox is open, it handles its own keyboard navigation
      if (lightboxIndex !== null) return; 
      
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, lightboxIndex, onNext, onPrev]);

  return (
    <>
      <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={onClose} />
        
        <motion.div className="modal-panel relative w-full sm:w-[92%] max-w-5xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden" initial={{ y: 80, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 60, opacity: 0, scale: 0.97 }} transition={{ type: "spring", damping: 28, stiffness: 280 }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-glow" aria-hidden />
          
          <div className="modal-header px-7 pt-7 pb-5 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="modal-eyebrow mb-2">Project</p>
                <h2 className="modal-title">{project.title}</h2>
                {project.softwareUsed && <span className="software-tag mt-4 inline-block">{project.softwareUsed}</span>}
              </div>
              
              {/* Added Navigation Controls Here */}
              <div className="flex items-center gap-3 shrink-0 mt-1">
                {hasNextPrev && (
                  <div className="hidden sm:flex bg-white/5 rounded-full p-1 border border-white/10">
                    <button onClick={onPrev} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition" title="Previous Project">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={onNext} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition" title="Next Project">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                <button onClick={onClose} className="close-btn" aria-label="Close"><X size={18} /></button>
              </div>
            </div>

            {project.description && <p className="modal-desc mt-5">{project.description}</p>}
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-5">
              {validMedia.length > 0 && (
                <div className="flex gap-4">
                  {(() => {
                    const { images, videos } = getMediaCount(project);
                    return (
                      <>
                        {images > 0 && <div className="stat-pill"><ImageIcon size={12} /><span>{images} image{images > 1 ? "s" : ""}</span></div>}
                        {videos > 0 && <div className="stat-pill"><Play size={12} /><span>{videos} video{videos > 1 ? "s" : ""}</span></div>}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Mobile Only Navigation Controls (shown below desc on small screens) */}
              {hasNextPrev && (
                <div className="flex sm:hidden bg-white/5 rounded-full p-1 border border-white/10 w-max">
                  <button onClick={onPrev} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={onNext} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-divider" />
          
          {/* Inner content wrapper with a key so React natively crossfades data when project changes */}
          <div key={project._id} className="flex-1 overflow-y-auto custom-scrollbar p-7 animate-in fade-in duration-300">
            {validMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/20">
                <ImageIcon size={40} />
                <p className="mt-3 text-sm">No media available</p>
              </div>
            ) : validMedia.length === 1 ? (
              <SingleMedia media={validMedia[0]} onClick={() => setLightboxIndex(0)} />
            ) : (
              <MediaMosaic media={validMedia} onClickIndex={setLightboxIndex} />
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null && <MediaLightbox media={validMedia} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Media Components ─────────────────────────────────────────────────────────

function SingleMedia({ media, onClick }: { media: MediaItem; onClick: () => void }) {
  const isVideo = isVideoFile(media.asset!.url, media.asset?.mimeType);
  return (
    <div className="media-item rounded-2xl overflow-hidden cursor-zoom-in" onClick={onClick}>
      {isVideo ? (
        <video src={media.asset!.url} controls className="w-full h-auto" />
      ) : (
        <Image src={media.asset!.url} alt="Project Media" width={1920} height={1080} className="w-full h-auto" />
      )}
    </div>
  );
}

function MediaMosaic({ media, onClickIndex }: { media: MediaItem[]; onClickIndex: (i: number) => void }) {
  const cols = media.length <= 3 ? media.length : 2;
  return (
    <div className="media-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {media.map((m, i) => {
        if (!m.asset?.url) return null;
        const isVideo = isVideoFile(m.asset.url, m.asset.mimeType);
        return (
          <motion.div key={i} className="media-item rounded-2xl overflow-hidden cursor-zoom-in" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => onClickIndex(i)}>
            {isVideo ? (
              <div className="relative h-full">
                <video src={m.asset.url} muted loop playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                    <Play size={18} className="text-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <Image src={m.asset.url} alt="Mosaic snippet" width={800} height={600} className="w-full h-full object-cover" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Portfolio Card ───────────────────────────────────────────────────────────

function PortfolioCard({ project, index, onClick }: { project: PortfolioItem; index: number; onClick: () => void }) {
  const preview = getPreviewMedia(project);
  const { total } = getMediaCount(project);

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, type: "spring", damping: 22 }}>
      <MagneticCard onClick={onClick} className="portfolio-card group cursor-pointer h-full">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {preview ? (
            preview.isVideo ? (
              <video src={preview.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted loop playsInline />
            ) : (
              <Image src={preview.url} alt={project.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            )
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <ImageIcon size={32} className="text-white/20" />
            </div>
          )}
          <div className="card-vignette absolute inset-0" />
          {total > 1 && <div className="absolute top-3 right-3 media-count-badge">{total}</div>}
          <div className="card-overlay absolute inset-0 flex flex-col justify-end p-5">
            <div className="card-meta">
              <div className="flex items-start justify-between gap-2">
                <h3 className="card-title">{project.title}</h3>
                <span className="card-arrow"><ArrowUpRight size={16} /></span>
              </div>
              {project.softwareUsed && <span className="software-tag mt-3 inline-block">{project.softwareUsed}</span>}
            </div>
          </div>
        </div>
      </MagneticCard>
    </motion.div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="portfolio-card">
      <div className="w-full aspect-[4/3] skeleton-shimmer rounded-xl" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    sanityClient
      .fetch(PORTFOLIO_QUERY)
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  const tags = ["ALL", ...Array.from(new Set(projects.map((p) => p.softwareUsed?.toUpperCase()).filter(Boolean)))];

  const filtered = filter === "ALL" 
    ? projects 
    : projects.filter((p) => p.softwareUsed?.toUpperCase() === filter);

  // Added Logic to cycle through projects
  const currentIndex = selectedProject ? filtered.findIndex(p => p._id === selectedProject._id) : -1;

  const handleNextProject = useCallback(() => {
    if (currentIndex === -1 || filtered.length <= 1) return;
    const nextIndex = (currentIndex + 1) % filtered.length;
    setSelectedProject(filtered[nextIndex]);
  }, [currentIndex, filtered]);

  const handlePrevProject = useCallback(() => {
    if (currentIndex === -1 || filtered.length <= 1) return;
    const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    setSelectedProject(filtered[prevIndex]);
  }, [currentIndex, filtered]);

  return (
    <section className="portfolio-section">
      <div className="noise-overlay" aria-hidden />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <motion.div className="portfolio-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div><h1 className="section-title">Projects</h1></div>
          <p className="section-count">{loading ? "—" : `${filtered.length} items`}</p>
        </motion.div>

        {tags.length > 1 && (
          <motion.div className="filter-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {tags.map((tag) => (
              <button key={tag} className={`filter-pill ${filter === tag ? "active" : ""}`} onClick={() => setFilter(tag)}>
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        <div className="portfolio-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((project, i) => <PortfolioCard key={project._id} project={project} index={i} onClick={() => setSelectedProject(project)} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="empty-state"><p>No projects found.</p></div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
            hasNextPrev={filtered.length > 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}