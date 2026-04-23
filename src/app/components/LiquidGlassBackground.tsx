'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseRadius: number;
  growthSpeed: number;
  phase: number;
  hue: number;
  vx: number;
  vy: number;
  opacity: number;
  isStar: boolean;
}

interface DeviceProfile {
  maxParticles: number;
  maxStars: number;
  maxBands: number;
  enableConnections: boolean;
  targetFPS: number;
  shadowBlur: number;
  baseRadiusMin: number;
  baseRadiusMax: number;
}

export default function LiquidGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  
  const deviceProfileRef = useRef<DeviceProfile>({
    maxParticles: 80,
    maxStars: 150,
    maxBands: 4,
    enableConnections: true,
    targetFPS: 60,
    shadowBlur: 40,
    baseRadiusMin: 15,
    baseRadiusMax: 35,
  });

  const interactionRef = useRef({ x: 0, y: 0, active: false });
  const scrollIntensityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    const detectDevice = (width: number): DeviceProfile => {
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (width >= 768 && width <= 1024);
      
      if (isMobile && !isTablet) {
        return {
          maxParticles: 30, maxStars: 50, maxBands: 2, enableConnections: false,
          targetFPS: 45, shadowBlur: 20, baseRadiusMin: 10, baseRadiusMax: 20,
        };
      }
      if (isTablet) {
        return {
          maxParticles: 50, maxStars: 100, maxBands: 3, enableConnections: true,
          targetFPS: 60, shadowBlur: 30, baseRadiusMin: 12, baseRadiusMax: 28,
        };
      }
      return {
        maxParticles: 80, maxStars: 150, maxBands: 4, enableConnections: true,
        targetFPS: 60, shadowBlur: 40, baseRadiusMin: 15, baseRadiusMax: 35,
      };
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let deviceProfile = detectDevice(width);
    deviceProfileRef.current = deviceProfile;

    const updateInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      interactionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      };
    };

    const handleMouseMove = (e: MouseEvent) => updateInteraction(e.clientX, e.clientY);
    const handleMouseLeave = () => { interactionRef.current.active = false; };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length) updateInteraction(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length) updateInteraction(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => { interactionRef.current.active = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    const handleScroll = () => {
      scrollIntensityRef.current = Math.min(1.5, scrollIntensityRef.current + 0.15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const initParticles = () => {
      const profile = deviceProfileRef.current;
      const particles: Particle[] = [];
      
      for (let i = 0; i < profile.maxParticles; i++) {
        const baseRadius = profile.baseRadiusMin + Math.random() * (profile.baseRadiusMax - profile.baseRadiusMin);
        const xPos = Math.random() * width;
        const yPos = Math.random() * height;
        
        particles.push({
          x: xPos,
          y: yPos,
          baseX: xPos,
          baseY: yPos,
          radius: baseRadius,
          baseRadius,
          growthSpeed: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          hue: 190 + Math.random() * 90, 
          vx: 0,
          vy: 0,
          opacity: 0.4 + Math.random() * 0.4,
          isStar: false
        });
      }

      for (let i = 0; i < profile.maxStars; i++) {
        const xPos = Math.random() * width;
        const yPos = Math.random() * height;
        particles.push({
          x: xPos, y: yPos, baseX: xPos, baseY: yPos,
          radius: Math.random() * 1.5 + 0.5,
          baseRadius: Math.random() * 1.5 + 0.5,
          growthSpeed: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          hue: 200 + Math.random() * 50,
          vx: 0, vy: -0.05 - Math.random() * 0.1, 
          opacity: Math.random() * 0.8 + 0.4,
          isStar: true
        });
      }
      particlesRef.current = particles;
    };

    const drawGlassOrb = (
      ctx: CanvasRenderingContext2D, x: number, y: number, radius: number,
      hue: number, opacity: number, scrollBoost: number
    ) => {
      const profile = deviceProfileRef.current;
      const finalRadius = radius * (1 + scrollBoost * 0.2);
      
      ctx.shadowBlur = profile.shadowBlur;
      ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${opacity * 0.9})`;

      const grad = ctx.createRadialGradient(
        x - finalRadius * 0.3, y - finalRadius * 0.3, finalRadius * 0.1, x, y, finalRadius
      );
      grad.addColorStop(0, `hsla(${hue}, 100%, 85%, ${opacity})`);
      grad.addColorStop(0.5, `hsla(${hue + 15}, 90%, 60%, ${opacity * 0.7})`);
      grad.addColorStop(1, `hsla(${hue - 20}, 90%, 40%, ${opacity * 0.2})`);

      ctx.beginPath();
      ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const highlight = ctx.createLinearGradient(
        x - finalRadius * 0.6, y - finalRadius * 0.6, x + finalRadius * 0.2, y + finalRadius * 0.2
      );
      highlight.addColorStop(0, `hsla(${hue + 30}, 100%, 95%, ${opacity})`);
      highlight.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.ellipse(
        x - finalRadius * 0.25, y - finalRadius * 0.25, finalRadius * 0.4, finalRadius * 0.2,
        Math.PI * -0.25, 0, Math.PI * 2
      );
      ctx.fillStyle = highlight;
      ctx.fill();

      ctx.shadowBlur = profile.shadowBlur * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue + 20}, 100%, 85%, ${opacity * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawLiquidBands = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const bands = deviceProfileRef.current.maxBands;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < bands; i++) {
        const yOffset = Math.sin(time * 0.15 + i) * 80;
        const grad = ctx.createLinearGradient(0, height * 0.1 + yOffset, width, height * 0.9 + yOffset);
        
        grad.addColorStop(0, 'hsla(260, 70%, 30%, 0.04)');
        grad.addColorStop(0.5, 'hsla(200, 90%, 50%, 0.06)');
        grad.addColorStop(1, 'hsla(180, 80%, 40%, 0.04)');

        ctx.beginPath();
        for (let x = 0; x <= width; x += 60) {
          const y = height * 0.4 + Math.sin(x * 0.004 + time * 0.4 + i) * 60 + Math.cos(x * 0.008 + time * 0.2 + i * 2) * 40;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); ctx.lineTo(0, height);
        ctx.fillStyle = grad; ctx.fill();
      }
      ctx.restore();
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      if (!deviceProfileRef.current.enableConnections) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      const orbs = particles.filter(p => !p.isStar);

      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 200) { 
            const intensity = (1 - dist / 200) * 0.25;
            const avgHue = (orbs[i].hue + orbs[j].hue) / 2;
            
            ctx.beginPath();
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            ctx.strokeStyle = `hsla(${avgHue}, 100%, 75%, ${intensity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    };

    const applyInteractionForce = () => {
      if (!interactionRef.current.active) return;
      const ix = interactionRef.current.x;
      const iy = interactionRef.current.y;
      const forceRadius = 250; 
      const strength = 0.6;

      for (const p of particlesRef.current) {
        if (p.isStar) continue; 
        const dx = p.x - ix;
        const dy = p.y - iy;
        const dist = Math.hypot(dx, dy);
        if (dist < forceRadius && dist > 0.01) {
          const force = Math.pow(1 - dist / forceRadius, 2) * strength; 
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
    };

    const decayScrollIntensity = () => {
      scrollIntensityRef.current *= 0.95;
      if (scrollIntensityRef.current < 0.01) scrollIntensityRef.current = 0;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      deviceProfile = detectDevice(width);
      deviceProfileRef.current = deviceProfile;
      initParticles();
    };

    const animate = (now: number) => {
      const profile = deviceProfileRef.current;
      const frameInterval = 1000 / profile.targetFPS;
      if (now - lastFrameTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = now;

      if (!ctx || !canvas) return;

      const time = timeRef.current;
      timeRef.current += 0.016;

      applyInteractionForce();
      decayScrollIntensity();

      ctx.fillStyle = '#030612';
      ctx.fillRect(0, 0, width, height);

      drawLiquidBands(ctx, width, height, time);

      const particles = particlesRef.current;
      const scrollBoost = scrollIntensityRef.current;

      for (const p of particles) {
        if (p.isStar) {
          p.y += p.vy;
          if (p.y < 0) p.y = height;
          
          const twinkle = 0.5 + Math.sin(time * p.growthSpeed + p.phase) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * twinkle})`;
          ctx.fill();
        } else {
          let growthFactor = 0.8 + Math.sin(time * p.growthSpeed + p.phase) * 0.2;
          growthFactor *= 1 + scrollBoost * 0.3;
          const currentRadius = p.baseRadius * growthFactor;

          const homeDx = p.baseX - p.x;
          const homeDy = p.baseY - p.y;
          p.vx += homeDx * 0.003; 
          p.vy += homeDy * 0.003;

          p.vx += Math.sin(time + p.phase) * 0.02;
          p.vy += Math.cos(time + p.phase) * 0.02;

          p.x += p.vx;
          p.y += p.vy;
          
          p.vx *= 0.94; 
          p.vy *= 0.94;

          const driftingHue = p.hue + Math.sin(time * 0.1 + p.phase) * 20;
          drawGlassOrb(ctx, p.x, p.y, currentRadius, driftingHue, p.opacity, scrollBoost);
        }
      }

      drawConnections(ctx, particles);

      const cornerDistance = Math.hypot(width / 2, height / 2);
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.2, 
        width / 2, height / 2, cornerDistance
      );
      grad.addColorStop(0, 'rgba(3, 6, 18, 0)');
      grad.addColorStop(0.5, 'rgba(3, 6, 18, 0.2)');
      grad.addColorStop(1, 'rgba(3, 6, 18, 0.75)'); 
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 block"
    />
  );
}