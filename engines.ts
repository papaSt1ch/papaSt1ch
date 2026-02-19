
import { GoogleGenAI, Type } from "@google/genai";
import { Engine, ReliabilityReport, AIPrediction } from "../types";

const SYSTEM_INSTRUCTION = `Ты — экспертный ИИ-механик и аналитик надежности мотоциклов. 
Твоя задача — анализировать историю эксплуатации двигателей и прогнозировать будущие риски.
Ты используешь реальную статистику отчетов владельцев.
Никогда не используй слова "гарантированно" или "обязательно". 
Используй "вероятно", "есть риск", "рекомендуется проверить".
Будь технически точным, используй термины (декомпрессор, обгонка, натяжитель, ГРМ).`;

export const predictEngineFailures = async (
  engine: Engine,
  allReports: ReliabilityReport[],
  userReport?: ReliabilityReport
): Promise<AIPrediction | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contextData = {
      engineName: engine.name,
      engineIndex: engine.index,
      reportsSummary: allReports.map(r => ({
        mileage: r.mileage,
        style: r.usageStyle,
        issues: r.breakdownCategories,
        maintenance: r.maintenanceRating
      })),
      currentUserData: userReport ? {
        mileage: userReport.mileage,
        style: userReport.usageStyle,
        maintenance: userReport.maintenanceRating
      } : null
    };

    const prompt = `Проанализируй данные эксплуатации мотора ${engine.name}. 
    У нас есть ${allReports.length} реальных отчетов.
    ${userReport ? `У текущего пользователя пробег ${userReport.mileage} ${userReport.mileageUnit}, стиль "${userReport.usageStyle}".` : 'Дай общий прогноз на основе статистики.'}
    
    Сформируй прогноз будущих поломок в формате JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Низкий', 'Средний', 'Высокий'] },
            riskScore: { type: Type.NUMBER },
            potentialIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  mileageWindow: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            personalAdvice: { type: Type.STRING },
            maintenanceForecast: { type: Type.STRING }
          }
        }
      },
    });

    const prediction = JSON.parse(response.text || '{}');
    return {
      ...prediction,
      dataConfidence: allReports.length
    };
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return null;
  }
};

export const getAIRecommendation = async (userPrompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error: any) {
    return `Ошибка ИИ: ${error.message}`;
  }
};

export const getStructuredRecommendation = async (data: {
  style: string;
  bikeType: string;
  weight: string;
  experience: string;
  budget: string;
}) => {
  const prompt = `Подбери мотор: ${JSON.stringify(data)}`;
  return getAIRecommendation(prompt);
};
