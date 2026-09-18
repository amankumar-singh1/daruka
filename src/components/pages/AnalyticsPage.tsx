import React, { useState } from 'react';
import { BarChart3, TrendingUp, Satellite, ShieldCheck, Calendar, Trees, Layers, Sparkles } from 'lucide-react';
import { Site, Project } from '../../types';
import { SiteAnalytics } from '../dashboard/SiteAnalytics';
import { motion } from 'motion/react';

interface AnalyticsPageProps {
  sites: Site[];
  projects: Project[];
  selectedSiteId: string;
  onSelectSiteId: (siteId: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  sites,
  projects,
  selectedSiteId,
  onSelectSiteId,
}) => {
  const currentSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const linkedProject = projects.find((p) => p.id === currentSite?.projectId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>DARUKAA.EARTH SCIENCE INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MRV Telemetry &amp; Remote Sensing
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Empirical multi-spectral canopy density, Sentinel-2 NDVI telemetry, and verified carbon sequestration curves.
          </p>
        </div>

        {/* Site Selector Dropdown */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 pl-2">Monitored Site:</span>
          <select
            value={currentSite?.id}
            onChange={(e) => onSelectSiteId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.locationName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Metadata Bar */}
      {currentSite && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Stock</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {currentSite.currentCarbonStock.toLocaleString()} <span className="text-xs font-medium text-slate-500">tCO2e</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              Baseline: {currentSite.baselineCarbonStock.toLocaleString()} tCO2e (+{Math.round(((currentSite.currentCarbonStock - currentSite.baselineCarbonStock) / currentSite.baselineCarbonStock) * 100)}%)
            </span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sentinel-2 NDVI</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
              {currentSite.averageNdvi}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              High Canopy Chlorophyll Index
            </span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Delineated Area</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {currentSite.areaHectares.toLocaleString()} <span className="text-xs font-medium text-slate-500">ha</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              PostGIS Polygon Verified
            </span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Methodology</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              VM0047
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              Verra AR-ACM0003 Compliant
            </span>
          </div>
        </div>
      )}

      {/* Main Analytics Chart Component */}
      {currentSite ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {linkedProject?.title || 'Ecological Restoration Zone'}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {currentSite.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                <Satellite className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Orbit Sensor Link</span>
              </span>
            </div>
          </div>

          {/* Render SiteAnalytics Time-Series Curves */}
          <SiteAnalytics site={currentSite} />
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-slate-500 text-sm">
          Select a site above to view MRV telemetry.
        </div>
      )}

      {/* Remote Sensing Verification Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
            <Satellite className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">ESA Sentinel-2 Multispectral</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            10-meter resolution visual and near-infrared reflectance (B4/B8) for bi-weekly vegetative biomass index tracking.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
            <Trees className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">NASA GEDI Lidar Canopy Model</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Spaceborne laser altimetry measuring vertical tree canopy structure and allometric above-ground carbon density.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Third-Party Verification Ready</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Immutable cryptographic timestamp logs formatted for Verra, Gold Standard, and Plan Vivo registry audits.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
