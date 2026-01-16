import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Template, CommunicationChannel } from '../types';
import { Copy, RefreshCw, Check, MoveLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

export const Editor: React.FC<EditorProps> = ({ template, onClose }) => {
  const [subject, setSubject] = useState(template.subject || '');
  const [content, setContent] = useState(template.content);
  const [secondaryContent, setSecondaryContent] = useState(template.secondaryContent || '');
  
  // State to track the *current* value of each variable placeholder
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  
  const [showVariables, setShowVariables] = useState(true);
  const [isCopiedMain, setIsCopiedMain] = useState(false);
  const [isCopiedSecondary, setIsCopiedSecondary] = useState(false);
  const [isCopiedSubject, setIsCopiedSubject] = useState(false);

  // Helper functions
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

  useEffect(() => {
    setSubject(template.subject || '');
    setContent(processTemplate(template.content));
    setSecondaryContent(processTemplate(template.secondaryContent || ''));
    setVariableValues({});
    setIsCopiedMain(false);
    setIsCopiedSecondary(false);
    setIsCopiedSubject(false);
  }, [template, processTemplate]);

  // --- SYNC LOGIC ---
  const placeholders = useMemo(() => {
    const regex = /\[(.*?)\]/g;
    const allText = `${template.subject || ''} ${template.content} ${template.secondaryContent || ''} ${template.tertiaryContent || ''}`;
    const found = allText.match(regex);
    if (!found) return [];
    
    const unique = Array.from(new Set(found));
    return unique.filter(p => 
      !p.includes('Saudação') && 
      !p.includes('Data Hoje') && 
      !p.includes('Data Extenso')
    );
  }, [template]);

  const handleVariableChange = (placeholder: string, inputValue: string) => {
    const oldValue = variableValues[placeholder] || placeholder;
    const newValue = inputValue === '' ? placeholder : inputValue;

    setVariableValues(prev => ({
      ...prev,
      [placeholder]: newValue
    }));

    const replaceInText = (text: string) => {
        return text.split(oldValue).join(newValue);
    };

    setSubject(prev => replaceInText(prev));
    setContent(prev => replaceInText(prev));
    setSecondaryContent(prev => replaceInText(prev));
  };

  const handleCopyGeneric = async (textToCopy: string, setCopiedState: (v: boolean) => void) => {
    try {
      const plainText = textToCopy;
      let htmlContent = textToCopy
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/\*(.*?)\*/g, "<b>$1</b>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

      const fullHtml = `
        <span style="font-family: 'Calibri', 'Segoe UI', sans-serif; font-size: 11pt; color: #000000; line-height: 1.5;">
          ${htmlContent}
        </span>
      `;

      if (typeof ClipboardItem !== 'undefined') {
        const clipboardItem = new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([fullHtml], { type: 'text/html' })
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    }
  };

  const handleCopyMain = () => handleCopyGeneric(content, setIsCopiedMain);
  const handleCopySecondary = () => handleCopyGeneric(secondaryContent, setIsCopiedSecondary);

  const handleCopySubject = () => {
    navigator.clipboard.writeText(subject);
    setIsCopiedSubject(true);
    setTimeout(() => setIsCopiedSubject(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Restaurar texto original e variáveis?')) {
      setSubject(template.subject || '');
      setContent(processTemplate(template.content));
      setSecondaryContent(processTemplate(template.secondaryContent || ''));
      setVariableValues({});
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col bg-transparent overflow-hidden"
    >
      {/* Editorial Header - Glass */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-10 py-6 md:py-8 shrink-0 gap-4 border-b border-black/5 relative z-20 bg-white/40 backdrop-blur-md">
        <div className="flex items-center space-x-4 md:space-x-6">
          <button 
            onClick={onClose}
            className="lg:hidden group flex items-center gap-2 text-black hover:opacity-50 transition-opacity"
          >
            <MoveLeft size={20} strokeWidth={1.5} />
          </button>
          
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-black/80 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></span>
               <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-black/60">
                  {template.channel === CommunicationChannel.EMAIL ? 'Email Template' : 'Message Template'}
               </span>
             </div>
             <h1 className="font-serif italic text-3xl md:text-5xl text-black leading-none drop-shadow-sm font-light">{template.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 self-end md:self-auto">
          {placeholders.length > 0 && (
             <button 
              onClick={() => setShowVariables(!showVariables)}
              className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-black/5 ${showVariables ? 'bg-white/70 text-black shadow-md' : 'text-gray-500 hover:text-black hover:bg-white/40'}`}
              title="Toggle Variables"
            >
              <SlidersHorizontal size={18} strokeWidth={1.5} />
            </button>
          )}
          <button 
            onClick={handleReset}
            className="text-gray-500 hover:text-black transition-colors p-3 hover:bg-white/40 rounded-full"
            title="Reset"
          >
            <RefreshCw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

       {/* Variables Panel (Smart Sync) - Glass */}
       <AnimatePresence>
        {placeholders.length > 0 && showVariables && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/30 backdrop-blur-lg border-b border-white/20 shrink-0 relative z-20 overflow-hidden shadow-sm"
          >
            <div className="px-6 md:px-10 py-8">
              <div className="flex items-center gap-2 mb-8 text-black/70">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Preenchimento Automático</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-8">
                {placeholders.map((placeholder) => (
                  <div key={placeholder} className="relative group">
                    <input 
                      type="text" 
                      id={placeholder}
                      className="peer w-full bg-transparent border-b border-black/10 focus:border-black/80 text-base py-2 transition-all outline-none font-serif italic text-black placeholder-transparent"
                      placeholder={placeholder}
                      value={variableValues[placeholder] === placeholder ? '' : variableValues[placeholder]} 
                      onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                    />
                    <label 
                      htmlFor={placeholder}
                      className="absolute left-0 -top-3 text-[9px] font-sans font-bold uppercase tracking-widest text-gray-400 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400/70 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-black cursor-text"
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

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-10 py-6 md:py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-10">
          
          {/* Main Content Card - Liquid Glass */}
          <div className="
            relative min-h-[400px] p-8 md:p-14
            bg-white/40 backdrop-blur-xl 
            border border-white/40 
            shadow-[0_20px_40px_-5px_rgba(0,0,0,0.03)]
            rounded-2xl
          ">
             {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply rounded-2xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            {/* Glossy sheen gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/70 via-transparent to-white/10 rounded-2xl"></div>

            {template.channel === CommunicationChannel.EMAIL && (
              <div className="mb-8 relative z-10 group">
                 <div className="flex justify-between items-end mb-3 border-b border-black/5 pb-2">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Assunto</label>
                  
                  <button 
                    onClick={handleCopySubject}
                    className={`
                      flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:underline transition-all font-sans
                      ${isCopiedSubject ? 'text-black' : 'text-gray-400 hover:text-black'}
                    `}
                  >
                    {isCopiedSubject ? (
                      <>
                        <Check size={12} strokeWidth={2} />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} strokeWidth={2} />
                        <span>Copiar Assunto</span>
                      </>
                    )}
                  </button>
                 </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-2 bg-transparent border-none focus:ring-0 outline-none text-black font-serif italic text-xl md:text-2xl placeholder:text-gray-400/30"
                  placeholder="Insira o assunto..."
                />
              </div>
            )}

            <div className="relative z-10 h-full flex flex-col">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  fontFamily: 'Calibri, "Segoe UI", Carlito, sans-serif',
                  fontSize: '11pt', 
                  lineHeight: '1.6',
                  color: '#1a1a1a'
                }}
                className="w-full h-full min-h-[300px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30"
                placeholder="Digite o conteúdo principal..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Secondary Content Card - Liquid Glass */}
          {secondaryContent !== '' && (
            <div className="
              relative min-h-[300px] p-8 md:p-14
              bg-white/40 backdrop-blur-xl 
              border border-white/40 
              shadow-[0_20px_40px_-5px_rgba(0,0,0,0.03)]
              rounded-2xl
            ">
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply rounded-2xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/70 via-transparent to-white/10 rounded-2xl"></div>
              
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                   <div className="w-1.5 h-1.5 bg-black/60 rotate-45"></div>
                   <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
                     {template.secondaryLabel || 'Conteúdo Adicional'}
                   </label>
                </div>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <textarea
                  value={secondaryContent}
                  onChange={(e) => setSecondaryContent(e.target.value)}
                  style={{
                    fontFamily: 'Calibri, "Segoe UI", Carlito, sans-serif',
                    fontSize: '11pt', 
                    lineHeight: '1.6',
                    color: '#1a1a1a'
                  }}
                  className="w-full h-full min-h-[200px] bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400/30"
                  placeholder="Digite o conteúdo secundário..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}
          
          <div className="h-20"></div>
        </div>
      </div>

      {/* Footer Actions - Glass */}
      <div className="px-6 md:px-10 py-6 bg-white/40 backdrop-blur-xl flex flex-wrap justify-end items-center sticky bottom-0 z-20 gap-3 md:gap-4 border-t border-white/20">
        
        {/* Secondary Copy Button */}
        {template.secondaryContent && (
          <button
            onClick={handleCopySecondary}
            className={`
              group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 transition-all duration-300 flex-1 md:flex-none rounded-full
              ${isCopiedSecondary ? 'bg-black/90 text-white border-black/90' : 'bg-transparent text-gray-700 border-gray-300 hover:border-black hover:text-black'}
              border backdrop-blur-sm
            `}
          >
            {isCopiedSecondary ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap font-sans">
              {isCopiedSecondary ? 'Copiado' : `Copiar ${template.secondaryLabel ? 'Protocolo' : 'Secundário'}`}
            </span>
          </button>
        )}

        {/* Main Copy Button */}
        <button
          onClick={handleCopyMain}
          className={`
            group relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-3.5 transition-all duration-300 flex-1 md:flex-none rounded-full
            ${isCopiedMain ? 'bg-black text-white shadow-lg' : 'bg-white/90 text-black hover:bg-black hover:text-white border-white/50'}
            border shadow-sm
          `}
        >
          {isCopiedMain ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap font-sans">
            {isCopiedMain ? 'Copiado' : `Copiar ${template.secondaryContent ? 'Email' : 'Texto'}`}
          </span>
        </button>
      </div>
    </motion.div>
  );
};