import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { 
  GalleryVerticalEnd,
  Layers,
  Calendar,
  SlidersHorizontal,
  Users,
  Pin,
  PinOff,
  Download,
  Command
} from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen: boolean; // Mobile state
  onCloseMobile: () => void;
}

const IconMap: Record<string, React.FC<any>> = {
  Layers, 
  Clock: Calendar, 
  Sliders: SlidersHorizontal, 
  Users: Users
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile
}) => {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Expanded logic: Pinned OR Hovered (Desktop), or Open (Mobile)
  const isExpanded = (isPinned || isHovered) && !isOpen ? true : isOpen ? true : false;
  // Width logic
  const widthClass = isOpen ? 'w-[18rem]' : (isExpanded ? 'w-[18rem]' : 'w-[5.5rem]');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex flex-col h-full 
          transition-[width,transform] duration-500 cubic-bezier(0.25, 0.1, 0.25, 1)
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          
          /* Refined Liquid Glass: Subtler, cleaner */
          bg-gradient-to-b from-white/60 via-white/40 to-white/20
          backdrop-blur-2xl
          border-r border-white/40
          shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]
        `}
        style={{ width: isOpen ? '18rem' : (isExpanded ? '18rem' : '5.5rem') }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle Noise Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>

        {/* Pin Toggle (Desktop Only) */}
        <div className={`
          hidden lg:flex absolute -right-3 top-9 z-50
          transition-all duration-300
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
        `}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPinned(!isPinned)}
            className="w-6 h-6 flex items-center justify-center bg-white border border-white/60 shadow-sm rounded-full text-black/70 hover:text-black"
          >
            {isPinned ? <Pin size={10} strokeWidth={1.5} /> : <PinOff size={10} strokeWidth={1.5} />}
          </motion.button>
        </div>

        {/* Brand Section */}
        <div className={`
          relative px-6 py-10 flex items-center 
          ${!isExpanded ? 'justify-center' : 'justify-start'} 
          transition-all duration-500 shrink-0 z-10
        `}>
          <div className="shrink-0 flex items-center justify-center">
             <div className="w-10 h-10 bg-gradient-to-br from-white/80 to-white/40 border border-white/60 backdrop-blur-md text-black flex items-center justify-center shadow-sm rounded-xl">
                <Command size={20} strokeWidth={1} />
             </div>
          </div>
          
          <div className={`
            ml-4 flex flex-col justify-center overflow-hidden whitespace-nowrap
            transition-all duration-500
            ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 pointer-events-none'}
          `}>
            <h1 className="text-xl font-serif italic font-medium tracking-tight text-black leading-none">
              QuickComms
            </h1>
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-black/40 mt-1">Studio</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1.5">
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectCategory('all');
                onCloseMobile();
              }}
              className={`
                relative w-full flex items-center transition-all duration-300 group rounded-xl
                ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                ${selectedCategory === 'all'
                  ? 'bg-white/50 text-black shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-white/60' 
                  : 'text-gray-500 hover:text-black hover:bg-white/20 border border-transparent'}
              `}
            >
                <span className="shrink-0 flex items-center justify-center">
                  <GalleryVerticalEnd size={20} strokeWidth={1} />
                </span>
                {isExpanded && (
                  <span className="text-[11px] font-sans font-medium tracking-wide">Visão Geral</span>
                )}
            </motion.button>

            <div className={`my-3 mx-4 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent transition-opacity duration-300 ${!isExpanded ? 'opacity-0' : 'opacity-100'}`} />

            {CATEGORIES.map((cat: Category) => {
              const Icon = IconMap[cat.icon] || GalleryVerticalEnd;
              const isSelected = selectedCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onCloseMobile();
                  }}
                  className={`
                    relative w-full flex items-center transition-all duration-300 group rounded-xl
                    ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                    ${isSelected 
                      ? 'bg-white/50 text-black shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-white/60' 
                      : 'text-gray-500 hover:text-black hover:bg-white/20 border border-transparent'}
                  `}
                >
                  <span className="shrink-0 flex items-center justify-center">
                    <Icon size={20} strokeWidth={1} />
                  </span>
                  {isExpanded && (
                    <span className="text-[11px] font-sans font-medium tracking-wide">{cat.name}</span>
                  )}
                </motion.button>
              );
            })}
        </nav>

        {/* Install Button */}
        {deferredPrompt && (
          <div className="p-4 mt-auto shrink-0 z-10">
              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className={`
                relative w-full flex items-center transition-colors duration-300 group rounded-xl border border-black/5 bg-white/10 hover:bg-white/30
                ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                text-gray-500 hover:text-black
              `}
            >
              <span className="shrink-0 flex items-center justify-center">
                <Download size={18} strokeWidth={1} />
              </span>
              {isExpanded && (
                <span className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase">Instalar App</span>
              )}
            </motion.button>
          </div>
        )}
      </aside>
      
      {/* Spacer for flow */}
      <div 
        className={`hidden lg:block shrink-0 transition-[width] duration-500 cubic-bezier(0.25, 0.1, 0.25, 1)`}
        style={{ width: isPinned ? '18rem' : '5.5rem' }}
      />
    </>
  );
};