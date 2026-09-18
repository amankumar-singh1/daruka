export interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role: 'admin' | 'researcher' | 'viewer';
  avatar?: string;
  token?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MetricDataPoint {
  date: string;
  carbonSequestered: number; // tonnes of CO2 equivalent
  targetCarbon: number;
  ndvi: number; // 0.0 - 1.0 (Normalized Difference Vegetation Index)
  biodiversityScore: number; // 0 - 100
  biomassDensity: number; // tonnes/hectare
  soilOrganicCarbon: number; // %
}

export interface UploadedAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category: 'image' | 'logo' | 'geojson' | 'document';
  uploadedAt: string;
  appliedTo?: string;
}

export interface Site {
  id: string;
  projectId: string;
  name: string;
  code: string;
  country: string;
  locationName: string;
  center: Coordinates;
  polygon: Coordinates[];
  areaHectares: number;
  ecosystem: 'Tropical Rainforest' | 'Mangrove & Coastal' | 'Temperate Forest' | 'Peatland Wetland' | 'Savanna Grassland';
  baselineCarbonStock: number; // tCO2e
  currentCarbonStock: number; // tCO2e
  annualSequestrationRate: number; // tCO2e/yr
  averageNdvi: number;
  biodiversityIndex: number;
  treeCanopyCover: number; // percentage
  status: 'Active Monitoring' | 'Restoration Phase' | 'Verification Pending' | 'Completed Baseline';
  establishedDate: string;
  imageUrl: string;
  metricsHistory: MetricDataPoint[];
  attachments?: UploadedAsset[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Reforestation' | 'Ocean & Mangroves' | 'Wildlife Corridor' | 'Peatland Carbon' | 'Community Forestry';
  status: 'Active' | 'Planning' | 'Verified';
  leadOrganization: string;
  country: string;
  totalHectares: number;
  targetCarbonTons: number;
  sequesteredCarbonTons: number;
  budgetUsd: number;
  treesPlanted: number;
  sitesCount: number;
  imageUrl: string;
  startDate: string;
  sdgGoals: number[];
  attachments?: UploadedAsset[];
}
