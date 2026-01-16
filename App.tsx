import React, { useState, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { INITIAL_TEMPLATES, CATEGORIES } from './constants';
import { Template } from './types';
import { Menu, Search, ArrowRight, Inbox, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter logic (Robust Search)
  const filteredTemplates = useMemo(() => {
    let filtered = INITIAL_TEMPLATES;
    
    const normalize = (str: string) => 
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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
    ? `Busca`
    : (selectedCategory === 'all' 
      ? 'Visão Geral' 
      : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Módulo');

  return (
    <div className="flex h-screen overflow-hidden text-[#111] font-sans selection:bg-black selection:text-white">
      
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

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-0 lg:p-4 gap-0 lg:gap-4">
        {/* Mobile Header - Glass */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-black active:scale-95 transition-transform">
            <Menu size={24} strokeWidth={1} />
          </button>
          <span className="font-serif italic text-2xl font-medium tracking-tight">QuickComms</span>
          <div className="w-8" />
        </header>

        <div className="flex-1 flex overflow-hidden w-full max-w-[1920px] mx-auto relative lg:rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]">
          
          {/* List Panel - Liquid Glass */}
          <div className={`
            flex-1 flex flex-col min-w-0 lg:max-w-[420px] transition-all duration-500 
            ${selectedTemplate ? 'hidden lg:flex' : 'flex'}
            z-0
            /* Refined Liquid Glass Styles */
            bg-white/40 
            backdrop-blur-3xl 
            backdrop-saturate-150
            border-r border-white/30
            shadow-[10px_0_30px_-5px_rgba(0,0,0,0.02)]
            relative
          `}>
            {/* Header Area */}
            <div className="px-8 pt-10 pb-4 shrink-0 z-10">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-500/90 ml-0.5">
                    {searchQuery ? 'Resultados' : 'Diretório'}
                  </span>
                  <h2 className="text-4xl font-serif italic font-light text-black/90 leading-tight">
                    {currentCategoryName}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
              <div className="flex flex-col pb-4">
                {filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Inbox size={24} strokeWidth={1} className="opacity-60" />
                    </div>
                    <p className="font-serif italic text-lg text-gray-500">Nenhum resultado encontrado.</p>
                  </div>
                ) : (
                  filteredTemplates.map((template, index) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`
                        w-full text-left px-6 py-6 my-1 rounded-xl transition-all duration-300 group relative overflow-hidden
                        ${selectedTemplate?.id === template.id 
                          ? 'bg-white/80 shadow-sm ring-1 ring-black/5' 
                          : 'hover:bg-white/40 hover:shadow-sm'}
                      `}
                    >
                      <div className="flex justify-between items-baseline mb-2">
                        <span className={`
                          text-[10px] font-bold uppercase tracking-[0.15em] font-sans
                          ${selectedTemplate?.id === template.id ? 'text-black' : 'text-gray-400 group-hover:text-black/70'}
                          transition-colors
                        `}>
                           {template.channel === 'EMAIL' ? 'Email' : 'Chat'} — {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                        {selectedTemplate?.id === template.id && (
                           <motion.div layoutId="activeArrow" transition={{ duration: 0.3 }}>
                             <ArrowRight size={14} className="text-black" strokeWidth={1.5} />
                           </motion.div>
                        )}
                      </div>
                      
                      <h3 className={`
                        font-serif text-xl italic leading-tight mb-2.5 transition-colors font-medium
                        ${selectedTemplate?.id === template.id ? 'text-black' : 'text-gray-800 group-hover:text-black'}
                      `}>
                        {template.title}
                      </h3>
                      <p className={`
                        text-sm font-sans leading-relaxed font-light line-clamp-2
                        ${selectedTemplate?.id === template.id ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'}
                      `}>
                        {template.description}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Search Bar - Floating Capsule */}
            <div className="p-6 shrink-0 z-20">
               <div 
                 className={`
                   relative group flex items-center
                   bg-white/60 backdrop-blur-xl
                   border transition-all duration-300 rounded-2xl
                   ${isSearchFocused 
                     ? 'border-black/20 shadow-lg scale-[1.01]' 
                     : 'border-white/40 shadow-sm hover:border-black/10'}
                 `}
               >
                <div className="pl-4 text-gray-400 group-focus-within:text-black transition-colors duration-300">
                  <Search size={18} strokeWidth={1.5} />
                </div>
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquisar modelos..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-4 bg-transparent border-none focus:ring-0 outline-none text-[#111] placeholder:text-gray-400 text-sm font-sans font-normal tracking-wide"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-3 p-1 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-600 transition-colors"
                    >
                      <X size={12} strokeWidth={2} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Editor Panel - Transparent container */}
          <div className={`
            flex-1 h-full relative overflow-hidden
            ${selectedTemplate ? 'block fixed inset-0 z-50 lg:static' : 'hidden lg:block'}
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
                   className="h-full flex flex-col items-center justify-center text-gray-400 select-none pointer-events-none"
                 >
                   <div className="w-px h-24 bg-gradient-to-b from-transparent via-black/10 to-transparent mb-8"></div>
                   <h3 className="text-4xl font-serif italic text-black/20 mb-3 tracking-wide">Editor Studio</h3>
                   <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/30 font-semibold">
                     Selecione um item para começar
                   </p>
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