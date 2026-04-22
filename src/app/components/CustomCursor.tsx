"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  type Easing,
} from "framer-motion";

type CursorState = "default" | "hover" | "click";

const MAIN_SPRING = { stiffness: 500, damping: 28, mass: 0.5 };
const TRAIL_SPRING = { stiffness: 180, damping: 22, mass: 1.2 };
const VELOCITY_RANGE: number[] = [-2800, 0, 2800];
const EASE_OUT_CUBIC: Easing = [0, 0, 0.58, 1];

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1024px), (hover: none), (pointer: coarse)").matches;
  });
  const [cursorState, setCursorState] = useState<CursorState>("default");

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const xVelocity = useVelocity(cursorX);
  const yVelocity = useVelocity(cursorY);

  const scaleX = useTransform(xVelocity, VELOCITY_RANGE, [1.6, 1, 1.6]);
  const scaleY = useTransform(yVelocity, VELOCITY_RANGE, [0.65, 1, 0.65]);
  const rotate = useTransform(xVelocity, VELOCITY_RANGE, [-35, 0, 35]);

  const x = useSpring(cursorX, MAIN_SPRING);
  const y = useSpring(cursorY, MAIN_SPRING);
  const trailX = useSpring(cursorX, TRAIL_SPRING);
  const trailY = useSpring(cursorY, TRAIL_SPRING);

  const interactiveSelectorRef = useRef(
    "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover'], .interactive-cursor"
  );
  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentTargetRef = useRef<Element | null>(null);

  const handleMobileChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setIsMobile(e.matches);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => setMounted(true));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mql = window.matchMedia("(max-width: 1024px), (hover: none), (pointer: coarse)");
    mediaQueryRef.current = mql;
    mql.addEventListener("change", handleMobileChange);
    return () => mql.removeEventListener("change", handleMobileChange);
  }, [mounted, handleMobileChange]);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseDown = () => setCursorState("click");
    const onMouseUp = () => setCursorState("default");

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(interactiveSelectorRef.current);
      if (interactive) {
        currentTargetRef.current = interactive;
        setCursorState("hover");
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      if (
        currentTargetRef.current &&
        !target.closest(interactiveSelectorRef.current) &&
        (!related || !related.closest(interactiveSelectorRef.current))
      ) {
        currentTargetRef.current = null;
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("pointerover", onPointerOver, true);
    document.body.addEventListener("pointerout", onPointerOut, true);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("pointerover", onPointerOver, true);
      document.body.removeEventListener("pointerout", onPointerOut, true);
    };
  }, [mounted, isMobile, cursorX, cursorY]);

  if (!mounted || isMobile) return null;

  const isHover = cursorState === "hover";
  const isClick = cursorState === "click";
  const stateTransition = { duration: 0.18, ease: EASE_OUT_CUBIC };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-9997 rounded-full will-change-transform"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          width: 72,
          height: 72,
          background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.02) 70%, transparent 100%)",
        }}
        animate={{
          opacity: isHover ? 0.8 : 0.6,
          scale: isHover ? 1.15 : 1,
        }}
        transition={stateTransition}
      />

      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full border will-change-transform"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          scaleX,
          scaleY,
          rotate,
        }}
        animate={{
          width: isHover ? 48 : isClick ? 24 : 34,
          height: isHover ? 48 : isClick ? 24 : 34,
          backgroundColor: isHover
            ? "rgba(34,211,238,0.14)"
            : isClick
            ? "rgba(34,211,238,0.6)"
            : "rgba(34,211,238,0.22)",
          borderColor: isHover
            ? "rgba(34,211,238,0.9)"
            : isClick
            ? "rgba(34,211,238,0.7)"
            : "rgba(34,211,238,0.45)",
          borderWidth: isHover ? "1.5px" : "1px",
          boxShadow: isHover
            ? "0 0 24px rgba(34,211,238,0.7), 0 0 48px rgba(34,211,238,0.25)"
            : isClick
            ? "0 0 16px rgba(34,211,238,0.9)"
            : "0 0 18px rgba(34,211,238,0.5)",
        }}
        transition={stateTransition}
      />

      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full will-change-transform"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClick ? 3 : 4.5,
          height: isClick ? 3 : 4.5,
          opacity: isHover ? 0 : 1,
          scale: isClick ? 0.6 : 1,
          backgroundColor: isClick ? "#ffffff" : "#22d3ee",
        }}
        transition={stateTransition}
      />
    </>
  );
}