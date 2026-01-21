import { useState, useCallback } from 'react';

interface UseTemplateCopierReturn {
  copyToClipboard: (text: string, key: string) => Promise<void>;
  isCopied: (key: string) => boolean;
}

export const useTemplateCopier = (): UseTemplateCopierReturn => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const isCopied = useCallback((key: string) => {
    return !!copiedStates[key];
  }, [copiedStates]);

  const copyToClipboard = useCallback(async (textToCopy: string, key: string) => {
    try {
      const plainText = textToCopy;
      
      // Basic HTML transformation for Rich Text copy
      let htmlContent = textToCopy
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/\*(.*?)\*/g, "<b>$1</b>") // Bold markdown-like syntax
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // Link syntax

      const fullHtml = `
        <span style="font-family: 'Calibri', 'Segoe UI', sans-serif; font-size: 11pt; color: #000000; line-height: 1.5;">
          ${htmlContent}
        </span>
      `;

      if (typeof ClipboardItem !== 'undefined') {
        const clipboardItem = new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([fullHtml], { type: 'text/html' })
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        // Fallback
        await navigator.clipboard.writeText(textToCopy);
      }

      setCopiedStates(prev => ({ ...prev, [key]: true }));
      
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);

    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback in case of error
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
      } catch (e) {
        console.error('Fallback copy failed', e);
      }
    }
  }, []);

  return { copyToClipboard, isCopied };
};