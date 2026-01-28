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
    <div className="flex-none flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-black/5 relative z-20 bg-white/50 backdrop-blur-xl shrink-0 px-6 py-5 lg:rounded-t-2xl">
      <div className="flex items-start md:items-center space-x-4">
        <button onClick={onClose} className="lg:hidden group flex items-center gap-2 text-black hover:opacity-50 transition-opacity mt-1 md:mt-0">
          <MoveLeft size={20} strokeWidth={0.75} />
        </button>
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-black rounded-full shadow-sm"></span>
            <span className="text-editorial-label text-gray-500">{labels[template.channel] || 'Chat'}</span>
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
            className={`p-2 rounded-full transition-all border ${showVariables ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'}`}
            title="Alternar Painel de Variáveis"
          >
            <SlidersHorizontal size={16} strokeWidth={1} />
          </MagneticButton>
        )}
        <MagneticButton onClick={onReset} className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full" title="Resetar">
          <RefreshCw size={16} strokeWidth={1} />
        </MagneticButton>
        <MagneticButton onClick={onClose} className="hidden lg:flex p-2 rounded-full text-gray-400 hover:text-black hover:bg-black/5 transition-colors" title="Fechar">
          <X size={18} strokeWidth={1} />
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
               <label htmlFor={placeholder} className="block text-[10px] font-sans uppercase tracking-wider text-gray-400 mb-1.5 ml-0.5">
                  {placeholder.replace(/[\[\]]/g, '')}
               </label>
              <div className="relative">
                {inputType === 'textarea' ? (
                  <textarea
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-medium text-black focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[5rem] resize-y shadow-sm"
                    value={value}
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                  />
                ) : (
                  <input 
                    type={inputType}
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-medium text-black focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
                    value={value} 
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                  />
                )}
                {inputType === 'date' && <Calendar size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />}
                {inputType === 'time' && <Clock size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />}
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
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 pb-24 flex flex-col gap-10">
      {isScenarioMode ? (
        <div className="grid grid-cols-1 gap-6">
          {scenarios.map((scene, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Quote size={12} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-700">{scene.title}</h3>
                </div>
                <MagneticButton onClick={() => copyToClipboard(scene.text, `scene-${idx}`)} className="text-xs font-medium px-3 py-1 bg-gray-50 rounded-md hover:bg-black hover:text-white transition-colors">
                  {isCopied(`scene-${idx}`) ? 'Copiado' : 'Copiar'}
                </MagneticButton>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{scene.text}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Card */}
          <div className="relative flex flex-col w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group focus-within:ring-1 focus-within:ring-black/5 transition-all">
            {template.channel === CommunicationChannel.EMAIL && (
              <div className="border-b border-gray-100 p-6 bg-gray-50/30">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Assunto</label>
                  <button onClick={() => copyToClipboard(subject, 'subject')} className="text-xs flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
                    {isCopied('subject') ? <Check size={12} /> : <Copy size={12} />}
                    {isCopied('subject') ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  className="w-full bg-transparent text-xl md:text-2xl font-serif italic text-black outline-none placeholder:text-gray-300" 
                  placeholder="Assunto do e-mail..."
                />
              </div>
            )}
            <div className="p-6 md:p-8">
              <textarea
                ref={mainRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent resize-none outline-none text-base md:text-lg text-gray-800 leading-relaxed font-sans placeholder:text-gray-300 min-h-[200px]"
                placeholder="Conteúdo principal..."
                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
              />
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <MagneticButton onClick={() => copyToClipboard(content, 'main')} className="bg-black text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg hover:bg-gray-800 flex items-center gap-2">
                 {isCopied('main') ? <Check size={14} /> : <Copy size={14} />}
                 {isCopied('main') ? 'Copiado' : 'Copiar Texto'}
               </MagneticButton>
            </div>
          </div>

          {/* Secondary Card */}
          {secondaryContent && (
            <div className="relative flex flex-col w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group focus-within:ring-1 focus-within:ring-black/5">
              <div className="border-b border-gray-100 p-4 bg-gray-50/30 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-gray-400 rotate-45"></div>
                 <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{template.secondaryLabel || 'Conteúdo Adicional'}</span>
              </div>
              <div className="p-6 md:p-8">
                <textarea
                  ref={secRef}
                  value={secondaryContent}
                  onChange={(e) => setSecondaryContent(e.target.value)}
                  className="w-full bg-transparent resize-none outline-none text-base text-gray-800 leading-relaxed font-sans placeholder:text-gray-300 min-h-[150px]"
                  placeholder="Conteúdo secundário..."
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                />
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <MagneticButton onClick={() => copyToClipboard(secondaryContent, 'secondary')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
                 {isCopied('secondary') ? <Check size={14} /> : <Copy size={14} />}
                 {isCopied('secondary') ? 'Copiado' : 'Copiar'}
               </MagneticButton>
            </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
