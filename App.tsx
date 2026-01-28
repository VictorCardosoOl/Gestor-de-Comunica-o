import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Search, X, Loader2, FileText, ChevronRight, Command } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDebounce } from './hooks/useDebounce';
import StaggeredMenu from './components/StaggeredMenu';
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

  useEffect(() => {
    if (selectedTemplate && !isMobile) setIsSidebarPinned(false);
    else if (!selectedTemplate && !isMobile) setIsSidebarPinned(true);
  }, [selectedTemplate, isMobile, setIsSidebarPinned]);

  const menuItems = useMemo(() => CATEGORIES.map(cat => ({ id: cat.id, label: cat.name })), []);
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
        {isMobile && (
          <StaggeredMenu 
            items={menuItems}
            activeId={selectedCategory}
            onSelectItem={(id) => { setSelectedCategory(id); setSearchQuery(''); setSelectedTemplate(null); }}
            socialItems={[{ label: 'Wise System', link: 'https://wisesystem.com.br' }]}
          />
        )}

        {!isMobile && (
          <Sidebar 
            selectedCategory={debouncedSearchQuery ? 'all' : selectedCategory} 
            onSelectCategory={(id) => { setSelectedCategory(id); setSearchQuery(''); setSelectedTemplate(null); }}
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
                bg-white/60 backdrop-blur-xl lg:rounded-2xl overflow-hidden border border-white/40 shadow-sm
              `}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
            >
              <div className="px-6 pt-10 pb-4 shrink-0 z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-editorial-label text-gray-500 pl-0.5">{debouncedSearchQuery ? 'Pesquisa' : 'Categoria'}</span>
                    <motion.h2 layout="position" className="text-editorial-title text-black tracking-tight truncate pr-2">{currentCategoryName}</motion.h2>
                  </div>
              </div>

              {/* Search Bar */}
              <div className="px-6 pb-6 shrink-0 z-30 relative">
                <div className={`relative group flex items-center w-full rounded-xl transition-all duration-300 ease-out border bg-white ${isSearchFocused ? 'border-black/20 shadow-sm ring-2 ring-black/5' : 'border-black/5'}`}>
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
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-6 right-6 top-[calc(100%+4px)] bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
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
                    <div className="flex flex-col gap-2">
                       {filteredTemplates.map((template, index) => (
                          <motion.button
                            key={template.id}
                            layoutId={`card-${template.id}`}
                            onClick={() => setSelectedTemplate(template)}
                            className={`w-full text-left p-5 rounded-xl transition-all duration-200 border ${selectedTemplate?.id === template.id ? 'bg-white border-black/10 shadow-md ring-1 ring-black/5' : 'bg-transparent border-transparent hover:bg-white/50 hover:border-white'}`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${selectedTemplate?.id === template.id ? 'bg-black text-white' : 'bg-black/5 text-gray-500'}`}>
                                   {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
                                </span>
                             </div>
                             <h3 className={`font-serif text-xl italic leading-tight mb-1.5 ${selectedTemplate?.id === template.id ? 'text-black' : 'text-gray-800'}`}>
                                <HighlightedText text={template.title} highlight={debouncedSearchQuery} />
                             </h3>
                             <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                <HighlightedText text={template.description || ''} highlight={debouncedSearchQuery} />
                             </p>
                          </motion.button>
                       ))}
                    </div>
                 )}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key={selectedTemplate.id}
                  className="flex-1 h-full min-w-0 fixed inset-0 z-50 lg:static bg-[#f5f5f7] lg:bg-transparent"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                   <Editor template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
                </motion.div>
              ) : (
                !isMobile && (
                  <div className="hidden lg:flex flex-1 h-full flex-col items-center justify-center text-center opacity-30 select-none">
                    <h3 className="text-8xl font-serif italic mb-4">Studio</h3>
                    <p className="text-sm uppercase tracking-[0.3em]">Selecione um modelo</p>
                  </div>
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