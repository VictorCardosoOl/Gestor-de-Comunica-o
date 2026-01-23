
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refines the provided text using Gemini, ensuring placeholders are preserved.
 * @param text The text content to refine.
 * @param instruction Additional instructions (e.g., tone, channel).
 */
export const refineText = async (text: string, instruction: string): Promise<string> => {
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
        temperature: 0.3, // Baixa temperatura para seguir regras estritas
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Erro ao refinar texto com Gemini:", error);
    // Em caso de erro, retorna o texto original para não quebrar o fluxo
    return text;
  }
};
