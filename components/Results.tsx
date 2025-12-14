import React, { useRef, useState } from 'react';
import { MealPlan, UserProfile } from '../types';
import { Download, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface ResultsProps {
  plan: MealPlan;
  userProfile: UserProfile;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ plan, userProfile, onRestart }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    const element = contentRef.current;
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `plano-nutricional-${userProfile.objective.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Using the global html2pdf library loaded in index.html
    const w = window as any;
    if (w.html2pdf) {
      w.html2pdf().from(element).set(opt).save().then(() => {
        setIsDownloading(false);
      });
    } else {
      alert("Erro ao carregar biblioteca de PDF. Tente novamente.");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Seu Plano Personalizado</h1>
          <div className="flex gap-3">
             <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors font-medium shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Novo Quiz
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-bold shadow-md disabled:opacity-70"
            >
              {isDownloading ? (
                <span className="animate-pulse">Gerando PDF...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Vamos alcançar esse objetivo!</h2>
            <p className="text-blue-100 italic text-lg">"{plan.motivationalMessage}"</p>
        </div>

        {/* Printable Area */}
        <div id="pdf-content" ref={contentRef} className="bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none">
          {/* PDF Header (Visible only in PDF usually, but we show here for preview) */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-slate-800">
             <div>
                <h1 className="text-2xl font-bold">NutriPlan Pro</h1>
                <p className="text-blue-200 text-sm">Plano Alimentar Inteligente</p>
             </div>
             <div className="text-right">
                <p className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-blue-200 capitalize">{userProfile.objective}</p>
             </div>
          </div>

          <div className="p-8 space-y-8">
            {/* User Profile Summary */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Perfil do Aluno
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                 <div>
                    <span className="block text-slate-500">Idade</span>
                    <span className="font-semibold text-slate-900">{userProfile.age} anos</span>
                 </div>
                 <div>
                    <span className="block text-slate-500">Peso/Altura</span>
                    <span className="font-semibold text-slate-900">{userProfile.weight}kg / {userProfile.height}cm</span>
                 </div>
                 <div>
                    <span className="block text-slate-500">Nível Ativ.</span>
                    <span className="font-semibold text-slate-900">{userProfile.activityLevel}</span>
                 </div>
                 <div>
                    <span className="block text-slate-500">Restrições</span>
                    <span className="font-semibold text-slate-900">{userProfile.restriction}</span>
                 </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-slate-700"><span className="font-bold">Análise:</span> {plan.summary}</p>
              </div>
            </div>

            {/* Macros & Calories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Meta Calórica</p>
                    <p className="text-3xl font-bold text-blue-900">{plan.caloriesTarget}</p>
                    <p className="text-xs text-blue-600">kcal/dia</p>
                </div>
                <MacroCard label="Proteína" value={plan.macros.protein} color="bg-green-50" textColor="text-green-900" borderColor="border-green-100" />
                <MacroCard label="Carboidratos" value={plan.macros.carbs} color="bg-yellow-50" textColor="text-yellow-900" borderColor="border-yellow-100" />
                <MacroCard label="Gorduras" value={plan.macros.fats} color="bg-red-50" textColor="text-red-900" borderColor="border-red-100" />
            </div>

            {/* Meal Plan */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 border-b pb-2">Cardápio Sugerido</h3>
                
                <MealSection title="Café da Manhã" items={plan.meals.breakfast} />
                <MealSection title="Almoço" items={plan.meals.lunch} />
                <MealSection title="Lanche da Tarde" items={plan.meals.snack} />
                <MealSection title="Jantar" items={plan.meals.dinner} />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Este plano é uma sugestão gerada por inteligência artificial e não substitui o aconselhamento médico ou de um nutricionista profissional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MacroCard = ({ label, value, color, textColor, borderColor }: any) => (
  <div className={`${color} p-4 rounded-xl text-center border ${borderColor}`}>
    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{label}</p>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
  </div>
);

const MealSection = ({ title, items }: { title: string, items: string[] }) => (
    <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-semibold text-slate-800">
            {title}
        </div>
        <div className="p-4">
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);
