import React, { useState } from 'react';
import { UserProfile, Objective, Gender, Routine, ActivityLevel, DietQuality, Restriction, MealFrequency } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizProps {
  onComplete: (data: UserProfile) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const totalSteps = 10;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    } else {
      // Validate all fields present before submit
      if (
        formData.objective &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight &&
        formData.routine &&
        formData.activityLevel &&
        formData.dietQuality &&
        formData.restriction &&
        formData.mealFrequency
      ) {
        onComplete(formData as UserProfile);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-advance for selection buttons, but not for inputs
    if (typeof value === 'string' && field !== 'age' && field !== 'height' && field !== 'weight') {
      setTimeout(() => {
        if (step < totalSteps - 1) setStep(prev => prev + 1);
        else if (step === totalSteps - 1) {
           // If it's the last step and it's a selection, we need to manually trigger completion if we want auto-submit
           // Ideally, user clicks "Finish" on last step.
        }
      }, 250);
    }
  };

  const renderQuestion = () => {
    switch (step) {
      case 0:
        return (
          <QuestionLayout
            title="Qual é seu objetivo principal?"
            options={['Emagrecer', 'Manter peso', 'Ganhar peso', 'Ganhar massa muscular']}
            selected={formData.objective}
            onSelect={(val) => updateField('objective', val as Objective)}
          />
        );
      case 1:
        return (
          <InputLayout
            title="Qual sua idade?"
            type="number"
            value={formData.age}
            onChange={(val) => updateField('age', Number(val))}
            suffix="anos"
          />
        );
      case 2:
        return (
          <QuestionLayout
            title="Qual seu sexo?"
            options={['Masculino', 'Feminino']}
            selected={formData.gender}
            onSelect={(val) => updateField('gender', val as Gender)}
          />
        );
      case 3:
        return (
          <InputLayout
            title="Qual sua altura?"
            type="number"
            value={formData.height}
            onChange={(val) => updateField('height', Number(val))}
            suffix="cm"
          />
        );
      case 4:
        return (
          <InputLayout
            title="Qual seu peso atual?"
            type="number"
            value={formData.weight}
            onChange={(val) => updateField('weight', Number(val))}
            suffix="kg"
          />
        );
      case 5:
        return (
          <QuestionLayout
            title="Como é sua rotina diária?"
            options={['Muito sedentária', 'Pouco ativa', 'Ativa', 'Muito ativa']}
            selected={formData.routine}
            onSelect={(val) => updateField('routine', val as Routine)}
          />
        );
      case 6:
        return (
          <QuestionLayout
            title="Você pratica atividade física?"
            options={['Não pratico', '1 a 2 vezes por semana', '3 a 5 vezes por semana', 'Todos os dias']}
            selected={formData.activityLevel}
            onSelect={(val) => updateField('activityLevel', val as ActivityLevel)}
          />
        );
      case 7:
        return (
          <QuestionLayout
            title="Como é sua alimentação hoje?"
            options={['Muito desregulada', 'Regular', 'Boa', 'Muito saudável']}
            selected={formData.dietQuality}
            onSelect={(val) => updateField('dietQuality', val as DietQuality)}
          />
        );
      case 8:
        return (
          <QuestionLayout
            title="Você possui alguma restrição alimentar?"
            options={['Nenhuma', 'Intolerância à lactose', 'Vegetariano(a)', 'Vegano(a)']}
            selected={formData.restriction}
            onSelect={(val) => updateField('restriction', val as Restriction)}
          />
        );
      case 9:
        return (
          <QuestionLayout
            title="Quantas refeições por dia você consegue fazer?"
            options={['3', '4', '5 ou mais']}
            selected={formData.mealFrequency}
            onSelect={(val) => updateField('mealFrequency', val as MealFrequency)}
          />
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = () => {
    switch (step) {
      case 0: return !!formData.objective;
      case 1: return !!formData.age && formData.age > 10 && formData.age < 120;
      case 2: return !!formData.gender;
      case 3: return !!formData.height && formData.height > 50 && formData.height < 300;
      case 4: return !!formData.weight && formData.weight > 20 && formData.weight < 500;
      case 5: return !!formData.routine;
      case 6: return !!formData.activityLevel;
      case 7: return !!formData.dietQuality;
      case 8: return !!formData.restriction;
      case 9: return !!formData.mealFrequency;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div 
            className="bg-blue-600 h-2 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col">
            <div className="mb-6 flex justify-between items-center text-sm text-slate-500 font-medium">
                <span>Passo {step + 1} de {totalSteps}</span>
                <span className="uppercase tracking-wider">{Math.round(progress)}% Completo</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
                 {renderQuestion()}
            </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 
              ${isCurrentStepValid() 
                ? 'bg-blue-900 hover:bg-blue-800 shadow-md hover:-translate-y-0.5' 
                : 'bg-slate-300 cursor-not-allowed'
              }`}
          >
            {step === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
            {step !== totalSteps - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-components for layouts
const QuestionLayout = ({ title, options, selected, onSelect }: { title: string, options: string[], selected?: string, onSelect: (val: string) => void }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-slate-900 text-center">{title}</h2>
    <div className="grid gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 text-lg
            ${selected === opt 
              ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-sm' 
              : 'border-slate-200 hover:border-blue-300 text-slate-700'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const InputLayout = ({ title, type, value, onChange, suffix }: { title: string, type: string, value?: number, onChange: (val: string) => void, suffix: string }) => (
  <div className="space-y-8 text-center">
    <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
    <div className="flex items-end justify-center gap-2">
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-center text-5xl font-bold text-blue-900 border-b-4 border-blue-200 focus:border-blue-600 outline-none w-48 py-2 bg-transparent transition-colors placeholder-slate-200"
        placeholder="0"
        autoFocus
      />
      <span className="text-xl font-medium text-slate-500 mb-4">{suffix}</span>
    </div>
  </div>
);
