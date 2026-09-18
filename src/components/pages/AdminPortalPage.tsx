import React, { useState } from 'react';
import { Shield, Plus, Database, MapPin, FolderKanban, CheckCircle2, AlertCircle, RefreshCw, Key, Users, ArrowUpRight, BarChart3, Activity, Sparkles } from 'lucide-react';
import { Project, Site, User } from '../../types';
import { motion } from 'motion/react';

interface AdminPortalPageProps {
  projects: Project[];
  sites: Site[];
  currentUser: User | null;
  onOpenProjectModal: () => void;
  onOpenSiteModal: () => void;
  onViewOnMap: (projectId: string) => void;
  onViewAnalytics: (siteId: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  projects,
  sites,
  currentUser,
  onOpenProjectModal,
  onOpenSiteModal,
  onViewOnMap,
  onViewAnalytics,
}) => {
  const [activeSection, setActiveSection] = useState<'projects' | 'sites' | 'activity'>('projects');

  const totalHectares = sites.reduce((sum, s) => sum + s.areaHectares, 0);
  const totalCarbon = sites.reduce((sum, s) => sum + s.currentCarbonStock, 0);
  const totalBudget = projects.reduce((sum, p) => sum + p.budgetUsd, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      {/* Admin Security Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ADMIN CONSOLE
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated Session
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                DARUKAA.EARTH Operations Manager
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Logged in as <strong>{currentUser?.name || 'Administrator'}</strong> ({currentUser?.email || 'admin@darukaa.earth'}) • Role: Carbon Modeling &amp; GIS Lead
              </p>
            </div>
          </div>

          {/* Quick Creator Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenProjectModal}
              className="px-4 py-2.5 rounded-full bg-[#cce24b] hover:bg-[#bdd43e] text-[#142119] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Project</span>
            </button>
            <button
              onClick={onOpenSiteModal}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#cce24b]" />
              <span>+ Add Site Polygon</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Projects</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{projects.length} Portfolios</span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">100% active status</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monitored Polygons</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{sites.length} Sites</span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {totalHectares.toLocaleString()} total hectares
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Sequestered Carbon</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
            {totalCarbon.toLocaleString()} <span className="text-sm font-normal text-slate-500">tCO2e</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">MRV Verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Capital Deployed</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            ${(totalBudget / 1000).toFixed(0)}k <span className="text-sm font-normal text-slate-500">USD</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Restoration Funding</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('projects')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'projects'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveSection('sites')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'sites'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manage Site Polygons ({sites.length})
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'activity'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System &amp; Database Health
        </button>
      </div>

      {/* Section 1: Projects Table */}
      {activeSection === 'projects' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Conservation Projects Inventory</h2>
            <button
              onClick={onOpenProjectModal}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              + Add New Project
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Project Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Carbon Progress</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span>{project.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{project.country}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">
                        {project.sequesteredCarbonTons.toLocaleString()} / {project.targetCarbonTons.toLocaleString()} tCO2e
                      </div>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((project.sequesteredCarbonTons / project.targetCarbonTons) * 100))}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      ${(project.budgetUsd / 1000).toLocaleString()}k USD
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onViewOnMap(project.id)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                      >
                        View Map
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Sites Table */}
      {activeSection === 'sites' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">PostGIS Polygon Sites Delineation</h2>
            <button
              onClick={onOpenSiteModal}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              + Add Site Polygon
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Site Name</th>
                  <th className="py-3.5 px-4">Area (ha)</th>
                  <th className="py-3.5 px-4">Centroid Coordinates</th>
                  <th className="py-3.5 px-4">Sentinel NDVI</th>
                  <th className="py-3.5 px-4">Carbon Stock</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>{site.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{site.locationName}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {site.areaHectares.toLocaleString()} ha
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      {site.center.lat.toFixed(4)}, {site.center.lng.toFixed(4)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                        {site.averageNdvi}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      {site.currentCarbonStock.toLocaleString()} tCO2e
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onViewAnalytics(site.id)}
                        className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold cursor-pointer"
                      >
                        Analytics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: System & Database Health */}
      {activeSection === 'activity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>Spatial Database Health (PostGIS 3.4)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Database Engine</span>
                <span className="font-bold text-slate-800">PostgreSQL 16 + PostGIS extension</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Spatial Reference System</span>
                <span className="font-bold text-slate-800">EPSG:4326 (WGS84 Geodetic)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Spatial Index</span>
                <span className="font-bold text-emerald-700">GIST (geom) Active</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Query Response Time</span>
                <span className="font-bold text-emerald-700">14 ms (p99)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Audit Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All polygons valid
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Real-Time Audit Stream</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Sentinel-2 Orbit Telemetry Ingested</p>
                  <p className="text-[11px] text-slate-500">NDVI update recorded for Western Ghats Moist Deciduous Canopy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Geodesic Polygon Recalculation</p>
                  <p className="text-[11px] text-slate-500">Sundarbans Delta Blue Carbon Mangroves verified at 42,000 ha.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Carbon Credit Batch Verified</p>
                  <p className="text-[11px] text-slate-500">Verra VM0047 standard compliance verified by audit team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
