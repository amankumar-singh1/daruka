import React, { useState } from 'react';
import { FolderKanban, Plus, Search, Filter, MapPin, BarChart3, ArrowUpRight, DollarSign, Calendar, Trees } from 'lucide-react';
import { Project, Site } from '../../types';
import { motion } from 'motion/react';

interface ProjectsPageProps {
  projects: Project[];
  sites: Site[];
  onOpenProjectModal: () => void;
  onViewOnMap: (projectId: string) => void;
  onViewAnalytics: (siteId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  sites,
  onOpenProjectModal,
  onViewOnMap,
  onViewAnalytics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Reforestation', 'Blue Carbon', 'Agroforestry', 'Conservation'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-2">
            <FolderKanban className="w-3.5 h-3.5 text-emerald-700" />
            <span>DARUKAA.EARTH PORTFOLIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Conservation &amp; Restoration Projects
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Explore verified carbon sequestration, community forestry, and coastal blue carbon ecosystems.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenProjectModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#cce24b]" />
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <Trees className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
          <p className="text-xs text-slate-500 mt-1">Try refining your search terms or filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projectSites = sites.filter((s) => s.projectId === project.id);
            const totalProjectHectares = projectSites.reduce((sum, s) => sum + s.areaHectares, 0);
            const progressPercent = Math.min(100, Math.round((project.sequesteredCarbonTons / project.targetCarbonTons) * 100));

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Project Image Banner */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-slate-800 shadow-xs">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-[#cce24b]" />
                      {project.country}
                    </span>
                    <span className="font-semibold text-white/90">
                      {totalProjectHectares.toLocaleString()} ha
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2 leading-snug group-hover:text-emerald-800 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Carbon Sequestered</span>
                        <span className="text-emerald-800 font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{project.sequesteredCarbonTons.toLocaleString()} tCO2e</span>
                        <span>Target: {project.targetCarbonTons.toLocaleString()} tCO2e</span>
                      </div>
                    </div>

                    {/* Budget and Linked Sites */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget</span>
                        <span className="font-extrabold text-slate-800 mt-0.5 block">
                          ${(project.budgetUsd / 1000).toLocaleString()}k USD
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sites Polygons</span>
                        <span className="font-extrabold text-emerald-800 mt-0.5 block">
                          {projectSites.length} Polygons
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onViewOnMap(project.id)}
                      className="flex-1 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>View on Map</span>
                    </button>
                    {projectSites[0] && (
                      <button
                        onClick={() => onViewAnalytics(projectSites[0].id)}
                        className="py-2 px-3.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="View Telemetry Analytics"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>MRV</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
