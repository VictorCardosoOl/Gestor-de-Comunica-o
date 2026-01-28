import React, { useRef, useLayoutEffect } from 'react';
import { Template, CommunicationChannel } from '../types';
import { MoveLeft, SlidersHorizontal, RefreshCw, X, Sparkles, Calendar, Clock, AlignLeft, Quote, Copy, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { motion } from 'framer-motion';
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
  return (
    <div className="flex-none flex items-center justify-between px-6 py-4 bg-white">
      <div className="flex items-center gap-4 min-w-0">
        <button 
          onClick={onClose} 
          className="p-2 -ml-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          title="Voltar"
        >
          <MoveLeft size={20} />
        </button>
        
        <div className="flex flex-col min-w-0">
           <div className="flex items-center gap-2 mb-0.5">
             <span className={`w-1.5 h-1.5 rounded-full ${
                template.channel === 'EMAIL' ? 'bg-blue-500' : 
                (template.channel === 'PROMPT' ? 'bg-purple-500' : 'bg-emerald-500')
             }`}></span>
             <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">{template.channel}</span>
           </div>
           <h1 className="text-xl font-bold text-gray-900 truncate pr-4">
             {template.title}
           </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {hasVariables && (
           <button 
            onClick={onToggleVariables}
            className={`p-2 rounded-md transition-colors ${showVariables ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
            title="Alternar Painel de Variáveis"
          >
            <SlidersHorizontal size={18} />
          </button>
        )}
        <button onClick={onReset} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-black rounded-md transition-colors" title="Resetar">
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
};

// --- VARIABLE PANEL ---
interface VariablePanelProps {
  placeholders: string[];
  variableValues: Record<string, string>;
  onVariableChange: (placeholder: string, value: string) => void;
  isVisible: boolean;
  className?: string; 
}

export const VariablePanel: React.FC<VariablePanelProps> = ({ placeholders, variableValues, onVariableChange, isVisible, className }) => {
  if (!isVisible || placeholders.length === 0) return null;

  return (
    <div className={`h-full overflow-y-auto custom-scrollbar ${className || 'p-6'}`}>
      <div className="flex items-center gap-2 text-gray-400 mb-6">
        <Sparkles size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Preenchimento</span>
      </div>
      
      <div className="flex flex-col gap-5">
        {placeholders.map((placeholder) => {
          const inputType = getInputType(placeholder);
          const value = variableValues[placeholder] || '';
          
          return (
            <div key={placeholder}>
               <label htmlFor={placeholder} className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {placeholder.replace(/[\[\]]/g, '')}
               </label>
              <div className="relative">
                {inputType === 'textarea' ? (
                  <textarea
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all min-h-[5rem] resize-y shadow-sm"
                    value={value}
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                    placeholder="..."
                  />
                ) : (
                  <input 
                    type={inputType}
                    id={placeholder}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all shadow-sm"
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
    <div className="w-full max-w-4xl mx-auto p-5 md:p-12 pb-32 flex flex-col gap-10">
      {isScenarioMode ? (
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map((scene, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{scene.title}</h3>
                <button 
                  onClick={() => copyToClipboard(scene.text, `scene-${idx}`)} 
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  {isCopied(`scene-${idx}`) ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{scene.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Document */}
          <div className="flex flex-col w-full">
            {template.channel === CommunicationChannel.EMAIL && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                   <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Assunto</label>
                   <button 
                     onClick={() => copyToClipboard(subject, 'subject')}
                     className="text-[10px] uppercase font-bold text-gray-400 hover:text-blue-600 transition-colors"
                   >
                     {isCopied('subject') ? 'Copiado' : 'Copiar'}
                   </button>
                </div>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  className="w-full bg-transparent text-xl font-bold text-gray-900 outline-none placeholder:text-gray-300 border-none p-0 focus:ring-0" 
                  placeholder="Insira o assunto..."
                />
                <div className="h-px w-full bg-gray-200 mt-4"></div>
              </div>
            )}
            
            <textarea
              ref={mainRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent resize-none outline-none text-base text-gray-800 leading-relaxed font-sans placeholder:text-gray-300 min-h-[300px] border-none focus:ring-0 p-0"
              placeholder="Comece a escrever..."
              onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
              spellCheck={false}
            />
          </div>

          {/* Secondary Content Divider */}
          {secondaryContent && (
            <div className="pt-8 border-t border-dashed border-gray-300">
               <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <AlignLeft size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{template.secondaryLabel || 'Conteúdo Adicional'}</span>
               </div>
               <textarea
                  ref={secRef}
                  value={secondaryContent}
                  onChange={(e) => setSecondaryContent(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg p-6 resize-none outline-none text-sm text-gray-700 leading-relaxed font-sans placeholder:text-gray-400 min-h-[150px] border border-transparent focus:bg-white focus:border-gray-200 transition-colors"
                  placeholder="Conteúdo secundário..."
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  spellCheck={false}
                />
            </div>
          )}
        </>
      )}
    </div>
  );
};
