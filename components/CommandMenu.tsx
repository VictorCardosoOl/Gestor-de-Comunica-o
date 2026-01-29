import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, CornerDownLeft, FileText, Layers, Hash } from 'lucide-react';
import { INITIAL_TEMPLATES } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { getAccentInsensitiveRegex } from '../utils/textUtils';
import { CommunicationChannel } from '../types';

export const CommandMenu: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, setSelectedTemplate } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchModalOpen]);

  // Filter Logic
  const filteredItems = useMemo(() => {
    if (!query.trim()) return INITIAL_TEMPLATES.slice(0, 5); // Show recent/top 5 initially
    
    const regex = getAccentInsensitiveRegex(query.trim());
    const normalize = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    const q = normalize(query.trim());

    return INITIAL_TEMPLATES.filter(t => {
      const fields = [t.title, t.description, t.content, t.subject, t.secondaryContent];
      return fields.some(field => normalize(field || '').includes(q));
    });
  }, [query]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchModalOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, filteredItems, selectedIndex]);

  // Ensure selected index is always valid when list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
        const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
            selectedElement.scrollIntoView({ block: 'nearest' });
        }
    }
  }, [selectedIndex]);

  const handleSelect = (template: any) => {
    setSelectedTemplate(template);
    setIsSearchModalOpen(false);
  };

  const getIcon = (channel: CommunicationChannel) => {
      switch(channel) {
          case CommunicationChannel.EMAIL: return <FileText size={14} />;
          case CommunicationChannel.PROMPT: return <Hash size={14} />;
          default: return <Layers size={14} />;
      }
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-[#fdfcfb] rounded-2xl shadow-2xl border border-[#e6e4e1] overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 py-4 border-b border-[#e6e4e1] shrink-0">
                <Search className="text-[#a8a49e] mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar comando, template ou texto..."
                  className="flex-1 bg-transparent text-lg text-[#1a1918] placeholder:text-[#d1cdc7] outline-none font-serif italic"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#a8a49e] bg-[#f2f0ed] px-1.5 py-0.5 rounded border border-[#d1cdc7]/50">ESC</span>
                </div>
              </div>

              {/* Results List */}
              <div ref={listRef} className="overflow-y-auto custom-scrollbar p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-[#a8a49e]">
                    <p className="text-sm">Nenhum resultado encontrado.</p>
                  </div>
                ) : (
                  filteredItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 group text-left
                        ${idx === selectedIndex ? 'bg-[#f2f0ed] shadow-sm' : 'hover:bg-[#f2f0ed]'}
                      `}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                            ${idx === selectedIndex ? 'bg-white border-[#d1cdc7] text-[#1a1918]' : 'bg-[#f8f7f6] border-transparent text-[#a8a49e]'}
                        `}>
                            {getIcon(item.channel)}
                        </div>
                        <div className="min-w-0">
                           <h4 className={`text-sm font-medium truncate ${idx === selectedIndex ? 'text-[#1a1918]' : 'text-[#6e6b66]'}`}>
                             {item.title}
                           </h4>
                           <p className="text-[11px] text-[#a8a49e] truncate max-w-[300px]">
                             {item.description || item.subject || 'Sem descrição'}
                           </p>
                        </div>
                      </div>

                      {idx === selectedIndex && (
                        <div className="hidden md:flex items-center text-[#a8a49e] text-[10px] font-bold tracking-widest uppercase gap-2">
                            <span>Selecionar</span>
                            <CornerDownLeft size={14} />
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-[#faf9f8] border-t border-[#e6e4e1] px-4 py-2 flex justify-between items-center text-[10px] text-[#a8a49e]">
                 <span>{filteredItems.length} resultados</span>
                 <div className="flex gap-3">
                    <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-[-90deg]"/> <ArrowRight size={10} className="rotate-90deg"/> Navegar</span>
                    <span className="flex items-center gap-1"><CornerDownLeft size={10}/> Abrir</span>
                 </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};