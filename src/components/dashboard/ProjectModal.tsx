import React, { useState, useRef } from 'react';
import { X, Plus, FolderPlus, DollarSign, Trees, Globe, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Reforestation');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [targetCarbonTons, setTargetCarbonTons] = useState(250000);
  const [budgetUsd, setBudgetUsd] = useState(3500000);
  const [leadOrganization, setLeadOrganization] = useState('Darukaa Conservation Alliance');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDeviceFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setUploadedFileName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDeviceFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !country) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      country,
      description,
      targetCarbonTons: Number(targetCarbonTons),
      sequesteredCarbonTons: 0,
      budgetUsd: Number(budgetUsd),
      totalHectares: 0,
      treesPlanted: 0,
      sitesCount: 0,
      leadOrganization,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      imageUrl,
      sdgGoals: [13, 15],
    };

    onCreateProject(newProject);
    onClose();
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FolderPlus className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Create New Carbon &amp; Biodiversity Project</h3>
            <p className="text-xs text-slate-500">Add an umbrella environmental initiative with multiple geographic sites</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Western Ghats Evergreen Canopy &amp; Wildlife Crossing"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30 bg-white"
              >
                <option value="Reforestation">Reforestation</option>
                <option value="Ocean & Mangroves">Ocean &amp; Mangroves</option>
                <option value="Wildlife Corridor">Wildlife Corridor</option>
                <option value="Peatland Carbon">Peatland Carbon</option>
                <option value="Community Forestry">Community Forestry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country / Geographic Region</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India / Karnataka"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description &amp; Objective</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of ecological objectives, baseline degradation, and community impact..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Carbon (tCO2e)</label>
              <input
                type="number"
                required
                value={targetCarbonTons}
                onChange={(e) => setTargetCarbonTons(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Budget (USD)</label>
              <input
                type="number"
                required
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lead Executing Entity</label>
            <input
              type="text"
              required
              value={leadOrganization}
              onChange={(e) => setLeadOrganization(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
            />
          </div>

          {/* Device Asset / Cover Photo Upload Section */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Project Cover Image (Upload from Device)</span>
              <span className="text-[10px] text-emerald-700 font-medium">Device files supported</span>
            </label>
            
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex items-center justify-between gap-4 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60'
                  : 'border-slate-300 hover:border-emerald-600 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleDeviceFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0 shadow-2xs">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {uploadedFileName || 'Drop an image from your device or click to browse'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports PNG, JPG, WebP from your computer
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 flex-shrink-0 shadow-2xs"
              >
                Browse File
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project &amp; Initialize PostGIS Registry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
