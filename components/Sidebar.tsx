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
import { motion, AnimatePresence, LayoutGroup, Variants } from 'framer-motion';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen: boolean; // Mobile open state
  onCloseMobile: () => void;
  isMobile: boolean; // Screen context
  // New props for controlled state
  isPinned: boolean;
  onTogglePin: () => void;
}

const IconMap: Record<string, React.FC<any>> = {
  Layers, 
  Clock: Calendar, 
  Sliders: SlidersHorizontal, 
  Users: Users,
  Sparkles: Sparkles
};

// --- ANIMAÇÕES DE ENTRADA (POP-IN) ---
const navVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 12, 
    scaleY: 0.9, 
    filter: 'blur(4px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scaleY: 1, 
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
      mass: 0.8
    }
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile,
  isMobile,
  isPinned,
  onTogglePin
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Logic to determine if sidebar is visually expanded
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

  const transition = { type: "spring", stiffness: 300, damping: 30, mass: 1 };

  const sidebarVariants = {
    mobileClosed: { 
      x: "-100%", 
      width: "18rem", 
      transition 
    },
    mobileOpen: { 
      x: "0%", 
      width: "18rem",
      transition 
    },
    desktopCollapsed: { 
      x: "0%", 
      width: "5.5rem",
      transition 
    },
    desktopExpanded: { 
      x: "0%", 
      width: "18rem",
      transition 
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
            transition={{ duration: 0.2 }}
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
          /* REFINED LIQUID GLASS */
          bg-white/80
          backdrop-blur-3xl
          border-r border-white/20
          shadow-[10px_0_30px_-10px_rgba(0,0,0,0.03)]
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
                  onClick={onTogglePin}
                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full text-gray-500 hover:text-black cursor-pointer transition-colors"
                  title={isPinned ? "Desafixar Sidebar" : "Fixar Sidebar"}
                >
                  {isPinned ? <Pin size={10} strokeWidth={1.5} /> : <PinOff size={10} strokeWidth={1.5} />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Brand */}
        <div className="relative px-6 py-10 flex items-center shrink-0 z-10 min-h-[5rem]">
           <div className="shrink-0 flex items-center justify-center z-20 w-10 h-10 bg-gradient-to-br from-white to-gray-100 border border-white shadow-sm rounded-xl text-black">
              <Command size={18} strokeWidth={1} />
           </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="ml-4 flex flex-col justify-center whitespace-nowrap overflow-hidden"
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
          <motion.nav 
            className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1.5"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={GalleryVerticalEnd}
                isSelected={selectedCategory === 'all'}
                isExpanded={isExpanded}
                isMobile={isMobile}
                variants={itemVariants}
                onClick={() => {
                  onSelectCategory('all');
                  if (isMobile) onCloseMobile();
                }}
              />

              <motion.div 
                className="my-2 mx-4 h-px bg-black/5" 
                variants={itemVariants}
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
                  variants={itemVariants}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    if (isMobile) onCloseMobile();
                  }}
                />
              ))}
          </motion.nav>
        </LayoutGroup>

        {/* Footer */}
        {deferredPrompt && (
          <div className="p-4 mt-auto shrink-0 z-10">
              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className={`
                relative w-full flex items-center transition-all duration-300 group rounded-xl border border-black/5 bg-white/40 hover:bg-white/80
                ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                text-gray-500 hover:text-black hover:shadow-sm
              `}
            >
              <span className="shrink-0 flex items-center justify-center">
                <Download size={16} strokeWidth={0.75} />
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
      
      {!isMobile && (
        <motion.div 
          className="shrink-0 hidden lg:block"
          initial={false}
          animate={{ width: isExpanded ? "18rem" : "5.5rem" }}
          transition={transition}
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
  variants?: Variants; // Add variants prop
}> = ({ label, icon: Icon, isSelected, isExpanded, isMobile, onClick, variants }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      variants={variants} // Apply entrance variants
      // Removed layout="position" to prevent jitter during parent width transition
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-xl z-10 group
        ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
        transition-all duration-200
        ${isSelected ? 'text-black' : 'text-gray-500 hover:text-black'}
      `}
    >
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-black/5 rounded-xl z-0"
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
          transition={{ duration: 0.15 }}
        />
      )}

      <span className="shrink-0 flex items-center justify-center relative z-10">
        <Icon size={18} strokeWidth={isSelected ? 1.5 : 1} className={isSelected ? "text-black" : "text-gray-500 group-hover:text-black transition-colors"} />
      </span>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="text-[13px] font-sans font-medium tracking-tight whitespace-nowrap overflow-hidden relative z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}