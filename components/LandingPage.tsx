import React from 'react';
import { ArrowRight, CheckCircle2, FileText, Activity, Utensils } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Header/Nav */}
      <header className="px-6 py-4 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold">NP</div>
          <span className="text-xl font-bold text-slate-900">NutriPlan Pro</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              Nutrição Inteligente
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Descubra o plano alimentar ideal para o <span className="text-blue-700">seu objetivo</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Responda um rápido questionário e receba um cardápio personalizado, gerado por inteligência artificial, de acordo com seu corpo, rotina e metas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureItem icon={<Activity className="w-5 h-5 text-blue-600" />} text="Análise personalizada" />
            <FeatureItem icon={<Utensils className="w-5 h-5 text-blue-600" />} text="Baseado em hábitos" />
            <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />} text="Cardápio prático" />
            <FeatureItem icon={<FileText className="w-5 h-5 text-blue-600" />} text="Download em PDF" />
          </div>

          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-900 rounded-xl hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
          >
            Começar Quiz
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-slate-500">
            * Gratuito e leva menos de 2 minutos.
          </p>
        </div>

        {/* Hero Image / Graphic */}
        <div className="flex-1 w-full max-w-md md:max-w-full flex justify-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-70"></div>
                <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop" 
                    alt="Healthy food" 
                    className="relative rounded-2xl shadow-2xl border-4 border-white object-cover h-80 w-full md:h-[500px] md:w-[400px]"
                />
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Resultado</p>
                        <p className="font-bold text-slate-900">100% Personalizado</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} NutriPlan Pro. Todos os direitos reservados.
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
    {icon}
    <span className="font-medium text-slate-700">{text}</span>
  </div>
);
