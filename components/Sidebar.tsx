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
  isOpen: boolean; // Mobile open state
  onCloseMobile: () => void;
  isMobile: boolean; // Screen context
}

const IconMap: Record<string, React.FC<any>> = {
  Layers, 
  Clock: Calendar, 
  Sliders: SlidersHorizontal, 
  Users: Users,
  Sparkles: Sparkles
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile,
  isMobile
}) => {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Logic: Is the sidebar visually expanded?
  // Mobile: Always "expanded" internally when open (to show text), but handled via slide animation.
  // Desktop: Expanded if Pinned OR Hovered.
  const isExpanded = isMobile ? true : (isPinned || isHovered);

  // Install PWA Prompt Logic
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

  // --- ANIMATION VARIANTS ---
  const sidebarVariants = {
    mobileClosed: { 
      x: "-100%", 
      width: "18rem", // Fixed width for mobile drawer
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    mobileOpen: { 
      x: "0%", 
      width: "18rem",
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    desktopCollapsed: { 
      x: "0%", 
      width: "5.5rem",
      transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
    },
    desktopExpanded: { 
      x: "0%", 
      width: "18rem",
      transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
    }
  };

  // Determine current animation state
  const getCurrentVariant = () => {
    if (isMobile) {
      return isOpen ? "mobileOpen" : "mobileClosed";
    }
    return isExpanded ? "desktopExpanded" : "desktopCollapsed";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={getCurrentVariant()}
        variants={sidebarVariants}
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex flex-col h-full 
          overflow-hidden
          /* Theme & Glassmorphism */
          bg-white/80
          backdrop-blur-xl
          border-r border-white/40
          shadow-[4px_0_24px_-4px_rgba(0,0,0,0.04)]
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>

        {/* Pin Toggle (Desktop Only) */}
        {!isMobile && (
          <div className="absolute -right-3 top-9 z-50">
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
                  title={isPinned ? "Desafixar Sidebar" : "Fixar Sidebar"}
                >
                  {isPinned ? <Pin size={10} strokeWidth={1.5} /> : <PinOff size={10} strokeWidth={1.5} />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Header / Brand */}
        <div className={`
          relative px-6 py-10 flex items-center shrink-0 z-10 transition-all duration-300
          ${!isExpanded ? 'justify-center' : 'justify-start'}
        `}>
          <motion.div layout="position" className="shrink-0 flex items-center justify-center z-20">
             <div className="w-10 h-10 bg-gradient-to-br from-white/90 to-white/50 border border-white/60 backdrop-blur-md text-black flex items-center justify-center shadow-sm rounded-xl">
                <Command size={20} strokeWidth={1} />
             </div>
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
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

        {/* Navigation List */}
        <LayoutGroup id="sidebar-nav">
          <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1.5">
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={GalleryVerticalEnd}
                isSelected={selectedCategory === 'all'}
                isExpanded={isExpanded}
                onClick={() => {
                  onSelectCategory('all');
                  if (isMobile) onCloseMobile();
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
                    if (isMobile) onCloseMobile();
                  }}
                />
              ))}
          </nav>
        </LayoutGroup>

        {/* Install Button Footer */}
        {deferredPrompt && (
          <div className="p-4 mt-auto shrink-0 z-10">
              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className={`
                relative w-full flex items-center transition-colors duration-300 group rounded-xl border border-black/5 bg-white/40 hover:bg-white/60
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
      
      {/* Desktop Spacer: Ensures content doesn't get hidden behind fixed sidebar */}
      {!isMobile && (
        <motion.div 
          className="shrink-0 hidden lg:block"
          initial={false}
          animate={{ width: isExpanded ? "18rem" : "5.5rem" }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        />
      )}
    </>
  );
};

// Sub-component for individual items
const SidebarItem: React.FC<{
  id: string;
  label: string;
  icon: any;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isSelected, isExpanded, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      layout="position"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-xl z-10
        ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
        text-gray-500 transition-colors duration-200
        ${isSelected ? 'text-black' : 'hover:text-black'}
      `}
    >
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-white/60 rounded-xl z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {!isSelected && isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 bg-white/40 rounded-xl z-0"
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