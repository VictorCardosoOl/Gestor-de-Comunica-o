import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Template } from '../types';
import { 
  processStaticTags, 
  getInputType, 
  formatValueForText, 
  calculateDuration, 
  generateOSFromDate 
} from '../utils/textUtils';

export const useEditorLogic = (template: Template) => {
  // Lazy initialization: Process text ONCE before the first render to avoid mount flickering/re-renders.
  const [subject, setSubject] = useState<string>(() => processStaticTags(template.subject || ''));
  const [content, setContent] = useState<string>(() => processStaticTags(template.content));
  const [secondaryContent, setSecondaryContent] = useState<string>(() => processStaticTags(template.secondaryContent || ''));
  
  // Keep raw copies for variable replacement reference
  const [rawContent, setRawContent] = useState<string>(() => processStaticTags(template.content));
  const [rawSecondaryContent, setRawSecondaryContent] = useState<string>(() => processStaticTags(template.secondaryContent || ''));
  
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  
  // Track previous template ID to handle template switching without unmounting
  const prevTemplateIdRef = useRef(template.id);

  // Initialize showVariables based on screen width
  const [showVariables, setShowVariables] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Identify Scenario Mode
  const isScenarioMode = useMemo(() => template.content.includes('[CENÁRIO:'), [template.content]);

  // Extract placeholders - Memoized to prevent regex on every render
  const placeholders = useMemo(() => {
    const allText = `${template.subject || ''} ${template.content} ${template.secondaryContent || ''}`;
    const found = allText.match(/\[(.*?)\]/g);
    if (!found) return [];
    
    const systemTags = ['[Saudação]', '[Data Hoje]', '[Data Extenso]', '[CENÁRIO:'];
    const unique = Array.from(new Set(found));
    return unique.filter(p => !systemTags.some(tag => p.includes(tag.replace('[', '').replace(']', ''))));
  }, [template.content, template.subject, template.secondaryContent]);

  // Handle Template Change (if Editor is recycled)
  useEffect(() => {
    if (prevTemplateIdRef.current !== template.id) {
        const processedSubject = processStaticTags(template.subject || '');
        const processedContent = processStaticTags(template.content);
        const processedSecondary = processStaticTags(template.secondaryContent || '');

        setSubject(processedSubject);
        setContent(processedContent);
        setSecondaryContent(processedSecondary);
        setRawContent(processedContent);
        setRawSecondaryContent(processedSecondary);
        setVariableValues({});
        prevTemplateIdRef.current = template.id;
    }
  }, [template]);

  const updateContentWithVariables = (baseText: string, values: Record<string, string>) => {
    let result = baseText;
    // Optimization: Only iterate if we have placeholders
    if (placeholders.length === 0) return result;

    placeholders.forEach(ph => {
      const type = getInputType(ph);
      const rawVal = values[ph];
      if (rawVal) {
        // Use split/join for global replacement which is generally faster than global regex for simple strings
        result = result.split(ph).join(formatValueForText(rawVal, type));
      }
    });
    return result;
  };

  const handleVariableChange = useCallback((placeholder: string, inputValue: string) => {
    setVariableValues(prev => {
      const newValues = { ...prev, [placeholder]: inputValue };

      // Business Logic: Smart Calculations
      if (placeholder === '[Horário Início]' || placeholder === '[Horário Fim]') {
        const start = placeholder === '[Horário Início]' ? inputValue : newValues['[Horário Início]'];
        const end = placeholder === '[Horário Fim]' ? inputValue : newValues['[Horário Fim]'];
        if (start && end) {
          newValues['[Duração]'] = calculateDuration(start, end);
        }
      } else if (placeholder === '[Data]') {
        newValues['[Número OS]'] = generateOSFromDate(inputValue);
      }

      // Batch updates to avoid multiple re-renders
      // Note: We use functional updates or current state references if needed, 
      // but here we are deriving from rawContent which is stable.
      setContent(updateContentWithVariables(rawContent, newValues));
      setSecondaryContent(updateContentWithVariables(rawSecondaryContent, newValues));
      setSubject(updateContentWithVariables(template.subject || '', newValues));
      
      return newValues;
    });
  }, [rawContent, rawSecondaryContent, template.subject, placeholders]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Restaurar texto original?')) return;
    
    // Recalculate static tags cleanly
    const pContent = processStaticTags(template.content);
    const pSecondary = processStaticTags(template.secondaryContent || '');
    
    setContent(pContent);
    setSecondaryContent(pSecondary);
    setSubject(processStaticTags(template.subject || ''));
    setVariableValues({});
  }, [template]);

  // Extract Scenarios - Memoized
  const scenarios = useMemo(() => {
    if (!isScenarioMode) return [];
    return content.split('[').reduce<{title: string, text: string}[]>((acc, seg) => {
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

  return {
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
  };
};