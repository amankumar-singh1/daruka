import React, { useState } from 'react';
import { X, Heart, Trees, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface GetInvolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard?: () => void;
}

export const GetInvolvedModal: React.FC<GetInvolvedModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
}) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'corporate' | 'donor'>('individual');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#cce24b] text-[#142119] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Get Involved with Taruka Earth</h3>
            <p className="text-xs text-slate-500">Every tree, donation, and hectare monitored makes history</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 mb-1">Welcome to the Movement!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Our regional coordinators will connect with you with verified field locations and carbon impact telemetry.
            </p>
          </div>
        ) : (
          <div>
            {/* Options grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setSelectedType('individual')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedType === 'individual'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Users className="w-5 h-5 mx-auto mb-1.5 text-emerald-700" />
                <div className="text-xs font-bold text-slate-900">Volunteer</div>
                <div className="text-[10px] text-slate-500">Field planting &amp; surveys</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('donor')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedType === 'donor'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Trees className="w-5 h-5 mx-auto mb-1.5 text-emerald-700" />
                <div className="text-xs font-bold text-slate-900">Sponsor Hectare</div>
                <div className="text-[10px] text-slate-500">$25/mo per hectare</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('corporate')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedType === 'corporate'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1.5 text-emerald-700" />
                <div className="text-xs font-bold text-slate-900">Enterprise ESG</div>
                <div className="text-[10px] text-slate-500">PostGIS carbon offsets</div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#cce24b] hover:bg-[#bdd43e] text-[#142119] text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Participation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Looking for admin GIS telemetry?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDashboard?.();
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Open Darukaa Geospatial Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
