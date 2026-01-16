import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { 
  GalleryVerticalEnd,
  Layers,
  Clock3,
  SlidersHorizontal,
  Users,
  Pin,
  PinOff,
  Download
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
  Layers, // Implantação
  Clock: Clock3, // Agendamento
  Sliders: SlidersHorizontal, // Operacional
  Users, // Relacionamento
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

  const isExpanded = isOpen || isPinned || isHovered;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col h-full 
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          
          /* Refined Dark Liquid Glass Effect */
          bg-[#0f0f0f]/95
          backdrop-blur-2xl
          border-r border-white/5
          text-[#f2f2f2]
          shadow-[20px_0_40px_rgba(0,0,0,0.1)]
        `}
        style={{ 
          width: isExpanded ? '18rem' : '5rem', 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pin Toggle */}
        <div className={`
          hidden lg:flex absolute -right-3 top-10 z-50
          transition-all duration-300
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
        `}>
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`
              w-6 h-6 text-black
              flex items-center justify-center 
              bg-white/90 backdrop-blur-md border border-white/40
              hover:bg-white transition-all shadow-lg rounded-full
            `}
          >
            {isPinned ? <Pin size={12} strokeWidth={1.5} /> : <PinOff size={12} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Brand */}
        <div className={`
          relative px-6 py-10 flex items-center 
          ${!isExpanded ? 'justify-center' : 'justify-start'} 
          transition-all duration-500 overflow-hidden
        `}>
          <div className="shrink-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-inner rounded-lg">
                <span className="font-serif font-bold text-lg italic mt-0.5">Q</span>
             </div>
          </div>
          
          <div className={`
            ml-4 flex flex-col
            transition-all duration-500
            ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}
          `}>
            <h1 className="text-xl font-serif italic font-light tracking-wide text-white leading-none">
              QuickComms
            </h1>
            <span className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] text-white/40 mt-1.5">Studio</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar overflow-x-hidden">
          <ul className="space-y-1">
            <li key="all">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onCloseMobile();
                }}
                className={`
                  relative w-full flex items-center transition-all duration-300 group rounded-xl
                  ${!isExpanded ? 'justify-center py-4' : 'px-5 py-3.5 space-x-4'}
                  ${selectedCategory === 'all'
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'}
                `}
              >
                  <span className="shrink-0 flex items-center justify-center">
                    <GalleryVerticalEnd size={18} strokeWidth={1.5} />
                  </span>
                  {isExpanded && (
                    <span className="text-xs font-sans font-medium tracking-widest uppercase">Visão Geral</span>
                  )}
              </button>
            </li>

            <div className={`my-6 mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300 ${!isExpanded ? 'opacity-0' : 'opacity-100'}`} />

            {CATEGORIES.map((cat: Category) => {
              const Icon = IconMap[cat.icon] || GalleryVerticalEnd;
              const isSelected = selectedCategory === cat.id;

              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onCloseMobile();
                    }}
                    className={`
                      relative w-full flex items-center transition-all duration-300 group rounded-xl
                      ${!isExpanded ? 'justify-center py-4' : 'px-5 py-3.5 space-x-4'}
                      ${isSelected 
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <span className="shrink-0 flex items-center justify-center">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    {isExpanded && (
                      <span className="text-xs font-sans font-medium tracking-widest uppercase">{cat.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Install App Button */}
          {deferredPrompt && (
            <div className="mt-6 px-3 mb-4">
               <button
                onClick={handleInstallClick}
                className={`
                  relative w-full flex items-center transition-all duration-300 group rounded-xl border border-white/5
                  ${!isExpanded ? 'justify-center py-4' : 'px-5 py-3.5 space-x-4'}
                  text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10
                `}
              >
                <span className="shrink-0 flex items-center justify-center">
                  <Download size={18} strokeWidth={1.5} />
                </span>
                {isExpanded && (
                  <span className="text-xs font-sans font-medium tracking-widest uppercase">Instalar App</span>
                )}
              </button>
            </div>
          )}
        </nav>

        {/* Footer Profile */}
        <div className={`p-6 border-t border-white/5 bg-black/20 ${!isExpanded ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-4 ${!isExpanded ? 'justify-center' : ''}`}>
            <div className="shrink-0 w-9 h-9 bg-gradient-to-tr from-[#333] to-[#222] border border-white/10 flex items-center justify-center text-white font-serif italic text-sm shadow-inner rounded-full">
              JS
            </div>
            <div className={`
              flex-1 min-w-0 transition-all duration-300
              ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}
            `}>
              <p className="text-xs font-sans font-bold uppercase tracking-widest text-white">João Silva</p>
              <p className="text-[10px] text-white/40 mt-0.5">Pro Workspace</p>
            </div>
          </div>
        </div>
      </aside>
      
      <div 
        className={`hidden lg:block shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{ 
          width: isPinned ? '18rem' : '5rem' 
        }}
      />
    </>
  );
};