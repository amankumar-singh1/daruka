import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MousePointerClick, RefreshCw, Check, Undo2, Trash2, Maximize2, Shield, Trees } from 'lucide-react';
import { Site, Coordinates } from '../../types';

interface InteractiveMapProps {
  sites: Site[];
  selectedSite: Site | null;
  onSelectSite: (site: Site) => void;
  onPolygonCreated: (coords: Coordinates[], calculatedHectares: number) => void;
}

// Calculate spherical polygon area in hectares using Shoelace on equirectangular projection
function calculatePolygonAreaHectares(coords: Coordinates[]): number {
  if (coords.length < 3) return 0;
  const earthRadius = 6371000; // meters
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];
    const x1 = (p1.lng * Math.PI) / 180;
    const y1 = (p1.lat * Math.PI) / 180;
    const x2 = (p2.lng * Math.PI) / 180;
    const y2 = (p2.lat * Math.PI) / 180;
    area += (x2 - x1) * (2 + Math.sin(y1) + Math.sin(y2));
  }
  area = Math.abs((area * earthRadius * earthRadius) / 2);
  const hectares = area / 10000;
  return Math.round(hectares);
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  onPolygonCreated,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const sitesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const drawLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [basemap, setBasemap] = useState<'satellite' | 'streets'>('satellite');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Coordinates[]>([]);
  const [computedHectares, setComputedHectares] = useState<number>(0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around tropical Indo-Pacific / Global tropics where our projects are located
    const map = L.map(mapContainerRef.current, {
      center: [12.0, 78.0],
      zoom: 4,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Default to Esri World Imagery (Satellite)
    const initialTileUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const initialTile = L.tileLayer(initialTileUrl, {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = initialTile;
    sitesLayerGroupRef.current = L.layerGroup().addTo(map);
    drawLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Invalidate size on mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Basemap
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      basemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTile = L.tileLayer(tileUrl, {
      attribution: basemap === 'satellite' ? 'Esri Satellite' : '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [basemap]);

  // Render Site Polygons & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const sitesGroup = sitesLayerGroupRef.current;
    if (!map || !sitesGroup) return;

    sitesGroup.clearLayers();

    sites.forEach((site) => {
      const isSelected = selectedSite?.id === site.id;

      // Draw Polygon
      const latLngs = site.polygon.map((p) => [p.lat, p.lng] as [number, number]);
      const polygon = L.polygon(latLngs, {
        color: isSelected ? '#cce24b' : '#10b981',
        weight: isSelected ? 3 : 2,
        fillColor: isSelected ? '#cce24b' : '#059669',
        fillOpacity: isSelected ? 0.45 : 0.25,
        dashArray: isSelected ? undefined : '4, 4',
      });

      polygon.on('click', () => {
        onSelectSite(site);
      });

      polygon.bindTooltip(
        `<div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;">
          <strong>${site.name}</strong><br/>
          <span>Area: ${site.areaHectares.toLocaleString()} Ha • NDVI: ${site.averageNdvi}</span>
        </div>`,
        { sticky: true }
      );

      sitesGroup.addLayer(polygon);

      // Custom divIcon marker at center
      const iconHtml = `
        <div style="
          background: ${isSelected ? '#cce24b' : '#142119'};
          color: ${isSelected ? '#142119' : '#ffffff'};
          padding: 3px 8px;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 1.5px solid #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
        ">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${isSelected ? '#059669' : '#cce24b'};"></span>
          ${site.code}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-site-label',
        html: iconHtml,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker([site.center.lat, site.center.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectSite(site);
      });

      sitesGroup.addLayer(marker);
    });
  }, [sites, selectedSite, onSelectSite]);

  // Handle Map Click in Drawing Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawing) return;
      const newPoint: Coordinates = {
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      };
      setDrawnPoints((prev) => {
        const next = [...prev, newPoint];
        const area = calculatePolygonAreaHectares(next);
        setComputedHectares(area);
        return next;
      });
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawing]);

  // Render Drawn Points & Polygons
  useEffect(() => {
    const drawGroup = drawLayerGroupRef.current;
    if (!drawGroup) return;

    drawGroup.clearLayers();

    if (drawnPoints.length === 0) return;

    // Draw markers on each vertex
    drawnPoints.forEach((point, idx) => {
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: 6,
        fillColor: '#f59e0b',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).bindTooltip(`Vertex ${idx + 1}: [${point.lat}, ${point.lng}]`);
      drawGroup.addLayer(circle);
    });

    // If 2 points, draw polyline
    if (drawnPoints.length === 2) {
      const latLngs = drawnPoints.map((p) => [p.lat, p.lng] as [number, number]);
      const polyline = L.polyline(
        latLngs,
        { color: '#f59e0b', weight: 2, dashArray: '4, 4' }
      );
      drawGroup.addLayer(polyline);
    }

    // If 3+ points, draw polygon
    if (drawnPoints.length >= 3) {
      const latLngs = drawnPoints.map((p) => [p.lat, p.lng] as [number, number]);
      const polygon = L.polygon(
        latLngs,
        {
          color: '#f59e0b',
          weight: 3,
          fillColor: '#fbbf24',
          fillOpacity: 0.35,
        }
      );
      drawGroup.addLayer(polygon);
    }
  }, [drawnPoints]);

  // Pan to selected site
  useEffect(() => {
    if (selectedSite && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedSite.center.lat, selectedSite.center.lng], 9, {
        duration: 1.2,
      });
    }
  }, [selectedSite]);

  const handleFinishDrawing = () => {
    if (drawnPoints.length < 3) {
      alert('Please click at least 3 vertices on the map to define a closed geographical polygon.');
      return;
    }
    const area = calculatePolygonAreaHectares(drawnPoints);
    onPolygonCreated(drawnPoints, area || 500);
    setIsDrawing(false);
    setDrawnPoints([]);
    setComputedHectares(0);
  };

  const handleUndoPoint = () => {
    setDrawnPoints((prev) => {
      const next = prev.slice(0, -1);
      setComputedHectares(calculatePolygonAreaHectares(next));
      return next;
    });
  };

  const handleClearDrawing = () => {
    setDrawnPoints([]);
    setComputedHectares(0);
  };

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-900 z-0" />

      {/* Floating Top Control Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Basemap Switcher & Status */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-white/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 pr-2 border-r border-slate-200">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Layer</span>
          </div>
          <button
            type="button"
            onClick={() => setBasemap('satellite')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              basemap === 'satellite'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite (Esri)
          </button>
          <button
            type="button"
            onClick={() => setBasemap('streets')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              basemap === 'streets'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Topographic (OSM)
          </button>
        </div>

        {/* Right: Polygon Drawing Action Trigger */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!isDrawing ? (
            <button
              type="button"
              onClick={() => setIsDrawing(true)}
              className="bg-[#36513b] hover:bg-[#283e2d] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MousePointerClick className="w-4 h-4 text-[#cce24b]" />
              <span>Draw New Site Polygon</span>
            </button>
          ) : (
            <div className="bg-amber-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Drawing Mode Active • Click on Map</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Drawing Panel when active */}
      {isDrawing && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-amber-300 text-xs text-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <MousePointerClick className="w-4 h-4 text-amber-600" />
              <span>Draw Site Boundary</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              {drawnPoints.length} Vertices
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3 leading-tight">
            Click multiple geographic points to delineate the restoration boundary. At least 3 points are needed for PostGIS polygon geometry.
          </p>

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-800 block uppercase font-bold">Calculated Area:</span>
              <span className="text-sm font-extrabold text-slate-900">
                {computedHectares > 0 ? `${computedHectares.toLocaleString()} Hectares` : '—'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-800 block uppercase font-bold">SRID / Projection:</span>
              <span className="font-mono text-[10px] text-slate-600">EPSG:4326 (WGS 84)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFinishDrawing}
              disabled={drawnPoints.length < 3}
              className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                drawnPoints.length >= 3
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save as New Site</span>
            </button>
            <button
              type="button"
              onClick={handleUndoPoint}
              disabled={drawnPoints.length === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
              title="Undo last point"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClearDrawing}
              disabled={drawnPoints.length === 0}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-40 cursor-pointer"
              title="Clear all points"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDrawing(false);
                handleClearDrawing();
              }}
              className="px-2.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] border border-white/20">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Active PostGIS Site</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cce24b] inline-block" />
          <span>Selected Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span>Drawing Polygon</span>
        </div>
      </div>
    </div>
  );
};
