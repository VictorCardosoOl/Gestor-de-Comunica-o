import { useState, useEffect, useMemo, useCallback } from 'react';
import { Template } from '../types';
import { 
  processStaticTags, 
  getInputType, 
  formatValueForText, 
  calculateDuration, 
  generateOSFromDate 
} from '../utils/textUtils';

export const useEditorLogic = (template: Template) => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [secondaryContent, setSecondaryContent] = useState<string>('');
  
  const [rawContent, setRawContent] = useState<string>('');
  const [rawSecondaryContent, setRawSecondaryContent] = useState<string>('');
  
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [showVariables, setShowVariables] = useState(true);

  // Identify Scenario Mode
  const isScenarioMode = useMemo(() => template.content.includes('[CENÁRIO:'), [template.content]);

  // Extract placeholders
  const placeholders = useMemo(() => {
    const allText = `${template.subject || ''} ${template.content} ${template.secondaryContent || ''}`;
    const found = allText.match(/\[(.*?)\]/g);
    if (!found) return [];
    
    const systemTags = ['[Saudação]', '[Data Hoje]', '[Data Extenso]', '[CENÁRIO:'];
    const unique = Array.from(new Set(found));
    return unique.filter(p => !systemTags.some(tag => p.includes(tag.replace('[', '').replace(']', ''))));
  }, [template]);

  // Initialize State
  useEffect(() => {
    const processedSubject = processStaticTags(template.subject || '');
    const processedContent = processStaticTags(template.content);
    const processedSecondary = processStaticTags(template.secondaryContent || '');

    setSubject(processedSubject);
    setContent(processedContent);
    setSecondaryContent(processedSecondary);
    setRawContent(processedContent);
    setRawSecondaryContent(processedSecondary);
    setVariableValues({});
  }, [template]);

  const updateContentWithVariables = (baseText: string, values: Record<string, string>) => {
    let result = baseText;
    placeholders.forEach(ph => {
      const type = getInputType(ph);
      const rawVal = values[ph];
      if (rawVal) {
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

      // Update content immediately
      setContent(updateContentWithVariables(rawContent, newValues));
      setSecondaryContent(updateContentWithVariables(rawSecondaryContent, newValues));
      setSubject(updateContentWithVariables(template.subject || '', newValues));
      
      return newValues;
    });
  }, [rawContent, rawSecondaryContent, template.subject]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Restaurar texto original?')) return;
    
    const pContent = processStaticTags(template.content);
    const pSecondary = processStaticTags(template.secondaryContent || '');
    
    setContent(pContent);
    setSecondaryContent(pSecondary);
    setSubject(processStaticTags(template.subject || ''));
    setVariableValues({});
  }, [template]);

  // Extract Scenarios
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
