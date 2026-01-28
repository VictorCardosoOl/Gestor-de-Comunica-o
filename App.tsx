import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Search, X, ChevronRight, Menu } from 'lucide-react';
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
          <span key={i} className="bg-yellow-100 text-black font-medium px-0.5 rounded-[1px]">
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

const TemplateCard: React.FC<TemplateCardProps> = ({ template, searchQuery, onClick }) => (
  <div
    onClick={onClick}
    className="group flex flex-col items-start text-left w-full h-full p-5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md cursor-pointer"
  >
    <div className="flex w-full justify-between items-start mb-3">
        <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
          template.channel === 'EMAIL' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
          (template.channel === 'PROMPT' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100')
        }`}>
          {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
        </span>
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight group-hover:text-black">
        <HighlightedText text={template.title} highlight={searchQuery} />
    </h3>
    
    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-auto">
        <HighlightedText text={template.description || ''} highlight={searchQuery} />
    </p>
  </div>
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
    if (!isMobile) setIsSidebarPinned(true);
  }, [isMobile, setIsSidebarPinned]);

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

  const currentCategoryName = debouncedSearchQuery 
    ? `Resultados`
    : (selectedCategory === 'all' ? 'Visão Geral' : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  return (
    <LayoutGroup>
      <div className="flex h-[100dvh] w-full overflow-hidden text-gray-900 font-sans bg-gray-50 relative">
        
        <Sidebar 
          selectedCategory={debouncedSearchQuery ? 'all' : selectedCategory} 
          onSelectCategory={(id) => { setSelectedCategory(id); setSearchQuery(''); setSelectedTemplate(null); }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
          isPinned={isSidebarPinned}
          onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shrink-0">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 active:bg-gray-100 rounded-md"
             >
               <Menu size={20} />
             </button>
            <span className="font-semibold text-gray-900">QuickComms</span>
            <div className="w-8"></div>
          </header>

          <div className="flex-1 flex overflow-hidden w-full relative">
            <AnimatePresence mode="wait" initial={false}>
              {/* LIST VIEW */}
              {!selectedTemplate ? (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col w-full h-full bg-gray-50/50"
                >
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto w-full px-6 py-8 md:px-10">
                      
                      {/* Header Section */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                            {debouncedSearchQuery ? 'Pesquisa' : 'Módulo'}
                          </span>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            {currentCategoryName}
                          </h2>
                        </div>

                        {/* Fast Search Bar */}
                        <div className="relative w-full md:w-80 lg:w-96">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={16} />
                          </div>
                          <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-shadow shadow-sm"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} 
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div>
                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-white border border-gray-200 border-dashed">
                              <p className="font-medium text-gray-900 mb-1">Sem resultados</p>
                              <p className="text-sm text-gray-500">Tente buscar por outro termo.</p>
                            </div>
                        ) : (
                            // Simplified Grid Layout
                            <div className="space-y-12">
                                {(selectedCategory === 'all' && !debouncedSearchQuery) ? (
                                   CATEGORIES.map(category => {
                                      const categoryTemplates = filteredTemplates.filter(t => t.category === category.id);
                                      if (categoryTemplates.length === 0) return null;
                                      
                                      return (
                                        <div key={category.id}>
                                            <div className="flex items-center gap-3 mb-4">
                                              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                                              <div className="h-px bg-gray-200 flex-1"></div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                              {categoryTemplates.map(template => (
                                                  <TemplateCard 
                                                    key={template.id} 
                                                    template={template} 
                                                    searchQuery={debouncedSearchQuery}
                                                    onClick={() => setSelectedTemplate(template)}
                                                  />
                                              ))}
                                            </div>
                                        </div>
                                      )
                                   })
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {filteredTemplates.map((template) => (
                                          <TemplateCard 
                                            key={template.id} 
                                            template={template} 
                                            searchQuery={debouncedSearchQuery}
                                            onClick={() => setSelectedTemplate(template)}
                                          />
                                      ))}
                                    </div>
                                )}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* EDITOR VIEW */
                <motion.div
                  key="editor-view"
                  className="flex-1 h-full w-full bg-white relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
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
