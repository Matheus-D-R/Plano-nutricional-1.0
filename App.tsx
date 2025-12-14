import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { generateMealPlan } from './services/geminiService';
import { UserProfile, MealPlan, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = () => {
    setView('quiz');
    setError(null);
  };

  const handleQuizComplete = async (data: UserProfile) => {
    setUserProfile(data);
    setView('loading');
    
    try {
      const plan = await generateMealPlan(data);
      setMealPlan(plan);
      setView('result');
    } catch (err) {
      setError("Não foi possível gerar seu plano no momento. Verifique sua chave API ou tente novamente.");
      setView('landing'); // Or a dedicated error view
    }
  };

  const handleRestart = () => {
    setUserProfile(null);
    setMealPlan(null);
    setView('landing');
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white min-h-screen">
      {view === 'landing' && <LandingPage onStart={startQuiz} />}
      
      {view === 'quiz' && (
        <Quiz 
          onComplete={handleQuizComplete} 
          onCancel={() => setView('landing')} 
        />
      )}

      {view === 'loading' && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analisando seu perfil...</h2>
          <p className="text-slate-500 max-w-md">
            Nossa inteligência artificial está calculando suas necessidades metabólicas e montando o cardápio ideal para o seu objetivo.
          </p>
        </div>
      )}

      {view === 'result' && mealPlan && userProfile && (
        <Results 
          plan={mealPlan} 
          userProfile={userProfile} 
          onRestart={handleRestart} 
        />
      )}

      {/* Simple Error Toast/Overlay if needed in Landing */}
      {error && view === 'landing' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
          <strong className="font-bold">Ops! </strong>
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
