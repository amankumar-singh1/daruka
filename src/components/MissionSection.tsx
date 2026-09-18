import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NATURE_IMAGES } from '../data/mockData';

interface MissionSectionProps {
  onExploreProjects?: () => void;
  onOpenDashboard?: () => void;
}

export const MissionSection: React.FC<MissionSectionProps> = ({
  onExploreProjects,
  onOpenDashboard,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-white" id="our-mission">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Text Block */}
          <div className="lg:col-span-5 pr-0 lg:pr-6">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path>
              </svg>
              OUR MISSION
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.15] mb-5 tracking-tight">
              We’re Building a <span className="text-[#2a7a4b]">Greener</span>, Cleaner, Stronger World.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Through education, action, and innovation, we empower people to protect nature and create lasting change.
            </p>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3c563f] hover:bg-[#2d4230] text-white text-sm font-semibold transition-all shadow-sm group cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenDashboard}
                className="px-6 py-3 rounded-full border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-semibold transition-all bg-white hover:bg-slate-50 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Feature Cards: 3 Tall Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Mission Card 1: Sustainable Land Use */}
            <div
              onClick={onExploreProjects}
              className="group relative rounded-3xl overflow-hidden h-[390px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                alt="Lush green mountain rainforest canopy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={NATURE_IMAGES.HERO_CANOPY}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-base text-white tracking-tight">
                  Sustainable<br />Land Use
                </h3>
                <p className="text-xs text-slate-200 mt-1 font-light">Promoting responsible land management & agroforestry.</p>
              </div>
            </div>

            {/* Mission Card 2: Climate Action */}
            <div
              onClick={onExploreProjects}
              className="group relative rounded-3xl overflow-hidden h-[390px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                alt="Pristine mountain and mist rainforest"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={NATURE_IMAGES.MISTY_RAINFOREST}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <h3 className="font-bold text-base text-white tracking-tight">
                  Climate<br />Action
                </h3>
                <p className="text-xs text-slate-200 mt-1 font-light">Reducing emissions, building resilience.</p>
              </div>
            </div>

            {/* Mission Card 3: Community Empowerment */}
            <div
              onClick={onExploreProjects}
              className="group relative rounded-3xl overflow-hidden h-[390px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                alt="Community tree planting initiative"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={NATURE_IMAGES.AGROFORESTRY_COMMUNITY}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <h3 className="font-bold text-base text-white tracking-tight">
                  Community<br />Empowerment
                </h3>
                <p className="text-xs text-slate-200 mt-1 font-light">Empowering local stewards, creating real verified impact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
