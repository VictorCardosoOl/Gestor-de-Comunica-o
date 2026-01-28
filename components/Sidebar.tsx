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
  isOpen: boolean; 
  onCloseMobile: () => void;
  isMobile: boolean; 
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

// Faster, crisper animations
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.2, ease: "easeOut" }
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
    mobileClosed: { x: "-100%", width: "16rem", transition: { duration: 0.2 } },
    mobileOpen: { x: "0%", width: "16rem", transition: { type: "spring", stiffness: 300, damping: 30 } },
    desktopCollapsed: { width: "4.5rem", transition: { duration: 0.2, ease: "easeInOut" } },
    desktopExpanded: { width: "16rem", transition: { duration: 0.2, ease: "easeInOut" } }
  };

  const getCurrentVariant = () => {
    if (isMobile) return isOpen ? "mobileOpen" : "mobileClosed";
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
            className="fixed inset-0 bg-black/10 z-[60]"
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
          bg-white border-r border-gray-200
          shadow-sm
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {!isMobile && (
          <div className="absolute -right-3 top-6 z-50">
            <AnimatePresence>
              {isExpanded && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={onTogglePin}
                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full text-gray-400 hover:text-black hover:border-gray-300 transition-all"
                >
                  {isPinned ? <Pin size={10} strokeWidth={2} /> : <PinOff size={10} strokeWidth={2} />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Brand */}
        <div className="h-16 flex items-center px-4 shrink-0 border-b border-transparent">
           <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black text-white shrink-0">
              <Command size={18} />
           </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="ml-3 overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-semibold text-gray-900 tracking-tight">QuickComms</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <LayoutGroup id="sidebar-nav">
          <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar flex flex-col gap-0.5">
              <SidebarItem 
                id="all"
                label="Visão Geral"
                icon={LayoutTemplate}
                isSelected={selectedCategory === 'all'}
                isExpanded={isExpanded}
                onClick={() => {
                  onSelectCategory('all');
                  if (isMobile) onCloseMobile();
                }}
              />

              <div className="my-2 border-b border-gray-100 mx-2" />

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

        {/* Footer */}
        {deferredPrompt && isExpanded && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <Download size={14} />
              <span>Instalar App</span>
            </button>
          </div>
        )}
      </motion.aside>
      
      {!isMobile && (
        <motion.div 
          className="shrink-0 hidden lg:block"
          initial={false}
          animate={{ width: isExpanded ? "16rem" : "4.5rem" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
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
  onClick: () => void;
}> = ({ label, icon: Icon, isSelected, isExpanded, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full flex items-center rounded-md z-10 group
        ${!isExpanded ? 'justify-center h-10' : 'px-3 h-10 gap-3'}
        transition-colors duration-150
        ${isSelected ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <span className="shrink-0 flex items-center justify-center">
        <Icon size={18} strokeWidth={isSelected ? 2 : 1.5} className="transition-all" />
      </span>
      
      {isExpanded && (
        <span className={`text-sm whitespace-nowrap overflow-hidden ${isSelected ? 'font-medium' : 'font-normal'}`}>
          {label}
        </span>
      )}
    </button>
  );
}
