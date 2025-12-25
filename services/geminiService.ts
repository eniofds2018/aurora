
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ResearchResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_CORE = `
  Você é Aurora, uma Pesquisadora Metodológica rigorosa e Orientadora Acadêmica Sênior.
  REGRAS DE FORMATAÇÃO DE TEXTO:
  1. NÃO USE símbolos de Markdown como '#', '##', '###' para títulos.
  2. NÃO USE '*' ou '_' para negrito ou itálico.
  3. NÃO USE '-' ou '*' para criar listas de tópicos.
  4. PARA TÍTULOS E SEÇÕES: Use CAIXA ALTA e pule uma linha.
  5. PARA LISTAS: Use numeração direta (1., 2., 3.) sem símbolos adicionais.
  6. O texto deve ser entregue como um documento limpo, pronto para ser colado em um editor de texto científico.
`;

export const performAcademicSearch = async (query: string): Promise<ResearchResponse> => {
  const ai = getAI();
  const systemInstruction = `
    ${SYSTEM_CORE}
    Sua missão é fornecer referências científicas REAIS.
    Utilize Google Search para encontrar artigos em bases confiáveis.
    Forneça o DOI e o link. Formate em ABNT e APA 7.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Pesquise artigos científicos recentes sobre: "${query}".`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri,
      }))
      .filter((s: any) => s.uri) || [];

    return {
      content: response.text || "Nenhum conteúdo gerado.",
      sources,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erro na busca acadêmica.");
  }
};

export const generateMethodology = async (topic: string, workType: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Como Aurora, estruture um plano metodológico para um ${workType} sobre: "${topic}". Use títulos em CAIXA ALTA.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { systemInstruction: `${SYSTEM_CORE} Especialista em metodologia científica.` },
  });
  return response.text || "";
};

export const getAcademicAdvice = async (query: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Como Orientadora Acadêmica, responda à seguinte dúvida: "${query}". Ofereça conselhos práticos e referências de boas práticas acadêmicas.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: `${SYSTEM_CORE} Você é empática mas rigorosa com a qualidade científica.` },
  });
  return response.text || "";
};

export const buildFullProject = async (data: { title: string, problem: string, objectives: string }): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Crie um PROJETO DE PESQUISA COMPLETO baseado nos seguintes dados:
    TÍTULO: ${data.title}
    PROBLEMA: ${data.problem}
    OBJETIVOS: ${data.objectives}
    
    ESTRUTURA:
    1. RESUMO EXECUTIVO
    2. INTRODUÇÃO E JUSTIFICATIVA
    3. DELIMITAÇÃO DO PROBLEMA
    4. OBJETIVOS (GERAL E ESPECÍFICOS)
    5. FUNDAMENTAÇÃO TEÓRICA SUGERIDA
    6. METODOLOGIA DETALHADA
    7. CRONOGRAMA ESTIMADO
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_CORE },
  });
  return response.text || "";
};

export const formatReference = async (rawText: string, standard: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Formate rigorosamente em ${standard}: "${rawText}". Não use símbolos de formatação markdown.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_CORE },
  });
  return response.text || "";
};

export const generateFichamento = async (fileBase64: string, mimeType: string, standard: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Analise o documento anexo e crie um FICHAMENTO CIENTÍFICO ESTRUTURADO.
    REFERÊNCIA BIBLIOGRÁFICA (Norma: ${standard})
    RESUMO INFORMATIVO
    PROBLEMA E OBJETIVOS
    METODOLOGIA
    PRINCIPAIS RESULTADOS
    CONCLUSÃO E CONTRIBUIÇÃO
    CITAÇÕES DIRETAS
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: fileBase64, mimeType } },
        { text: prompt }
      ]
    },
    config: { systemInstruction: SYSTEM_CORE }
  });

  return response.text || "Não foi possível analisar o documento.";
};

export const consolidateFichamentos = async (fichamentos: string[]): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Abaixo estão múltiplos fichamentos de diferentes artigos científicos. 
    Crie uma SÍNTESE COMPARATIVA CRÍTICA cruzando as informações.
    
    ESTRUTURA DA RESPOSTA:
    1. PANORAMA GERAL DO CONJUNTO
    2. CONVERGÊNCIAS (PONTOS EM QUE OS AUTORES CONCORDAM)
    3. DIVERGÊNCIAS OU LACUNAS (ONDE HÁ CONFLITOS DE IDEIAS)
    4. TENDÊNCIAS METODOLÓGICAS DO GRUPO
    5. SUGESTÃO DE PRÓXIMOS PASSOS PARA A PESQUISA
    
    DADOS:
    ${fichamentos.join('\n\n--- NOVO ARTIGO ---\n\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_CORE }
  });

  return response.text || "Não foi possível consolidar as informações.";
};
