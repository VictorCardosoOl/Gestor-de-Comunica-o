
import React, { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { Template, CommunicationChannel } from '../types';
import { Copy, RefreshCw, Check, MoveLeft, Sparkles, SlidersHorizontal, Loader2, Quote, X, Calendar, Clock, AlignLeft } from 'lucide-react';
import { refineText } from '../services/geminiService';
import { useTemplateCopier } from '../hooks/useTemplateCopier';
import { MagneticButton } from './MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getInputType, 
  formatValueForText, 
  processStaticTags, 
  calculateDuration, 
  generateOSFromDate 
} from '../utils/textUtils';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

interface Scenario {
  title: string;
  text: string;
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 }
};

const contentOrchestratorVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
};

export const Editor: React.FC<EditorProps> = ({ template, onClose }) => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [secondaryContent, setSecondaryContent] = useState<string>('');
  
  // Originals for reset
  const [rawContent, setRawContent] = useState<string>('');
  const [rawSecondaryContent, setRawSecondaryContent] = useState<string>('');
  
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [showVariables, setShowVariables] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  
  const { copyToClipboard, isCopied } = useTemplateCopier();
  const mainTextareaRef = useRef<HTMLTextAreaElement>(null);
  const secondaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isScenarioMode = useMemo(() => template.content.includes('[CENÁRIO:'), [template.content]);

  // Extract placeholders once
  const placeholders = useMemo(() => {
    const allText = `${template.subject || ''} ${template.content} ${template.secondaryContent || ''}`;
    const found = allText.match(/\[(.*?)\]/g);
    if (!found) return [];
    
    // Filter out static system tags
    const systemTags = ['[Saudação]', '[Data Hoje]', '[Data Extenso]', '[CENÁRIO:'];
    const unique = Array.from(new Set(found));
    return unique.filter(p => !systemTags.some(tag => p.includes(tag.replace('[', '').replace(']', ''))));
  }, [template]);

  // Initialize State
  useEffect(() => {
    const processedSubject = processStaticTags(template.subject || '');
    const processedContent = processStaticTags(template.content);
    const processedSecondary = processStaticTags(template.secondaryContent || '');

    setSubject(processedSubject);
    setContent(processedContent);
    setSecondaryContent(processedSecondary);
    setRawContent(processedContent);
    setRawSecondaryContent(processedSecondary);
    setVariableValues({});
    
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [template]);

  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    const adjustAll = () => {
      adjustTextareaHeight(mainTextareaRef.current);
      adjustTextareaHeight(secondaryTextareaRef.current);
    };
    adjustAll();
    // Debounce adjustment for layout shifts
    const timer = setTimeout(adjustAll, 100);
    return () => clearTimeout(timer);
  }, [content, secondaryContent, isScenarioMode, template.id, adjustTextareaHeight]);

  const updateContentWithVariables = (baseText: string, values: Record<string, string>) => {
    let result = baseText;
    placeholders.forEach(ph => {
      const type = getInputType(ph);
      const rawVal = values[ph];
      if (rawVal) {
        result = result.split(ph).join(formatValueForText(rawVal, type));
      }
    });
    return result;
  };

  const handleVariableChange = (placeholder: string, inputValue: string) => {
    const newValues = { ...variableValues, [placeholder]: inputValue };

    // Smart logic for duration and OS number
    if (placeholder === '[Horário Início]' || placeholder === '[Horário Fim]') {
      const start = newValues['[Horário Início]'];
      const end = newValues['[Horário Fim]'];
      if (start && end) {
        newValues['[Duração]'] = calculateDuration(start, end);
      }
    } else if (placeholder === '[Data]') {
      newValues['[Número OS]'] = generateOSFromDate(inputValue);
    }

    setVariableValues(newValues);
    setContent(updateContentWithVariables(rawContent, newValues));
    setSecondaryContent(updateContentWithVariables(rawSecondaryContent, newValues));
    setSubject(updateContentWithVariables(template.subject || '', newValues)); 
  };

  const handleReset = () => {
    if (!window.confirm('Restaurar texto original?')) return;
    
    const pContent = processStaticTags(template.content);
    const pSecondary = processStaticTags(template.secondaryContent || '');
    
    setContent(pContent);
    setRawContent(pContent);
    setSecondaryContent(pSecondary);
    setRawSecondaryContent(pSecondary);
    setSubject(processStaticTags(template.subject || ''));
    setVariableValues({});
  };
  
  const handleAiRefine = async () => {
    if (!content || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineText(content, `Canal: ${template.channel}. Objetivo: Melhorar clareza, correção gramatical e tom profissional. Mantenha estritamente as variáveis e a formatação (negrito, links).`);
      setContent(refined);
      setRawContent(refined); // Update raw to allow variable re-injection on refined text
    } catch {
      alert('Serviço indisponível.');
    } finally {
      setIsRefining(false);
    }
  };

  const scenarios: Scenario[] = useMemo(() => {
    if (!isScenarioMode) return [];
    return content.split('[').reduce<Scenario[]>((acc, seg) => {
      if (seg.startsWith('CENÁRIO:')) {
        const endBracket = seg.indexOf(']');
        if (endBracket !== -1) {
          acc.push({
            title: seg.substring(8, endBracket).trim(),
            text: seg.substring(endBracket + 1).trim()
          });
        }
      }
      return acc;
    }, []);
  }, [content, isScenarioMode]);

  const ChannelLabel = () => {
    const labels: Record<string, string> = {
      [CommunicationChannel.EMAIL]: 'Email',
      [CommunicationChannel.WHATSAPP]: 'Chat',
      [CommunicationChannel.PROMPT]: 'Prompt'
    };
    return <span className="text-editorial-label text-black/40">{labels[template.channel] || 'Chat'}</span>;
  };

  return (
    <motion.div 
      ref={containerRef}
      variants={containerVariants}
      className="h-full flex flex-col bg-transparent relative lg:rounded-2xl overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-none flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/20 relative z-20 bg-gradient-to-b from-white/60 via-white/40 to-white/10 backdrop-blur-2xl shrink-0"
        style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}
      >
        <div className="flex items-start md:items-center space-x-4 md:space-x-6">
          <button 
            onClick={onClose}
            className="lg:hidden group flex items-center gap-2 text-black hover:opacity-50 transition-opacity mt-1 md:mt-0"
          >
            <MoveLeft size={20} strokeWidth={0.75} />
          </button>
          
          <div className="flex flex-col gap-2 min-w-0">
             <div className="flex items-center gap-2.5">
               <span className="w-1 h-1 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></span>
               <ChannelLabel />
             </div>
             <h1 className="text-editorial-title text-black leading-none drop-shadow-sm break-words hyphens-auto pr-2">
               {template.title}
             </h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3 self-start md:self-auto pt-2 xl:pt-0">
          {!isScenarioMode && (
            <MagneticButton
              onClick={handleAiRefine}
              className={`
                flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-colors duration-300
                ${isRefining 
                  ? 'bg-white/50 text-black/40 cursor-wait' 
                  : 'bg-white/30 hover:bg-white/60 border border-white/30 shadow-sm hover:shadow-md text-gray-800'}
              `}
            >
              {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} strokeWidth={0.75} className="text-gray-600" />}
              <span className="text-editorial-label font-sans">
                {isRefining ? 'Processando' : 'Otimizar'}
              </span>
            </MagneticButton>
          )}
          <div className="hidden sm:block w-px h-6 bg-black/5 mx-1"></div>
          {placeholders.length > 0 && (
             <MagneticButton 
              onClick={() => setShowVariables(!showVariables)}
              className={`p-2.5 md:p-3 rounded-full transition-colors duration-300 backdrop-blur-sm border border-transparent ${showVariables ? 'bg-white/60 text-black shadow-md border-white/30' : 'text-gray-500 hover:text-black hover:bg-white/30'}`}
              title="Alternar Variáveis"
            >
              <SlidersHorizontal size={16} strokeWidth={0.75} />
            </MagneticButton>
          )}
          <MagneticButton 
            onClick={handleReset}
            className="text-gray-500 hover:text-black transition-colors p-2.5 md:p-3 hover:bg-white/30 rounded-full"
            title="Resetar"
          >
            <RefreshCw size={16} strokeWidth={0.75} />
          </MagneticButton>
          <MagneticButton
            onClick={onClose}
            className="hidden lg:flex p-2.5 md:p-3 rounded-full text-gray-400 hover:text-black hover:bg-white/30 transition-colors"
            title="Fechar"
          >
            <X size={18} strokeWidth={0.75} />
          </MagneticButton>
        </div>
      </motion.div>

       <div 
         ref={scrollContainerRef}
         className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0 overscroll-contain"
       >
         <div className="pb-8">
             <motion.div
               variants={contentOrchestratorVariants}
               initial="initial"
               animate="animate"
               className="flex flex-col"
             >
               <AnimatePresence>
               {placeholders.length > 0 && showVariables && (
                  <motion.div 
                    key="variables-panel"
                    variants={itemVariants}
                    className="bg-white/20 backdrop-blur-xl border-b border-white/20 shrink-0 relative z-20 overflow-hidden shadow-sm"
                  >
                    <div className="px-6 md:px-12 py-8 md:py-10">
                      <div className="flex items-center gap-2 mb-6 md:mb-8 text-black/60">
                        <Sparkles size={10} strokeWidth={1} />
                        <span className="text-editorial-label font-sans">Preenchimento Automático</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-8 md:gap-y-10">
                        {placeholders.map((placeholder) => {
                          const inputType = getInputType(placeholder);
                          return (
                            <div key={placeholder} className={`relative group ${inputType === 'textarea' ? 'col-span-1 sm:col-span-2' : ''}`}>
                              <div className="relative">
                                {inputType === 'textarea' ? (
                                  <textarea
                                    id={placeholder}
                                    className="peer w-full bg-transparent border-b border-black/10 focus:border-black/50 text-base md:text-lg py-2 transition-all outline-none font-serif italic text-black/80 placeholder-transparent min-h-[3rem] resize-y"
                                    placeholder={placeholder}
                                    value={variableValues[placeholder] || ''}
                                    onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                                    rows={1}
                                  />
                                ) : (
                                  <input 
                                    type={inputType}
                                    id={placeholder}
                                    className={`
                                      peer w-full bg-transparent border-b border-black/10 focus:border-black/50 
                                      text-base md:text-lg py-2 transition-all outline-none 
                                      font-serif italic text-black/80 placeholder-transparent
                                      ${inputType === 'date' || inputType === 'time' ? 'pr-8' : ''}
                                    `}
                                    placeholder={placeholder}
                                    value={variableValues[placeholder] || ''} 
                                    onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                                  />
                                )}
                                
                                {inputType === 'date' && <Calendar size={12} className="absolute right-0 top-3 text-gray-400 pointer-events-none" />}
                                {inputType === 'time' && <Clock size={12} className="absolute right-0 top-3 text-gray-400 pointer-events-none" />}
                                {inputType === 'textarea' && <AlignLeft size={12} className="absolute right-0 top-3 text-gray-400 pointer-events-none" />}
                              </div>
                              <label 
                                htmlFor={placeholder}
                                className="absolute left-0 -top-4 text-editorial-label text-gray-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400/50 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-black cursor-text"
                              >
                                {placeholder.replace(/[\[\]]/g, '')}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>

              <div className="w-full" style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
                <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-12 pb-12">
                  {isScenarioMode ? (
                    <div className="grid grid-cols-1 gap-6">
                        {scenarios.map((scene, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05), duration: 0.3 }}
                            className="relative p-6 md:p-8 bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-3xl border border-white/40 shadow-sm rounded-xl flex flex-col gap-4"
                          >
                            <div className="flex justify-between items-center border-b border-black/5 pb-3">
                              <div className="flex items-center gap-2">
                                <Quote size={10} className="text-black/30" />
                                <h3 className="text-editorial-label text-black/60">{scene.title}</h3>
                              </div>
                              <MagneticButton onClick={() => copyToClipboard(scene.text, `scenario-${idx}`)} className={`px-4 py-1.5 rounded-full text-editorial-label border transition-all ${isCopied(`scenario-${idx}`) ? 'bg-black text-white border-black' : 'bg-white/40 text-gray-600 border-gray-300 hover:border-black hover:text-black'}`}>
                                {isCopied(`scenario-${idx}`) ? 'Copiado' : 'Copiar'}
                              </MagneticButton>
                            </div>
                            <div className="font-sans text-editorial-body text-[#1a1a1a] whitespace-pre-wrap">
                              {scene.text}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <>
                      <motion.div 
                        variants={itemVariants}
                        className="relative flex flex-col w-full min-h-[30vh] p-6 md:p-14 bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-3xl border border-white/40 shadow-sm rounded-xl md:rounded-2xl"
                      >
                        
                        {template.channel === CommunicationChannel.EMAIL && (
                          <div className="mb-6 md:mb-10 relative z-10 group shrink-0">
                            <div className="flex flex-wrap justify-between items-end mb-2 md:mb-3 border-b border-black/5 pb-2 gap-2">
                              <label className="text-editorial-label text-gray-400">Assunto</label>
                              <MagneticButton onClick={() => copyToClipboard(subject, 'subject')} className={`flex items-center gap-1.5 text-editorial-label hover:underline transition-colors font-sans ${isCopied('subject') ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
                                {isCopied('subject') ? <><Check size={10} strokeWidth={1} /><span>Copiado</span></> : <><Copy size={10} strokeWidth={1} /><span>Copiar Assunto</span></>}
                              </MagneticButton>
                            </div>
                            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full py-2 bg-transparent border-none focus:ring-0 outline-none text-black font-serif italic text-2xl md:text-3xl placeholder:text-gray-400/30 font-light tracking-wide" placeholder="Insira o assunto..." />
                          </div>
                        )}

                        <div className="relative z-10 flex flex-col w-full">
                          <textarea
                            ref={mainTextareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ color: '#1a1a1a' }}
                            className="w-full min-h-[200px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30 overflow-hidden text-editorial-body placeholder:italic text-lg"
                            placeholder="Digite o conteúdo principal..."
                            spellCheck={false}
                            onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                          />
                        </div>
                      </motion.div>

                      {secondaryContent !== '' && (
                        <motion.div 
                          variants={itemVariants}
                          className="relative flex flex-col w-full min-h-[15rem] p-6 md:p-14 bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-3xl border border-white/40 shadow-sm rounded-xl md:rounded-2xl"
                        >
                          <div className="mb-6 md:mb-10 relative z-10 shrink-0">
                            <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                              <div className="w-1 h-1 bg-black/40 rotate-45"></div>
                              <label className="text-editorial-label text-gray-500">{template.secondaryLabel || 'Conteúdo Adicional'}</label>
                            </div>
                          </div>
                          <div className="relative z-10 flex flex-col w-full">
                            <textarea
                              ref={secondaryTextareaRef}
                              value={secondaryContent}
                              onChange={(e) => setSecondaryContent(e.target.value)}
                              style={{ color: '#1a1a1a' }}
                              className="w-full min-h-[150px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30 overflow-hidden text-editorial-body placeholder:italic text-lg"
                              placeholder="Digite o conteúdo secundário..."
                              spellCheck={false}
                              onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
       </div>

      {!isScenarioMode && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex-none bg-gradient-to-t from-white/80 via-white/60 to-white/30 backdrop-blur-xl flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 md:gap-4 border-t border-white/30 z-30" style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}
        >
          {template.secondaryContent && (
            <MagneticButton onClick={() => copyToClipboard(secondaryContent, 'secondary')} className={`group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 transition-all duration-300 rounded-full border ${isCopied('secondary') ? 'bg-black text-white border-black shadow-lg' : 'bg-white/40 text-gray-600 border-white/50 hover:border-white/80 hover:text-black hover:shadow-md'}`}>
              <div className="relative z-10 flex items-center gap-2">
                {isCopied('secondary') ? <Check size={12} strokeWidth={1} /> : <Copy size={12} strokeWidth={1} />}
                <span className="text-editorial-label whitespace-nowrap font-sans">{isCopied('secondary') ? 'Copiado' : `Copiar ${template.secondaryLabel ? 'Protocolo' : 'Secundário'}`}</span>
              </div>
            </MagneticButton>
          )}
          <MagneticButton onClick={() => copyToClipboard(content, 'main')} className={`group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3.5 md:py-4 transition-all duration-300 rounded-full border ${isCopied('main') ? 'bg-black text-white border-black shadow-lg' : 'bg-white/70 text-black border-white/50 hover:bg-white hover:border-white shadow-sm hover:shadow-lg'}`}>
             <div className="absolute inset-0 bg-white/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center gap-2">
               {isCopied('main') ? <Check size={12} strokeWidth={1} /> : <Copy size={12} strokeWidth={1} />}
               <span className="text-editorial-label whitespace-nowrap font-sans">{isCopied('main') ? 'Copiado' : `Copiar ${template.secondaryContent ? 'Email' : 'Texto'}`}</span>
            </div>
          </MagneticButton>
        </motion.div>
      )}
    </motion.div>
  );
};
