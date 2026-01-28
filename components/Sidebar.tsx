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
  Sparkles,
  LayoutTemplate
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

// Icon Mapping with refined choices if needed
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
      mass: 0.8,
      filter: { type: "tween", ease: "easeOut", duration: 0.3 }
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

  const transition = { type: "spring" as const, stiffness: 300, damping: 30, mass: 1 };

  const sidebarVariants = {
    mobileClosed: { 
      x: "-100%", 
      width: "18rem", 
      transition: { ...transition, damping: 25 }
    },
    mobileOpen: { 
      x: "0%", 
      width: "18rem",
      transition: { ...transition, damping: 25 }
    },
    desktopCollapsed: { 
      x: "0%", 
      width: "5rem", 
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
          bg-white/90
          ${isMobile ? 'backdrop-blur-xl max-w-[85vw]' : 'backdrop-blur-3xl'}
          border-r border-black/5
          shadow-2xl lg:shadow-none
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
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
                  className="w-5 h-5 flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-full text-gray-400 hover:text-black cursor-pointer transition-colors"
                  title={isPinned ? "Desafixar Sidebar" : "Fixar Sidebar"}
                >
                  {isPinned ? <Pin size={8} strokeWidth={1} /> : <PinOff size={8} strokeWidth={1} />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Brand */}
        <div className="relative px-6 py-10 flex items-center shrink-0 z-10 min-h-[5rem]">
           <div className="shrink-0 flex items-center justify-center z-20 w-8 h-8 rounded-lg bg-black text-white">
              <Command size={14} strokeWidth={1.5} />
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
                <h1 className="text-lg font-serif italic tracking-wide text-black leading-none">
                  QuickComms
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <LayoutGroup id="sidebar-nav">
          <motion.nav 
            className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar overflow-x-hidden z-10 flex flex-col gap-1"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={LayoutTemplate}
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
                className="my-3 mx-2 h-px bg-black/5" 
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
                relative w-full flex items-center transition-all duration-300 group rounded-lg border border-black/5 bg-white
                ${!isExpanded ? 'justify-center py-3' : 'px-4 py-3 space-x-3'}
                text-gray-400 hover:text-black hover:border-black/20
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
                    className="text-[9px] font-sans font-medium tracking-[0.1em] uppercase whitespace-nowrap overflow-hidden"
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
          animate={{ width: isExpanded ? "18rem" : "5rem" }}
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
  variants?: Variants; 
}> = ({ label, icon: Icon, isSelected, isExpanded, isMobile, onClick, variants }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      layout="position" 
      variants={variants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-lg z-10 group
        ${!isExpanded ? 'justify-center py-3' : 'px-4 py-2.5 space-x-4'}
        transition-colors duration-300
        ${isSelected ? 'text-black' : 'text-gray-400 hover:text-black'}
      `}
    >
      {isSelected && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-black/[0.03] rounded-lg z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {!isSelected && isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 bg-black/[0.015] rounded-lg z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}

      <motion.span 
        layout="position" 
        className="shrink-0 flex items-center justify-center relative z-10"
      >
        <Icon size={20} strokeWidth={0.75} className={isSelected ? "text-black" : "text-gray-400 group-hover:text-black transition-colors"} />
      </motion.span>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              text-[11px] font-sans tracking-wide whitespace-nowrap overflow-hidden relative z-10
              ${isSelected ? 'font-medium' : 'font-normal'}
            `}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}