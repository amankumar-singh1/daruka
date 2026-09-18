import React from 'react';

interface FooterProps {
  onOpenDashboard?: () => void;
  onOpenGetInvolved?: () => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDashboard,
  onOpenGetInvolved,
  onOpenDocs,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12">
          {/* Col 1: Brand Info (4 cols) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 pr-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4 text-[#cce24b]"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                DARUKAA<span className="text-emerald-700">.EARTH</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed text-xs">
              Next-generation geospatial nature intelligence, verified carbon sequestration accounting, and high-resolution MRV monitoring.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-tight">Platform</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  GIS Map &amp; Polygons
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  MRV Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Sentinel-2 Telemetry
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  PostGIS Cadastre
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-tight">Community</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenGetInvolved}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Join Field Network
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGetInvolved}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Partner With Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGetInvolved}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Carbon Offsets
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGetInvolved}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Research Grants
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Standards */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-tight">Standards</h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-500">Verra VM0047</span></li>
              <li><span className="text-slate-500">Gold Standard</span></li>
              <li><span className="text-slate-500">IPCC Tier 3</span></li>
              <li><span className="text-slate-500">Plan Vivo</span></li>
            </ul>
          </div>

          {/* Col 5: Follow Us */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-tight">Connect</h4>
            <div className="flex items-center gap-2.5">
              <a
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors"
                href="#twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors"
                href="#linkedin"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <span>© {new Date().getFullYear()} DARUKAA.EARTH. All rights reserved.</span>
          <span>Science-driven Geospatial Nature Intelligence &amp; MRV Cadastre</span>
        </div>
      </div>
    </footer>
  );
};
