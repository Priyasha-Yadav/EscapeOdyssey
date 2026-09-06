import React, { useState } from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDeck } from './components/DestinationDeck';
import { MapView } from './components/MapView';
import { AboutSection } from './components/AboutSection';
import { CollectionsSection } from './components/CollectionsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { NewsletterSection } from './components/NewsletterSection';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { EscapeQuizModal } from './components/EscapeQuizModal';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { ShareModal } from './components/ShareModal';
import { CompareModal } from './components/CompareModal';
import { Compass, Shield, Globe, Code2, Layers, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { filters, filteredDestinations, savedIds, setCompareOpen } = useTrip();
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-gray-950">
      
      {/* Header Navbar */}
      <Navbar onOpenSavedDrawer={() => setSavedDrawerOpen(true)} />

      {/* Main Body Content */}
      <main className="flex-1 pb-24">
        
        {/* Hero & Interactive Controller */}
        <HeroSection />

        {/* View Mode Content Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {filters.viewMode === 'grid' && (
            <div>
              {filteredDestinations.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-4 border border-white/10">
                  <Compass className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">No Getaways Found</h3>
                  <p className="text-xs text-gray-400">Try widening your travel radius slider or removing some vibe chips.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredDestinations.map(dest => (
                    <DestinationCard key={dest.id} destination={dest} />
                  ))}
                </div>
              )}
            </div>
          )}

          {filters.viewMode === 'deck' && <DestinationDeck />}

          {filters.viewMode === 'map' && <MapView />}

        </section>

        {/* SECTION 2: How EscapeOdyssey Works (About) */}
        <AboutSection />

        {/* SECTION 3: Featured Curated Collections */}
        <CollectionsSection />

        {/* SECTION 4: Traveler Testimonials */}
        <TestimonialsSection />

        {/* SECTION 5: Frequently Asked Questions */}
        <FaqSection />

        {/* SECTION 6: VIP Escape Radar Newsletter */}
        <NewsletterSection />

        {/* Floating Compare Action Bar */}
        {savedIds.length >= 2 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
            <div className="glass-modal rounded-full px-5 py-3 border border-emerald-500/30 shadow-2xl flex items-center space-x-4 bg-gray-950/90 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-xs text-gray-200 font-semibold">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{savedIds.length} getaways bookmarked for comparison</span>
              </div>

              <button
                onClick={() => setCompareOpen(true)}
                className="px-4 py-1.5 rounded-full bg-emerald-500 text-gray-950 font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center space-x-1 shadow-lg shadow-emerald-500/30"
              >
                <span>Launch Side-by-Side Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Modals & Drawers */}
      <DestinationDetailModal />
      <EscapeQuizModal />
      <SavedTripsDrawer isOpen={savedDrawerOpen} onClose={() => setSavedDrawerOpen(false)} />
      <ShareModal />
      <CompareModal />

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white">Escape<span className="text-emerald-400">Odyssey</span></span>
              <p className="text-[11px] text-gray-400">Next-Gen 48-Hour Weekend Escape Engine • Production Ready Frontend</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-gray-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Multi-Hub Engine</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>React 18 + Vite + Tailwind</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Zero Decision Fatigue</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <TripProvider>
      <MainContent />
    </TripProvider>
  );
}
