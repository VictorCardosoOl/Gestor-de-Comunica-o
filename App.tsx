import React, { useState, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Template } from './types';
import { Menu, Search, ArrowRight, Inbox, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search Logic
  const filteredTemplates = useMemo(() => {
    // Safety check if INITIAL_TEMPLATES is undefined/empty
    let filtered = INITIAL_TEMPLATES || [];
    
    // Normalize string to ignore accents and case
    const normalize = (str: string) => 
      str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

    const query = normalize(searchQuery.trim());

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
  }, [selectedCategory, searchQuery]);

  const currentCategoryName = searchQuery 
    ? `Resultados`
    : (selectedCategory === 'all' 
      ? 'Visão Geral' 
      : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  return (
    // Main Container
    <div className="flex h-screen w-full overflow-hidden text-[#111] font-sans bg-[#f2f2f4]">
      
      <Sidebar 
        selectedCategory={searchQuery ? 'all' : selectedCategory} 
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          setSearchQuery(''); 
          setSelectedTemplate(null);
        }}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-black active:scale-95 transition-transform">
            <Menu size={24} strokeWidth={1} />
          </button>
          <span className="font-serif italic text-xl font-medium tracking-tight text-black">QuickComms</span>
          <div className="w-8" />
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 flex overflow-hidden w-full relative lg:p-4 lg:gap-4">
          
          {/* List Panel */}
          <div className={`
            flex flex-col shrink-0 relative z-20 transition-all duration-500
            
            /* Responsive Visibility Logic */
            ${selectedTemplate ? 'hidden lg:flex' : 'flex w-full'}
            
            /* Desktop Width */
            lg:w-[360px] xl:w-[420px] 2xl:w-[480px]
            
            /* Styles */
            bg-gradient-to-b from-white/80 via-white/50 to-white/30
            backdrop-blur-2xl
            lg:border border-white/40
            lg:shadow-sm
            lg:rounded-3xl
          `}>
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Header Title */}
            <div className="px-6 pt-8 pb-4 shrink-0 z-10">
              <motion.div
                key={currentCategoryName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gray-500 pl-1">
                    {searchQuery ? 'Pesquisa' : 'Categoria'}
                  </span>
                  <h2 className="text-4xl font-serif italic font-light text-black tracking-tight truncate pr-2">
                    {currentCategoryName}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-4 shrink-0 z-20">
              <div 
                className={`
                  relative group flex items-center w-full rounded-xl transition-all duration-300
                  ${isSearchFocused 
                    ? 'bg-white shadow-sm ring-1 ring-black/5' 
                    : 'bg-white/40 border border-white/40 hover:bg-white/60'}
                `}
              >
                <div className={`pl-3.5 transition-colors duration-300 ${isSearchFocused ? 'text-black' : 'text-gray-400'}`}>
                  <Search size={16} strokeWidth={1.5} />
                </div>
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar modelos..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 bg-transparent border-none focus:ring-0 outline-none text-[#111] placeholder:text-gray-500/60 text-sm font-sans"
                />
                <div className="absolute right-3 flex items-center gap-2">
                   {searchQuery && (
                     <button 
                       onClick={() => {
                         setSearchQuery('');
                         searchInputRef.current?.focus();
                       }}
                       className="p-1 rounded-full bg-gray-200/50 hover:bg-gray-300 text-gray-600 transition-colors"
                     >
                       <X size={12} strokeWidth={2} />
                     </button>
                   )}
                </div>
              </div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6 z-10">
              <div className="flex flex-col gap-2">
                {filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/60 to-white/20 border border-white/50 flex items-center justify-center mb-4 backdrop-blur-sm shadow-sm">
                      <Search size={24} strokeWidth={1} className="text-black/30" />
                    </div>
                    <p className="font-serif italic text-xl text-black/60 mb-2">Nada encontrado</p>
                    <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                      Não encontramos modelos para "{searchQuery}". Tente outra palavra-chave.
                    </p>
                  </div>
                ) : (
                  filteredTemplates.map((template, index) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`
                        w-full text-left p-4 rounded-xl transition-all duration-200 group relative
                        ${selectedTemplate?.id === template.id 
                          ? 'bg-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)] border border-white/60 ring-1 ring-black/5' 
                          : 'hover:bg-white/40 border border-transparent hover:border-white/30'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`
                          text-[9px] font-bold uppercase tracking-[0.1em] font-sans px-2 py-0.5 rounded-md border
                          ${selectedTemplate?.id === template.id 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white/50 text-gray-500 border-gray-100 group-hover:border-gray-300'}
                          transition-colors duration-200
                        `}>
                           {template.channel === 'EMAIL' ? 'Email' : (template.channel === 'PROMPT' ? 'Prompt' : 'Chat')}
                        </span>
                        {selectedTemplate?.id === template.id && (
                           <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                      
                      <h3 className={`
                        font-serif text-xl italic leading-tight mb-1 transition-colors
                        ${selectedTemplate?.id === template.id ? 'text-black' : 'text-gray-800 group-hover:text-black'}
                      `}>
                        {template.title}
                      </h3>
                      <p className={`
                        text-[11px] font-sans leading-relaxed line-clamp-2
                        ${selectedTemplate?.id === template.id ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}>
                        {template.description}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
            
            {/* Status Footer */}
            <div className="px-6 py-3 border-t border-white/20 bg-white/10 backdrop-blur-md flex justify-between items-center z-10">
               <span className="text-[10px] text-gray-400 font-medium">
                  {filteredTemplates.length} {filteredTemplates.length === 1 ? 'modelo' : 'modelos'}
               </span>
               {searchQuery && (
                 <span className="text-[10px] text-gray-400 italic">
                   filtrado
                 </span>
               )}
            </div>

          </div>

          {/* Editor Panel */}
          <div className={`
            flex-1 h-full relative overflow-hidden min-w-0
            /* Mobile: Fixed overlay if selected */
            ${selectedTemplate ? 'block fixed inset-0 z-50 lg:static' : 'hidden lg:block'}
            bg-[#f2f2f4] lg:bg-transparent
            lg:rounded-3xl
            lg:border border-white/0
            transition-all duration-300
          `}>
             <AnimatePresence mode="wait">
               {selectedTemplate ? (
                 <Editor 
                   key={selectedTemplate.id}
                   template={selectedTemplate} 
                   onClose={() => setSelectedTemplate(null)} 
                 />
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full flex flex-col items-center justify-center text-gray-300 select-none pointer-events-none p-4 text-center"
                 >
                   <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-black/5 to-transparent mb-6"></div>
                   <h3 className="text-4xl md:text-5xl font-serif italic text-black/10 mb-3 tracking-wide">Studio</h3>
                   <div className="flex items-center gap-3">
                     <span className="h-px w-8 bg-black/5"></span>
                     <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-black/30 font-medium">
                       Selecione um modelo
                     </p>
                     <span className="h-px w-8 bg-black/5"></span>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;