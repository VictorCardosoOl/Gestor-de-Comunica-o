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
  Command,
  Sparkles
} from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

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
  Users: Users,
  Sparkles: Sparkles
};

// Physics constants for a "heavy" but responsive feel
const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
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

  // Logic: Pinned OR Hovered (Desktop), or Open (Mobile)
  const isExpanded = (isPinned || isHovered) && !isOpen ? true : isOpen ? true : false;
  
  // Define width for motion.aside
  const width = isOpen ? '18rem' : (isExpanded ? '18rem' : '5.5rem');

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

      <motion.aside 
        initial={false}
        animate={{ width }}
        transition={SPRING_TRANSITION}
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex flex-col h-full 
          overflow-hidden
          /* Glassmorphism */
          bg-gradient-to-b from-white/80 via-white/60 to-white/40
          backdrop-blur-2xl
          border-r border-white/40
          shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ x: isOpen ? 0 : undefined }} // Handle mobile slide-in separately if needed via class, but motion handles width better
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle Noise Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>

        {/* Pin Toggle (Desktop Only) */}
        <div className="hidden lg:block absolute -right-3 top-9 z-50">
          <AnimatePresence>
            {isExpanded && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPinned(!isPinned)}
                className="w-6 h-6 flex items-center justify-center bg-white border border-white/60 shadow-sm rounded-full text-black/70 hover:text-black cursor-pointer"
              >
                {isPinned ? <Pin size={10} strokeWidth={1.5} /> : <PinOff size={10} strokeWidth={1.5} />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Section */}
        <div className={`
          relative px-6 py-10 flex items-center shrink-0 z-10
          ${!isExpanded ? 'justify-center' : 'justify-start'}
        `}>
          <motion.div layout className="shrink-0 flex items-center justify-center z-20">
             <div className="w-10 h-10 bg-gradient-to-br from-white/80 to-white/40 border border-white/60 backdrop-blur-md text-black flex items-center justify-center shadow-sm rounded-xl">
                <Command size={20} strokeWidth={1} />
             </div>
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="ml-4 flex flex-col justify-center overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xl font-serif italic font-medium tracking-tight text-black leading-none">
                  QuickComms
                </h1>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-black/40 mt-1">Studio</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <LayoutGroup id="sidebar-nav">
          <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1.5">
              {/* "All" Category Item */}
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={GalleryVerticalEnd}
                isSelected={selectedCategory === 'all'}
                isExpanded={isExpanded}
                onClick={() => {
                  onSelectCategory('all');
                  onCloseMobile();
                }}
              />

              <motion.div 
                layout
                className={`my-3 mx-4 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent transition-opacity duration-300 ${!isExpanded ? 'opacity-0' : 'opacity-100'}`} 
              />

              {CATEGORIES.map((cat: Category) => (
                <SidebarItem 
                  key={cat.id}
                  id={cat.id}
                  label={cat.name}
                  icon={IconMap[cat.icon] || GalleryVerticalEnd}
                  isSelected={selectedCategory === cat.id}
                  isExpanded={isExpanded}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onCloseMobile();
                  }}
                />
              ))}
          </nav>
        </LayoutGroup>

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
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase whitespace-nowrap overflow-hidden"
                  >
                    Instalar App
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}
      </motion.aside>
      
      {/* Spacer for flow (Desktop) */}
      <motion.div 
        className="hidden lg:block shrink-0"
        initial={false}
        animate={{ width }}
        transition={SPRING_TRANSITION}
      />
    </>
  );
};

// Sub-component for Cleaner Motion Logic
const SidebarItem: React.FC<{
  id: string;
  label: string;
  icon: any;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ id, label, icon: Icon, isSelected, isExpanded, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      layout="position" // Ensures smooth position changes when separator appears/disappears
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => setIsHovered(false)} // Fix stuck hover state on touch
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-xl z-10
        ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
        text-gray-500 transition-colors duration-200
        ${isSelected ? 'text-black' : 'hover:text-black'}
      `}
    >
      {/* Active State Background (The "Pill") */}
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-white/60 rounded-xl z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {/* Hover State Background (Subtle) */}
      {!isSelected && isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 bg-white/30 rounded-xl z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <span className="shrink-0 flex items-center justify-center relative z-10">
        <Icon size={20} strokeWidth={1} className={isSelected ? "text-black" : ""} />
      </span>
      
      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.span 
            initial={{ opacity: 0, x: -5, filter: 'blur(2px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -5, filter: 'blur(2px)' }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-sans font-medium tracking-wide whitespace-nowrap overflow-hidden relative z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}