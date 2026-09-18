import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Project } from '../types';
import { NATURE_IMAGES } from '../data/mockData';

interface InitiativesSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAll: () => void;
}

export const InitiativesSection: React.FC<InitiativesSectionProps> = ({
  projects,
  onSelectProject,
  onViewAll,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#fafcf9]" id="initiatives">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-8">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
          </svg>
          OUR INITIATIVES
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: 3 Initiative Feature Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Initiative 1: Ocean Cleanup */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img
                  alt="Coastal ocean and mangrove delta"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={projects[0]?.imageUrl || NATURE_IMAGES.OCEAN_MANGROVE}
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-slate-800 shadow-xs">
                  {projects[0]?.category || 'Ocean Cleanup'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
                    {projects[0]?.title || 'Clean Oceans, Bright Future'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {projects[0]?.description || 'Removing plastic and debris from our oceans and coastlines.'}
                  </p>
                </div>
                <div className="pt-5 mt-auto">
                  <button
                    onClick={() => projects[0] && onSelectProject(projects[0])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Initiative 2: Reforestation */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img
                  alt="Lush temperate forest canopy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={projects[1]?.imageUrl || NATURE_IMAGES.HERO_CANOPY}
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-slate-800 shadow-xs">
                  {projects[1]?.category || 'Reforestation'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
                    {projects[1]?.title || 'More Trees, Better Planet'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {projects[1]?.description || 'Planting and restoring forests for a healthier Earth.'}
                  </p>
                </div>
                <div className="pt-5 mt-auto">
                  <button
                    onClick={() => projects[1] && onSelectProject(projects[1])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Initiative 3: Community */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img
                  alt="Community agroforestry and trees"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={projects[2]?.imageUrl || NATURE_IMAGES.AGROFORESTRY_COMMUNITY}
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-slate-800 shadow-xs">
                  {projects[2]?.category || 'Community'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
                    {projects[2]?.title || 'Stronger Communities, Stronger Future'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {projects[2]?.description || 'Empowering communities to lead local change.'}
                  </p>
                </div>
                <div className="pt-5 mt-auto">
                  <button
                    onClick={() => projects[2] && onSelectProject(projects[2])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Newsletter Lime Box */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Carousel Arrows */}
            <div className="flex items-center justify-end gap-2 mb-4">
              <button
                onClick={handlePrev}
                aria-label="Previous initiatives"
                className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-bold cursor-pointer"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                aria-label="Next initiatives"
                className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-bold cursor-pointer"
              >
                →
              </button>
            </div>

            {/* Header */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              Real Actions. Real Impact. A Better Future.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Discover how we turn ideas into impact through projects that protect our planet and support communities.
            </p>
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors mb-8 cursor-pointer text-left"
            >
              <span>View All Initiatives</span>
              <span>→</span>
            </button>

            {/* Newsletter Box (Distinct Lime Container) */}
            <div className="bg-[#d4ea54] rounded-3xl p-6 sm:p-7 text-slate-900 shadow-sm relative overflow-hidden">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight mb-2">
                Stay Inspired. Stay Informed.
              </h3>
              <p className="text-xs text-slate-800/80 leading-relaxed mb-5">
                Subscribe to our newsletter and get the latest updates on our projects, stories, and how you can help.
              </p>

              {/* Inline Subscription Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex items-center bg-white rounded-full p-1 shadow-sm mb-4">
                <input
                  className="w-full px-4 py-2 text-xs rounded-full text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button
                  className="bg-[#36513b] hover:bg-[#273a2a] text-white px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                  type="submit"
                >
                  <span>{subscribed ? 'Subscribed' : 'Subscribe'}</span>
                  {subscribed ? <Check className="w-3.5 h-3.5 text-[#d4ea54]" /> : <span>→</span>}
                </button>
              </form>

              {/* Small Social Proof Avatars */}
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    alt="Subscriber"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#d4ea54] object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGaHRc5G6WCHwSorVNHx-JexRhIXlHoDBO_o_tmgUMnDIP124Z4177XEvv94830kbfel5RTZvcqJP_slWxhPS3yHnwWeCY1l9LESlJjdQOKzB3-0rfaaaZDhR5KMDnNA50yCGXUgpJWy7wsh5_vXgIhQ5PXXthpi-je-s5bMQr_adluI_NDnUY6PPA0uGL6BCPwVUssXOtTXzn6V7EiKIjrJfulEFISfHAby8tmTuF5zp7m1rxdTmV"
                  />
                  <img
                    alt="Subscriber"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#d4ea54] object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjr-L7uoQnszRq9WvyxHp562FduCjWAKfuIKCx1WgkMPjb-FEIBkEubT-xvENHhM_MjhztfYECoqyjblrxs3hcu7SQNwafgRwqRCcq0LQZjCfg1leuLo3cd2ATKoX6Eu9Ra1dW82OvxqK3pzUvCFIDMr2xtPQp-ZVrVR7HdLjcUrLmX7HMJry3Fjt9VJIz9Gz0QKBYUUgN1khDDecEWWzf7THIFcDzUiAkSEdomZCyFOcqwjM4_Xe5"
                  />
                  <img
                    alt="Subscriber"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#d4ea54] object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLenDbq5tS7Wkw8KAb9x2US6Yq4K-_szJAGes6akRw67Zfualpp1GhaJteQtb7PBMA6BezJzp5Da6DGAES6q4KtX5b4edYiDN1WUtOHDOHFOGoeYviWPfTMftiE-Oor1Ea-2uGw23PaIoAzlIGeI9hKk-9S10JDYyllmYteGr-sdGf2uoP6wzvVbPWn_ihC8BlWbmr0ykf71kZNG8FZPNnrxoMzHxtkEAkX8qsQOttLA-QenjNK5he"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-800/80">
                  Join thousands of change-makers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
