import React, { useState } from 'react';
import { ArrowRight, Play, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { NATURE_IMAGES } from '../data/mockData';

interface HeroSectionProps {
  onWatchStory?: () => void;
  onOpenVideo?: () => void;
  onExploreProjects?: () => void;
  onOpenDashboard?: () => void;
  onOpenMap?: () => void;
  onOpenGetInvolved?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onWatchStory,
  onOpenVideo,
  onExploreProjects,
  onOpenDashboard,
  onOpenMap,
  onOpenGetInvolved,
}) => {
  const triggerWatch = onWatchStory || onOpenVideo || (() => {});
  const triggerExplore = onExploreProjects || onOpenDashboard || onOpenMap || (() => {});
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const heroImageSrc = NATURE_IMAGES.HERO_CANOPY;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden" id="home">
      {/* Background Graphic Split Effect with high-res lush forest canopy */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-[740px] pointer-events-none -z-10 rounded-bl-[80px] lg:rounded-bl-[110px] overflow-hidden shadow-2xl">
        <div className="w-full h-full relative">
          <motion.img
            key={heroImageSrc}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.02, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            alt="Aerial view of lush green forest canopy by DARUKAA.EARTH"
            className="w-full h-full object-cover object-center filter saturate-[1.15] contrast-[1.05]"
            src={heroImageSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafcf9] via-[#fafcf9]/25 to-transparent lg:w-2/5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafcf9] via-transparent to-transparent h-1/4 bottom-0 top-auto"></div>
          {/* Subtle nature green overlay */}
          <div className="absolute inset-0 bg-emerald-950/10 mix-blend-multiply"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 pt-4"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-6 shadow-xs border border-emerald-800/10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 fill-current" />
              <span>DARUKAA.EARTH • TOGETHER FOR A GREENER PLANET</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-[70px] font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
              Save <span className="text-[#2a7a4b] underline decoration-[#cce24b] decoration-wavy decoration-2">Nature</span>,<br />
              Save Tomorrow.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-normal">
              Science-driven nature intelligence, geospatial carbon sequestration MRV, and real-world ecological restoration powered by <strong>DARUKAA.EARTH</strong>.
            </p>

            {/* Newsletter Form */}
            <form
              onSubmit={handleJoin}
              className="max-w-md flex items-center bg-white rounded-full p-1.5 shadow-lg border border-slate-200/80 mb-6 transition-all focus-within:ring-2 focus-within:ring-emerald-600/30"
            >
              <input
                className="w-full px-5 py-3 text-sm rounded-full text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none"
                placeholder="Enter your email to join the movement"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[#36513b] hover:bg-[#283e2d] text-white px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 group flex-shrink-0 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02]"
                type="submit"
              >
                <span>{subscribed ? 'Joined!' : 'Join Us'}</span>
                {subscribed ? (
                  <Check className="w-4 h-4 text-[#cce24b]" />
                ) : (
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </form>

            {/* Community Proof Social Avatars */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  alt="Community member"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                />
                <img
                  alt="Community member"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                />
                <img
                  alt="Community member"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Join <span className="font-bold text-slate-800">15,000+</span> environmentalists making a verified difference
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Aerial & Floating Feature Badges */}
          <div className="lg:col-span-5 relative min-h-[460px] flex flex-col justify-center">
            {/* Video Play Trigger & Asset Upload Trigger */}
            <div className="absolute top-10 left-0 lg:-left-10 z-20 flex flex-col gap-2.5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={triggerWatch}
                className="flex items-center gap-3 backdrop-blur-md bg-white/90 py-2.5 px-4 rounded-full shadow-xl border border-white cursor-pointer hover:bg-white transition-all"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-emerald-500/40 animate-ping" />
                  <div className="relative w-8 h-8 rounded-full bg-[#36513b] text-white flex items-center justify-center shadow">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-[#cce24b]" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">Watch Our Story</span>
              </motion.div>
            </div>

            {/* Floating Initiative Cards Container */}
            <div className="space-y-4 ml-auto w-full max-w-xs z-20">
              {/* Card 1: Reforestation */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.03, x: -4 }}
                onClick={triggerExplore}
                className="bg-white/90 backdrop-blur-md border border-white/95 p-3 rounded-2xl shadow-xl flex items-center gap-3.5 transition-all duration-300 cursor-pointer hover:shadow-2xl"
              >
                <img
                  alt="Rainforest canopy"
                  className="w-14 h-14 rounded-xl object-cover shadow-xs"
                  src={NATURE_IMAGES.MISTY_RAINFOREST}
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">Reforestation</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Planting trees, restoring forests.</p>
                </div>
              </motion.div>

              {/* Card 2: Clean Oceans */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.03, x: -4 }}
                onClick={triggerExplore}
                className="bg-white/90 backdrop-blur-md border border-white/95 p-3 rounded-2xl shadow-xl flex items-center gap-3.5 transition-all duration-300 cursor-pointer hover:shadow-2xl"
              >
                <img
                  alt="Ocean and mangrove delta"
                  className="w-14 h-14 rounded-xl object-cover shadow-xs"
                  src={NATURE_IMAGES.OCEAN_MANGROVE}
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">Clean Oceans</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Mangrove barriers, ocean health.</p>
                </div>
              </motion.div>

              {/* Card 3: Community Agroforestry */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.03, x: -4 }}
                onClick={triggerExplore}
                className="bg-white/90 backdrop-blur-md border border-white/95 p-3 rounded-2xl shadow-xl flex items-center gap-3.5 transition-all duration-300 cursor-pointer hover:shadow-2xl"
              >
                <img
                  alt="Community agroforestry"
                  className="w-14 h-14 rounded-xl object-cover shadow-xs"
                  src={NATURE_IMAGES.AGROFORESTRY_COMMUNITY}
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">Community Action</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Empowering indigenous stewards.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Metrics Grid (Frosted White Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-14 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl"
        >
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl text-left border border-white/90 shadow-md hover:shadow-xl transition-all">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">520K+</div>
            <div className="text-xs text-slate-500 font-bold mt-1">Trees Planted</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl text-left border border-white/90 shadow-md hover:shadow-xl transition-all">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">120+</div>
            <div className="text-xs text-slate-500 font-bold mt-1">Local Communities</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl text-left border border-white/90 shadow-md hover:shadow-xl transition-all">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">350+</div>
            <div className="text-xs text-slate-500 font-bold mt-1">Projects Monitored</div>
          </div>
          <div className="bg-[#cce24b] p-5 rounded-3xl text-left shadow-md hover:shadow-xl transition-all text-[#142119]">
            <div className="text-2xl lg:text-3xl font-extrabold tracking-tight">100%</div>
            <div className="text-xs font-bold mt-1">Science Verified</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
