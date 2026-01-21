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
      Você é um especialista em comunicação corporativa e editorial.
      
      Sua tarefa é refinar o texto abaixo para torná-lo mais profissional, claro e direto, seguindo o tom solicitado.
      
      REGRAS CRÍTICAS:
      1. Mantenha TODAS as variáveis entre colchetes (ex: [Nome do Cliente], [Data], [Empresa]) EXATAMENTE como estão. Não as remova, não as traduza e não altere seu conteúdo.
      2. Mantenha a estrutura de parágrafos e formatação HTML (se houver).
      3. O idioma de saída deve ser Português (Brasil).
      
      Instrução de Tom/Contexto: ${instruction}
      
      Texto Original:
      "${text}"
      
      Retorne apenas o texto refinado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7, // Criatividade balanceada com precisão
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Erro ao refinar texto com Gemini:", error);
    // Em caso de erro, retorna o texto original para não quebrar o fluxo
    return text;
  }
};