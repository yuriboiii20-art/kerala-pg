import useScrollLock from '../hooks/useScrollLock';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const all8Images = [
  "/images/1pg.jpeg",
  "/images/2pg.jpeg",
  "/images/3pg.jpeg",
  "/images/4pg.jpeg",
  "/images/5pg.jpeg",
  "/images/6pg.jpeg",
  "/images/7pg.jpeg",
  "/images/8pg.jpeg"
];

export default function RoomModal({ room, onClose, onBookNow }) {
  useScrollLock(!!room);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imagesList = room?.images && room.images.length > 0 ? room.images : (room?.image ? [room.image] : all8Images);

  // Always show the first image (index 0) by default
  useEffect(() => {
    setActiveImageIndex(0);
  }, [room]);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!room) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      }
    };

    if (room) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [room, onClose, imagesList.length]);

  if (!room) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl rounded-3xl glass-card border border-[#D4A64A]/30 p-4 sm:p-8 shadow-2xl z-10 my-auto overflow-y-auto max-h-[92vh]"
        >
          {/* Close Button with aria-label */}
          <button
            onClick={onClose}
            aria-label="Close Room Details Modal"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F0] transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
            
            {/* Left: High-Clarity Keyboard & Arrow Slider */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <div className="relative h-64 xs:h-72 sm:h-80 md:h-[400px] max-h-[50vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#080d1a] flex items-center justify-center select-none group">
                {/* Soft ambient background fill */}
                <img
                  src={imagesList[activeImageIndex]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none"
                />

                {/* Active Photo - Full uncropped wide view (Zoomed out) */}
                <img
                  key={activeImageIndex}
                  src={imagesList[activeImageIndex]}
                  alt={`${room.title} interior preview`}
                  className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-3 transition-opacity duration-300 drop-shadow-2xl"
                />

                {/* Photo Counter Pill */}
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] sm:text-xs font-mono font-bold border border-white/15 shadow-lg pointer-events-none flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4A64A]" />
                  <span>Photo {activeImageIndex + 1}/{imagesList.length}</span>
                </div>

                {/* Previous Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo (Left Arrow)"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 hover:border-[#D4A64A] shadow-xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                {/* Next Arrow Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo (Right Arrow)"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 hover:border-[#D4A64A] shadow-xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                {/* Bottom Center Dots Indicator */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 max-w-[85%] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-white/15 z-10 overflow-x-auto no-scrollbar">
                  {imagesList.map((_, idx) => {
                    const isVisibleOnMobile = Math.abs(idx - activeImageIndex) <= 3 || idx === 0 || idx === imagesList.length - 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`Go to photo ${idx + 1}`}
                        className={`transition-all rounded-full cursor-pointer shrink-0 ${
                          activeImageIndex === idx
                            ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#D4A64A]'
                            : isVisibleOnMobile
                            ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                            : 'hidden sm:block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#FAF7F0]/60 px-1">
                <span>
                  <span className="sm:hidden">👆 Swipe or tap arrows</span>
                  <span className="hidden sm:inline">⌨️ Press <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">←</kbd> <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">→</kbd> to browse</span>
                </span>
                <span>{imagesList.length} Photos</span>
              </div>
            </div>

            {/* Right: Detailed Room Specs & Booking */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A64A]/15 text-[#D4A64A] border border-[#D4A64A]/30 text-xs font-semibold uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{room.sharing || 'Coliving'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] mb-2 font-sora">
                  {room.title || room.name}
                </h3>

                <p className="text-[#FAF7F0]/80 text-xs sm:text-sm leading-relaxed mb-4">
                  {room.description || room.desc}
                </p>

                {/* Features Breakdown */}
                <h4 className="text-xs font-bold text-[#D4A64A] uppercase tracking-wider mb-2.5 font-mono">
                  Included Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(room.features || room.facilities || room.highlights || []).slice(0, 6).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#FAF7F0]/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl glass-card border border-white/10 mb-4">
                  <p className="text-[11px] text-[#D4A64A] mb-0.5 font-mono uppercase font-bold">Zero Hidden Costs Guarantee</p>
                  <p className="text-xs text-[#FAF7F0]/75">
                    Includes 3 times Kerala homestyle meals, power backup, washing machine, hot water, and WiFi.
                  </p>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-[#FAF7F0]/60 uppercase font-mono">Monthly Rent</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#FAF7F0] font-sora">
                    {room.priceDisplay || `₹${room.price?.toLocaleString('en-IN') || '7,499'}`}{' '}
                    <span className="text-xs font-normal text-[#FAF7F0]/60">/{room.period || 'month'}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onBookNow(room.title || room.name);
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A64A] to-yellow-600 text-[#0B1220] font-bold text-xs sm:text-sm shadow-xl shadow-[#D4A64A]/25 hover:shadow-[#D4A64A]/40 transition-all cursor-pointer"
                  data-cursor="expand"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>Reserve Room</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
