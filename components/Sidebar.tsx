import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { 
  LayoutTemplate,
  GalleryVerticalEnd,
  Layers,
  Calendar,
  SlidersHorizontal,
  Users,
  Sparkles,
  Command,
  X
} from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen: boolean; 
  onCloseMobile: () => void;
  isMobile: boolean; 
}

const IconMap: Record<string, React.FC<any>> = {
  Layers, 
  Clock: Calendar, 
  Sliders: SlidersHorizontal, 
  Users: Users,
  Sparkles: Sparkles
};

// --- ANIMATION VARIANTS ---

const sidebarVariants: Variants = {
  closed: { 
    x: "-100%",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 40 
    }
  },
  open: { 
    x: "0%",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.07, // Stagger effect for items
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const overlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile,
  isMobile,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // --- MOBILE RENDER (Editorial Drawer) ---
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={onCloseMobile}
            />

            {/* Sidebar Drawer */}
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-[#fdfcfb] z-[70] shadow-2xl border-r border-[#e6e4e1] flex flex-col overflow-hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-8 py-8 border-b border-[#e6e4e1]/50">
                <div className="flex items-center gap-3 text-[#1a1918]">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1918] text-white flex items-center justify-center">
                    <Command size={16} />
                  </div>
                  <span className="font-serif italic text-2xl tracking-tight">Menu</span>
                </div>
                <button 
                  onClick={onCloseMobile}
                  className="p-2 rounded-full hover:bg-[#f2f0ed] transition-colors"
                >
                  <X size={24} strokeWidth={1.5} className="text-[#6e6b66]" />
                </button>
              </div>

              {/* Mobile Nav Items (Staggered) */}
              <nav className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6 no-scrollbar">
                
                {/* Overview Item */}
                <MobileMenuItem 
                  id="all"
                  label="Visão Geral"
                  icon={LayoutTemplate}
                  isSelected={selectedCategory === 'all'}
                  onClick={() => { onSelectCategory('all'); onCloseMobile(); }}
                  index={0}
                />

                <motion.div variants={itemVariants} className="h-px bg-[#e6e4e1] w-full my-2" />

                {/* Categories */}
                {CATEGORIES.map((cat, idx) => (
                  <MobileMenuItem 
                    key={cat.id}
                    id={cat.id}
                    label={cat.name}
                    icon={IconMap[cat.icon] || GalleryVerticalEnd}
                    isSelected={selectedCategory === cat.id}
                    onClick={() => { onSelectCategory(cat.id); onCloseMobile(); }}
                    index={idx + 1}
                  />
                ))}
              </nav>

              {/* Mobile Footer */}
              <motion.div 
                variants={itemVariants}
                className="p-8 border-t border-[#e6e4e1]/50 bg-[#fbfaf9]"
              >
                <p className="text-xs font-sans text-[#a8a49e] uppercase tracking-widest">
                  QuickComms Studio © 2024
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // --- DESKTOP RENDER (Floating Dock) ---
  return (
    <motion.aside 
      className="fixed left-4 top-4 bottom-4 w-16 bg-white/50 backdrop-blur-xl rounded-[24px] border border-white/40 shadow-sm z-[70] flex flex-col items-center"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
    >
      {/* Brand */}
      <div className="h-20 flex items-center justify-center shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1918] text-white shadow-lg transition-transform hover:scale-105">
            <Command size={20} strokeWidth={1.5} />
          </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-3 w-full px-2 py-4 overflow-y-auto no-scrollbar overflow-x-hidden">
          <DockItem 
            id="all"
            label="Overview"
            icon={LayoutTemplate}
            isSelected={selectedCategory === 'all'}
            onClick={() => onSelectCategory('all')}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />

          <div className="w-8 h-px bg-[#e6e4e1] mx-auto my-2 opacity-50" />

          {CATEGORIES.map((cat: Category) => (
            <DockItem 
              key={cat.id}
              id={cat.id}
              label={cat.name}
              icon={IconMap[cat.icon] || GalleryVerticalEnd}
              isSelected={selectedCategory === cat.id}
              onClick={() => onSelectCategory(cat.id)}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
      </nav>
    </motion.aside>
  );
};

// --- SUB-COMPONENTS ---

const MobileMenuItem: React.FC<{
  id: string;
  label: string;
  icon: any;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ label, icon: Icon, isSelected, onClick, index }) => {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={`group flex items-center gap-5 w-full text-left transition-colors duration-300 ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
    >
      <span className="text-[10px] font-sans font-bold text-[#a8a49e] w-4 pt-1">
        {String(index).padStart(2, '0')}
      </span>
      <div className="flex-1">
        <span className={`block text-3xl font-serif italic leading-none transition-colors ${isSelected ? 'text-[#1a1918]' : 'text-[#6e6b66] group-hover:text-[#1a1918]'}`}>
          {label}
        </span>
      </div>
      {isSelected && (
        <motion.div 
          layoutId="mobile-active"
          className="w-1.5 h-1.5 rounded-full bg-[#1a1918]" 
        />
      )}
    </motion.button>
  );
};

const DockItem: React.FC<{
  id: string;
  label: string;
  icon: any;
  isSelected: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onClick: () => void;
}> = ({ id, label, icon: Icon, isSelected, hoveredId, setHoveredId, onClick }) => {
  const isHovered = hoveredId === id;

  return (
    <div className="relative flex items-center justify-center group">
      {/* Tooltip (Desktop Only) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: 5, scale: 0.95 }}
            animate={{ opacity: 1, x: 15, scale: 1 }}
            exit={{ opacity: 0, x: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-full bg-[#1a1918] text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded-md whitespace-nowrap z-50 pointer-events-none shadow-xl"
          >
            {label}
            {/* Tiny arrow */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1918] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredId(id)}
        onMouseLeave={() => setHoveredId(null)}
        className={`
          relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
          ${isSelected ? 'bg-white shadow-md text-black scale-105' : 'text-gray-400 hover:text-gray-900 hover:bg-white/50 hover:scale-105'}
        `}
      >
        <Icon size={20} strokeWidth={1.5} />
        
        {isSelected && (
          <motion.div 
            layoutId="active-dot"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -right-1 top-1 w-2 h-2 bg-black rounded-full border-2 border-white"
          />
        )}
      </button>
    </div>
  );
}
