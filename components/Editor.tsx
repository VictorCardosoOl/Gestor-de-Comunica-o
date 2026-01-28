import React from 'react';
import { Template } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorLogic } from '../hooks/useEditorLogic';
import { EditorHeader, VariablePanel, ContentArea } from './EditorComponents';
import { Copy, Check, Layers, X } from 'lucide-react';
import { useTemplateCopier } from '../hooks/useTemplateCopier';
import { MagneticButton } from './MagneticButton';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

export const Editor: React.FC<EditorProps> = ({ template, onClose }) => {
  const {
    subject, setSubject,
    content, setContent,
    secondaryContent, setSecondaryContent,
    variableValues,
    showVariables, setShowVariables,
    handleVariableChange,
    handleReset,
    placeholders,
    scenarios,
    isScenarioMode
  } = useEditorLogic(template);

  const { copyToClipboard, isCopied } = useTemplateCopier();
  const hasVariables = placeholders.length > 0;
  
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* Header (Top) */}
      <div className="z-20 relative border-b border-gray-200">
        <EditorHeader 
          template={template} 
          onClose={onClose} 
          showVariables={showVariables}
          onToggleVariables={() => setShowVariables(!showVariables)}
          onReset={handleReset}
          hasVariables={hasVariables}
        />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-gray-50/30"> 
           <ContentArea 
             template={template}
             subject={subject} setSubject={setSubject}
             content={content} setContent={setContent}
             secondaryContent={secondaryContent} setSecondaryContent={setSecondaryContent}
             isScenarioMode={isScenarioMode}
             scenarios={scenarios}
           />
        </div>

        {/* Variable Panel (Desktop) */}
        {hasVariables && !isMobile && (
           <motion.div 
             initial={false}
             animate={{ width: showVariables ? 300 : 0, opacity: showVariables ? 1 : 0 }}
             transition={{ duration: 0.2, ease: "easeInOut" }}
             className="hidden lg:block h-full border-l border-gray-200 bg-white relative overflow-hidden"
           >
             <div className="absolute inset-0 w-[300px]">
                <VariablePanel 
                  placeholders={placeholders} 
                  variableValues={variableValues} 
                  onVariableChange={handleVariableChange} 
                  isVisible={true} 
                />
             </div>
           </motion.div>
        )}

        {/* Mobile Variables Modal */}
        <AnimatePresence>
          {isMobile && hasVariables && showVariables && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setShowVariables(false)}
              />
              
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-2xl h-[70vh] flex flex-col overflow-hidden lg:hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Preenchimento</h3>
                  <button onClick={() => setShowVariables(false)} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   <VariablePanel 
                      placeholders={placeholders} 
                      variableValues={variableValues} 
                      onVariableChange={handleVariableChange} 
                      isVisible={true}
                      className="p-5 pb-24"
                   />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* FABs */}
        {!isScenarioMode && (
          <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">
            {secondaryContent && (
              <button 
                onClick={() => copyToClipboard(secondaryContent, 'sec-float')} 
                className={`
                  pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full shadow-md border transition-transform active:scale-95
                  ${isCopied('sec-float') 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
                `}
              >
                {isCopied('sec-float') ? <Check size={16} /> : <Layers size={16} />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isCopied('sec-float') ? 'Copiado' : (template.secondaryLabel || 'Protocolo')}
                </span>
              </button>
            )}

            <button 
              onClick={() => copyToClipboard(content, 'main-float')} 
              className={`
                pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full shadow-lg border transition-transform active:scale-95
                ${isCopied('main-float') 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-black text-white border-transparent hover:bg-gray-900'}
              `}
            >
              {isCopied('main-float') ? <Check size={18} /> : <Copy size={18} />}
              <span className="text-sm font-bold uppercase tracking-wider">
                {isCopied('main-float') ? 'Copiado' : 'Copiar Texto'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
