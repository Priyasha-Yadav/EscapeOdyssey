import React, { useState } from 'react';
import { Mail, Sparkles, Check, AlertCircle } from 'lucide-react';
import { sound } from '../utils/sound';
import { isValidEmail, sanitizeInput } from '../utils/security';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeInput(email, 100);

    if (!isValidEmail(sanitized)) {
      setError('Please enter a valid email address (e.g., alex@domain.com).');
      sound.playPop();
      return;
    }

    setError('');
    sound.playFanfare();
    setSubscribed(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-gray-950 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        
        <div className="space-y-2 text-center md:text-left max-w-xl z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Escape Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Get 1 Curated 48-Hour Getaway <span className="gradient-emerald-indigo">Every Thursday</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Join 12,000+ busy travelers receiving secret weekend itineraries tailored to weather and golden hour forecasts.
          </p>
        </div>

        <div className="w-full md:w-auto z-10">
          {subscribed ? (
            <div className="flex items-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-500 text-gray-950 font-bold text-sm shadow-xl">
              <Check className="w-5 h-5" />
              <span>You're on the VIP Radar list!</span>
            </div>
          ) : (
            <div className="space-y-2 w-full max-w-md">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 text-gray-950 font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all shadow-xl shrink-0"
                >
                  Subscribe
                </button>
              </form>

              {error && (
                <div className="flex items-center space-x-1 text-xs text-rose-400 font-medium pl-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
