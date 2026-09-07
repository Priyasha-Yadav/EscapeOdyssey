import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Compass, Sparkles } from 'lucide-react';
import { useTrip } from '../../../hooks/useTrip';

export const ShareModal: React.FC = () => {
  const { shareDestination, setShareDestination, filters, getComputedCost } = useTrip();
  const [copied, setCopied] = useState(false);

  if (!shareDestination) return null;

  const dest = shareDestination;
  const hubTravel = dest.hubDistance[filters.departureHub] || Object.values(dest.hubDistance)[0];
  const cost = getComputedCost(dest);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 border border-white/15 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">48h Escape Share Card</h3>
          </div>
          <button
            onClick={() => setShareDestination(null)}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable/Shareable Card Ticket Box */}
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 rounded-2xl p-5 border border-white/15 space-y-4 shadow-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                EscapeOdyssey
              </span>
              <span className="text-[11px] text-gray-400 font-mono">48H GETAWAY PASS</span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex space-x-4 items-center">
            <img src={dest.heroImage} alt={dest.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base leading-tight">{dest.title}</h4>
              <p className="text-xs text-emerald-400 font-medium">{hubTravel?.formatted} • {dest.weather.condition}</p>
              <div className="text-xs font-mono font-bold text-amber-400">${cost} / person est.</div>
            </div>
          </div>

          {/* Highlights */}
          <div className="pt-2 space-y-1 border-t border-white/10">
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Weekend Highlights</span>
            <div className="space-y-1 text-xs text-gray-300">
              {dest.highlights.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">✦</span>
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Barcode Mockup */}
          <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <QrCode className="w-8 h-8 text-white" />
              <div className="text-[10px] leading-tight">
                <span className="block font-bold text-white">SCAN TO OPEN</span>
                <span>Itinerary Pass #{dest.id.slice(0, 6)}</span>
              </div>
            </div>

            <div className="text-right text-[10px]">
              <span className="block font-semibold text-emerald-400">STATUS: CONFIRMED</span>
              <span>48 Hours Non-stop Vibe</span>
            </div>
          </div>

        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="w-full py-3 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Itinerary Pass Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Shareable Trip Link</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
