import React, { useState } from 'react';
import {
  TrendingUp,
  Leaf,
  Layers,
  Sparkles,
  Calendar,
  Satellite,
  Radio,
  CheckCircle2,
  Trees,
  ShieldCheck,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Site, MetricDataPoint } from '../../types';

interface SiteAnalyticsProps {
  site: Site;
  onClose?: () => void;
}

export const SiteAnalytics: React.FC<SiteAnalyticsProps> = ({ site }) => {
  const [activeMetric, setActiveMetric] = useState<'carbon' | 'ndvi' | 'biodiversity' | 'biomass'>('carbon');
  const [hoveredPoint, setHoveredPoint] = useState<MetricDataPoint | null>(null);
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | 'ALL'>('ALL');

  const history = site.metricsHistory;
  if (!history || history.length === 0) {
    return <div className="p-6 text-center text-slate-500 text-xs">No metrics history recorded for this site.</div>;
  }

  // Determine chart values
  const getMetricValue = (item: MetricDataPoint) => {
    switch (activeMetric) {
      case 'carbon':
        return item.carbonSequestered;
      case 'ndvi':
        return item.ndvi;
      case 'biodiversity':
        return item.biodiversityScore;
      case 'biomass':
        return item.biomassDensity;
    }
  };

  const getMetricTarget = (item: MetricDataPoint) => {
    if (activeMetric === 'carbon') return item.targetCarbon;
    return undefined;
  };

  const metricLabel = {
    carbon: 'Carbon Sequestration (tCO2e)',
    ndvi: 'Normalized Difference Vegetation Index (NDVI)',
    biodiversity: 'Biodiversity Health Index (0-100)',
    biomass: 'Above-Ground Biomass Density (t/ha)',
  }[activeMetric];

  const metricUnit = {
    carbon: 'tCO2e',
    ndvi: '',
    biodiversity: 'pts',
    biomass: 't/ha',
  }[activeMetric];

  // SVG Chart Geometry
  const width = 640;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = history.map(getMetricValue);
  const targets = history.map((item) => getMetricTarget(item) || 0);

  const maxVal = Math.max(...values, ...(activeMetric === 'carbon' ? targets : [0])) * 1.15;
  const minVal = activeMetric === 'ndvi' ? 0.3 : 0;

  const getX = (index: number) => padding.left + (index / (history.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Polyline points
  const pointsString = history
    .map((item, idx) => `${getX(idx)},${getY(getMetricValue(item))}`)
    .join(' ');

  const targetPointsString =
    activeMetric === 'carbon'
      ? history.map((item, idx) => `${getX(idx)},${getY(item.targetCarbon)}`).join(' ')
      : '';

  const areaPathString = `M ${getX(0)},${padding.top + chartH} ` +
    history.map((item, idx) => `L ${getX(idx)},${getY(getMetricValue(item))}`).join(' ') +
    ` L ${getX(history.length - 1)},${padding.top + chartH} Z`;

  const latest = history[history.length - 1];
  const initial = history[0];
  const carbonGain = latest.carbonSequestered - initial.carbonSequestered;
  const ndviGain = ((latest.ndvi - initial.ndvi) / initial.ndvi) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      {/* Site Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <img
            src={site.imageUrl}
            alt={site.name}
            className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                {site.code}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">{site.country} • {site.locationName}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">{site.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Ecosystem: <strong className="text-slate-800">{site.ecosystem}</strong></span>
              <span>•</span>
              <span>Delineated Area: <strong className="text-slate-800">{site.areaHectares.toLocaleString()} Ha</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {site.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action / Sensor badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>IoT Sensors &amp; Sentinel-2 Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {/* KPI 1: Carbon */}
        <div
          onClick={() => setActiveMetric('carbon')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'carbon'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Carbon Sequestered</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {site.currentCarbonStock.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">tCO2e</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            +{carbonGain.toLocaleString()} tCO2e (+{Math.round((carbonGain / initial.carbonSequestered) * 100)}%)
          </div>
        </div>

        {/* KPI 2: NDVI */}
        <div
          onClick={() => setActiveMetric('ndvi')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'ndvi'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Vegetation Index (NDVI)</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {site.averageNdvi}{' '}
            <span className="text-xs font-normal text-slate-500">/ 1.0</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            +{ndviGain.toFixed(1)}% Canopy Density
          </div>
        </div>

        {/* KPI 3: Biodiversity */}
        <div
          onClick={() => setActiveMetric('biodiversity')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'biodiversity'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Biodiversity Index</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {site.biodiversityIndex}{' '}
            <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            High Species Endemism
          </div>
        </div>

        {/* KPI 4: Canopy / Biomass */}
        <div
          onClick={() => setActiveMetric('biomass')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'biomass'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
              : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Tree Canopy Cover</span>
            <Trees className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {site.treeCanopyCover}%{' '}
            <span className="text-xs font-normal text-slate-500">covered</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {latest.biomassDensity} t/ha Biomass
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
        {/* Chart Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>{metricLabel}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Verified time-series telemetry from quarterly satellite spectrometry &amp; ground flux towers
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('1Y')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '1Y' ? 'bg-[#36513b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1Y
            </button>
            <button
              onClick={() => setTimeRange('3Y')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '3Y' ? 'bg-[#36513b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3Y
            </button>
            <button
              onClick={() => setTimeRange('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === 'ALL' ? 'bg-[#36513b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Quarters
            </button>
          </div>
        </div>

        {/* SVG Responsive Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none min-w-[500px]">
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + chartH * ratio;
              const val = Math.round(maxVal - ratio * (maxVal - minVal));
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Filled area */}
            <path d={areaPathString} fill="url(#metricGradient)" />

            {/* Target Line if carbon */}
            {activeMetric === 'carbon' && (
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                points={targetPointsString}
              />
            )}

            {/* Metric Polyline */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* Data points & X axis */}
            {history.map((item, idx) => {
              const x = getX(idx);
              const val = getMetricValue(item);
              const y = getY(val);
              const isHovered = hoveredPoint?.date === item.date;

              return (
                <g key={item.date}>
                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartH}
                      stroke="#059669"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? '#cce24b' : '#ffffff'}
                    stroke="#059669"
                    strokeWidth={isHovered ? 3 : 2}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(item)}
                  />

                  {/* X Axis Date Label */}
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {item.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover / Tooltip Card */}
        <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#059669] rounded-full inline-block" />
              <span className="font-semibold text-slate-700">Actual {metricLabel}</span>
            </div>
            {activeMetric === 'carbon' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 border-t-2 border-dashed border-slate-400 inline-block" />
                <span className="text-slate-500">Target Trajectory</span>
              </div>
            )}
          </div>

          <div className="text-slate-600">
            {hoveredPoint ? (
              <span>
                <strong>{hoveredPoint.date}:</strong>{' '}
                <span className="font-extrabold text-emerald-800">
                  {getMetricValue(hoveredPoint).toLocaleString()} {metricUnit}
                </span>{' '}
                {activeMetric === 'carbon' && `(Target: ${hoveredPoint.targetCarbon.toLocaleString()})`}
              </span>
            ) : (
              <span className="text-slate-400 italic">Hover on data points to inspect specific quarter</span>
            )}
          </div>
        </div>
      </div>

      {/* Geospatial & Remote Sensing Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-2">
            <Satellite className="w-4 h-4 text-emerald-700" />
            <span>Sentinel-2 Multispectral Analysis</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">NIR / Red Band Ratio:</span>
              <span className="font-semibold">3.82 (Dense Chlorophyll Activity)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Soil Organic Carbon (SOC):</span>
              <span className="font-semibold">{latest.soilOrganicCarbon}% in top 30cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mean Canopy Height (LiDAR):</span>
              <span className="font-semibold">24.6 meters</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Carbon Credit Verification &amp; Registry</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">PostGIS Polygon Hash:</span>
              <span className="font-mono text-[10px] text-slate-600">ST_GeomFromGeoJSON(SRID=4326)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Annual Audited Sequestration:</span>
              <span className="font-semibold text-emerald-700">+{site.annualSequestrationRate.toLocaleString()} tCO2e / yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Methodology:</span>
              <span className="font-semibold">VM0007 REDD+ &amp; Coastal Blue Carbon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
