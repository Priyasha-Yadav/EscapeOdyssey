import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Mountain, Waves, Wine, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTrip } from '../context/TripContext';
import type { Destination, QuizAnswer } from '../types';

export const EscapeQuizModal: React.FC = () => {
  const { quizOpen, setQuizOpen, handleQuizComplete, setActiveDestination } = useTrip();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswer>({
    stressLevel: 7,
    environment: 'beach',
    companion: 'couple',
  });
  const [matchedDest, setMatchedDest] = useState<Destination | null>(null);

  if (!quizOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback silent
    }
  };

  const handleFinish = () => {
    const dest = handleQuizComplete(answers);
    setMatchedDest(dest);
    setStep(4);
    triggerConfetti();
  };

  const handleClose = () => {
    setQuizOpen(false);
    setStep(1);
    setMatchedDest(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <h3 className="text-base font-extrabold text-white">Weekend Escape Matcher</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: STRESS LEVEL */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Question 1 of 3</span>
              <h4 className="text-lg font-bold text-white">How intense was your work week?</h4>
              <p className="text-xs text-gray-300">We'll calibrate the speed and tranquility of your itinerary.</p>
            </div>

            <div className="space-y-3">
              {[
                { level: 3, title: '😌 Low Stress', desc: 'Ready for lively city culture, dining & outdoor activities.' },
                { level: 6, title: '🧘 Moderate Burnout', desc: 'Need a balanced mix of nature walk & cozy spa lounge.' },
                { level: 9, title: '🌋 Maximum Exhaustion', desc: 'Complete digital detox sanctuary, zero alarm clocks.' },
              ].map((opt) => (
                <button
                  key={opt.level}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, stressLevel: opt.level }));
                    setStep(2);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    answers.stressLevel === opt.level
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                      : 'glass-panel border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <h5 className="font-bold text-sm text-white">{opt.title}</h5>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SCENERY */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Question 2 of 3</span>
              <h4 className="text-lg font-bold text-white">What scenery fuels your soul right now?</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'mountains', label: 'Alpine Pines', icon: <Mountain className="w-5 h-5 text-emerald-400" /> },
                { id: 'beach', label: 'Coastal Ocean', icon: <Waves className="w-5 h-5 text-cyan-400" /> },
                { id: 'city', label: 'Vineyard Wine', icon: <Wine className="w-5 h-5 text-amber-400" /> },
                { id: 'forest', label: 'Deep Forest', icon: <Building2 className="w-5 h-5 text-indigo-400" /> },
              ].map((scenery) => (
                <button
                  key={scenery.id}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, environment: scenery.id as any }));
                    setStep(3);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                    answers.environment === scenery.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                      : 'glass-panel border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  {scenery.icon}
                  <span className="text-xs font-bold text-white">{scenery.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: COMPANION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Question 3 of 3</span>
              <h4 className="text-lg font-bold text-white">Who is joining your 48-hour escape?</h4>
            </div>

            <div className="space-y-3">
              {[
                { id: 'solo', label: '🧑 Solo Recharge', desc: 'Peaceful self-reflection & quiet reading spots.' },
                { id: 'couple', label: '💑 Romantic Couple', desc: 'Candlelit dining & scenic sunset viewpoints.' },
                { id: 'friends', label: '👯 Squad / Friends', desc: 'Barbecue, craft beer & group outdoor activities.' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, companion: c.id as any }));
                    handleFinish();
                  }}
                  className="w-full text-left p-4 rounded-2xl glass-panel border border-white/10 text-gray-300 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all"
                >
                  <h5 className="font-bold text-sm text-white">{c.label}</h5>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: MATCH RESULT */}
        {step === 4 && matchedDest && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500 text-gray-950 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>99% Soul Match Found!</span>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
              <img src={matchedDest.heroImage} alt={matchedDest.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-left">
                <h4 className="font-bold text-white text-base">{matchedDest.title}</h4>
                <p className="text-xs text-emerald-300">{matchedDest.tagline}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl glass-pill text-xs font-semibold text-gray-300 hover:text-white"
              >
                Retake Quiz
              </button>

              <button
                onClick={() => {
                  setActiveDestination(matchedDest);
                  handleClose();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-1.5"
              >
                <span>View 48h Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
