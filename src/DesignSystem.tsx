import React from 'react';
import { motion } from 'framer-motion';
import {
  Play, Home, Search, Film, Tv, User, Plus, Check, ArrowLeft,
  ChevronRight, Star, Zap, WifiOff, Cast, Sparkles, Info
} from 'lucide-react';

// Import logos
import donaLogoBanner from './images/dona_logo_banner_2x.webp';
import donaLogoMacaron from './images/dona_logo_macaron_2x.webp';
import coverTLOU from './images/cover the last of us.webp';
import coverCyberpunk from './images/cover cyberpunk.jpeg';
import coverSuccession from './images/cover succession.jpg';

// Theme colors
const THEME = {
  primary: '#F21C4C',
  background: '#050505',
  surface: '#121212',
  surfaceHover: '#1E1E1E',
};

// Bento Card Component
const BentoCard = ({
  children,
  className = '',
  title,
  span = 'col-span-1'
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  span?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-[#0A0A0A] rounded-3xl border border-white/5 p-6 ${span} ${className}`}
  >
    {title && (
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{title}</h3>
    )}
    {children}
  </motion.div>
);

// Sample Button Component
const SampleButton = ({ variant, children }: { variant: 'primary' | 'glass' | 'outline'; children: React.ReactNode }) => {
  const styles = {
    primary: 'bg-[#F21C4C] text-white shadow-lg shadow-[#F21C4C]/30',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white',
    outline: 'border border-white/30 text-white bg-transparent',
  };

  return (
    <button className={`px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 ${styles[variant]}`}>
      {children}
    </button>
  );
};

// Sample Media Card
const SampleMediaCard = ({ image, title }: { image: string; title: string }) => (
  <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden relative group cursor-pointer">
    <img src={image} alt={title} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
      <span className="text-[10px] font-bold truncate">{title}</span>
    </div>
  </div>
);

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-2">
          <img src={donaLogoBanner} alt="Dona" className="h-8" />
          <span className="text-white/30 text-sm font-medium">Design System</span>
        </div>
        <p className="text-white/50 text-sm max-w-xl">
          Interface premium pour plateforme de streaming. Optimisée pour TV, Desktop et Mobile.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min">

        {/* Colors */}
        <BentoCard title="Couleurs" span="col-span-2" className="row-span-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F21C4C] shadow-lg shadow-[#F21C4C]/30" />
              <div>
                <p className="font-bold text-sm">Primary</p>
                <p className="text-xs text-white/50">#F21C4C</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#050505] border border-white/10" />
              <div>
                <p className="font-bold text-sm">Background</p>
                <p className="text-xs text-white/50">#050505</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#121212] border border-white/10" />
              <div>
                <p className="font-bold text-sm">Surface</p>
                <p className="text-xs text-white/50">#121212</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] border border-white/10" />
              <div>
                <p className="font-bold text-sm">Surface Hover</p>
                <p className="text-xs text-white/50">#1E1E1E</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white" />
              <div>
                <p className="font-bold text-sm">Text Primary</p>
                <p className="text-xs text-white/50">#FFFFFF</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#A1A1AA]" />
              <div>
                <p className="font-bold text-sm">Text Dim</p>
                <p className="text-xs text-white/50">#A1A1AA</p>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Logo */}
        <BentoCard title="Logo" span="col-span-2">
          <div className="flex items-center justify-around gap-6">
            <div className="text-center">
              <div className="bg-black/50 rounded-2xl p-4 mb-2 flex items-center justify-center">
                <img src={donaLogoBanner} alt="Banner" className="h-8" />
              </div>
              <p className="text-[10px] text-white/40">Banner</p>
            </div>
            <div className="text-center">
              <div className="bg-black/50 rounded-2xl p-4 mb-2 flex items-center justify-center">
                <img src={donaLogoMacaron} alt="Macaron" className="h-12 w-12" />
              </div>
              <p className="text-[10px] text-white/40">Macaron</p>
            </div>
          </div>
        </BentoCard>

        {/* Typography */}
        <BentoCard title="Typographie" span="col-span-2" className="row-span-2">
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-black tracking-tight mb-1">Display</p>
              <p className="text-[10px] text-white/40">Inter Black · 64-96px</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">Heading 1</p>
              <p className="text-[10px] text-white/40">Inter Bold · 40-56px</p>
            </div>
            <div>
              <p className="text-xl font-semibold mb-1">Heading 2</p>
              <p className="text-[10px] text-white/40">Inter Semibold · 20-40px</p>
            </div>
            <div>
              <p className="text-base mb-1">Body</p>
              <p className="text-[10px] text-white/40">Inter Regular · 15-24px</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Caption</p>
              <p className="text-[10px] text-white/40">Inter Regular · 13px</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/60 mb-1">OVERLINE</p>
              <p className="text-[10px] text-white/40">Inter Semibold · 10px</p>
            </div>
          </div>
        </BentoCard>

        {/* Buttons */}
        <BentoCard title="Boutons" span="col-span-2">
          <div className="flex flex-wrap gap-3">
            <SampleButton variant="primary">Primary</SampleButton>
            <SampleButton variant="glass">Glass</SampleButton>
            <SampleButton variant="outline">Outline</SampleButton>
          </div>
        </BentoCard>

        {/* Icons */}
        <BentoCard title="Icônes" span="col-span-2">
          <div className="flex flex-wrap gap-4">
            {[Play, Home, Search, Film, Tv, User, Plus, Check, ArrowLeft, ChevronRight, Star, Info].map((Icon, i) => (
              <div key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white/70" />
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Badges */}
        <BentoCard title="Badges" span="col-span-2">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#F21C4C] text-white text-[10px] font-bold rounded-md uppercase">Exclusivité</span>
            <span className="px-2 py-1 bg-white/5 border border-white/20 text-white text-[10px] font-bold rounded-md uppercase">4K</span>
            <span className="px-2 py-1 bg-white/5 border border-white/20 text-white text-[10px] font-bold rounded-md uppercase">HDR</span>
            <span className="px-2 py-1 bg-white/5 border border-white/20 text-white text-[10px] font-bold rounded-md uppercase">Atmos</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full">98% Match</span>
          </div>
        </BentoCard>

        {/* Media Cards */}
        <BentoCard title="Media Cards" span="col-span-2">
          <div className="flex gap-3">
            <SampleMediaCard image={coverTLOU} title="The Last of Us" />
            <SampleMediaCard image={coverCyberpunk} title="Cyberpunk" />
            <SampleMediaCard image={coverSuccession} title="Succession" />
          </div>
        </BentoCard>

        {/* Navigation Item */}
        <BentoCard title="Navigation" span="col-span-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#F21C4C] rounded-xl text-white font-bold text-sm shadow-lg shadow-[#F21C4C]/30">
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white/5 rounded-xl text-white/50 text-sm transition-colors">
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white/5 rounded-xl text-white/50 text-sm transition-colors">
              <Film className="w-5 h-5" />
              <span>Films</span>
            </div>
          </div>
        </BentoCard>

        {/* Player Controls */}
        <BentoCard title="Player Controls" span="col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6">
              <button className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="bg-[#F21C4C] rounded-full p-4 shadow-lg shadow-[#F21C4C]/30">
                <Play className="w-6 h-6 text-white fill-white" />
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-[#F21C4C] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>32:15</span>
                <span>1:16:42</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Feature Icons */}
        <BentoCard title="Feature Highlights" span="col-span-2">
          <div className="space-y-3">
            {[
              { icon: <WifiOff className="w-4 h-4" />, text: "Mode Hors-ligne" },
              { icon: <Cast className="w-4 h-4" />, text: "AirPlay & Chromecast" },
              { icon: <Sparkles className="w-4 h-4" />, text: "Qualité 4K HDR" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F21C4C]/10 border border-[#F21C4C]/20 flex items-center justify-center text-[#F21C4C]">
                  {item.icon}
                </div>
                <span className="text-sm text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Spacing */}
        <BentoCard title="Spacing Scale" span="col-span-2">
          <div className="space-y-2">
            {[4, 8, 12, 16, 24, 32, 48].map((size) => (
              <div key={size} className="flex items-center gap-3">
                <div
                  className="bg-[#F21C4C]/30 rounded"
                  style={{ width: size, height: 16 }}
                />
                <span className="text-xs text-white/50">{size}px</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Glassmorphism */}
        <BentoCard title="Effects" span="col-span-2">
          <div className="space-y-3">
            <div className="relative h-20 rounded-xl overflow-hidden">
              <img src={coverTLOU} className="w-full h-full object-cover" alt="bg" />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center">
                <span className="text-xs font-bold">Glassmorphism</span>
              </div>
            </div>
            <div className="h-12 rounded-xl bg-gradient-to-r from-[#F21C4C] to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold">Gradient</span>
            </div>
            <div className="h-12 rounded-xl bg-[#F21C4C] shadow-[0_0_40px_rgba(242,28,76,0.4)] flex items-center justify-center">
              <span className="text-xs font-bold">Glow Effect</span>
            </div>
          </div>
        </BentoCard>

        {/* Animations */}
        <BentoCard title="Animations" span="col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Micro</span>
              <span className="text-xs text-white/40">150ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">UI</span>
              <span className="text-xs text-white/40">300ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Page</span>
              <span className="text-xs text-white/40">500ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Cinematic</span>
              <span className="text-xs text-white/40">800ms</span>
            </div>
            <div className="text-[10px] text-white/30 mt-2">
              Easing: cubic-bezier(0.16, 1, 0.3, 1)
            </div>
          </div>
        </BentoCard>

      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
        <img src={donaLogoBanner} alt="Dona" className="h-5 opacity-50" />
        <p className="text-xs text-white/30">Design System v1.0 · 2024</p>
      </div>
    </div>
  );
}
