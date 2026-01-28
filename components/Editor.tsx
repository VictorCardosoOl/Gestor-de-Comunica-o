import React from 'react';
import { Template } from '../types';
import { motion } from 'framer-motion';
import { useEditorLogic } from '../hooks/useEditorLogic';
import { EditorHeader, VariablePanel, ContentArea } from './EditorComponents';

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
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-transparent">
           {/* Mobile Variables (Accordion style could be added here, but for now relying on Desktop split) */}
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
             <div className="absolute inset-0 w-80"> {/* Container to fix width during animation */}
                <VariablePanel 
                  placeholders={placeholders} 
                  variableValues={variableValues} 
                  onVariableChange={handleVariableChange} 
                  isVisible={true} 
                />
             </div>
           </motion.div>
        )}
      </div>
    </motion.div>
  );
};
