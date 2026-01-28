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

interface TemplateCardProps {
  template: any;
  searchQuery: string;
  onClick: () => void;
}

// Helper Component for consistency in Grid and Grouped views
const TemplateCard: React.FC<TemplateCardProps> = ({ template, searchQuery, onClick }) => (
  <motion.button
    layoutId={`card-${template.id}`}
    onClick={onClick}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    className="group relative flex flex-col items-start text-left w-full h-full p-6 rounded-xl bg-white border border-gray-200/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:border-black/10 hover:-translate-y-1 overflow-hidden"
  >
    {/* Hover Arrow Action */}
    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
       <div className="bg-black text-white rounded-full p-1.5 shadow-md">
         <ChevronRight size={14} strokeWidth={2} />
       </div>
    </div>

    <div className="flex w-full justify-between items-start mb-5">
        <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
          template.channel === 'EMAIL' ? 'bg-blue-50/50 text-blue-600 border-blue-100' : 
          (template.channel === 'PROMPT' ? 'bg-purple-50/50 text-purple-600 border-purple-100' : 'bg-emerald-50/50 text-emerald-600 border-emerald-100')
        }`}>
          {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
        </span>
    </div>
    
    <h3 className="font-serif text-2xl italic leading-none mb-3 text-gray-900 group-hover:text-black transition-colors pr-6">
        <HighlightedText text={template.title} highlight={searchQuery} />
    </h3>
    
    <p className="text-xs font-sans text-gray-500 line-clamp-3 leading-relaxed mt-auto">
        <HighlightedText text={template.description || ''} highlight={searchQuery} />
    </p>
  </motion.button>
);

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

          <div className="flex-1 flex overflow-hidden w-full relative">
            <AnimatePresence mode="wait">
              {/* LIST VIEW */}
              {!selectedTemplate ? (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col w-full h-full"
                >
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-10">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                      
                      {/* Header Section */}
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-editorial-label text-gray-400 pl-0.5 uppercase tracking-widest">{debouncedSearchQuery ? 'Pesquisa' : 'Categoria'}</span>
                          <motion.h2 layout="position" className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-black tracking-tight leading-[0.9]">{currentCategoryName}</motion.h2>
                        </div>

                        {/* Search Bar - Full Width & Clean */}
                        <div className={`relative group flex items-center w-full rounded-xl transition-all duration-300 ease-out border bg-white ${isSearchFocused ? 'border-black/20 shadow-lg ring-2 ring-black/5' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}>
                          <div className="pl-4 text-gray-400"><Search size={20} /></div>
                          <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar modelo por título, conteúdo ou tag..."
                            value={searchQuery}
                            onFocus={() => { setIsSearchFocused(true); setActiveSuggestionIndex(-1); }}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-12 py-4 bg-transparent border-none focus:ring-0 outline-none text-gray-800 text-base font-sans placeholder:text-gray-300"
                          />
                          <div className="absolute right-4">
                            {searchQuery ? (
                                <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="p-1 rounded-full bg-black/5 hover:bg-black hover:text-white text-gray-500 transition-colors"><X size={14} /></button>
                              ) : (!isMobile && !isSearchFocused && (
                                  <div className="pointer-events-none flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-black/5 text-[10px] font-sans font-medium text-gray-400"><Command size={10} /><span>K</span></div>
                              ))}
                          </div>
                          
                          {/* Search Suggestions Dropdown */}
                          <AnimatePresence>
                            {isSearchFocused && suggestions.length > 0 && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-100 shadow-2xl rounded-xl z-50 overflow-hidden">
                                  {suggestions.map((sug, idx) => (
                                    <button key={sug.id} onClick={() => handleSuggestionClick(sug)} className="w-full text-left px-5 py-4 hover:bg-gray-50 flex items-center justify-between text-sm text-gray-700 border-b border-gray-50 last:border-0">
                                      <HighlightedText text={sug.title} highlight={searchQuery} />
                                    </button>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="min-h-[50vh]">
                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                              <p className="font-serif italic text-3xl text-gray-300 mb-2">Sem resultados</p>
                              <p className="text-sm text-gray-400">Não encontramos nada para "{searchQuery}"</p>
                            </div>
                        ) : (
                            // Conditional Layout: Grouped vs Grid
                            (selectedCategory === 'all' && !debouncedSearchQuery) ? (
                                <div className="space-y-16 pb-12">
                                  {CATEGORIES.map(category => {
                                    const categoryTemplates = filteredTemplates.filter(t => t.category === category.id);
                                    if (categoryTemplates.length === 0) return null;
                                    
                                    return (
                                      <motion.div 
                                        key={category.id} 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        className="space-y-6"
                                      >
                                          <div className="flex items-center gap-4">
                                            <h3 className="text-2xl font-serif italic text-black">{category.name}</h3>
                                            <div className="h-px bg-gray-200 flex-1"></div>
                                            <span className="text-[10px] font-sans font-medium text-gray-400 uppercase tracking-widest">{categoryTemplates.length} Modelos</span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {categoryTemplates.map(template => (
                                                <TemplateCard 
                                                  key={template.id} 
                                                  template={template} 
                                                  searchQuery={debouncedSearchQuery}
                                                  onClick={() => setSelectedTemplate(template)}
                                                />
                                            ))}
                                          </div>
                                      </motion.div>
                                    )
                                  })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-12">
                                  {filteredTemplates.map((template) => (
                                      <TemplateCard 
                                        key={template.id} 
                                        template={template} 
                                        searchQuery={debouncedSearchQuery}
                                        onClick={() => setSelectedTemplate(template)}
                                      />
                                  ))}
                                </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* EDITOR VIEW */
                <motion.div
                  key="editor-view"
                  className="flex-1 h-full min-w-0 w-full relative bg-transparent p-0 lg:p-4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
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