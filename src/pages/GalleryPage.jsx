import useScrollLock from '../hooks/useScrollLock';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ZoomIn, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);
  useScrollLock(!!activeImage);

  const galleryItems = [
    {
      id: 1,
      title: 'Aafa Coliving - Private & Executive Rooms',
      category: 'rooms',
      image: '/images/1pg.jpeg',
      caption: 'Furnished bedroom space with beds, wardrobes, and high-speed WiFi.'
    },
    {
      id: 2,
      title: 'Aafa Coliving - Twin & Sharing Bedrooms',
      category: 'rooms',
      image: '/images/2pg.jpeg',
      caption: 'Spacious sharing room layout with power backup and natural ventilation.'
    },
    {
      id: 3,
      title: 'Aafa Coliving - Triple & Sharing Setup',
      category: 'rooms',
      image: '/images/3pg.jpeg',
      caption: 'Comfortable sharing arrangement with individual storage and charging points.'
    },
    {
      id: 4,
      title: 'Aafa Coliving - Quad Room & Wardrobes',
      category: 'rooms',
      image: '/images/4pg.jpeg',
      caption: 'Clean, well-maintained budget-friendly 4 sharing room setup.'
    },
    {
      id: 5,
      title: 'Aafa Coliving - Common Lounge & Living Zone',
      category: 'lounge',
      image: '/images/5pg.jpeg',
      caption: 'Relaxing lounge area and entertainment zone for residents.'
    },
    {
      id: 6,
      title: 'Aafa Coliving - Dining Hall & Kerala Mess',
      category: 'dining',
      image: '/images/6pg.jpeg',
      caption: 'Communal dining space serving 3 times fresh homestyle Kerala meals.'
    },
    {
      id: 7,
      title: 'Aafa Coliving - Washing & Utility Area',
      category: 'lounge',
      image: '/images/7pg.jpeg',
      caption: 'Washing machine and utility facilities with 24/7 hot water supply.'
    },
    {
      id: 8,
      title: 'Aafa Coliving - Self Cooking & Kitchen Space',
      category: 'kitchen',
      image: '/images/8pg.jpeg',
      caption: 'Self cooking kitchen area equipped with essential amenities for residents.'
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Image className="w-4 h-4 text-[#D4A64A]" />
            <span>Aafa Campus Photo Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 font-sora tracking-tight">
            Take a Virtual Walk Through <span className="text-gradient-gold">Aafa Coliving</span>
          </h2>
          <p className="opacity-80 text-base sm:text-lg">
            Real photos of our bedrooms, attached bathrooms, dining mess, gaming lounge, and rooftop terrace across Pan-India.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'rooms', label: 'Bedrooms & Workstations' },
            { id: 'dining', label: 'Dining & Kerala Mess' },
            { id: 'kitchen', label: 'Kitchen & Prep' },
            { id: 'lounge', label: 'Lounge & Rooftop' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-[#D4A64A] to-yellow-600 text-[#0B1220] shadow-lg shadow-[#D4A64A]/25 scale-105 font-bold'
                  : 'glass-card opacity-80 hover:opacity-100'
              }`}
              data-cursor="expand"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 cursor-pointer group relative h-72"
                data-cursor="expand"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#D4A64A] uppercase bg-[#0B1220]/80 px-2 py-0.5 rounded border border-[#D4A64A]/30">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold mt-1 font-sora">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#D4A64A] text-[#0B1220] shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveImage(null)}
                className="fixed inset-0 bg-[#0B1220]/90 backdrop-blur-2xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="relative max-w-4xl w-full rounded-3xl overflow-hidden glass-card border border-[#D4A64A]/40 p-4 shadow-2xl z-10"
              >
                <button
                  onClick={() => setActiveImage(null)}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-[#0B1220]/80 text-white hover:bg-[#0B1220] transition-all z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative h-[450px] sm:h-[550px] rounded-2xl overflow-hidden mb-4 bg-[#080d1a] flex items-center justify-center border border-white/10">
                  <img
                    src={activeImage.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none"
                  />
                  <img
                    src={activeImage.image}
                    alt={activeImage.title}
                    className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-4 drop-shadow-2xl"
                  />
                </div>

                <div className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-sora">
                      {activeImage.title}
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                      {activeImage.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
