import React from 'react';

interface PartnerLogosProps {
  customLogos?: { name: string; url: string }[];
}

export const PartnerLogos: React.FC<PartnerLogosProps> = ({ customLogos = [] }) => {
  return (
    <section className="py-12 border-y border-slate-200/70 bg-[#fafcf9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-between gap-6 md:gap-8">
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">TRUSTED BY</span>

        {/* Custom Uploaded Partner Logos from User's Device */}
        {customLogos.map((logo, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <img src={logo.url} alt={logo.name} className="h-6 w-auto object-contain max-w-[100px] grayscale hover:grayscale-0 transition-all" />
            <span className="text-sm font-bold tracking-tight">{logo.name}</span>
          </div>
        ))}

        {/* Standard Partner Logos */}
        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
            <circle cx="16" cy="16" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
            <path d="M12 16h8M16 12v8"></path>
          </svg>
          <span className="text-sm font-bold tracking-tight">logoipsum</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
            <polygon fill="none" points="16,4 28,26 4,26" stroke="currentColor" strokeWidth="3"></polygon>
          </svg>
          <span className="text-sm font-bold tracking-tight">logoipsum</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
            <rect fill="none" height="20" rx="4" stroke="currentColor" strokeWidth="3" width="20" x="6" y="6"></rect>
            <circle cx="16" cy="16" r="4"></circle>
          </svg>
          <span className="text-sm font-bold tracking-tight">logoipsum</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
            <path d="M6 16 A10 10 0 0 0 26 16 A10 10 0 0 0 6 16" fill="none" stroke="currentColor" strokeWidth="3"></path>
            <circle cx="16" cy="16" r="2"></circle>
          </svg>
          <span className="text-sm font-bold tracking-tight">logoipsum</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
            <circle cx="10" cy="16" fill="none" r="6" stroke="currentColor" strokeWidth="2.5"></circle>
            <circle cx="22" cy="16" fill="none" r="6" stroke="currentColor" strokeWidth="2.5"></circle>
          </svg>
          <span className="text-sm font-bold tracking-tight">logoipsum</span>
        </div>
      </div>
    </section>
  );
};
