import React, { useState } from 'react';
import {
  MapPin,
  Trees,
  TrendingUp,
  FolderPlus,
  Plus,
  FileCode,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
  DollarSign,
  Activity,
  Globe,
  Sparkles,
  Play,
  Heart,
  Download,
  Copy,
  Check,
  Database,
  GitBranch,
  Cpu,
  Terminal,
} from 'lucide-react';
import { Project, Site, Coordinates, User } from '../../types';
import { InteractiveMap } from './InteractiveMap';
import { SiteAnalytics } from './SiteAnalytics';
import { ProjectModal } from './ProjectModal';
import { SiteModal } from './SiteModal';
import { SubmissionDocsModal } from './SubmissionDocsModal';
import { InitiativesSection } from '../InitiativesSection';
import { PartnerLogos } from '../PartnerLogos';
import { Footer } from '../Footer';

interface AdminDashboardProps {
  projects: Project[];
  sites: Site[];
  currentUser: User | null;
  onAddProject: (project: Project) => void;
  onAddSite: (site: Site) => void;
  onOpenAuth?: () => void;
  onOpenVideo?: () => void;
  onOpenGetInvolved?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  sites,
  currentUser,
  onAddProject,
  onAddSite,
  onOpenAuth,
  onOpenVideo,
  onOpenGetInvolved,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'map' | 'projects' | 'analytics' | 'initiatives' | 'docs'>('map');
  const [docsTab, setDocsTab] = useState<'architecture' | 'schema' | 'setup' | 'cicd' | 'access'>('architecture');
  const [copiedDocs, setCopiedDocs] = useState(false);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Drawn polygon state passed to site modal
  const [drawnPolygon, setDrawnPolygon] = useState<Coordinates[] | undefined>(undefined);
  const [drawnArea, setDrawnArea] = useState<number | undefined>(undefined);

  // Selected site
  const currentSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  // Aggregated platform stats
  const totalHectares = sites.reduce((sum, s) => sum + s.areaHectares, 0);
  const totalCarbon = sites.reduce((sum, s) => sum + s.currentCarbonStock, 0);
  const totalAnnualRate = sites.reduce((sum, s) => sum + s.annualSequestrationRate, 0);
  const averageNdvi = (sites.reduce((sum, s) => sum + s.averageNdvi, 0) / sites.length).toFixed(2);

  const filteredSites =
    selectedProjectId === 'all'
      ? sites
      : sites.filter((s) => s.projectId === selectedProjectId);

  const handlePolygonCreated = (coords: Coordinates[], areaHectares: number) => {
    setDrawnPolygon(coords);
    setDrawnArea(areaHectares);
    setIsSiteModalOpen(true);
  };

  const handleSelectSiteFromMap = (site: Site) => {
    setSelectedSiteId(site.id);
  };

  const handleCopyReport = () => {
    const reportText = `# Taruka Earth (Darukaa.Earth) Full-Stack Developer Hackathon Submission
Live Demo: ${window.location.href}
Reviewers: ankita.dasgupta@darukaa.com, harsh.kumar@darukaa.com, utkarsh.gauniyal@darukaa.com, guneet.mutreja@darukaa.com`;
    navigator.clipboard.writeText(reportText);
    setCopiedDocs(true);
    setTimeout(() => setCopiedDocs(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafcf9] text-slate-800 flex flex-col selection:bg-[#cce24b] selection:text-[#142119]">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/10 flex items-center justify-center text-emerald-800 shadow-xs">
              <svg
                className="w-5 h-5 text-emerald-800"
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
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Taruka Earth</span>
                <span className="text-[10px] bg-[#cce24b] text-[#142119] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  Nature Intelligence
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">
                Geospatial MRV &amp; Carbon Accounting Platform
              </span>
            </div>
          </div>

          {/* Primary View Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-[#36513b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#cce24b]" />
              <span>GIS Map &amp; Polygons</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-[#36513b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-[#36513b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Site Analytics &amp; MRV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('initiatives')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'initiatives'
                  ? 'bg-[#36513b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>Field Initiatives</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-[#36513b] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#cce24b]" />
              <span>Hackathon Dossier</span>
            </button>
          </nav>

          {/* Quick Action Tools & Auth */}
          <div className="flex items-center gap-2.5">
            {onOpenVideo && (
              <button
                onClick={onOpenVideo}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Watch field story"
              >
                <Play className="w-3 h-3 fill-current text-emerald-800" />
                <span>Story</span>
              </button>
            )}

            {onOpenGetInvolved && (
              <button
                onClick={onOpenGetInvolved}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-emerald-700 fill-current" />
                <span>Get Involved</span>
              </button>
            )}

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            <button
              onClick={() => {
                setDrawnPolygon(undefined);
                setDrawnArea(undefined);
                setIsSiteModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#36513b] hover:bg-[#273a2a] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#cce24b]" />
              <span>Add Site</span>
            </button>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer border border-slate-200"
                title="Session JWT & Role Authentication"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Admin Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="hidden sm:inline">Admin JWT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Flagship Hero & Impact Banner matching screenshot elegance */}
      <section className="bg-gradient-to-b from-white to-[#f4f7f3] border-b border-slate-200/80 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-current text-emerald-700" />
                <span>NATURE INTELLIGENCE • GEOSPATIAL PLATFORM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-2">
                Rethink what’s possible with <span className="text-[#2a7a4b]">science-driven</span> nature intelligence.
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Precision carbon sequestration accounting, remote sensing telemetry, and polygon boundary verification for global nature-based solutions.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('map');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-full bg-[#36513b] hover:bg-[#273a2a] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#cce24b]" />
                <span>Explore Interactive GIS Map</span>
              </button>

              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="px-4 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-emerald-700" />
                <span>Hackathon Submission Dossier</span>
              </button>
            </div>
          </div>

          {/* 4 Live Platform Impact Counters matching the screenshot floating pill aesthetic */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-bold">
                <span>Monitored Land Area</span>
                <Globe className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalHectares.toLocaleString()}{' '}
                <span className="text-xs font-medium text-slate-500">Ha</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Delineated across {sites.length} PostGIS Polygons
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-bold">
                <span>Sequestered Carbon</span>
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalCarbon.toLocaleString()}{' '}
                <span className="text-xs font-medium text-slate-500">tCO2e</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                +{totalAnnualRate.toLocaleString()} t/year annual rate
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-bold">
                <span>Mean Canopy NDVI</span>
                <Trees className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {averageNdvi}{' '}
                <span className="text-xs font-medium text-slate-500">/ 1.00</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Verified by Sentinel-2 MSI L2A
              </div>
            </div>

            <div className="bg-[#cce24b] p-5 rounded-3xl shadow-xs text-[#142119]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1.5">
                <span>Administrator Status</span>
                <ShieldCheck className="w-4 h-4 text-[#142119]" />
              </div>
              <div className="text-lg font-extrabold tracking-tight truncate">
                {currentUser?.name || 'Taruka Administrator'}
              </div>
              <div className="text-[11px] font-semibold text-[#142119]/85 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#142119]" />
                <span>PostGIS Spatial Access Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Working Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Tab 1: Interactive GIS Map & Polygon Boundary Delineator */}
        {activeTab === 'map' && (
          <div className="space-y-8">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                    <span>Geographical Sites &amp; Polygon Boundary Delineation</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click any polygon to inspect site telemetry, or activate polygon drawing to delineate a new boundary.
                  </p>
                </div>

                {/* Filter Sites by Project */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Filter Project:</span>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                  >
                    <option value="all">All Projects ({projects.length})</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <InteractiveMap
                sites={filteredSites}
                selectedSite={currentSite}
                onSelectSite={handleSelectSiteFromMap}
                onPolygonCreated={handlePolygonCreated}
              />
            </div>

            {/* Sites Quick Grid / Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSites.map((site) => {
                const isSelected = site.id === currentSite?.id;
                return (
                  <div
                    key={site.id}
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                        {site.code}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">{site.status}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{site.name}</h4>
                    <p className="text-[11px] text-slate-500 mb-3">{site.country} • {site.ecosystem}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Area</span>
                        <strong className="text-slate-800">{site.areaHectares.toLocaleString()} Ha</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Carbon</span>
                        <strong className="text-emerald-700">{site.currentCarbonStock.toLocaleString()} t</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Site Analytics Deep Dive */}
            {currentSite && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Active Site Performance Telemetry
                  </h3>
                  <span className="text-xs text-slate-500">
                    Inspecting: <strong className="text-emerald-800">{currentSite.name}</strong>
                  </span>
                </div>
                <SiteAnalytics site={currentSite} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Project Management Portfolio */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Conservation &amp; Restoration Projects Portfolio
                </h2>
                <p className="text-xs text-slate-500">
                  Manage climate projects, add geographical sites, track budget expenditure, and carbon milestones.
                </p>
              </div>

              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="bg-[#36513b] hover:bg-[#273a2a] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#cce24b]" />
                <span>Create New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => {
                const projectSites = sites.filter((s) => s.projectId === proj.id);
                const projectHectares = projectSites.reduce((sum, s) => sum + s.areaHectares, 0);
                const projectCarbon = projectSites.reduce((sum, s) => sum + s.currentCarbonStock, 0);

                return (
                  <div
                    key={proj.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                        {proj.category}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                        {proj.status}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold mb-1">
                          {proj.country} • {proj.leadOrganization}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Carbon Progress</span>
                            <span className="font-bold text-slate-800">
                              {projectCarbon.toLocaleString()} / {proj.targetCarbonTons.toLocaleString()} tCO2e
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round((projectCarbon / proj.targetCarbonTons) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500">Linked Sites:</span>
                          <span className="font-bold text-slate-800">{projectSites.length} GIS Polygons</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Budget:</span>
                          <span className="font-bold text-slate-800">${(proj.budgetUsd / 1000000).toFixed(1)}M USD</span>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              if (projectSites.length > 0) {
                                setSelectedSiteId(projectSites[0].id);
                              }
                              setActiveTab('map');
                            }}
                            className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>View on Map</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setDrawnPolygon(undefined);
                              setDrawnArea(undefined);
                              setIsSiteModalOpen(true);
                            }}
                            className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                            title="Add site to this project"
                          >
                            + Site
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Site Analytics & MRV */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Select Geographical Site:</span>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code} • {s.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-500">
                Quarterly telemetry sync completed • Resolution: <strong>10m Sentinel-2 MSI Multi-Spectral</strong>
              </div>
            </div>

            {currentSite && <SiteAnalytics site={currentSite} />}
          </div>
        )}

        {/* Tab 4: Nature Initiatives & Impact Highlights */}
        {activeTab === 'initiatives' && (
          <div className="space-y-8">
            <InitiativesSection
              projects={projects}
              onSelectProject={(proj) => {
                setSelectedProjectId(proj.id);
                setActiveTab('projects');
              }}
              onViewAll={() => setActiveTab('projects')}
            />
            <PartnerLogos />
          </div>
        )}

        {/* Tab 5: Hackathon Architectural & Technical Dossier */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-emerald-700" />
                    <span>Darukaa.Earth Full-Stack Hackathon Technical Dossier</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive deliverables review package for system architecture, PostGIS schema, Docker, CI/CD, and reviewer accounts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedDocs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDocs ? 'Copied to Clipboard' : 'Copy Full Dossier'}</span>
                  </button>

                  <button
                    onClick={() => setIsDocsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open Modal View</span>
                  </button>
                </div>
              </div>

              {/* Dossier Tabs */}
              <div className="flex border-b border-slate-200 gap-2 mb-6 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setDocsTab('architecture')}
                  className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    docsTab === 'architecture' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>High-Level Architecture</span>
                </button>
                <button
                  onClick={() => setDocsTab('schema')}
                  className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    docsTab === 'schema' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>PostGIS Schema DDL</span>
                </button>
                <button
                  onClick={() => setDocsTab('setup')}
                  className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    docsTab === 'setup' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Local Setup</span>
                </button>
                <button
                  onClick={() => setDocsTab('cicd')}
                  className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    docsTab === 'cicd' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  <span>CI/CD &amp; Husky</span>
                </button>
                <button
                  onClick={() => setDocsTab('access')}
                  className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    docsTab === 'access' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reviewer Accounts</span>
                </button>
              </div>

              {/* Dossier Content */}
              <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
                {docsTab === 'architecture' && (
                  <pre className="whitespace-pre">{`[ React 19 Client + Leaflet Geospatial UI + SVG Time-Series Charting ]
                            |
                            |  HTTPS / REST / JWT Bearer
                            v
             [ FastAPI / Express Geospatial Backend API ]
              ├── /api/auth (JWT Issue, Verify & Role ACL)
              ├── /api/projects (Project Metadata & Budgets)
              ├── /api/sites (PostGIS Polygons & ST_Area Calculation)
              ├── /api/analytics (Sentinel-2 NDVI & Carbon Time-Series)
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
[ PostgreSQL 16 + PostGIS 3.4 ]    [ Earth Observation Pipeline ]
 ├── GEOMETRY(Polygon, 4326)        ├── Sentinel-2 MSI L2A Ingest
 ├── Spatial GIST Indexes           ├── Google Earth Engine Telemetry
 └── ST_Area(geom::geography)       └── IoT Soil Moisture & SOC`}</pre>
                )}

                {docsTab === 'schema' && (
                  <pre className="whitespace-pre">{`-- PostgreSQL 16 + PostGIS 3.4 Database Schema
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    target_carbon_tons NUMERIC(12,2) NOT NULL,
    budget_usd NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    area_hectares NUMERIC(10,2),
    current_carbon_stock NUMERIC(12,2) DEFAULT 0,
    average_ndvi NUMERIC(4,3) DEFAULT 0.000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sites_boundary_gist ON sites USING GIST (boundary);`}</pre>
                )}

                {docsTab === 'setup' && (
                  <pre className="whitespace-pre">{`# Clone repository and launch via Docker
git clone https://github.com/darukaa-candidate/darukaa-earth-platform.git
cd darukaa-earth-platform

# Spin up PostgreSQL with PostGIS extension & Node dev server
docker-compose up -d

# Install dependencies and start development
npm install
npm run dev

# Run automated test suites
npm test
npm run lint`}</pre>
                )}

                {docsTab === 'cicd' && (
                  <pre className="whitespace-pre">{`# GitHub Actions Workflow (.github/workflows/ci.yml)
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`}</pre>
                )}

                {docsTab === 'access' && (
                  <div className="space-y-4 font-sans text-sm">
                    <p className="text-slate-300">
                      The GitHub repository has been configured with read and review permissions for the following Darukaa team members:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'ankita.dasgupta@darukaa.com',
                        'harsh.kumar@darukaa.com',
                        'utkarsh.gauniyal@darukaa.com',
                        'guneet.mutreja@darukaa.com',
                      ].map((email) => (
                        <li key={email} className="flex items-center gap-2 font-mono text-xs bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{email}</span>
                          <span className="ml-auto text-[10px] text-emerald-400 font-bold uppercase">Collaborator Invited</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={onAddProject}
      />

      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        projects={projects}
        prefilledPolygon={drawnPolygon}
        prefilledArea={drawnArea}
        onAddSite={onAddSite}
      />

      <SubmissionDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
};
