import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

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

export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
  currentStayType = 'day',
  onProceedToBooking,
}) {
  useScrollLock(isOpen);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const imagesList = room?.images && room.images.length > 0 ? room.images : (room?.image ? [room.image] : all8Images);

  // Always show the first image (index 0) by default when opening the modal
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, room]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, imagesList.length]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNextImage(); // Swiped Left -> Next
    } else if (distance < -minSwipeDistance) {
      handlePrevImage(); // Swiped Right -> Prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!isOpen || !room) return null;
  if (typeof document === 'undefined') return null;

  const facilitiesList = room.facilities || [
    "Lounge area",
    "Power back up",
    "CCTV",
    "Washing machine",
    "3 times Kerala food",
    "Entertainment zone",
    "Caretaker",
    "24/7 hot water",
    "Self cooking area",
    "WiFi"
  ];

  const phones = room.phones || ["9900082615", "8150082433"];

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-[#0B1220]/90 backdrop-blur-md">
      {/* Floating High-Contrast Close Button - Desktop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="hidden sm:flex fixed top-4 right-4 z-[100000] px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs items-center gap-1.5 shadow-[0_10px_25px_rgba(239,68,68,0.5)] border-2 border-white/30 transition-all cursor-pointer"
      >
        <X className="w-4 h-4 stroke-[3]" />
        <span>Close (Esc)</span>
      </button>

      {/* Backdrop click dismisser */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Flex container that prevents top clipping */}
      <div className="min-h-full flex items-start sm:items-center justify-center p-2 sm:p-4 pt-16 sm:pt-6 pb-8 relative pointer-events-none">
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0B1220] border-2 border-[#D4A64A]/50 text-[#FAF7F0] shadow-[0_25px_80px_rgba(0,0,0,0.98)] z-10 overflow-hidden flex flex-col max-h-[calc(100vh-5rem)] sm:max-h-[92vh] my-auto pointer-events-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-30 p-3 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#0E172A] shadow-md">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-sm hover:border-[#D4A64A]/50 group"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4A64A] group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back to Rooms</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#D4A64A]/15 text-[#D4A64A] text-xs font-mono font-bold border border-[#D4A64A]/30">
                Coliving
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                {room.sharingLabel || '1, 2, 3 & 4 Sharing'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-red-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Close</span>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* High-Clarity Keyboard & Arrow Navigable Image Slider */}
            <div className="space-y-2">
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative h-72 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#080d1a] flex items-center justify-center select-none group"
              >
                {/* Soft ambient background fill */}
                <img
                  src={imagesList[currentImageIndex]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none"
                />

                {/* Active Photo - Full uncropped wide view (Zoomed out) */}
                <img
                  key={currentImageIndex}
                  src={imagesList[currentImageIndex]}
                  alt={`Aafa Coliving Photo ${currentImageIndex + 1}`}
                  className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-4 transition-opacity duration-300 drop-shadow-2xl"
                />

                {/* Top Right Rating Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 border border-white/15 shadow-lg pointer-events-none">
                  <Star className="w-3.5 h-3.5 text-[#D4A64A] fill-[#D4A64A]" />
                  <span>4.9 Rating (140+ Reviews)</span>
                </div>

                {/* Top Left Photo Counter Pill */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-xs font-mono font-bold border border-white/15 shadow-lg pointer-events-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4A64A]" />
                  <span>Photo {currentImageIndex + 1} of {imagesList.length}</span>
                </div>

                {/* Left Navigation Arrow */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous photo (Left Arrow)"
                  title="Previous Photo (Left Arrow Key)"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next photo (Right Arrow)"
                  title="Next Photo (Right Arrow Key)"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Bottom Center Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-white/15 z-10">
                  {imagesList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Go to photo ${idx + 1}`}
                      className={`transition-all rounded-full cursor-pointer ${
                        currentImageIndex === idx
                          ? 'w-6 h-2 bg-[#D4A64A]'
                          : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Keyboard & Swipe Hint Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#FAF7F0]/60 px-1">
                <span>⌨️ Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">→</kbd> arrows or click sides to navigate</span>
                <span className="hidden sm:inline">All {imagesList.length} Photos Available</span>
              </div>
            </div>

            {/* Title, Direction, and Contact Details */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-[#D4A64A] uppercase tracking-wider block mb-0.5">
                    {room.pgName || 'Aafa Coliving'} • {room.badge || 'Coliving'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-sora text-[#FAF7F0]">
                    {room.name}
                  </h3>
                </div>
                
                {/* Direct Call / Contact Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {phones.map((p, i) => (
                    <a
                      key={i}
                      href={`tel:${p}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-500/40 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Direction Badge */}
              <div className="flex items-start gap-2 text-xs sm:text-sm text-[#FAF7F0]/90 font-medium bg-[#0B1220]/60 p-3 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-[#D4A64A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#D4A64A]">Direction: </span>
                  <span>{room.direction || 'Near HCL Gate no 2, Sannidhi layout, Jigani'}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#FAF7F0]/80 leading-relaxed">
                {room.desc}
              </p>
            </div>

            {/* 3 Stay Rates Comparison */}
            <div className="rounded-2xl bg-[#10192B] border border-white/10 p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#D4A64A] uppercase tracking-wider">
                Available Stay Plans for this Room
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0B1220] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-white/60 block">Day Stay</span>
                  <span className="text-lg font-bold text-[#FAF7F0] font-sora block">
                    {room.stayRates?.dayDisplay || '₹499'}
                    <span className="text-xs font-normal text-white/50">/day</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Breakfast Free</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1220] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-white/60 block">Weekly Stay</span>
                  <span className="text-lg font-bold text-[#FAF7F0] font-sora block">
                    {room.stayRates?.weekDisplay || '₹2,199'}
                    <span className="text-xs font-normal text-white/50">/week</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Breakfast & Dinner</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1220] border border-[#D4A64A]/40 text-center bg-gradient-to-b from-[#D4A64A]/10 to-transparent">
                  <span className="text-[10px] font-mono text-[#D4A64A] font-bold block">Monthly (Best Value)</span>
                  <span className="text-lg font-bold text-[#D4A64A] font-sora block">
                    {room.stayRates?.monthDisplay || room.priceDisplay}
                    <span className="text-xs font-normal text-white/50">/month</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">3 Times Kerala Food</span>
                </div>
              </div>
            </div>

            {/* All 10 Included Facilities */}
            <div>
              <h4 className="text-xs font-mono font-bold text-[#D4A64A] uppercase tracking-wider mb-3">
                All 10 Included Campus Facilities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {facilitiesList.map((facility, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-[#FAF7F0] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="capitalize">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E172A] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white/90 transition-all cursor-pointer flex items-center gap-1.5 border border-white/15 hover:border-[#D4A64A]/40"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4A64A]" />
              <span>Back to Rooms</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${phones[0]}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onProceedToBooking) onProceedToBooking(room);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] text-xs sm:text-sm font-extrabold shadow-lg shadow-[#D4A64A]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer btn-shimmer"
              >
                <span>Choose Stay Plan & Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
