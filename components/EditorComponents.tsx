import React, { useRef, useLayoutEffect } from 'react';
import { Template, CommunicationChannel } from '../types';
import { MoveLeft, SlidersHorizontal, RefreshCw, X, Sparkles, Calendar, Clock, AlignLeft, Quote, Copy, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { getInputType } from '../utils/textUtils';
import { useTemplateCopier } from '../hooks/useTemplateCopier';

// --- HEADER COMPONENT ---
interface EditorHeaderProps {
  template: Template;
  onClose: () => void;
  showVariables: boolean;
  onToggleVariables: () => void;
  onReset: () => void;
  hasVariables: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  template, onClose, showVariables, onToggleVariables, onReset, hasVariables 
}) => {
  const labels: Record<string, string> = {
    [CommunicationChannel.EMAIL]: 'Email',
    [CommunicationChannel.WHATSAPP]: 'Chat',
    [CommunicationChannel.PROMPT]: 'Prompt'
  };

  return (
    <div className="flex-none flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-black/5 relative z-20 bg-white/80 backdrop-blur-xl shrink-0 px-6 py-5 lg:rounded-t-2xl">
      <div className="flex items-start md:items-center space-x-4">
        {/* Back Button */}
        <button 
          onClick={onClose} 
          className="group flex items-center gap-2 text-black hover:opacity-50 transition-opacity mt-1 md:mt-0 p-2 rounded-full hover:bg-black/5"
          title="Voltar"
        >
          <MoveLeft size={20} strokeWidth={0.75} />
        </button>
        
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                template.channel === 'EMAIL' ? 'bg-blue-500' : 
                (template.channel === 'PROMPT' ? 'bg-purple-500' : 'bg-emerald-500')
            }`}></span>
            <span className="text-editorial-label text-gray-500">{labels[template.channel] || 'Modelo'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif italic text-black leading-none drop-shadow-sm truncate pr-2">
            {template.title}
          </h1>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
        {hasVariables && (
           <MagneticButton 
            onClick={onToggleVariables}
            className={`p-2.5 rounded-full transition-all border ${showVariables ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'}`}
            title="Alternar Painel de Variáveis"
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
          </MagneticButton>
        )}
        <MagneticButton onClick={onReset} className="text-gray-500 hover:text-black transition-colors p-2.5 hover:bg-black/5 rounded-full" title="Resetar">
          <RefreshCw size={16} strokeWidth={1.5} />
        </MagneticButton>
      </div>
    </div>
  );
};

// --- VARIABLE PANEL (SIDEBAR) ---
interface VariablePanelProps {
  placeholders: string[];
  variableValues: Record<string, string>;
  onVariableChange: (placeholder: string, value: string) => void;
  isVisible: boolean;
}

export const VariablePanel: React.FC<VariablePanelProps> = ({ placeholders, variableValues, onVariableChange, isVisible }) => {
  if (!isVisible || placeholders.length === 0) return null;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50/50 backdrop-blur-sm border-l border-black/5 p-6 space-y-8">
      <div className="flex items-center gap-2 text-gray-500 mb-6">
        <Sparkles size={14} />
        <span className="text-editorial-label">Preenchimento</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {placeholders.map((placeholder) => {
          const inputType = getInputType(placeholder);
          const value = variableValues[placeholder] || '';
          
          return (
            <div key={placeholder} className="group relative">
               <label htmlFor={placeholder} className="block text-[10px] font-sans uppercase tracking-wider text-gray-400 mb-2 ml-0.5 font-semibold">
                  {placeholder.replace(/[\[\]]/g, '')}
               </label>
              <div className="relative">
                {inputType === 'textarea' ? (
                  <textarea
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-black focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[6rem] resize-y shadow-sm hover:border-gray-300"
                    value={value}
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                    placeholder="Digite aqui..."
                  />
                ) : (
                  <input 
                    type={inputType}
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-black focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm hover:border-gray-300"
                    value={value} 
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                    placeholder="Digite aqui..."
                  />
                )}
                {inputType === 'date' && <Calendar size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />}
                {inputType === 'time' && <Clock size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CONTENT AREA ---
interface ContentAreaProps {
  template: Template;
  subject: string;
  setSubject: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  secondaryContent: string;
  setSecondaryContent: (v: string) => void;
  isScenarioMode: boolean;
  scenarios: any[];
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  template, subject, setSubject, content, setContent, secondaryContent, setSecondaryContent, isScenarioMode, scenarios
}) => {
  const { copyToClipboard, isCopied } = useTemplateCopier();
  const mainRef = useRef<HTMLTextAreaElement>(null);
  const secRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    adjustHeight(mainRef.current);
    adjustHeight(secRef.current);
  }, [content, secondaryContent, isScenarioMode]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-10 pb-32 flex flex-col gap-8">
      {isScenarioMode ? (
        <div className="grid grid-cols-1 gap-6">
          {scenarios.map((scene, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Quote size={14} className="text-black" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{scene.title}</h3>
                </div>
                <MagneticButton onClick={() => copyToClipboard(scene.text, `scene-${idx}`)} className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-colors border border-gray-100">
                  {isCopied(`scene-${idx}`) ? 'Copiado' : 'Copiar'}
                </MagneticButton>
              </div>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-sans">{scene.text}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Card */}
          <div className="relative flex flex-col w-full bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group transition-all duration-300">
            {template.channel === CommunicationChannel.EMAIL && (
              <div className="border-b border-gray-100 px-8 py-6 bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Assunto do E-mail</label>
                  <button 
                    onClick={() => copyToClipboard(subject, 'subject')} 
                    className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md ${isCopied('subject') ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-black hover:bg-black/5'}`}
                  >
                    {isCopied('subject') ? <Check size={12} /> : <Copy size={12} />}
                    {isCopied('subject') ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  className="w-full bg-transparent text-xl md:text-2xl font-serif italic text-black outline-none placeholder:text-gray-300" 
                  placeholder="Insira o assunto..."
                />
              </div>
            )}
            
            <div className="p-8 md:p-10 relative">
               {/* Decorative left line for focus */}
              <div className="absolute left-0 top-10 bottom-10 w-1 bg-black/0 group-focus-within:bg-black/5 transition-colors duration-500 rounded-r-full"></div>
              
              <textarea
                ref={mainRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent resize-none outline-none text-lg text-gray-800 leading-relaxed font-sans placeholder:text-gray-300 min-h-[300px]"
                placeholder="Conteúdo principal..."
                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Secondary Card */}
          {secondaryContent && (
            <div className="relative flex flex-col w-full bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group">
              <div className="border-b border-gray-100 px-8 py-4 bg-gray-50/50 flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <AlignLeft size={12} />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{template.secondaryLabel || 'Conteúdo Adicional'}</span>
              </div>
              <div className="p-8 md:p-10">
                <textarea
                  ref={secRef}
                  value={secondaryContent}
                  onChange={(e) => setSecondaryContent(e.target.value)}
                  className="w-full bg-transparent resize-none outline-none text-base text-gray-700 leading-relaxed font-sans placeholder:text-gray-300 min-h-[200px]"
                  placeholder="Conteúdo secundário..."
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};