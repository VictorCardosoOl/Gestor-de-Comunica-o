
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Template } from './types';
import { Search, X, Loader2, FileText, ChevronRight, Command } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDebounce } from './hooks/useDebounce';
import { SmoothWrapper } from './components/SmoothWrapper';
import StaggeredMenu from './components/StaggeredMenu';
import { getAccentInsensitiveRegex } from './utils/textUtils';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedSearchQuery; 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); 
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedTemplate && !isMobile) {
      setIsSidebarPinned(false);
    } else if (!selectedTemplate && !isMobile) {
      setIsSidebarPinned(true);
    }
  }, [selectedTemplate, isMobile]);

  const menuItems = useMemo(() => {
    return CATEGORIES.map(cat => ({
      id: cat.id,
      label: cat.name
    }));
  }, []);

  const normalizeText = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const q = normalizeText(searchQuery);

    return INITIAL_TEMPLATES
      .filter(t => normalizeText(t.title).includes(q))
      .slice(0, 5); 
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key === 'k';
      if (isCmdK) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (isSearchFocused && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
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
    : (selectedCategory === 'all' 
      ? 'Visão Geral' 
      : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  const editorPanelVariants = {
    initial: { opacity: 0, x: 20, scale: 0.99 },
    animate: { 
      opacity: 1, x: 0, scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 25, mass: 1 } 
    },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
  };

  const mobileEditorVariants = {
    initial: { y: '100%' },
    animate: { 
      y: 0,
      transition: { type: "spring", damping: 30, stiffness: 300 }
    },
    exit: { 
      y: '100%',
      transition: { type: "spring", damping: 30, stiffness: 300 }
    }
  };

  return (
    <LayoutGroup>
      <div className="flex h-[100dvh] w-full overflow-hidden text-[#111] font-sans bg-transparent relative">
        
        {isMobile && (
          <StaggeredMenu 
            items={menuItems}
            activeId={selectedCategory}
            onSelectItem={(id) => {
              setSelectedCategory(id);
              setSearchQuery('');
              setSelectedTemplate(null);
            }}
            socialItems={[{ label: 'Wise System', link: 'https://wisesystem.com.br' }]}
          />
        )}

        {!isMobile && (
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
            isPinned={isSidebarPinned}
            onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
          />
        )}

        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500">
          
          <header className="lg:hidden flex items-center justify-center px-5 py-4 bg-white/0 sticky top-0 z-30 shrink-0 pointer-events-none">
            <span className="font-serif italic text-xl font-medium tracking-tight text-black backdrop-blur-md bg-white/30 px-4 py-1 rounded-full border border-white/40 shadow-sm">QuickComms</span>
          </header>

          <div className="flex-1 flex overflow-hidden w-full relative lg:p-4 lg:gap-4">
            
            <motion.div 
              layout 
              className={`
                flex flex-col shrink-0 relative z-20 w-full h-full
                ${selectedTemplate ? 'lg:flex-[0_0_20rem] xl:flex-[0_0_24rem] lg:max-w-[25vw]' : 'lg:w-full'}
                bg-gradient-to-b from-white/60 to-white/20 backdrop-blur-3xl
                lg:border border-white/30 lg:shadow-[0_8px_32px_0_rgba(0,0,0,0.01)] lg:rounded-2xl overflow-hidden
              `}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
            >
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              <div className="px-6 pt-10 pb-4 shrink-0 z-10">
                <motion.div
                  layout="position"
                  key={currentCategoryName}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-editorial-label text-gray-400 pl-0.5">
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

              {/* --- SEARCH BAR SECTION --- */}
              <div className="px-6 pb-6 shrink-0 z-30 relative">
                <motion.div 
                  layout
                  animate={{
                    backgroundColor: isSearchFocused ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)",
                    borderColor: isSearchFocused ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.5)",
                    boxShadow: isSearchFocused ? "0 10px 40px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)" : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  className={`
                    relative group flex items-center w-full rounded-2xl transition-all duration-300 ease-out border
                    ${suggestions.length > 0 && isSearchFocused ? 'rounded-b-none border-b-0' : ''}
                  `}
                >
                  <div className={`pl-4 flex items-center justify-center transition-all duration-300 ${isSearchFocused ? 'text-black' : 'text-gray-400'}`}>
                    <AnimatePresence mode="wait">
                      {isSearching ? (
                        <motion.div key="loader" initial={{ opacity: 0, rotate: -90, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.8 }}>
                          <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />
                        </motion.div>
                      ) : (
                         <motion.div key="search-icon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                          <Search size={18} strokeWidth={1.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar modelo..."
                    value={searchQuery}
                    onFocus={() => { setIsSearchFocused(true); setActiveSuggestionIndex(-1); }}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                      w-full pl-3 pr-12 py-3.5 bg-transparent border-none focus:ring-0 outline-none 
                      text-[#1a1a1a] text-base
                      placeholder:font-serif placeholder:italic placeholder:text-gray-400/70 placeholder:text-lg
                      font-sans font-normal tracking-normal
                    "
                  />
                  
                  <div className="absolute right-3 flex items-center gap-2">
                     <AnimatePresence mode="popLayout">
                       {searchQuery ? (
                         <motion.button 
                           key="clear-btn"
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.8 }}
                           onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                           className="p-1 rounded-full bg-black/5 hover:bg-black hover:text-white text-gray-500 transition-colors"
                         >
                           <X size={12} strokeWidth={2} />
                         </motion.button>
                       ) : (
                         !isMobile && !isSearchFocused && (
                           <motion.div 
                            key="shortcut"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="pointer-events-none flex items-center gap-0.5 px-2 py-1 rounded-md bg-white/50 border border-black/5 shadow-sm text-[10px] font-sans font-medium text-gray-400"
                           >
                             <Command size={9} />
                             <span>K</span>
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
                      initial={{ opacity: 0, y: -5, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -5, height: 0, transition: { duration: 0.15 } }}
                      className="absolute left-6 right-6 top-[calc(100%-1px)] bg-white/95 backdrop-blur-2xl border-x border-b border-black/5 shadow-2xl rounded-b-2xl z-40 overflow-hidden"
                    >
                      <div className="flex flex-col py-2">
                        <div className="px-5 py-2 flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase tracking-widest border-b border-black/5 mb-1">
                          <span>Sugestões</span>
                        </div>
                        {suggestions.map((sug, idx) => (
                          <button
                            key={sug.id}
                            className={`
                              relative text-left px-5 py-3 flex items-center justify-between group
                              transition-colors duration-200
                            `}
                            onClick={() => handleSuggestionClick(sug)}
                            onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          >
                             {idx === activeSuggestionIndex && (
                              <motion.div
                                layoutId="suggestion-hover"
                                className="absolute inset-0 bg-black/[0.03]"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            <span className="truncate text-sm font-sans text-gray-700 relative z-10">
                              <HighlightedText text={sug.title} highlight={searchQuery} />
                            </span>
                            {idx === activeSuggestionIndex && (
                              <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative z-10"
                              >
                                <ChevronRight size={14} strokeWidth={1.5} className="text-black/60" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10" ref={listWrapperRef}>
                <SmoothWrapper 
                  className="min-h-full px-4 pb-6" 
                  wrapperRef={listWrapperRef} 
                  contentRef={listContentRef}
                  resetDependency={[selectedCategory, debouncedSearchQuery]} 
                >
                  <div ref={listContentRef} className="flex flex-col gap-2">
                    <LayoutGroup id="template-list">
                      <AnimatePresence mode="popLayout">
                      {filteredTemplates.length === 0 ? (
                        <motion.div 
                          key="no-results" 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="flex flex-col items-center justify-center py-20 text-center px-8"
                        >
                          <div className="w-20 h-20 rounded-full bg-white/60 border border-white shadow-lg flex items-center justify-center mb-6">
                            <Search size={32} strokeWidth={0.5} className="text-gray-300" />
                          </div>
                          <p className="font-serif italic text-3xl text-black/80 mb-3">Sem resultados</p>
                          <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed font-light mb-8">
                            Não encontramos nenhum modelo para <br/> "<span className="text-black font-medium">{debouncedSearchQuery}</span>".
                          </p>
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                             className="px-8 py-3 bg-black text-white rounded-full text-xs font-semibold tracking-widest uppercase shadow-xl hover:shadow-2xl hover:bg-gray-900 transition-all duration-300"
                           >
                             Limpar Busca
                           </motion.button>
                        </motion.div>
                      ) : (
                        filteredTemplates.map((template, index) => {
                          const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const q = normalize(debouncedSearchQuery);
                          const isDeepMatch = debouncedSearchQuery && !normalize(template.title).includes(q) && !normalize(template.description || '').includes(q);

                          return (
                          <motion.button
                            key={template.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.9)' }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ delay: index * 0.03, type: "spring", stiffness: 200, damping: 25 }}
                            onClick={() => setSelectedTemplate(template)}
                            className={`
                              w-full text-left p-6 rounded-2xl transition-all duration-300 group relative
                              ${selectedTemplate?.id === template.id ? 'bg-white shadow-xl ring-1 ring-black/5 scale-[1.01]' : 'bg-white/0 border border-transparent hover:border-white/50 hover:shadow-sm'}
                            `}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className={`text-[9px] font-sans tracking-[0.15em] uppercase px-2.5 py-1 rounded-md border transition-colors duration-300 ${selectedTemplate?.id === template.id ? 'bg-black text-white border-black' : 'bg-white/60 text-gray-400 border-black/5 group-hover:border-black/10 group-hover:text-black'}`}>
                                 {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
                              </span>
                              {selectedTemplate?.id === template.id && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-black mt-1" />}
                            </div>
                            
                            <h3 className={`font-serif text-2xl italic leading-none mb-2 transition-colors ${selectedTemplate?.id === template.id ? 'text-black font-normal' : 'text-gray-900 font-light group-hover:text-black'}`}>
                              <HighlightedText text={template.title} highlight={debouncedSearchQuery} />
                            </h3>
                            <p className={`text-[11px] font-sans leading-relaxed line-clamp-2 tracking-wide font-light ${selectedTemplate?.id === template.id ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                              <HighlightedText text={template.description || ''} highlight={debouncedSearchQuery} />
                            </p>

                            {isDeepMatch && (
                              <div className="mt-3 flex items-center gap-1.5 opacity-60">
                                <FileText size={10} strokeWidth={1} className="text-gray-400" />
                                <span className="text-[9px] text-gray-400 tracking-wide">Encontrado no conteúdo</span>
                              </div>
                            )}
                          </motion.button>
                        );
                        })
                      )}
                      </AnimatePresence>
                    </LayoutGroup>
                  </div>
                </SmoothWrapper>
              </div>
              
              <div className="px-6 py-4 border-t border-white/10 bg-white/10 backdrop-blur-md flex justify-between items-center z-10 rounded-b-2xl">
                 <span className="text-editorial-label text-gray-400 text-[9px]">
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? 'item' : 'itens'}
                 </span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key={selectedTemplate.id}
                  className="flex-1 h-full min-w-0 fixed inset-0 z-50 lg:static bg-[#f5f5f7] lg:bg-transparent lg:rounded-2xl lg:border border-white/0"
                  variants={isMobile ? mobileEditorVariants : editorPanelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                   <Editor template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
                </motion.div>
              ) : (
                !isMobile && (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="hidden lg:flex flex-1 h-full flex-col items-center justify-center text-gray-300 select-none pointer-events-none p-4 text-center"
                  >
                    <h3 className="text-6xl font-serif italic text-black/5 mb-4 tracking-tight">Studio</h3>
                    <p className="text-editorial-label text-black/20 tracking-[0.2em]">Selecione um modelo</p>
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
