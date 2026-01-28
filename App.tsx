import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Search, X, Loader2, FileText, ChevronRight, Command, Menu } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDebounce } from './hooks/useDebounce';
import { getAccentInsensitiveRegex } from './utils/textUtils';
import { useAppContext } from './contexts/AppContext';

const HighlightedText = React.memo(({ text, highlight, className }: { text: string, highlight: string, className?: string }) => {
  if (!highlight.trim()) return <span className={className}>{text}</span>;
  const regex = useMemo(() => getAccentInsensitiveRegex(highlight.trim()), [highlight]);
  const parts = text.split(regex);
  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200/50 text-black font-medium rounded-[1px] px-0.5 box-decoration-clone">
            {part}
          </span>
        ) : part
      )}
    </span>
  );
});

const App: React.FC = () => {
  const {
    selectedCategory, setSelectedCategory,
    selectedTemplate, setSelectedTemplate,
    searchQuery, setSearchQuery,
    isSidebarOpen, setIsSidebarOpen,
    isSidebarPinned, setIsSidebarPinned
  } = useAppContext();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedSearchQuery; 
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
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

  // Handle Sidebar Pin logic based on screen size (simplified for new layout)
  useEffect(() => {
    if (!isMobile) setIsSidebarPinned(true);
  }, [isMobile, setIsSidebarPinned]);

  const normalizeText = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = normalizeText(searchQuery);
    return INITIAL_TEMPLATES.filter(t => normalizeText(t.title).includes(q)).slice(0, 5); 
  }, [searchQuery]);

  const handleSuggestionClick = (template: any) => {
    setSelectedTemplate(template);
    setSearchQuery(template.title); 
    setIsSearchFocused(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.blur();
  };

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

  const currentCategoryName = debouncedSearchQuery 
    ? `Resultados`
    : (selectedCategory === 'all' ? 'Visão Geral' : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  return (
    <LayoutGroup>
      <div className="flex h-[100dvh] w-full overflow-hidden text-[#111] font-sans bg-transparent relative">
        
        {/* Unified Sidebar for Desktop and Mobile */}
        <Sidebar 
          selectedCategory={debouncedSearchQuery ? 'all' : selectedCategory} 
          onSelectCategory={(id) => { setSelectedCategory(id); setSearchQuery(''); setSelectedTemplate(null); }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
          isPinned={isSidebarPinned}
          onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500">
          <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white/0 sticky top-0 z-30 shrink-0 pointer-events-none">
            <div className="pointer-events-auto">
               <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-white/40 backdrop-blur-md border border-white/40 rounded-full shadow-sm text-black"
                aria-label="Abrir Menu"
               >
                 <Menu size={20} strokeWidth={1.5} />
               </button>
            </div>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedTemplate(null);
              }}
              className="font-serif italic text-xl font-medium tracking-tight text-black backdrop-blur-md bg-white/30 px-4 py-1 rounded-full border border-white/40 shadow-sm pointer-events-auto hover:bg-white/50 transition-colors"
            >
              QuickComms
            </button>
            <div className="w-10"></div> {/* Spacer for center alignment */}
          </header>

          <div className="flex-1 flex overflow-hidden w-full relative lg:p-4">
            <AnimatePresence mode="wait">
              {/* LIST VIEW */}
              {!selectedTemplate ? (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="flex flex-col w-full h-full max-w-5xl mx-auto bg-white/60 backdrop-blur-xl lg:rounded-2xl overflow-hidden border border-white/40 shadow-sm"
                >
                  <div className="px-6 pt-10 pb-4 shrink-0 z-10">
                      <div className="flex flex-col gap-2">
                        <span className="text-editorial-label text-gray-500 pl-0.5">{debouncedSearchQuery ? 'Pesquisa' : 'Categoria'}</span>
                        <motion.h2 layout="position" className="text-editorial-title text-black tracking-tight truncate pr-2">{currentCategoryName}</motion.h2>
                      </div>
                  </div>

                  {/* Search Bar */}
                  <div className="px-6 pb-6 shrink-0 z-30 relative">
                    <div className={`relative group flex items-center w-full max-w-2xl rounded-xl transition-all duration-300 ease-out border bg-white ${isSearchFocused ? 'border-black/20 shadow-sm ring-2 ring-black/5' : 'border-black/5'}`}>
                      <div className="pl-4 text-gray-400"><Search size={18} /></div>
                      <input 
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar modelo..."
                        value={searchQuery}
                        onFocus={() => { setIsSearchFocused(true); setActiveSuggestionIndex(-1); }}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-12 py-3 bg-transparent border-none focus:ring-0 outline-none text-[#1a1a1a] text-sm font-sans"
                      />
                      <div className="absolute right-3">
                        {searchQuery ? (
                            <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="p-1 rounded-full bg-black/5 hover:bg-black hover:text-white text-gray-500 transition-colors"><X size={12} /></button>
                          ) : (!isMobile && !isSearchFocused && (
                              <div className="pointer-events-none flex items-center gap-0.5 px-2 py-1 rounded-md bg-gray-100 border border-black/5 text-[10px] font-sans font-medium text-gray-400"><Command size={9} /><span>K</span></div>
                          ))}
                      </div>
                    </div>
                    <AnimatePresence>
                      {isSearchFocused && suggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-6 right-6 max-w-2xl top-[calc(100%+4px)] bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
                            {suggestions.map((sug, idx) => (
                              <button key={sug.id} onClick={() => handleSuggestionClick(sug)} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between text-sm text-gray-700">
                                <HighlightedText text={sug.title} highlight={searchQuery} />
                              </button>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Native Scroll List (Performance Optimized) */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-4 pb-6">
                    {filteredTemplates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                          <p className="font-serif italic text-2xl text-black/40 mb-2">Sem resultados</p>
                          <p className="text-xs text-gray-500">Tente buscar por outro termo.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {filteredTemplates.map((template, index) => (
                              <motion.button
                                key={template.id}
                                layoutId={`card-${template.id}`}
                                onClick={() => setSelectedTemplate(template)}
                                className="w-full h-full flex flex-col items-start text-left p-6 rounded-xl transition-all duration-300 border bg-transparent border-transparent hover:bg-white hover:shadow-md hover:border-black/5 group"
                              >
                                <div className="flex w-full justify-between items-start mb-3">
                                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/5 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors`}>
                                      {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl italic leading-tight mb-2 text-gray-800 group-hover:text-black">
                                    <HighlightedText text={template.title} highlight={debouncedSearchQuery} />
                                </h3>
                                <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed mt-auto">
                                    <HighlightedText text={template.description || ''} highlight={debouncedSearchQuery} />
                                </p>
                              </motion.button>
                          ))}
                        </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* EDITOR VIEW */
                <motion.div
                  key="editor-view"
                  className="flex-1 h-full min-w-0 w-full relative bg-transparent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                >
                   <Editor template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </LayoutGroup>
  );
};

export default App;