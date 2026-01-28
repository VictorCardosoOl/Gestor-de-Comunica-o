import React, { useRef, useLayoutEffect } from 'react';
import { Template, CommunicationChannel } from '../types';
import { MoveLeft, SlidersHorizontal, RefreshCw, Sparkles, Calendar, Clock, AlignLeft, Quote, Copy, Check, ArrowUpLeft } from 'lucide-react';
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
    <div className="flex-none flex items-center justify-between px-6 py-6 md:px-12 bg-[#fdfcfb]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#e6e4e1]">
      <div className="flex items-center gap-6 min-w-0">
        <button 
          onClick={onClose} 
          className="group flex items-center gap-2 text-[#6e6b66] hover:text-[#1a1918] transition-colors"
          title="Voltar"
        >
          <div className="w-10 h-10 rounded-full border border-[#e6e4e1] flex items-center justify-center group-hover:border-[#1a1918] transition-colors">
             <MoveLeft size={18} />
          </div>
          <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Voltar</span>
        </button>
        
        <div className="flex flex-col min-w-0 border-l border-[#e6e4e1] pl-6">
           <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a8a49e]">{template.channel} Template</span>
           </div>
           <h1 className="text-2xl md:text-3xl font-serif italic text-[#1a1918] truncate leading-none">
             {template.title}
           </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {hasVariables && (
           <button 
            onClick={onToggleVariables}
            className={`p-3 rounded-full border transition-all duration-300 ${showVariables ? 'bg-[#1a1918] text-white border-[#1a1918]' : 'bg-white text-[#6e6b66] border-[#e6e4e1] hover:border-[#1a1918]'}`}
            title="Alternar Painel de Variáveis"
          >
            <SlidersHorizontal size={18} strokeWidth={1.5} />
          </button>
        )}
        <button onClick={onReset} className="p-3 text-[#6e6b66] border border-transparent hover:border-[#e6e4e1] rounded-full transition-colors" title="Resetar">
          <RefreshCw size={18} strokeWidth={1.5} />
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
    <div className={`h-full overflow-y-auto custom-scrollbar bg-[#faf9f8] ${className || 'p-8'}`}>
      <div className="flex items-center gap-2 text-[#a8a49e] mb-10">
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Personalização</span>
      </div>
      
      <div className="flex flex-col gap-8">
        {placeholders.map((placeholder) => {
          const inputType = getInputType(placeholder);
          const value = variableValues[placeholder] || '';
          
          return (
            <div key={placeholder} className="group">
               <label htmlFor={placeholder} className="block text-[11px] font-bold uppercase tracking-wider text-[#6e6b66] mb-3 ml-1">
                  {placeholder.replace(/[\[\]]/g, '')}
               </label>
              <div className="relative">
                {inputType === 'textarea' ? (
                  <textarea
                    id={placeholder}
                    className="w-full bg-white border border-[#e6e4e1] rounded-[16px] p-4 text-sm font-medium text-[#1a1918] focus:ring-1 focus:ring-[#1a1918] focus:border-[#1a1918] outline-none transition-all min-h-[6rem] resize-y shadow-sm hover:border-[#d1cdc7]"
                    value={value}
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                    placeholder="Digitar valor..."
                  />
                ) : (
                  <input 
                    type={inputType}
                    id={placeholder}
                    className="w-full bg-white border border-[#e6e4e1] rounded-[12px] p-4 text-sm font-medium text-[#1a1918] focus:ring-1 focus:ring-[#1a1918] focus:border-[#1a1918] outline-none transition-all shadow-sm hover:border-[#d1cdc7]"
                    value={value} 
                    onChange={(e) => onVariableChange(placeholder, e.target.value)}
                    placeholder="Digitar valor..."
                  />
                )}
                {inputType === 'date' && <Calendar size={16} className="absolute right-4 top-4 text-[#a8a49e] pointer-events-none" />}
                {inputType === 'time' && <Clock size={16} className="absolute right-4 top-4 text-[#a8a49e] pointer-events-none" />}
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
    <div className="w-full max-w-4xl mx-auto p-6 md:p-16 pb-40 flex flex-col gap-12">
      {isScenarioMode ? (
        <div className="grid grid-cols-1 gap-6">
          {scenarios.map((scene, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-white border border-[#e6e4e1] rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center border-b border-[#f2f0ed] pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <Quote size={16} className="text-[#a8a49e]" />
                    <h3 className="text-xs font-bold text-[#1a1918] uppercase tracking-wider">{scene.title}</h3>
                </div>
                <button 
                  onClick={() => copyToClipboard(scene.text, `scene-${idx}`)} 
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                      isCopied(`scene-${idx}`) ? 'bg-[#1a1918] text-white border-[#1a1918]' : 'bg-white text-[#6e6b66] border-[#e6e4e1] hover:border-[#1a1918]'
                  }`}
                >
                  {isCopied(`scene-${idx}`) ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-[#1a1918] text-base leading-loose font-sans">{scene.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Document - Paper Style */}
          <div className="flex flex-col w-full">
            {template.channel === CommunicationChannel.EMAIL && (
              <div className="mb-10 p-6 bg-[#f2f0ed]/50 rounded-[16px] border border-transparent hover:border-[#e6e4e1] transition-colors group">
                <div className="flex items-center justify-between mb-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-[#a8a49e]">Assunto</label>
                   <button 
                     onClick={() => copyToClipboard(subject, 'subject')}
                     className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#a8a49e] hover:text-[#1a1918] transition-colors"
                   >
                     {isCopied('subject') ? <Check size={12}/> : <Copy size={12}/>}
                     {isCopied('subject') ? 'Copiado' : 'Copiar'}
                   </button>
                </div>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  className="w-full bg-transparent text-2xl md:text-3xl font-serif italic text-[#1a1918] outline-none placeholder:text-[#d1cdc7] border-none p-0 focus:ring-0" 
                  placeholder="Insira o assunto aqui..."
                />
              </div>
            )}
            
            <div className="relative group">
                {/* Decorative margin line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-[#e6e4e1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <textarea
                  ref={mainRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent resize-none outline-none text-lg md:text-xl text-[#1a1918] leading-[1.8] font-serif placeholder:text-[#d1cdc7] min-h-[400px] border-none focus:ring-0 p-0 pl-0 md:pl-8 transition-all"
                  placeholder="Comece a escrever a narrativa..."
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  spellCheck={false}
                />
            </div>
          </div>

          {/* Secondary Content Divider */}
          {secondaryContent && (
            <div className="mt-8 pt-12 border-t border-[#e6e4e1]">
               <div className="flex items-center gap-3 mb-6 text-[#a8a49e]">
                  <AlignLeft size={16} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">{template.secondaryLabel || 'Conteúdo Adicional'}</span>
               </div>
               <div className="bg-[#f2f0ed] rounded-[20px] p-8 border border-transparent hover:border-[#d1cdc7] transition-colors">
                   <textarea
                      ref={secRef}
                      value={secondaryContent}
                      onChange={(e) => setSecondaryContent(e.target.value)}
                      className="w-full bg-transparent resize-none outline-none text-base text-[#6e6b66] leading-relaxed font-sans placeholder:text-[#a8a49e] min-h-[150px] border-none focus:ring-0 p-0"
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
