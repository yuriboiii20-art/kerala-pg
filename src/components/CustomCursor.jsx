import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth elastic lag for trailing ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.3 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor if device has mouse/fine pointer
    const mediaQuery = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    let rafId;
    const handleMouseMove = (e) => {
      if (!mediaQuery.matches) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.glass-card-hover') ||
        target.closest('[data-cursor="expand"]');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Center Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D4A64A] shadow-[0_0_8px_#D4A64A] will-change-transform"
      />

      {/* Trailing Elastic Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? '#FAF7F0' : '#D4A64A',
          backgroundColor: isHovered ? 'rgba(212, 166, 74, 0.15)' : 'rgba(212, 166, 74, 0)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D4A64A]/60 shadow-[0_0_12px_rgba(212,166,74,0.3)] will-change-transform"
      />
    </div>
  );
}

