import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Search, X, Menu, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from './hooks/useDebounce';
import { getAccentInsensitiveRegex } from './utils/textUtils';
import { useAppContext } from './contexts/AppContext';

// --- ANIMATION CONSTANTS ---
const STAGGER_DELAY = 0.03;

const pageVariants = {
  listInitial: { opacity: 0, scale: 0.98, y: 10 },
  listAnimate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 35 } 
  },
  listExit: { 
    opacity: 0, 
    scale: 0.96, 
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } 
  },
  editorInitial: { opacity: 0, y: 40, scale: 0.98 },
  editorAnimate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } 
  },
  editorExit: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" } 
  }
};

// --- COMPONENTS ---

const HighlightedText = React.memo(({ text, highlight, className }: { text: string, highlight: string, className?: string }) => {
  if (!highlight.trim()) return <span className={className}>{text}</span>;
  const regex = useMemo(() => getAccentInsensitiveRegex(highlight.trim()), [highlight]);
  const parts = text.split(regex);
  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-[#e6e4e1] text-black font-medium px-0.5 rounded-[2px]">
            {part}
          </span>
        ) : part
      )}
    </span>
  );
});

interface TemplateCardProps {
  template: any;
  searchQuery: string;
  onClick: () => void;
  index: number;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, searchQuery, onClick, index }) => (
  <motion.div
    layoutId={`card-${template.id}`}
    initial={{ opacity: 0, y: 15 }} 
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: index * STAGGER_DELAY, 
      type: "spring",
      stiffness: 400,
      damping: 40
    }}
    onClick={onClick}
    className="group relative flex flex-col p-6 h-full bg-white rounded-[20px] border border-transparent hover:border-[#e6e4e1] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 cursor-pointer overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <span className={`
        text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border
        ${template.channel === 'EMAIL' ? 'bg-blue-50/50 text-blue-600 border-blue-100' : 
         (template.channel === 'PROMPT' ? 'bg-purple-50/50 text-purple-600 border-purple-100' : 
         'bg-emerald-50/50 text-emerald-600 border-emerald-100')}
      `}>
        {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
      </span>
      <div className="w-8 h-8 rounded-full border border-[#e6e4e1] flex items-center justify-center text-[#d1cdc7] group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300">
         <ArrowRight size={14} />
      </div>
    </div>

    <h3 className="text-xl font-serif italic-editorial text-[#1a1918] mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-gray-300">
        <HighlightedText text={template.title} highlight={searchQuery} />
    </h3>
    
    <p className="text-sm text-[#6e6b66] line-clamp-3 leading-relaxed mt-auto font-sans">
        <HighlightedText text={template.description || ''} highlight={searchQuery} />
    </p>
  </motion.div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const {
    selectedCategory, setSelectedCategory,
    selectedTemplate, setSelectedTemplate,
    searchQuery, setSearchQuery,
    isSidebarOpen, setIsSidebarOpen,
  } = useAppContext();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); 
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsSidebarOpen]);

  // Keyboard Shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const normalizeText = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filteredTemplates = useMemo(() => {
    let filtered = INITIAL_TEMPLATES || [];
    const query = normalizeText(debouncedSearchQuery.trim());
    if (query) {
       filtered = filtered.filter(t => {
         const fields = [t.title, t.description, t.content, t.subject, t.secondaryContent];
         return fields.some(field => normalizeText(field || '').includes(query));
       });
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    return filtered;
  }, [selectedCategory, debouncedSearchQuery]);

  const categoryInfo = useMemo(() => {
    if (debouncedSearchQuery) return { title: 'Busca', subtitle: `${filteredTemplates.length} resultados encontrados` };
    if (selectedCategory === 'all') return { title: 'Visão Geral', subtitle: 'Todos os seus modelos disponíveis' };
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    return { title: cat?.name || 'Módulo', subtitle: 'Modelos selecionados' };
  }, [selectedCategory, debouncedSearchQuery, filteredTemplates.length]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden relative">
      
      {/* Sidebar / Dock */}
      <Sidebar 
        selectedCategory={debouncedSearchQuery ? 'all' : selectedCategory} 
        onSelectCategory={(id) => { setSelectedCategory(id); setSearchQuery(''); setSelectedTemplate(null); }}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main "Window" Container */}
      <main 
        className={`
          flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-500 ease-[0.23,1,0.32,1]
          ${isMobile ? 'bg-[#f2f0ed]' : 'my-4 mr-4 ml-24 rounded-[24px] border border-white/50 bg-[#fdfcfb] shadow-2xl shadow-[#1a1918]/5'}
        `}
      >
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-5 sticky top-0 z-30 shrink-0 bg-[#f2f0ed]/80 backdrop-blur-md">
           <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-[#1a1918]"
           >
             <Menu size={24} strokeWidth={1.5} />
           </button>
          <span className="font-serif italic text-xl text-[#1a1918]">QuickComms</span>
          <div className="w-8"></div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 flex overflow-hidden w-full relative">
          <AnimatePresence mode="wait" initial={false}>
            
            {/* --- LIST VIEW --- */}
            {!selectedTemplate ? (
              <motion.div 
                key="list-view"
                variants={pageVariants}
                initial="listInitial"
                animate="listAnimate"
                exit="listExit"
                className="flex flex-col w-full h-full"
              >
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="max-w-[1400px] mx-auto w-full px-6 py-8 md:px-12 md:py-12">
                    
                    {/* Editorial Hero Section */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16 border-b border-[#e6e4e1] pb-8">
                      <div className="max-w-2xl">
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className="text-xs font-sans font-bold text-[#a8a49e] uppercase tracking-[0.2em] mb-3 block"
                        >
                          {categoryInfo.subtitle}
                        </motion.span>
                        <motion.h2 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
                          className="text-5xl md:text-7xl font-serif italic-editorial text-[#1a1918] leading-[0.9] tracking-tight"
                        >
                          {categoryInfo.title}
                        </motion.h2>
                      </div>

                      {/* Search Input - Minimalist */}
                      <div className="relative w-full xl:w-96 group">
                         <div className={`absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none transition-colors duration-300 ${searchQuery ? 'text-black' : 'text-[#a8a49e]'}`}>
                            <Search size={20} strokeWidth={1.5} />
                         </div>
                         <input 
                           ref={searchInputRef}
                           type="text"
                           placeholder="Buscar..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-8 pr-8 py-3 bg-transparent border-b border-[#e6e4e1] text-lg font-serif italic text-[#1a1918] focus:outline-none focus:border-black transition-colors placeholder:font-sans placeholder:not-italic"
                         />
                         
                         {/* Shortcut Badge (Shown when empty and not focused) */}
                         {!searchQuery && (
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none transition-opacity duration-300 opacity-100 group-focus-within:opacity-0">
                               <span className="text-[10px] font-sans font-bold text-[#a8a49e] bg-[#f2f0ed] px-1.5 py-0.5 rounded-[4px] border border-[#d1cdc7]/50 tracking-wider">
                                 ⌘K
                               </span>
                            </div>
                         )}

                         {searchQuery && (
                           <button 
                             onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} 
                             className="absolute inset-y-0 right-0 pr-0 flex items-center text-[#1a1918] hover:opacity-50"
                           >
                             <X size={16} />
                           </button>
                         )}
                      </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="min-h-[50vh]">
                      {filteredTemplates.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                            <p className="font-serif italic text-2xl text-[#1a1918] mb-2">Nada encontrado</p>
                            <p className="text-sm font-sans text-[#6e6b66]">Tente refinar sua busca.</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                             {filteredTemplates.map((template, idx) => (
                                <TemplateCard 
                                  key={template.id} 
                                  template={template} 
                                  searchQuery={debouncedSearchQuery}
                                  onClick={() => setSelectedTemplate(template)}
                                  index={idx}
                                />
                             ))}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* --- EDITOR VIEW (Enhanced Transition) --- */
              <motion.div
                key="editor-view"
                variants={pageVariants}
                initial="editorInitial"
                animate="editorAnimate"
                exit="editorExit"
                className="absolute inset-0 z-20 bg-[#fdfcfb] flex flex-col"
              >
                 <Editor template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;