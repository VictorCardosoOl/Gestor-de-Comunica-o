
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("Gemini API Key is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refines the provided text using Gemini, ensuring placeholders are preserved.
 * Uses strict prompt engineering to maintain variable integrity.
 * 
 * @param text The text content to refine.
 * @param instruction Additional instructions (e.g., tone, channel).
 * @returns The refined text or the original text if the operation fails.
 */
export const refineText = async (text: string, instruction: string): Promise<string> => {
  if (!text.trim()) return text;

  try {
    const prompt = `
      Você é um assistente editorial especializado em comunicação corporativa técnica.
      
      Sua missão é refinar o texto abaixo seguindo estas DIRETRIZES TÉCNICAS RÍGIDAS:

      1. **Blindagem de Variáveis:**
         - Mantenha TODAS as variáveis entre colchetes (ex: [Nome do Cliente], [Data], [Empresa], [Duração]) INTACTAS.
         - Não traduza variáveis. Não remova colchetes.

      2. **Preservação Visual:**
         - Mantenha estritamente a formatação de negrito (texto entre asteriscos *texto*).
         - Mantenha a indentação (tabs ou espaços no início da linha).
         - Mantenha os links no formato Markdown ou texto puro.

      3. **Objetivo do Refinamento:**
         - Melhore apenas a fluidez, correção gramatical e o tom profissional do texto que NÃO é variável.
         - Instrução de Tom: ${instruction}

      Texto Original:
      "${text}"
      
      Retorne apenas o texto final refinado, sem comentários adicionais.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    return response.text || text;
  } catch (error) {
    // In production, send this to an observability service (e.g., Sentry)
    // console.error("AI Service Error", error); 
    return text;
  }
};
