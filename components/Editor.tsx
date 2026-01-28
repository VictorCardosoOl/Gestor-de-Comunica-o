import React from 'react';
import { Template } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEditorLogic } from '../hooks/useEditorLogic';
import { EditorHeader, VariablePanel, ContentArea } from './EditorComponents';
import { Copy, Check, Layers, X } from 'lucide-react';
import { useTemplateCopier } from '../hooks/useTemplateCopier';

interface EditorProps {
  template: Template;
  onClose: () => void;
}

const TRANSITION_EASE = [0.16, 1, 0.3, 1];

// Staggered Animation Container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const fabVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
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
  
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div 
      className="h-full flex flex-col relative overflow-hidden bg-[#fdfcfb]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="z-20">
        <EditorHeader 
          template={template} 
          onClose={onClose} 
          showVariables={showVariables}
          onToggleVariables={() => setShowVariables(!showVariables)}
          onReset={handleReset}
          hasVariables={hasVariables}
        />
      </motion.div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative"> 
           <motion.div variants={itemVariants}>
             <ContentArea 
               template={template}
               subject={subject} setSubject={setSubject}
               content={content} setContent={setContent}
               secondaryContent={secondaryContent} setSecondaryContent={setSecondaryContent}
               isScenarioMode={isScenarioMode}
               scenarios={scenarios}
             />
           </motion.div>
        </div>

        {/* Variable Panel (Desktop Side-by-Side) */}
        {hasVariables && !isMobile && (
           <motion.div 
             initial={false}
             animate={{ width: showVariables ? 380 : 0, opacity: showVariables ? 1 : 0 }}
             transition={{ duration: 0.35, ease: TRANSITION_EASE }}
             className="hidden lg:block h-full border-l border-[#e6e4e1] relative overflow-hidden"
           >
             <div className="absolute inset-0 w-[380px]">
                <VariablePanel 
                  placeholders={placeholders} 
                  variableValues={variableValues} 
                  onVariableChange={handleVariableChange} 
                  isVisible={true} 
                />
             </div>
           </motion.div>
        )}

        {/* Mobile Variables Modal (Bottom Sheet) */}
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
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-[#fdfcfb] rounded-t-[24px] shadow-2xl h-[75vh] flex flex-col overflow-hidden lg:hidden"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e6e4e1] shrink-0">
                  <h3 className="text-sm font-bold text-[#1a1918] uppercase tracking-wider">Personalização</h3>
                  <button onClick={() => setShowVariables(false)} className="p-2 bg-[#f2f0ed] rounded-full hover:bg-[#e6e4e1] text-[#1a1918] transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   <VariablePanel 
                      placeholders={placeholders} 
                      variableValues={variableValues} 
                      onVariableChange={handleVariableChange} 
                      isVisible={true}
                      className="p-6 pb-24"
                   />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* FABs (Floating Action Buttons) - High Contrast Editorial Style */}
        {!isScenarioMode && (
          <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-4 pointer-events-none">
            {secondaryContent && (
              <motion.button 
                variants={fabVariants}
                onClick={() => copyToClipboard(secondaryContent, 'sec-float')} 
                className={`
                  pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105
                  ${isCopied('sec-float') 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-white/90 text-[#1a1918] border-[#e6e4e1] hover:border-[#1a1918]'}
                `}
              >
                {isCopied('sec-float') ? <Check size={18} /> : <Layers size={18} />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isCopied('sec-float') ? 'Copiado' : (template.secondaryLabel || 'Protocolo')}
                </span>
              </motion.button>
            )}

            <motion.button 
              variants={fabVariants}
              onClick={() => copyToClipboard(content, 'main-float')} 
              className={`
                pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 active:scale-95
                ${isCopied('main-float') 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-[#1a1918] text-white border-[#1a1918] hover:bg-black'}
              `}
            >
              {isCopied('main-float') ? <Check size={20} /> : <Copy size={20} />}
              <span className="text-sm font-bold uppercase tracking-widest">
                {isCopied('main-float') ? 'Copiado' : 'Copiar Texto'}
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
