import React from 'react';
import { Template } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorLogic } from '../hooks/useEditorLogic';
import { EditorHeader, VariablePanel, ContentArea } from './EditorComponents';
import { Copy, Check, Layers } from 'lucide-react';
import { useTemplateCopier } from '../hooks/useTemplateCopier';
import { MagneticButton } from './MagneticButton';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 }
};

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

  return (
    <motion.div 
      variants={containerVariants}
      className="h-full flex flex-col bg-[#f8f9fa] relative lg:rounded-2xl overflow-hidden border border-white/50 shadow-2xl"
    >
      {/* Header (Top) */}
      <EditorHeader 
        template={template} 
        onClose={onClose} 
        showVariables={showVariables}
        onToggleVariables={() => setShowVariables(!showVariables)}
        onReset={handleReset}
        hasVariables={hasVariables}
      />

      {/* Main Layout: Flex Row for Desktop (Content | Variables) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left/Center: Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-transparent pb-20"> {/* pb-20 ensures content isn't hidden behind FAB */}
           {/* Mobile Variables */}
           <div className="lg:hidden">
              <VariablePanel 
                  placeholders={placeholders} 
                  variableValues={variableValues} 
                  onVariableChange={handleVariableChange} 
                  isVisible={showVariables} 
               />
           </div>

           <ContentArea 
             template={template}
             subject={subject} setSubject={setSubject}
             content={content} setContent={setContent}
             secondaryContent={secondaryContent} setSecondaryContent={setSecondaryContent}
             isScenarioMode={isScenarioMode}
             scenarios={scenarios}
           />
        </div>

        {/* Right: Variable Panel (Desktop Sticky) */}
        {hasVariables && (
           <motion.div 
             initial={false}
             animate={{ width: showVariables ? 320 : 0, opacity: showVariables ? 1 : 0 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className="hidden lg:block h-full border-l border-gray-200 bg-white relative overflow-hidden"
           >
             <div className="absolute inset-0 w-80">
                <VariablePanel 
                  placeholders={placeholders} 
                  variableValues={variableValues} 
                  onVariableChange={handleVariableChange} 
                  isVisible={true} 
                />
             </div>
           </motion.div>
        )}

        {/* --- FLOATING ACTION BUTTONS (FAB) --- */}
        {!isScenarioMode && (
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-50 flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
              {secondaryContent && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="pointer-events-auto"
                >
                  <MagneticButton 
                    onClick={() => copyToClipboard(secondaryContent, 'sec-float')} 
                    className={`
                      group flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300
                      ${isCopied('sec-float') 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white/90 text-gray-700 border-white/50 hover:bg-white hover:scale-105'}
                    `}
                  >
                    {isCopied('sec-float') ? <Check size={16} /> : <Layers size={16} />}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isCopied('sec-float') ? 'Copiado' : (template.secondaryLabel || 'Protocolo')}
                    </span>
                  </MagneticButton>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto"
            >
              <MagneticButton 
                onClick={() => copyToClipboard(content, 'main-float')} 
                className={`
                  group flex items-center gap-3 px-6 py-3.5 rounded-full shadow-xl border backdrop-blur-md transition-all duration-300
                  ${isCopied('main-float') 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-[#111] text-white border-black/10 hover:bg-black hover:scale-105 hover:shadow-2xl'}
                `}
              >
                {isCopied('main-float') ? <Check size={18} /> : <Copy size={18} />}
                <span className="text-sm font-bold uppercase tracking-wider">
                  {isCopied('main-float') ? 'Copiado!' : 'Copiar Texto'}
                </span>
              </MagneticButton>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};