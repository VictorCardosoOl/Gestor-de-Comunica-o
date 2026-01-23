
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Template } from './types';
import { Menu, Search, X, Loader2, Command, FileText, ChevronRight, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDebounce } from './hooks/useDebounce';
import { SmoothWrapper } from './components/SmoothWrapper';

// --- HELPER: ACCENT INSENSITIVE HIGHLIGHT ---
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getAccentInsensitiveRegex = (text: string) => {
   // Mapping for common pt-BR accents to regex groups
   const accMap: Record<string, string> = {
     'a': '[aàáâãäå]', 'e': '[eèéêë]', 'i': '[iìíîï]', 'o': '[oòóôõöø]', 'u': '[uùúûü]', 'c': '[cç]', 'n': '[nñ]'
   };
   
   const escaped = escapeRegExp(text);
   const pattern = escaped.split('').map((char) => {
      const lower = char.toLowerCase();
      return accMap[lower] || char;
   }).join('');
   
   return new RegExp(`(${pattern})`, 'gi');
};

const HighlightedText = ({ text, highlight, className }: { text: string, highlight: string, className?: string }) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = getAccentInsensitiveRegex(highlight.trim());
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200/80 text-black font-semibold rounded-[2px] px-0.5 box-decoration-clone shadow-sm">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce for the MAIN list filtering (heavy operation)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedSearchQuery; 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Suggestion state
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  // REFS PARA O SCROLL DO LENIS
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); 
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- AUTOCOMPLETE SUGGESTIONS LOGIC ---
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const normalize = (str: string) => 
      str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    
    const q = normalize(searchQuery);

    // Filter mainly by Title for suggestions
    return INITIAL_TEMPLATES
      .filter(t => normalize(t.title).includes(q))
      .slice(0, 5); // Limit to top 5
  }, [searchQuery]);

  // Keyboard Navigation for Suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Dropdown Navigation
      if (isSearchFocused && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
          e.preventDefault();
          const selected = suggestions[activeSuggestionIndex];
          handleSuggestionClick(selected);
        }
      }

      if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
           searchInputRef.current?.blur();
           setIsSearchFocused(false);
        } else if (selectedTemplate) {
           setSelectedTemplate(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTemplate, isSearchFocused, suggestions, activeSuggestionIndex]);

  const handleSuggestionClick = (template: Template) => {
    setSelectedTemplate(template);
    setSearchQuery(template.title); // Optional: fill bar
    setIsSearchFocused(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.blur();
  };

  // --- MAIN LIST FILTERING LOGIC ---
  const filteredTemplates = useMemo(() => {
    let filtered = INITIAL_TEMPLATES || [];
    
    const normalize = (str: string) => 
      str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

    const query = normalize(debouncedSearchQuery.trim());

    if (query) {
       filtered = filtered.filter(t => {
         const title = normalize(t.title);
         const description = normalize(t.description || '');
         const content = normalize(t.content);
         const subject = normalize(t.subject || '');
         const secondary = normalize(t.secondaryContent || '');
         
         return title.includes(query) || 
                description.includes(query) ||
                content.includes(query) ||
                subject.includes(query) ||
                secondary.includes(query);
       });
    } else {
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(t => t.category === selectedCategory);
      }
    }

    return filtered;
  }, [selectedCategory, debouncedSearchQuery]);

  const currentCategoryName = debouncedSearchQuery 
    ? `Resultados`
    : (selectedCategory === 'all' 
      ? 'Visão Geral' 
      : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  const editorPanelVariants = {
    initial: { opacity: 0, x: 40, scale: 0.98 },
    animate: { 
      opacity: 1, x: 0, scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 30, mass: 1 }
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const mobileEditorVariants = {
    initial: { y: '100%' },
    animate: { 
      y: 0,
      transition: { type: "spring", damping: 35, stiffness: 250 }
    },
    exit: { 
      y: '100%',
      transition: { type: "spring", damping: 35, stiffness: 250 }
    }
  };

  return (
    <LayoutGroup>
      <div className="flex h-[100dvh] w-full overflow-hidden text-[#111] font-sans bg-transparent">
        
        <Sidebar 
          selectedCategory={debouncedSearchQuery ? 'all' : selectedCategory} 
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setSearchQuery(''); 
            setSelectedTemplate(null);
          }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500">
          
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30 shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 text-black active:scale-95 transition-transform rounded-full hover:bg-black/5"
            >
              <Menu size={20} strokeWidth={0.75} />
            </button>
            <span className="font-serif italic text-xl font-medium tracking-tight text-black">QuickComms</span>
            <div className="w-8" />
          </header>

          {/* Content Wrapper */}
          <div className="flex-1 flex overflow-hidden w-full relative lg:p-4 lg:gap-4">
            
            {/* List Panel */}
            <motion.div 
              layout 
              className={`
                flex flex-col shrink-0 relative z-20 
                w-full h-full
                ${selectedTemplate 
                  ? 'lg:flex-[0_0_24rem] xl:flex-[0_0_28rem] lg:max-w-[30vw]' 
                  : 'lg:w-full'}
                
                /* LIQUID GLASS REFINEMENT */
                bg-gradient-to-b from-white/40 to-white/5
                backdrop-blur-3xl
                lg:border border-white/20
                lg:shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]
                lg:rounded-3xl
                overflow-hidden
              `}
              transition={{ type: "spring", stiffness: 200, damping: 30, mass: 1.2 }}
            >
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              {/* Header Title */}
              <div className="px-6 pt-8 pb-4 shrink-0 z-10">
                <motion.div
                  layout="position"
                  key={currentCategoryName}
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-editorial-label text-gray-500 pl-1">
                      {debouncedSearchQuery ? 'Pesquisa' : 'Categoria'}
                    </span>
                    <motion.h2 
                      layout="position" 
                      className="text-editorial-title text-black tracking-tight truncate pr-2"
                    >
                      {currentCategoryName}
                    </motion.h2>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Search Bar */}
              <div className="px-6 pb-6 shrink-0 z-30 relative">
                <motion.div 
                  layout
                  className={`
                    relative group flex items-center w-full rounded-2xl transition-all duration-300 ease-out
                    ${isSearchFocused 
                      ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/10 scale-[1.01]' 
                      : 'bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/60 hover:border-white/50 shadow-sm'}
                    /* Rounded corners fix for dropdown */
                    ${suggestions.length > 0 && isSearchFocused ? 'rounded-b-none' : ''}
                  `}
                >
                  <div className={`pl-4 transition-colors duration-300 ${isSearchFocused ? 'text-black' : 'text-gray-400'}`}>
                    {isSearching ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Search size={16} strokeWidth={0.75} />
                    )}
                  </div>
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar (⌘K)"
                    value={searchQuery}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setActiveSuggestionIndex(-1);
                    }}
                    onBlur={() => {
                      // Small timeout to allow click on dropdown items to register
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-10 py-3.5 bg-transparent border-none focus:ring-0 outline-none text-[#111] placeholder:text-gray-500/50 text-sm font-sans tracking-wide"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                     <AnimatePresence>
                       {searchQuery ? (
                         <motion.button 
                           initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                           animate={{ opacity: 1, scale: 1, rotate: 0 }}
                           exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => {
                             setSearchQuery('');
                             searchInputRef.current?.focus();
                           }}
                           className="p-1.5 rounded-full bg-black/5 hover:bg-black hover:text-white text-gray-500 transition-colors"
                         >
                           <X size={10} strokeWidth={1.5} />
                         </motion.button>
                       ) : (
                         !isMobile && !isSearchFocused && (
                           <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="pointer-events-none px-1.5 py-0.5 rounded border border-black/5 bg-black/5 text-[10px] font-sans text-black/30 font-medium"
                           >
                             ⌘K
                           </motion.div>
                         )
                       )}
                     </AnimatePresence>
                  </div>
                </motion.div>

                {/* --- AUTOCOMPLETE DROPDOWN --- */}
                <AnimatePresence>
                  {isSearchFocused && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute left-6 right-6 top-[calc(100%-24px)] pt-3 pb-2 bg-white/95 backdrop-blur-xl border-x border-b border-white/50 shadow-2xl rounded-b-2xl z-40 overflow-hidden origin-top"
                    >
                      <div className="flex flex-col">
                        <div className="px-4 py-1.5 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          <span>Sugestões</span>
                          <span className="flex items-center gap-1">
                            Use <CornerDownLeft size={10} /> para selecionar
                          </span>
                        </div>
                        {suggestions.map((sug, idx) => (
                          <button
                            key={sug.id}
                            className={`
                              text-left px-4 py-2.5 flex items-center justify-between group
                              transition-colors duration-200
                              ${idx === activeSuggestionIndex ? 'bg-black/5 text-black' : 'hover:bg-black/5 text-gray-700'}
                            `}
                            onClick={() => handleSuggestionClick(sug)}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          >
                            <span className="truncate text-sm font-sans">
                              <HighlightedText text={sug.title} highlight={searchQuery} />
                            </span>
                            {idx === activeSuggestionIndex && (
                              <ChevronRight size={14} className="text-black/40" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Template List */}
              <div 
                className="flex-1 overflow-y-auto custom-scrollbar relative z-10" 
                ref={listWrapperRef}
              >
                <SmoothWrapper 
                  className="min-h-full px-3 pb-6" 
                  wrapperRef={listWrapperRef} 
                  contentRef={listContentRef}
                  resetDependency={[selectedCategory, debouncedSearchQuery]} 
                >
                  <div 
                    ref={listContentRef}
                    className="flex flex-col gap-2.5"
                  >
                    <LayoutGroup id="template-list">
                      <AnimatePresence mode="popLayout">
                      {filteredTemplates.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-20 text-center px-6"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/80 to-white/20 border border-white/50 flex items-center justify-center mb-6 shadow-lg shadow-black/5 backdrop-blur-md">
                            <Search size={24} strokeWidth={0.5} className="text-black/40" />
                          </div>
                          <p className="font-serif italic text-2xl text-black/80 mb-2">Sem resultados</p>
                          <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed font-light mb-6">
                            Não encontramos nenhum modelo correspondente a "{debouncedSearchQuery}".
                          </p>
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => {
                               setSearchQuery('');
                               searchInputRef.current?.focus();
                             }}
                             className="px-6 py-2.5 bg-white/60 border border-white/40 rounded-full text-editorial-label text-black/80 hover:text-black hover:bg-white hover:shadow-md transition-all duration-300"
                           >
                             Limpar Busca
                           </motion.button>
                        </motion.div>
                      ) : (
                        filteredTemplates.map((template, index) => {
                          const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const q = normalize(debouncedSearchQuery);
                          const titleMatch = normalize(template.title).includes(q);
                          const descMatch = normalize(template.description || '').includes(q);
                          const isDeepMatch = debouncedSearchQuery && !titleMatch && !descMatch;

                          return (
                          <motion.button
                            layout="position"
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.6)' }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ 
                              delay: index * 0.03, 
                              type: "spring", stiffness: 100, damping: 20 
                            }}
                            onClick={() => setSelectedTemplate(template)}
                            className={`
                              w-full text-left p-5 rounded-2xl transition-all duration-300 group relative
                              ${selectedTemplate?.id === template.id 
                                ? 'bg-white shadow-[0_8px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60' 
                                : 'border border-transparent hover:border-white/30'}
                            `}
                          >
                            <div className="flex justify-between items-start mb-2.5">
                              <div className="flex flex-wrap gap-1.5">
                                <span className={`
                                  text-editorial-label px-2 py-0.5 rounded border text-[9px] tracking-[0.1em]
                                  ${selectedTemplate?.id === template.id 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white/30 text-gray-400 border-white/20 group-hover:border-black/10 group-hover:text-gray-600'}
                                  transition-colors duration-300
                                `}>
                                   {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
                                </span>
                                {template.secondaryContent && (
                                  <span className="text-editorial-label px-2 py-0.5 rounded border border-white/20 bg-blue-50/50 text-blue-800/70 text-[9px] tracking-[0.1em]">
                                    + Protocolo
                                  </span>
                                )}
                              </div>
                              {selectedTemplate?.id === template.id && (
                                 <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-black mt-1" />
                              )}
                            </div>
                            
                            <h3 className={`
                              font-serif text-xl italic leading-none mb-2 transition-colors
                              ${selectedTemplate?.id === template.id ? 'text-black font-medium' : 'text-gray-800 font-light group-hover:text-black'}
                            `}>
                              <HighlightedText text={template.title} highlight={debouncedSearchQuery} />
                            </h3>
                            <p className={`
                              text-[11px] font-sans leading-relaxed line-clamp-2 tracking-wide
                              ${selectedTemplate?.id === template.id ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-500'}
                            `}>
                              <HighlightedText text={template.description || ''} highlight={debouncedSearchQuery} />
                            </p>

                            {isDeepMatch && (
                              <div className="mt-2 flex items-center gap-1.5">
                                <FileText size={10} className="text-gray-400" />
                                <span className="text-[9px] text-gray-400 font-medium bg-white/40 px-1.5 rounded-sm">
                                  Encontrado no conteúdo
                                </span>
                              </div>
                            )}
                          </motion.button>
                        );
                        })}
                      )}
                      </AnimatePresence>
                    </LayoutGroup>
                  </div>
                </SmoothWrapper>
              </div>
              
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10 rounded-b-3xl">
                 <span className="text-editorial-label text-gray-400">
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? 'item' : 'itens'}
                 </span>
                 {debouncedSearchQuery && (
                   <span className="text-[10px] text-gray-400 italic">
                     filtrado
                   </span>
                 )}
              </div>

            </motion.div>

            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key="editor-panel"
                  className={`
                    flex-1 h-full min-w-0
                    fixed inset-0 z-50 lg:static 
                    bg-[#f5f5f7] lg:bg-transparent
                    lg:rounded-3xl lg:border border-white/0
                  `}
                  variants={isMobile ? mobileEditorVariants : editorPanelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                   <Editor 
                     key={selectedTemplate.id}
                     template={selectedTemplate} 
                     onClose={() => setSelectedTemplate(null)} 
                   />
                </motion.div>
              ) : (
                !isMobile && (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="hidden lg:flex flex-1 h-full flex-col items-center justify-center text-gray-300 select-none pointer-events-none p-4 text-center"
                  >
                    <div className="w-px h-24 bg-gradient-to-b from-transparent via-black/5 to-transparent mb-8"></div>
                    <h3 className="text-5xl font-serif italic text-black/5 mb-4 tracking-wide mix-blend-multiply">Studio</h3>
                    <div className="flex items-center gap-4 opacity-50">
                      <span className="h-px w-8 bg-black/10"></span>
                      <p className="text-editorial-label text-black/30">
                        Selecione um modelo
                      </p>
                      <span className="h-px w-8 bg-black/10"></span>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </LayoutGroup>
  );
};

export default App;
