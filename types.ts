export type Objective = 'Emagrecer' | 'Manter peso' | 'Ganhar peso' | 'Ganhar massa muscular';
export type Gender = 'Masculino' | 'Feminino';
export type Routine = 'Muito sedentária' | 'Pouco ativa' | 'Ativa' | 'Muito ativa';
export type ActivityLevel = 'Não pratico' | '1 a 2 vezes por semana' | '3 a 5 vezes por semana' | 'Todos os dias';
export type DietQuality = 'Muito desregulada' | 'Regular' | 'Boa' | 'Muito saudável';
export type Restriction = 'Nenhuma' | 'Intolerância à lactose' | 'Vegetariano(a)' | 'Vegano(a)';
export type MealFrequency = '3' | '4' | '5 ou mais';

export interface UserProfile {
  objective: Objective;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  routine: Routine;
  activityLevel: ActivityLevel;
  dietQuality: DietQuality;
  restriction: Restriction;
  mealFrequency: MealFrequency;
}

export interface MealPlan {
  summary: string;
  caloriesTarget: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meals: {
    breakfast: string[];
    lunch: string[];
    snack: string[];
    dinner: string[];
  };
  motivationalMessage: string;
}

export type ViewState = 'landing' | 'quiz' | 'loading' | 'result';
