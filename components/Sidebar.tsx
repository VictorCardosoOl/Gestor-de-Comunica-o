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
  Command
} from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen,
  onCloseMobile,
  isMobile,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
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
        className={`
          fixed z-[70] flex flex-col items-center
          ${isMobile ? 'inset-y-0 left-0 w-20 bg-white border-r border-[#e6e4e1]' : 'left-4 top-4 bottom-4 w-16 bg-white/50 backdrop-blur-xl rounded-[24px] border border-white/40 shadow-sm'}
        `}
        initial={false}
        animate={isMobile ? { x: isOpen ? 0 : "-100%" } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-center shrink-0">
           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1918] text-white shadow-lg">
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
              onClick={() => {
                onSelectCategory('all');
                if (isMobile) onCloseMobile();
              }}
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
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (isMobile) onCloseMobile();
                }}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />
            ))}
        </nav>
      </motion.aside>
    </>
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
      {/* Tooltip (Desktop Only) - Snappy appearance */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: 5, scale: 0.95 }}
            animate={{ opacity: 1, x: 15, scale: 1 }}
            exit={{ opacity: 0, x: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-full bg-[#1a1918] text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded-md whitespace-nowrap z-50 pointer-events-none"
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
          relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
          ${isSelected ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'}
        `}
      >
        <Icon size={20} strokeWidth={1.5} className={`transition-transform duration-200 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        
        {isSelected && (
          <motion.div 
            layoutId="active-dot"
            transition={{ type: "spring", stiffness: 500, damping: 30 }} // Snappier spring
            className="absolute -right-1 top-1 w-2 h-2 bg-black rounded-full border-2 border-white"
          />
        )}
      </button>
    </div>
  );
}
