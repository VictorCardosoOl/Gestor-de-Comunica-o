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

  const isExpanded = isMobile ? true : (isPinned || isHovered);

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

  const sidebarVariants = {
    mobileClosed: { 
      x: "-100%", 
      width: "18rem", 
      transition: { type: "spring", stiffness: 300, damping: 35, mass: 1 }
    },
    mobileOpen: { 
      x: "0%", 
      width: "18rem",
      transition: { type: "spring", stiffness: 300, damping: 35, mass: 1 }
    },
    desktopCollapsed: { 
      x: "0%", 
      width: "5.5rem",
      transition: { type: "spring", stiffness: 200, damping: 30, mass: 1 }
    },
    desktopExpanded: { 
      x: "0%", 
      width: "18rem",
      transition: { type: "spring", stiffness: 200, damping: 30, mass: 1 }
    }
  };

  const getCurrentVariant = () => {
    if (isMobile) {
      return isOpen ? "mobileOpen" : "mobileClosed";
    }
    return isExpanded ? "desktopExpanded" : "desktopCollapsed";
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[60]"
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
          /* REFINED LIQUID GLASS - Ultra subtle & Integrated */
          bg-gradient-to-b from-white/40 to-white/5
          backdrop-blur-3xl
          border-r border-white/20
          shadow-[20px_0_40px_-10px_rgba(0,0,0,0.02)]
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>

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
                  className="w-6 h-6 flex items-center justify-center bg-white/60 border border-white/40 backdrop-blur-md shadow-sm rounded-full text-black/60 hover:text-black cursor-pointer transition-colors"
                  title={isPinned ? "Desafixar Sidebar" : "Fixar Sidebar"}
                >
                  {isPinned ? <Pin size={8} strokeWidth={0.75} /> : <PinOff size={8} strokeWidth={0.75} />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Brand */}
        <div className={`
          relative px-6 py-10 flex items-center shrink-0 z-10 transition-all duration-300
          ${!isExpanded ? 'justify-center' : 'justify-start'}
        `}>
          <motion.div layout="position" className="shrink-0 flex items-center justify-center z-20">
             <div className="w-10 h-10 bg-gradient-to-br from-white/90 to-white/40 border border-white/50 backdrop-blur-md text-black/80 flex items-center justify-center shadow-lg shadow-black/5 rounded-xl">
                <Command size={16} strokeWidth={0.75} />
             </div>
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="ml-4 flex flex-col justify-center overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xl font-serif italic font-light tracking-tight text-black leading-none">
                  QuickComms
                </h1>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-black/30 mt-1">Studio</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <LayoutGroup id="sidebar-nav">
          <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1.5">
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={GalleryVerticalEnd}
                isSelected={selectedCategory === 'all'}
                isExpanded={isExpanded}
                isMobile={isMobile}
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
                  isMobile={isMobile}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    if (isMobile) onCloseMobile();
                  }}
                />
              ))}
          </nav>
        </LayoutGroup>

        {/* Footer */}
        {deferredPrompt && (
          <div className="p-4 mt-auto shrink-0 z-10">
              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className={`
                relative w-full flex items-center transition-colors duration-300 group rounded-xl border border-white/30 bg-white/10 hover:bg-white/30
                ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                text-gray-500 hover:text-black
              `}
            >
              <span className="shrink-0 flex items-center justify-center">
                <Download size={14} strokeWidth={0.75} />
              </span>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase whitespace-nowrap overflow-hidden"
                  >
                    Instalar App
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}
      </motion.aside>
      
      {!isMobile && (
        <motion.div 
          className="shrink-0 hidden lg:block"
          initial={false}
          animate={{ width: isExpanded ? "18rem" : "5.5rem" }}
          transition={{ type: "spring", stiffness: 200, damping: 30, mass: 1 }}
        />
      )}
    </>
  );
};

const SidebarItem: React.FC<{
  id: string;
  label: string;
  icon: any;
  isSelected: boolean;
  isExpanded: boolean;
  isMobile: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isSelected, isExpanded, isMobile, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      layout={!isMobile ? "position" : undefined} 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-xl z-10
        ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
        text-gray-500 transition-colors duration-300
        ${isSelected ? 'text-black' : 'hover:text-black'}
      `}
    >
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-white/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-white/40 rounded-xl z-0 backdrop-blur-sm"
          initial={false}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}
      
      {!isSelected && isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 bg-white/20 rounded-xl z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <span className="shrink-0 flex items-center justify-center relative z-10 transition-transform duration-300" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
        <Icon size={16} strokeWidth={0.75} className={isSelected ? "text-black" : ""} />
      </span>
      
      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.span 
            initial={{ opacity: 0, x: -5, filter: 'blur(2px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -5, filter: 'blur(2px)' }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="text-[11px] font-sans font-medium tracking-wide whitespace-nowrap overflow-hidden relative z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}