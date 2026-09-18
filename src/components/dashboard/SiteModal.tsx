import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Trees, ShieldCheck, Plus, Check, Upload, FileCode, Image as ImageIcon } from 'lucide-react';
import { Project, Site, Coordinates } from '../../types';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  prefilledPolygon?: Coordinates[];
  prefilledArea?: number;
  onAddSite: (site: Site) => void;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  onClose,
  projects,
  prefilledPolygon,
  prefilledArea,
  onAddSite,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('India');
  const [locationName, setLocationName] = useState('Central Highlands Sector B');
  const [ecosystem, setEcosystem] = useState<Site['ecosystem']>('Tropical Rainforest');
  const [areaHectares, setAreaHectares] = useState<number>(prefilledArea || 4500);
  const [baselineCarbonStock, setBaselineCarbonStock] = useState<number>(38000);
  const [currentCarbonStock, setCurrentCarbonStock] = useState<number>(54000);
  const [annualSequestrationRate, setAnnualSequestrationRate] = useState<number>(9500);
  const [averageNdvi, setAverageNdvi] = useState<number>(0.78);
  const [biodiversityIndex, setBiodiversityIndex] = useState<number>(89);
  const [treeCanopyCover, setTreeCanopyCover] = useState<number>(84);
  const [siteImageUrl, setSiteImageUrl] = useState(
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  );
  const [customPolygon, setCustomPolygon] = useState<Coordinates[] | undefined>(prefilledPolygon);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [uploadedGeoJsonName, setUploadedGeoJsonName] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const geoJsonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefilledArea && prefilledArea > 0) {
      setAreaHectares(prefilledArea);
    }
    if (prefilledPolygon && prefilledPolygon.length >= 3) {
      setCustomPolygon(prefilledPolygon);
    }
  }, [prefilledArea, prefilledPolygon]);

  if (!isOpen) return null;

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSiteImageUrl(e.target.result as string);
        setUploadedImageName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeoJsonUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        let coords: Coordinates[] = [];

        // Support GeoJSON FeatureCollection, Feature, or raw Geometry
        let rawPolygonCoords: number[][] | null = null;
        if (parsed.type === 'FeatureCollection' && parsed.features?.[0]?.geometry) {
          rawPolygonCoords = parsed.features[0].geometry.coordinates[0];
        } else if (parsed.type === 'Feature' && parsed.geometry) {
          rawPolygonCoords = parsed.geometry.coordinates[0];
        } else if (parsed.type === 'Polygon') {
          rawPolygonCoords = parsed.coordinates[0];
        }

        if (rawPolygonCoords && rawPolygonCoords.length >= 3) {
          coords = rawPolygonCoords.map((pt) => ({
            lng: Number(pt[0]),
            lat: Number(pt[1]),
          }));
          setCustomPolygon(coords);
          setUploadedGeoJsonName(`${file.name} (${coords.length} vertices parsed)`);
          
          // Approximate area in hectares
          const approxHectares = Math.round(coords.length * 850);
          setAreaHectares(approxHectares);
        } else {
          alert('Could not find polygon coordinates in this GeoJSON file.');
        }
      } catch (err) {
        alert('Invalid GeoJSON JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedProjectId) return;

    // Calculate center
    let center: Coordinates = { lat: 14.5, lng: 76.2 };
    let polygon = customPolygon || prefilledPolygon;

    if (polygon && polygon.length >= 3) {
      const avgLat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
      const avgLng = polygon.reduce((sum, p) => sum + p.lng, 0) / polygon.length;
      center = { lat: Number(avgLat.toFixed(4)), lng: Number(avgLng.toFixed(4)) };
    } else {
      polygon = [
        { lat: 14.52, lng: 76.18 },
        { lat: 14.54, lng: 76.24 },
        { lat: 14.48, lng: 76.22 },
        { lat: 14.47, lng: 76.17 },
      ];
    }

    const newSite: Site = {
      id: `site-${Date.now()}`,
      projectId: selectedProjectId,
      name,
      code: code || `DKA-GEO-${Math.floor(100 + Math.random() * 900)}`,
      country,
      locationName,
      center,
      polygon,
      areaHectares: Number(areaHectares),
      ecosystem,
      baselineCarbonStock: Number(baselineCarbonStock),
      currentCarbonStock: Number(currentCarbonStock),
      annualSequestrationRate: Number(annualSequestrationRate),
      averageNdvi: Number(averageNdvi),
      biodiversityIndex: Number(biodiversityIndex),
      treeCanopyCover: Number(treeCanopyCover),
      status: 'Active Monitoring',
      establishedDate: new Date().toISOString().split('T')[0],
      imageUrl: siteImageUrl,
      metricsHistory: [
        { date: '2023-Q3', carbonSequestered: baselineCarbonStock, targetCarbon: baselineCarbonStock, ndvi: averageNdvi - 0.15, biodiversityScore: biodiversityIndex - 12, biomassDensity: 140, soilOrganicCarbon: 4.0 },
        { date: '2023-Q4', carbonSequestered: baselineCarbonStock + 5000, targetCarbon: baselineCarbonStock + 4000, ndvi: averageNdvi - 0.08, biodiversityScore: biodiversityIndex - 8, biomassDensity: 160, soilOrganicCarbon: 4.4 },
        { date: '2024-Q1', carbonSequestered: currentCarbonStock, targetCarbon: currentCarbonStock - 2000, ndvi: averageNdvi, biodiversityScore: biodiversityIndex, biomassDensity: 190, soilOrganicCarbon: 4.9 },
      ],
    };

    onAddSite(newSite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#cce24b] text-[#142119] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add Geographical Site to Project</h3>
            <p className="text-xs text-slate-500">Attach PostGIS polygon boundary and baseline carbon metrics</p>
          </div>
        </div>

        {prefilledPolygon && prefilledPolygon.length >= 3 && (
          <div className="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Polygon Linked:</strong> {prefilledPolygon.length} coordinates captured from map drawing tool
              </span>
            </div>
            <span className="font-bold bg-emerald-200/80 px-2 py-0.5 rounded text-[11px]">
              {prefilledArea ? `${prefilledArea.toLocaleString()} Ha` : 'Custom'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30 bg-white"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title} ({proj.country})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Agumbe Ridge Canopy Reserve"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Code / ID</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DKA-IND-04"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ecosystem Classification</label>
              <select
                value={ecosystem}
                onChange={(e) => setEcosystem(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30 bg-white"
              >
                <option value="Tropical Rainforest">Tropical Rainforest</option>
                <option value="Mangrove & Coastal">Mangrove &amp; Coastal</option>
                <option value="Temperate Forest">Temperate Forest</option>
                <option value="Peatland Wetland">Peatland Wetland</option>
                <option value="Savanna Grassland">Savanna Grassland</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area (Hectares)</label>
              <input
                type="number"
                required
                value={areaHectares}
                onChange={(e) => setAreaHectares(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Baseline Carbon (tCO2e)</label>
              <input
                type="number"
                required
                value={baselineCarbonStock}
                onChange={(e) => setBaselineCarbonStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Carbon (tCO2e)</label>
              <input
                type="number"
                required
                value={currentCarbonStock}
                onChange={(e) => setCurrentCarbonStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NDVI Index (0-1)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={averageNdvi}
                onChange={(e) => setAverageNdvi(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biodiversity Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={biodiversityIndex}
                onChange={(e) => setBiodiversityIndex(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tree Canopy %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={treeCanopyCover}
                onChange={(e) => setTreeCanopyCover(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
              />
            </div>
          </div>

          {/* Device Assets Upload for Site: Ground Photo & GeoJSON Boundary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Ground Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Site Ground Photo</span>
                <span className="text-[10px] text-emerald-700 font-medium">Device file</span>
              </label>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3"
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {siteImageUrl ? (
                    <img src={siteImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {uploadedImageName || 'Upload photo from device'}
                  </p>
                  <p className="text-[10px] text-slate-400">Click to choose image</p>
                </div>
              </div>
            </div>

            {/* 2. GeoJSON Boundary Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Import Boundary (.geojson)</span>
                <span className="text-[10px] text-emerald-700 font-medium">Spatial file</span>
              </label>
              <div
                onClick={() => geoJsonInputRef.current?.click()}
                className="border border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3"
              >
                <input
                  ref={geoJsonInputRef}
                  type="file"
                  accept=".geojson,.json,.kml"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleGeoJsonUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <FileCode className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {uploadedGeoJsonName || 'Upload GeoJSON / KML'}
                  </p>
                  <p className="text-[10px] text-slate-400">Auto-parses polygon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#cce24b]" />
              <span>Register Site in PostGIS &amp; Attach to Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
