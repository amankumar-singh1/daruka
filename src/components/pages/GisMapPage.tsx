import React, { useState } from 'react';
import { MapPin, Trees, Layers, Plus, Sparkles, ChevronRight, BarChart3, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Project, Site, Coordinates } from '../../types';
import { InteractiveMap } from '../dashboard/InteractiveMap';
import { motion } from 'motion/react';

interface GisMapPageProps {
  projects: Project[];
  sites: Site[];
  selectedSiteId: string;
  onSelectSiteId: (id: string) => void;
  onOpenSiteModal: () => void;
  onGoToAnalytics: (siteId: string) => void;
  onPolygonCreated?: (coords: Coordinates[], calculatedHectares: number) => void;
}

export const GisMapPage: React.FC<GisMapPageProps> = ({
  projects,
  sites,
  selectedSiteId,
  onSelectSiteId,
  onOpenSiteModal,
  onGoToAnalytics,
  onPolygonCreated,
}) => {
  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const linkedProject = projects.find((p) => p.id === selectedSite?.projectId);

  const totalHectares = sites.reduce((sum, s) => sum + s.areaHectares, 0);
  const totalCarbon = sites.reduce((sum, s) => sum + s.currentCarbonStock, 0);

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
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>DARUKAA.EARTH GEOSPATIAL CADASTRE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Interactive GIS &amp; Site Polygons
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Centimeter-accurate polygon delineation, satellite ground-truthing, and live geodesic area calculations.
          </p>
        </div>

        {/* Action Button & Quick Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSiteModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#cce24b]" />
            <span>+ Add Site Polygon</span>
          </button>
        </div>
      </div>

      {/* Summary Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Monitored Sites</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{sites.length} Active</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Area</span>
          <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
            {totalHectares.toLocaleString()} <span className="text-xs font-normal text-slate-600">ha</span>
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Verified Carbon</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {totalCarbon.toLocaleString()} <span className="text-xs font-normal text-slate-600">tCO2e</span>
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Coordinate CRS</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">EPSG:4326</span>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Workspace (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-2 border border-slate-200/80 shadow-md">
          <div className="h-[520px] rounded-2xl overflow-hidden relative">
            <InteractiveMap
              sites={sites}
              selectedSite={selectedSite}
              onSelectSite={(site) => onSelectSiteId(site.id)}
              onPolygonCreated={onPolygonCreated || (() => {})}
            />
          </div>
          <div className="p-3 bg-slate-50 rounded-b-2xl mt-1 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Active PostGIS Polygon
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Selected Boundary
              </span>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              Tip: Click any polygon on the map to inspect telemetry, or click Delineate to draw points.
            </span>
          </div>
        </div>

        {/* Selected Site Detail Drawer (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedSite ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                    {selectedSite.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 leading-tight">
                    {selectedSite.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedSite.locationName}, {selectedSite.country}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  GIS
                </div>
              </div>

              {/* Progress & Metrics */}
              <div className="space-y-3.5 my-5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Parent Project</span>
                  <span className="font-bold text-slate-800 truncate max-w-[160px]">
                    {linkedProject?.title || 'Standalone Site'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Geodesic Area</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedSite.areaHectares.toLocaleString()} hectares
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Current Carbon</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {selectedSite.currentCarbonStock.toLocaleString()} tCO2e
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sentinel-2 NDVI</span>
                  <span className="font-bold text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-md text-emerald-800">
                    {selectedSite.averageNdvi} (Dense Canopy)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Centroid Coordinates</span>
                  <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedSite.center.lat.toFixed(4)}, {selectedSite.center.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Action: Open Analytics */}
              <button
                onClick={() => onGoToAnalytics(selectedSite.id)}
                className="w-full py-2.5 rounded-full bg-[#cce24b] hover:bg-[#bdd43e] text-[#142119] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>View Deep-Dive MRV Analytics</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-500">
              Select a site to inspect boundary telemetry.
            </div>
          )}

          {/* Quick Site Switcher List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
              All Restoration Sites ({sites.length})
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => onSelectSiteId(site.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    site.id === selectedSiteId
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold truncate">{site.name}</div>
                    <div className="text-[11px] text-slate-500">{site.locationName}</div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                    {site.areaHectares} ha
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
