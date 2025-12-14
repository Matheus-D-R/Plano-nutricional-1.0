import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MealPlan } from "../types";

const mapObjectiveToPrompt = (objective: string) => {
  switch (objective) {
    case 'Emagrecer': return 'perda de gordura saudável com déficit calórico moderado';
    case 'Ganhar massa muscular': return 'hipertrofia com superávit calórico limpo e alta proteína';
    case 'Ganhar peso': return 'ganho de peso saudável focado em alimentos densos em nutrientes';
    default: return 'manutenção de peso com foco em qualidade nutricional';
  }
};

export const generateMealPlan = async (userProfile: UserProfile): Promise<MealPlan> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Atue como um nutricionista esportivo de elite. Crie um plano alimentar personalizado de um dia para o seguinte perfil:
    
    - Objetivo: ${userProfile.objective} (${mapObjectiveToPrompt(userProfile.objective)})
    - Idade: ${userProfile.age} anos
    - Sexo: ${userProfile.gender}
    - Altura: ${userProfile.height} cm
    - Peso: ${userProfile.weight} kg
    - Rotina Diária: ${userProfile.routine}
    - Atividade Física: ${userProfile.activityLevel}
    - Qualidade Atual da Dieta: ${userProfile.dietQuality}
    - Restrições: ${userProfile.restriction}
    - Preferência de Frequência: ${userProfile.mealFrequency} refeições por dia.

    Retorne APENAS um objeto JSON com a seguinte estrutura:
    - summary: Um resumo curto (máx 20 palavras) do perfil metabólico.
    - caloriesTarget: Meta calórica diária (número inteiro).
    - macros: Objeto com strings de porcentagem ou gramas para protein, carbs, fats.
    - meals: Objeto contendo arrays de strings (itens do cardápio) para breakfast, lunch, snack, dinner. Seja específico nas quantidades (ex: "2 ovos", "100g de frango").
    - motivationalMessage: Uma frase curta e inspiradora focada no objetivo da pessoa.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      caloriesTarget: { type: Type.INTEGER },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          fats: { type: Type.STRING },
        }
      },
      meals: {
        type: Type.OBJECT,
        properties: {
          breakfast: { type: Type.ARRAY, items: { type: Type.STRING } },
          lunch: { type: Type.ARRAY, items: { type: Type.STRING } },
          snack: { type: Type.ARRAY, items: { type: Type.STRING } },
          dinner: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      },
      motivationalMessage: { type: Type.STRING },
    },
    required: ["summary", "caloriesTarget", "macros", "meals", "motivationalMessage"]
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as MealPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};
