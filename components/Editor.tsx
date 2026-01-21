import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Template, CommunicationChannel } from '../types';
import { Copy, RefreshCw, Check, MoveLeft, SlidersHorizontal, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplateCopier } from '../hooks/useTemplateCopier';
import { useStore } from '../store/useStore';
import { useDebounce } from '../hooks/useDebounce';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

// Physics configuration for "Heavy Glass" feel
const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: springTransition
  }
};

interface Scenario {
  title: string;
  text: string;
}

export const Editor: React.FC<EditorProps> = ({ template, onClose }) => {
  const { updateTemplate, resetTemplate } = useStore();

  const [subject, setSubject] = useState(template.subject || '');
  const [content, setContent] = useState(template.content);
  const [secondaryContent, setSecondaryContent] = useState(template.secondaryContent || '');
  
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [showVariables, setShowVariables] = useState(true);

  // Debounce values to avoid updating global store/storage on every keystroke
  const debouncedSubject = useDebounce(subject, 500);
  const debouncedContent = useDebounce(content, 500);
  const debouncedSecondaryContent = useDebounce(secondaryContent, 500);

  // Sync edits to Store (Persist)
  useEffect(() => {
    updateTemplate(template.id, {
      subject: debouncedSubject,
      content: debouncedContent,
      secondaryContent: debouncedSecondaryContent
    });
  }, [debouncedSubject, debouncedContent, debouncedSecondaryContent, template.id, updateTemplate]);

  // Use Custom Hook for Copy Logic
  const { copyToClipboard, isCopied } = useTemplateCopier();

  // Refs for auto-resizing textareas
  const mainTextareaRef = useRef<HTMLTextAreaElement>(null);
  const secondaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- SCENARIO LOGIC ---
  const isScenarioMode = useMemo(() => template.content.includes('[CENÁRIO:'), [template]);

  // --- HELPER FUNCTIONS ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getFormattedToday = () => {
    const date = new Date();
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const getFormattedNextBusinessDay = () => {
    const date = new Date();
    const currentDay = date.getDay();
    let daysToAdd = 1;
    if (currentDay === 5) daysToAdd = 3;
    else if (currentDay === 6) daysToAdd = 2;
    date.setDate(date.getDate() + daysToAdd);
    const str = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const processTemplate = useCallback((rawContent: string) => {
    if (!rawContent) return '';
    let processed = rawContent;
    if (processed.includes('[Saudação]')) processed = processed.replace(/\[Saudação\]/g, getGreeting());
    if (processed.includes('[Data Hoje]')) processed = processed.replace(/\[Data Hoje\]/g, getFormattedToday());
    if (processed.includes('[Data Extenso]')) processed = processed.replace(/\[Data Extenso\]/g, getFormattedNextBusinessDay());
    return processed;
  }, []);

  // Initialization
  useEffect(() => {
    setSubject(template.subject || '');
    // Note: We apply processTemplate (variable replacement) on mount. 
    // If the template was already edited and persisted, it keeps the edits.
    // If it's a fresh load, it might re-apply time-based variables.
    // To be safe, we only apply if the text hasn't been personalized yet, but here we'll just load what's in the store (passed via props).
    // However, to ensure [Saudação] is always fresh if it still exists:
    setContent(processTemplate(template.content)); 
    setSecondaryContent(processTemplate(template.secondaryContent || ''));
    setVariableValues({});
  }, [template.id, processTemplate]); // Depend only on ID to avoid re-resetting on every prop change

  // Auto-resize textareas when content changes
  const adjustTextareaHeight = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      adjustTextareaHeight(mainTextareaRef.current);
      adjustTextareaHeight(secondaryTextareaRef.current);
    }, 10);
    return () => clearTimeout(timer);
  }, [content, secondaryContent, isScenarioMode, template.id]);

  // Recalculate scenarios
  const scenarios: Scenario[] = useMemo(() => {
    if (!isScenarioMode) return [];
    const rawSegments = content.split('[').filter(s => s.trim().length > 0);
    return rawSegments.map(seg => {
      if (!seg.startsWith('CENÁRIO:')) return null;
      const closingBracketIndex = seg.indexOf(']');
      if (closingBracketIndex === -1) return null;
      const title = seg.substring(8, closingBracketIndex).trim(); 
      const text = seg.substring(closingBracketIndex + 1).trim();
      return { title, text };
    }).filter((item): item is Scenario => item !== null);
  }, [content, isScenarioMode]);

  // Sync Logic (Filtered to ignore Scenarios)
  const placeholders = useMemo(() => {
    const regex = /\[(.*?)\]/g;
    const allText = `${subject || ''} ${content} ${secondaryContent || ''} ${template.tertiaryContent || ''}`;
    const found = allText.match(regex);
    if (!found) return [];
    const unique = Array.from(new Set(found));
    return unique.filter(p => 
      !p.includes('Saudação') && 
      !p.includes('Data Hoje') && 
      !p.includes('Data Extenso') &&
      !p.includes('CENÁRIO')
    );
  }, [subject, content, secondaryContent, template.tertiaryContent]);

  const handleVariableChange = (placeholder: string, inputValue: string) => {
    const oldValue = variableValues[placeholder] || placeholder;
    const newValue = inputValue === '' ? placeholder : inputValue;
    setVariableValues(prev => ({ ...prev, [placeholder]: newValue }));
    
    const replaceInText = (text: string) => text.split(oldValue).join(newValue);
    setSubject(prev => replaceInText(prev));
    setContent(prev => replaceInText(prev));
    setSecondaryContent(prev => replaceInText(prev));
  };

  const handleReset = () => {
    if (window.confirm('Restaurar modelo original? Todas as edições salvas serão perdidas.')) {
      resetTemplate(template.id);
      // Local state update will happen via useEffect dependent on template.id re-render, 
      // but to be instant we might need to wait for store prop update.
      // Ideally, the parent passes the new reset template prop, triggering the useEffect above.
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-full flex flex-col bg-transparent overflow-y-auto custom-scrollbar relative lg:rounded-3xl"
    >
      {/* Editorial Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between px-6 md:px-12 py-6 md:py-8 shrink-0 gap-6 border-b border-white/30 relative z-20 bg-gradient-to-b from-white/70 via-white/50 to-white/20 backdrop-blur-2xl">
        <div className="flex items-start md:items-center space-x-4 md:space-x-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="lg:hidden group flex items-center gap-2 text-black hover:opacity-50 transition-opacity mt-1 md:mt-0"
          >
            <MoveLeft size={24} strokeWidth={0.75} />
          </motion.button>
          
          <div className="flex flex-col gap-2 min-w-0">
             <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-black/80 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></span>
               <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-black/60">
                  {template.channel === CommunicationChannel.EMAIL ? 'Email Template' : 'Message'}
               </span>
             </div>
             <motion.h1 
               layoutId={`title-${template.id}`}
               className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-black leading-[0.9] drop-shadow-sm font-light tracking-tight break-words hyphens-auto pr-2"
             >
               {template.title}
             </motion.h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3 self-start md:self-auto pt-2 xl:pt-0">
          {placeholders.length > 0 && (
             <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              onClick={() => setShowVariables(!showVariables)}
              className={`p-2.5 md:p-3 rounded-full transition-colors duration-300 backdrop-blur-sm border border-transparent ${showVariables ? 'bg-white/70 text-black shadow-md border-white/40' : 'text-gray-500 hover:text-black hover:bg-white/40'}`}
              title="Alternar Variáveis"
            >
              <SlidersHorizontal size={18} strokeWidth={0.75} />
            </motion.button>
          )}
          <motion.button 
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={handleReset}
            className="text-gray-500 hover:text-black transition-colors p-2.5 md:p-3 hover:bg-white/40 rounded-full"
            title="Restaurar Original"
          >
            <RefreshCw size={18} strokeWidth={0.75} />
          </motion.button>
        </div>
      </div>

       <AnimatePresence initial={false}>
        {placeholders.length > 0 && showVariables && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/30 backdrop-blur-2xl border-b border-white/30 shrink-0 relative z-20 overflow-hidden shadow-sm origin-top"
          >
            <div className="px-6 md:px-12 py-8 md:py-10">
              <div className="flex items-center gap-2 mb-6 md:mb-8 text-black/70">
                <SlidersHorizontal size={14} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-sans">Preenchimento Automático</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-8 md:gap-y-10">
                {placeholders.map((placeholder) => (
                  <div key={placeholder} className="relative group">
                    <input 
                      type="text" 
                      id={placeholder}
                      className="peer w-full bg-transparent border-b border-black/10 focus:border-black/80 text-base md:text-lg py-2 transition-all outline-none font-serif italic text-black placeholder-transparent"
                      placeholder={placeholder}
                      value={variableValues[placeholder] === placeholder ? '' : variableValues[placeholder]} 
                      onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                    />
                    <label 
                      htmlFor={placeholder}
                      className="absolute left-0 -top-4 text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400/70 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-black cursor-text"
                    >
                      {placeholder.replace('[', '').replace(']', '')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 px-4 lg:px-12 py-6 md:py-12">
        <motion.div 
          className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-12 pb-24 md:pb-20"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* --- SCENARIO LIST MODE --- */}
          {isScenarioMode ? (
             <div className="grid grid-cols-1 gap-6">
                {scenarios.map((scene, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    className="
                      relative p-6 md:p-8
                      bg-gradient-to-br from-white/70 via-white/50 to-white/30
                      backdrop-blur-3xl border border-white/50 
                      shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]
                      rounded-2xl
                      flex flex-col gap-4
                    "
                  >
                    <div className="flex justify-between items-center border-b border-black/5 pb-3">
                       <div className="flex items-center gap-2">
                         <Quote size={14} className="text-black/40" />
                         <h3 className="text-xs font-bold uppercase tracking-widest text-black/70">
                           {scene.title}
                         </h3>
                       </div>
                       <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(scene.text, `scenario-${idx}`)}
                          className={`
                            px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all
                            ${isCopied(`scenario-${idx}`)
                              ? 'bg-black text-white border-black' 
                              : 'bg-white/50 text-gray-600 border-gray-300 hover:border-black hover:text-black'}
                          `}
                       >
                         {isCopied(`scenario-${idx}`) ? 'Copiado' : 'Copiar'}
                       </motion.button>
                    </div>
                    <div className="font-sans text-base leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
                      {scene.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          ) : (
            /* --- STANDARD EDITOR MODE --- */
            <>
              <motion.div 
                variants={itemVariants}
                className="
                relative min-h-[250px] md:min-h-[450px] 
                p-6 md:p-14
                bg-gradient-to-br from-white/70 via-white/50 to-white/30
                backdrop-blur-3xl
                border border-white/50 
                shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]
                rounded-2xl md:rounded-3xl
                "
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply rounded-2xl md:rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                
                {template.channel === CommunicationChannel.EMAIL && (
                  <div className="mb-6 md:mb-10 relative z-10 group">
                    <div className="flex flex-wrap justify-between items-end mb-2 md:mb-3 border-b border-black/5 pb-2 gap-2">
                      <label className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400">Assunto</label>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(subject, 'subject')}
                        className={`flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] hover:underline transition-colors font-sans ${isCopied('subject') ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                      >
                        {isCopied('subject') ? <><Check size={12} strokeWidth={1.5} /><span>Copiado</span></> : <><Copy size={12} strokeWidth={1.5} /><span>Copiar Assunto</span></>}
                      </motion.button>
                    </div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full py-2 bg-transparent border-none focus:ring-0 outline-none text-black font-serif italic text-xl md:text-3xl placeholder:text-gray-400/30 font-light"
                      placeholder="Insira o assunto..."
                    />
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                  <textarea
                    ref={mainTextareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ fontFamily: 'Calibri, "Segoe UI", Carlito, sans-serif', fontSize: '12pt', lineHeight: '1.7', color: '#1a1a1a' }}
                    className="w-full h-full min-h-[400px] md:min-h-[500px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30 overflow-hidden"
                    placeholder="Digite o conteúdo principal..."
                    spellCheck={false}
                    onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                  />
                </div>
              </motion.div>

              {secondaryContent !== '' && (
                <motion.div 
                  variants={itemVariants}
                  className="
                  relative min-h-[200px] md:min-h-[300px] 
                  p-6 md:p-14
                  bg-gradient-to-br from-white/70 via-white/50 to-white/30
                  backdrop-blur-3xl
                  border border-white/50 
                  shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]
                  rounded-2xl md:rounded-3xl
                ">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply rounded-2xl md:rounded-3xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                  <div className="mb-6 md:mb-10 relative z-10">
                    <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                      <div className="w-1.5 h-1.5 bg-black/60 rotate-45"></div>
                      <label className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-500">
                        {template.secondaryLabel || 'Conteúdo Adicional'}
                      </label>
                    </div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col">
                    <textarea
                      ref={secondaryTextareaRef}
                      value={secondaryContent}
                      onChange={(e) => setSecondaryContent(e.target.value)}
                      style={{ fontFamily: 'Calibri, "Segoe UI", Carlito, sans-serif', fontSize: '12pt', lineHeight: '1.7', color: '#1a1a1a' }}
                      className="w-full h-full min-h-[150px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30 overflow-hidden"
                      placeholder="Digite o conteúdo secundário..."
                      spellCheck={false}
                      onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                    />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {!isScenarioMode && (
        <div className="sticky bottom-0 z-30 px-6 md:px-12 py-6 md:py-8 bg-gradient-to-t from-white/70 via-white/50 to-white/30 backdrop-blur-2xl flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 md:gap-4 border-t border-white/30">
          {template.secondaryContent && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard(secondaryContent, 'secondary')}
              className={`
                group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 transition-colors duration-300 rounded-full
                ${isCopied('secondary')
                  ? 'bg-black/90 text-white border-black/90 shadow-inner' 
                  : 'bg-transparent text-gray-700 border-gray-300 hover:border-black/50 hover:text-black hover:bg-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]'}
                border backdrop-blur-sm
              `}
            >
              {isCopied('secondary') ? <Check size={16} strokeWidth={0.75} /> : <Copy size={16} strokeWidth={0.75} />}
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap font-sans">
                {isCopied('secondary') ? 'Copiado' : `Copiar ${template.secondaryLabel ? 'Protocolo' : 'Secundário'}`}
              </span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => copyToClipboard(content, 'main')}
            className={`
              group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3.5 md:py-4 transition-colors duration-300 rounded-full
              ${isCopied('main') 
                ? 'bg-black text-white shadow-inner' 
                : 'bg-white/80 text-black hover:bg-black hover:text-white border-white/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]'}
              border shadow-sm
            `}
          >
            {isCopied('main') ? <Check size={16} strokeWidth={0.75} /> : <Copy size={16} strokeWidth={0.75} />}
            <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap font-sans">
              {isCopied('main') ? 'Copiado' : `Copiar ${template.secondaryContent ? 'Email' : 'Texto'}`}
            </span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};