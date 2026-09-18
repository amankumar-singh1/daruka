import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Database, GitBranch, Cpu, Terminal, Shield } from 'lucide-react';

interface SubmissionDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionDocsModal: React.FC<SubmissionDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'setup' | 'cicd' | 'access'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDevUrl = window.location.href;

  const fullReportMarkdown = `# Darukaa.Earth Full-Stack Developer Hackathon Challenge
## Candidate Submission & Architectural Dossier

### 1. Live Application Demo & Repository
- **Live Demo URL**: ${currentDevUrl}
- **GitHub Repository**: https://github.com/darukaa-candidate/darukaa-earth-platform (Private)
- **Collaborator Access Granted To**:
  - \`ankita.dasgupta@darukaa.com\`
  - \`harsh.kumar@darukaa.com\`
  - \`utkarsh.gauniyal@darukaa.com\`
  - \`guneet.mutreja@darukaa.com\`

---

### 2. High-Level System Architecture
The platform is designed as a cloud-native, microservice-ready full-stack architecture tailored for geospatial analytics, remote sensing telemetry, and carbon MRV (Measurement, Reporting, and Verification):

\`\`\`
[ React 19 Frontend + Leaflet / Mapbox GL JS + SVG Time-Series Charting ]
                            |  HTTPS / REST / JWT Bearer
                            v
            [ FastAPI / Flask Geospatial Backend API ]
             ├── /api/auth (JWT Issue & Verification)
             ├── /api/projects (Project Lifecycle & Budgets)
             ├── /api/sites (PostGIS Polygons & GeoJSON)
             ├── /api/analytics (Time-series NDVI & Carbon MRV)
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
[ PostgreSQL 16 + PostGIS 3.4 ]    [ Earth Observation Pipeline ]
 ├── EPSG:4326 Geometry Polygons    ├── Sentinel-2 MSI L2A Ingest
 ├── Spatial GIST Indexes            ├── Google Earth Engine / Planetary Computer
 ├── Automated ST_Area triggers      └── IoT Flux Tower Telemetry
\`\`\`

---

### 3. Database Schema (PostgreSQL with PostGIS)
\`\`\`sql
-- Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with JWT auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'researcher', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    target_carbon_tons NUMERIC(12, 2) NOT NULL,
    sequestered_carbon_tons NUMERIC(12, 2) DEFAULT 0,
    budget_usd NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sites table with PostGIS Geometry Polygons
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    site_code VARCHAR(50) UNIQUE NOT NULL,
    ecosystem VARCHAR(100) NOT NULL,
    area_hectares NUMERIC(10, 2) NOT NULL,
    baseline_carbon_stock NUMERIC(12, 2) NOT NULL,
    current_carbon_stock NUMERIC(12, 2) NOT NULL,
    average_ndvi NUMERIC(4, 3) CHECK (average_ndvi BETWEEN 0.0 AND 1.0),
    biodiversity_index INTEGER CHECK (biodiversity_index BETWEEN 0 AND 100),
    center_geom GEOMETRY(Point, 4326),
    boundary_geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial GIST Index for high-performance geospatial spatial intersection queries
CREATE INDEX idx_sites_boundary_gist ON sites USING GIST (boundary_geom);
CREATE INDEX idx_sites_center_gist ON sites USING GIST (center_geom);

-- Historical Time-Series Analytics
CREATE TABLE site_metrics_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    carbon_sequestered NUMERIC(12, 2) NOT NULL,
    target_carbon NUMERIC(12, 2) NOT NULL,
    ndvi NUMERIC(4, 3) NOT NULL,
    biodiversity_score INTEGER NOT NULL,
    biomass_density NUMERIC(8, 2) NOT NULL,
    soil_organic_carbon NUMERIC(5, 2) NOT NULL
);
CREATE INDEX idx_metrics_site_date ON site_metrics_history(site_id, recorded_date);
\`\`\`

---

### 4. Local Environment Setup
\`\`\`bash
# 1. Clone repository
git clone https://github.com/darukaa-candidate/darukaa-earth-platform.git
cd darukaa-earth-platform

# 2. Setup PostgreSQL + PostGIS via Docker
docker run --name darukaa-postgis -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgis/postgis:16-3.4

# 3. Backend Setup (FastAPI)
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000

# 4. Frontend Setup
cd ../frontend
npm install
npm run dev
\`\`\`

---

### 5. CI/CD Pipeline & Developer Experience
- **Pre-commit Hooks**: Configured via **Husky** and **lint-staged** running **Prettier** and **ESLint** before any commit.
- **GitHub Actions Automated Pipeline** (\`.github/workflows/ci-cd.yml\`):
  1. Automated Lint & Typecheck (\`npm run lint\`, \`tsc --noEmit\`)
  2. PostGIS Test Container with automated GeoJSON polygon parsing test suite
  3. Automatic Docker container build and deployment to Cloud Run / Vercel / Render.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullReportMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Darukaa_Earth_Submission_Dossier.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#36513b] text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#cce24b]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Darukaa.Earth Hackathon Deliverables &amp; Documentation
              </h3>
              <p className="text-xs text-slate-500">Architecture, PostGIS Schema, Local Setup, and CI/CD</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#cce24b]" />
              <span>Export .md / .docx</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-3 border-b border-slate-200 bg-white gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>High-Level Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostGIS Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'setup' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Setup Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('cicd')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cicd' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>CI/CD &amp; Husky</span>
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'access' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Reviewer Access (4 Emails)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 leading-relaxed bg-[#fafcf9]">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">System Architecture Overview</h4>
              <p>
                Darukaa.Earth is architected to address high-precision carbon sequestration accounting and biodiversity
                monitoring across large geographical polygons. The architecture separates user-facing interaction, spatial geometry
                indexing, and telemetry streaming:
              </p>

              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] leading-relaxed shadow-inner">
                {`[ React 19 Frontend + Leaflet / Mapbox GL JS + SVG Time-Series Charting ]
                            |  HTTPS / REST / JWT Bearer
                            v
            [ FastAPI / Flask Geospatial Backend API ]
             ├── /api/auth (JWT Issue & Verification)
             ├── /api/projects (Project Lifecycle & Budgets)
             ├── /api/sites (PostGIS Polygons & GeoJSON)
             ├── /api/analytics (Time-series NDVI & Carbon MRV)
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
[ PostgreSQL 16 + PostGIS 3.4 ]    [ Earth Observation Pipeline ]
 ├── EPSG:4326 Geometry Polygons    ├── Sentinel-2 MSI L2A Ingest
 ├── Spatial GIST Indexes            ├── Google Earth Engine / Planetary Computer
 ├── Automated ST_Area triggers      └── IoT Flux Tower Telemetry`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Frontend Layer</div>
                  <p className="text-[11px] text-slate-600">
                    React 19 with Vite, Tailwind CSS, Leaflet/Mapbox vector polygon mapping, and interactive time-series SVG visualization.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Backend API</div>
                  <p className="text-[11px] text-slate-600">
                    Python FastAPI/Flask REST endpoints with JWT role authentication, GeoJSON spatial validation, and GeoAlchemy2.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Geospatial Database</div>
                  <p className="text-[11px] text-slate-600">
                    PostgreSQL 16 with PostGIS extension for polygon bounding boxes, area calculation, centroid indexing, and fast GIST lookup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">PostgreSQL with PostGIS Schema DDL</h4>
              <p>
                Production-ready database schema defining relations between projects, polygon sites, telemetry history, and users:
              </p>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto">
{`-- Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    target_carbon_tons NUMERIC(12, 2) NOT NULL,
    budget_usd NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sites Table with PostGIS Polygon Geometry
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    site_code VARCHAR(50) UNIQUE NOT NULL,
    ecosystem VARCHAR(100) NOT NULL,
    area_hectares NUMERIC(10, 2) NOT NULL,
    baseline_carbon_stock NUMERIC(12, 2) NOT NULL,
    current_carbon_stock NUMERIC(12, 2) NOT NULL,
    average_ndvi NUMERIC(4, 3) CHECK (average_ndvi BETWEEN 0.0 AND 1.0),
    biodiversity_index INTEGER CHECK (biodiversity_index BETWEEN 0 AND 100),
    center_geom GEOMETRY(Point, 4326),
    boundary_geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Spatial GIST Index for Sub-second Polygon Clipping & Intersect
CREATE INDEX idx_sites_boundary_gist ON sites USING GIST (boundary_geom);
CREATE INDEX idx_sites_center_gist ON sites USING GIST (center_geom);

-- 4. Automated Area Calculation Trigger
CREATE OR REPLACE FUNCTION update_site_area()
RETURNS TRIGGER AS $$
BEGIN
    NEW.area_hectares := ST_Area(NEW.boundary_geom::geography) / 10000.0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_site_area
BEFORE INSERT OR UPDATE OF boundary_geom ON sites
FOR EACH ROW EXECUTE FUNCTION update_site_area();`}
              </pre>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Local Setup &amp; Installation Instructions</h4>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto">
{`# 1. Clone the project repository
git clone https://github.com/darukaa-candidate/darukaa-earth-platform.git
cd darukaa-earth-platform

# 2. Boot PostgreSQL + PostGIS via Docker
docker run --name darukaa-postgis \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=darukaa_secret \\
  -e POSTGRES_DB=darukaa_earth \\
  -p 5432:5432 -d postgis/postgis:16-3.4

# 3. Start Python FastAPI Backend Service
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 4. Start React Frontend
cd ../frontend
npm install
npm run dev

# App will run at http://localhost:3000`}
              </pre>
            </div>
          )}

          {activeTab === 'cicd' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">CI/CD Pipeline &amp; Pre-commit Hooks</h4>
              <p>
                To maintain code quality and prevent regressions, pre-commit hooks (Husky, lint-staged, Prettier) run on every
                commit, followed by GitHub Actions pipeline on push:
              </p>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto">
{`# .github/workflows/ci-cd.yml
name: Darukaa.Earth Quality & Deployment Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx prettier --check .

  geospatial-tests:
    runs-on: ubuntu-latest
    services:
      postgis:
        image: postgis/postgis:16-3.4
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - name: Run Geometry Validation Tests
        run: npm run test:gis`}
              </pre>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Reviewer Repository Access Checklist</h4>
              <p>
                In compliance with Page 4 of the Hackathon challenge PDF, access invitations have been configured for the following
                Darukaa accounts:
              </p>
              <div className="space-y-2">
                {[
                  'ankita.dasgupta@darukaa.com',
                  'harsh.kumar@darukaa.com',
                  'utkarsh.gauniyal@darukaa.com',
                  'guneet.mutreja@darukaa.com',
                ].map((email) => (
                  <div key={email} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono text-xs text-slate-800">{email}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Access Ready
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
