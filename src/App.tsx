import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_SITES, INITIAL_USER } from './data/mockData';
import { Project, Site, User, Coordinates, UploadedAsset } from './types';
import { Navbar, PageTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MissionSection } from './components/MissionSection';
import { PartnerLogos } from './components/PartnerLogos';
import { InitiativesSection } from './components/InitiativesSection';
import { Footer } from './components/Footer';
import { GisMapPage } from './components/pages/GisMapPage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AdminPortalPage } from './components/pages/AdminPortalPage';

// Modals
import { VideoModal } from './components/VideoModal';
import { AuthModal } from './components/auth/AuthModal';
import { GetInvolvedModal } from './components/GetInvolvedModal';
import { ProjectModal } from './components/dashboard/ProjectModal';
import { SiteModal } from './components/dashboard/SiteModal';
import { AssetManagerModal } from './components/dashboard/AssetManagerModal';

const DEFAULT_ASSETS: UploadedAsset[] = [
  {
    id: 'asset-hero-1',
    name: 'western-ghats-canopy-drone.jpg',
    size: 1420500,
    type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
    category: 'image',
    uploadedAt: '10:15 AM',
  },
  {
    id: 'asset-logo-1',
    name: 'darukaa-emblem-badge.png',
    size: 245000,
    type: 'image/png',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
    category: 'logo',
    uploadedAt: '10:20 AM',
  },
  {
    id: 'asset-geo-1',
    name: 'western-ghats-sector-a.geojson',
    size: 48000,
    type: 'application/geo+json',
    url: '#',
    category: 'geojson',
    uploadedAt: '11:05 AM',
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageTab>('home');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(INITIAL_SITES[0]?.id || '');

  // Custom User Assets from Device
  const [assets, setAssets] = useState<UploadedAsset[]>(() => {
    try {
      const saved = localStorage.getItem('darukaa_user_assets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_ASSETS;
  });

  const [customHeroImageUrl, setCustomHeroImageUrl] = useState<string | null>(() => {
    return localStorage.getItem('darukaa_hero_image') || null;
  });

  const [customBrandLogoUrl, setCustomBrandLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('darukaa_brand_logo') || null;
  });

  const [customPartnerLogos, setCustomPartnerLogos] = useState<{ name: string; url: string }[]>(() => {
    try {
      const saved = localStorage.getItem('darukaa_partner_logos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Modals
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGetInvolvedOpen, setIsGetInvolvedOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('darukaa_user_assets', JSON.stringify(assets));
    } catch (e) {
      // ignore
    }
  }, [assets]);

  useEffect(() => {
    if (customHeroImageUrl) {
      localStorage.setItem('darukaa_hero_image', customHeroImageUrl);
    }
  }, [customHeroImageUrl]);

  useEffect(() => {
    if (customBrandLogoUrl) {
      localStorage.setItem('darukaa_brand_logo', customBrandLogoUrl);
    }
  }, [customBrandLogoUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('darukaa_partner_logos', JSON.stringify(customPartnerLogos));
    } catch (e) {
      // ignore
    }
  }, [customPartnerLogos]);

  // Asset Actions
  const handleUploadAssets = (newAssets: UploadedAsset[]) => {
    setAssets((prev) => [...newAssets, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetHeroImage = (url: string) => {
    setCustomHeroImageUrl(url);
  };

  const handleSetBrandLogo = (url: string) => {
    setCustomBrandLogoUrl(url);
  };

  const handleAddPartnerLogo = (name: string, url: string) => {
    setCustomPartnerLogos((prev) => [...prev, { name, url }]);
  };

  const handleAssignToProject = (projectId: string, imageUrl: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, imageUrl } : p))
    );
  };

  // Prefilled polygon state from map drawing
  const [drawnPolygon, setDrawnPolygon] = useState<Coordinates[] | undefined>(undefined);
  const [drawnArea, setDrawnArea] = useState<number | undefined>(undefined);

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleAddSite = (newSite: Site) => {
    setSites((prev) => [newSite, ...prev]);
    setSelectedSiteId(newSite.id);
    // Update parent project totals
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === newSite.projectId) {
          return {
            ...p,
            sitesCount: (p.sitesCount || 0) + 1,
            totalHectares: (p.totalHectares || 0) + newSite.areaHectares,
            sequesteredCarbonTons: (p.sequesteredCarbonTons || 0) + newSite.currentCarbonStock,
          };
        }
        return p;
      })
    );
  };

  const handlePolygonDrawn = (coords: Coordinates[], calculatedHectares: number) => {
    setDrawnPolygon(coords);
    setDrawnArea(calculatedHectares);
    setIsSiteModalOpen(true);
  };

  const handleSelectPage = (page: PageTab) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafcf9] text-slate-800 font-sans selection:bg-[#cce24b] selection:text-[#142119] flex flex-col">
      {/* Universal Fixed Header */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenGetInvolved={() => setIsGetInvolvedOpen(true)}
        customBrandLogoUrl={customBrandLogoUrl}
        onOpenAssetManager={() => setIsAssetManagerOpen(true)}
      />

      {/* Main Screen Content Switching */}
      <main className="flex-1">
        {/* Page 1: Home */}
        {currentPage === 'home' && (
          <div>
            <HeroSection
              onOpenVideo={() => setIsVideoModalOpen(true)}
              onOpenGetInvolved={() => setIsGetInvolvedOpen(true)}
              onExploreProjects={() => handleSelectPage('projects')}
              onOpenDashboard={() => handleSelectPage('map')}
              customHeroImageUrl={customHeroImageUrl || undefined}
              onOpenAssetManager={() => setIsAssetManagerOpen(true)}
            />
            <MissionSection
              onExploreProjects={() => handleSelectPage('projects')}
              onOpenDashboard={() => handleSelectPage('map')}
            />
            <PartnerLogos customLogos={customPartnerLogos} />
            <InitiativesSection
              projects={projects}
              onSelectProject={(project) => {
                const matchedSite = sites.find((s) => s.projectId === project.id);
                if (matchedSite) setSelectedSiteId(matchedSite.id);
                handleSelectPage('projects');
              }}
              onViewAll={() => handleSelectPage('projects')}
            />
          </div>
        )}

        {/* Page 2: GIS Map */}
        {currentPage === 'map' && (
          <GisMapPage
            projects={projects}
            sites={sites}
            selectedSiteId={selectedSiteId}
            onSelectSiteId={setSelectedSiteId}
            onOpenSiteModal={() => {
              setDrawnPolygon(undefined);
              setDrawnArea(undefined);
              setIsSiteModalOpen(true);
            }}
            onGoToAnalytics={(siteId) => {
              setSelectedSiteId(siteId);
              handleSelectPage('analytics');
            }}
            onPolygonCreated={handlePolygonDrawn}
          />
        )}

        {/* Page 3: Projects */}
        {currentPage === 'projects' && (
          <ProjectsPage
            projects={projects}
            sites={sites}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
            onViewOnMap={(projectId) => {
              const matchedSite = sites.find((s) => s.projectId === projectId);
              if (matchedSite) setSelectedSiteId(matchedSite.id);
              handleSelectPage('map');
            }}
            onViewAnalytics={(siteId) => {
              setSelectedSiteId(siteId);
              handleSelectPage('analytics');
            }}
          />
        )}

        {/* Page 4: Analytics & MRV */}
        {currentPage === 'analytics' && (
          <AnalyticsPage
            sites={sites}
            projects={projects}
            selectedSiteId={selectedSiteId}
            onSelectSiteId={setSelectedSiteId}
          />
        )}

        {/* Page 5: Admin Portal */}
        {currentPage === 'admin' && (
          <AdminPortalPage
            projects={projects}
            sites={sites}
            currentUser={currentUser}
            assets={assets}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
            onOpenSiteModal={() => {
              setDrawnPolygon(undefined);
              setDrawnArea(undefined);
              setIsSiteModalOpen(true);
            }}
            onViewOnMap={(projectId) => {
              const matchedSite = sites.find((s) => s.projectId === projectId);
              if (matchedSite) setSelectedSiteId(matchedSite.id);
              handleSelectPage('map');
            }}
            onViewAnalytics={(siteId) => {
              setSelectedSiteId(siteId);
              handleSelectPage('analytics');
            }}
            onOpenAssetManager={() => setIsAssetManagerOpen(true)}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onOpenDashboard={() => handleSelectPage('map')}
        onOpenGetInvolved={() => setIsGetInvolvedOpen(true)}
        onOpenDocs={() => handleSelectPage('map')}
      />

      {/* Modals */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user: User) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      <GetInvolvedModal
        isOpen={isGetInvolvedOpen}
        onClose={() => setIsGetInvolvedOpen(false)}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleAddProject}
      />

      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        projects={projects}
        prefilledPolygon={drawnPolygon}
        prefilledArea={drawnArea}
        onAddSite={handleAddSite}
      />

      {/* Device Asset Manager Modal */}
      <AssetManagerModal
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
        assets={assets}
        onUploadAssets={handleUploadAssets}
        onDeleteAsset={handleDeleteAsset}
        onSetHeroImage={handleSetHeroImage}
        onSetBrandLogo={handleSetBrandLogo}
        onAddPartnerLogo={handleAddPartnerLogo}
        projects={projects}
        onAssignToProject={handleAssignToProject}
      />
    </div>
  );
}
