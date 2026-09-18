import React from 'react';
import { X, Play, Volume2, ShieldCheck, TreePine, Award } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#142119] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#cce24b] text-[#142119] flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Our Story: Guardians of the Canopy</h3>
              <p className="text-xs text-slate-400">Taruka Earth Nature Intelligence Documentary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMceKVEp17Z2T4TidrczfOp_DGJP8OKZwQyRcxazTkStqz-fErBca7MixWWIh-rbRGuEllXiM-dM0nIiq_x4hCjGcgi2gjY3jaug949iTPKfjtrVY1ZjCb7AOoSOJAcbhsXgMvYeBDEelU7L7NvYVBw-n5LvlVAd05vM2OlisGS_wdmpKpNYRsB4AAKyx4M9g1hwrZpzzcQK98TccS6owDKoO2rQ8dkxB9EQRjrLRVdtgUWZbT92s_"
            alt="Nature documentary preview"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142119] via-transparent to-black/40" />

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#cce24b] text-[#142119] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform cursor-pointer group mb-4">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase bg-black/60 px-3 py-1 rounded-full border border-white/20 mb-2">
              Interactive Story Mode
            </span>
            <p className="text-lg font-bold max-w-md">
              Restoring 1 Million Hectares of Rainforest &amp; Coastal Blue Carbon
            </p>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4K Drone Telemetry • Sentinel-2 Earth Observation</span>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span>03:45 / 08:20</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#17261d]">
          <div className="flex items-center gap-3">
            <TreePine className="w-5 h-5 text-[#cce24b]" />
            <div>
              <div className="text-xs font-bold text-white">520,000+ Planted</div>
              <div className="text-[11px] text-slate-400">Native biodiverse species</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#cce24b]" />
            <div>
              <div className="text-xs font-bold text-white">PostGIS Verified</div>
              <div className="text-[11px] text-slate-400">Sub-meter polygon accuracy</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#cce24b]" />
            <div>
              <div className="text-xs font-bold text-white">Gold Standard Carbon</div>
              <div className="text-[11px] text-slate-400">Verified carbon reduction credits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
