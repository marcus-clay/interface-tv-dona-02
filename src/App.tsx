import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Play, Pause, ArrowLeft, ChevronRight, Check, Monitor, 
  Loader2, Home, Search, Film, Tv, User, Info, LogOut, 
  Plus, Check as CheckIcon, Smartphone, Cast, WifiOff, Star, 
  Zap, ShieldCheck, CreditCard, Sparkles, X, Filter, Volume2, VolumeX, Maximize2,
  MessageCircle, ShoppingBag, Settings, Globe, ThumbsUp, Clapperboard, Share2,
  SkipForward, Rewind
} from 'lucide-react';

// --- CONFIGURATION ---
const THEME = {
  primary: '#F21C4C',
  primaryHover: '#D9123C',
  background: '#050505',
  surface: '#121212',
  surfaceHover: '#1E1E1E',
  text: '#FFFFFF',
  textDim: '#A1A1AA'
};

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// --- TYPES ---
type PageView = 'landing' | 'browse' | 'movies' | 'series' | 'search' | 'profile' | 'detail';
type ContentType = 'film' | 'series';
type QualityBadge = '4K' | 'HDR' | 'Atmos' | 'Dolby Vision' | '5.1';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  year: number;
  duration: string;
  rating: number;
  synopsis: string;
  poster: string;
  backdrop: string;
  dominantColor: string;
  badges: QualityBadge[];
  genres: string[];
  match: number;
  director?: string;
  studio?: string;
  cast?: { name: string; role: string; image: string }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Gratuit' | 'Dona+';
}

// --- MOCK DATA ENRICHED ---
const MOCK_CAST = [
  { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://image.tmdb.org/t/p/w200/3Ua1uX6135j1a6125b2a121.jpg" },
  { name: "Emily Blunt", role: "Katherine Oppenheimer", image: "https://image.tmdb.org/t/p/w200/nPJXaRM7I1x51a1a121.jpg" },
  { name: "Matt Damon", role: "Leslie Groves", image: "https://image.tmdb.org/t/p/w200/elSlNgV8xVfs121a12.jpg" },
  { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://image.tmdb.org/t/p/w200/5qHNjhtjMD4Yn1a121.jpg" },
];

const MOCK_REVIEWS = [
  { user: "Sarah L.", rating: 5, text: "Une claque visuelle et sonore absolue. Le meilleur film de l'année." },
  { user: "Marc D.", rating: 4, text: "Un peu long mais la performance de Murphy est incroyable." },
  { user: "CinéFan88", rating: 5, text: "L'expérience IMAX retranscrite parfaitement sur mon écran." }
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Bande Originale Vinyle", price: "35€", image: "https://placehold.co/200x200/111/FFF?text=Vinyl" },
  { id: 2, name: "Artbook Officiel", price: "50€", image: "https://placehold.co/200x200/111/FFF?text=Artbook" },
];

const MOCK_CONTENT: ContentItem[] = [
  // --- FILMS ---
  {
    id: 'oppenheimer', type: 'film', title: 'Oppenheimer', year: 2023, duration: '3h 00m', rating: 8.5,
    synopsis: "Le lieutenant-général Leslie Groves recrute le physicien J. Robert Oppenheimer pour travailler sur le projet top-secret Manhattan.",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", 
    backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    dominantColor: '#D86626', badges: ['4K', 'HDR', 'Atmos'], genres: ['Drame', 'Histoire'], match: 98,
    director: "Christopher Nolan", studio: "Universal Pictures", cast: MOCK_CAST
  },
  {
    id: 'dune2', type: 'film', title: 'Dune: Deuxième Partie', year: 2024, duration: '2h 46m', rating: 8.8,
    synopsis: "Paul Atreides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont anéanti sa famille.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    dominantColor: '#C6823F', badges: ['4K', 'Dolby Vision', 'Atmos'], genres: ['Sci-Fi', 'Aventure'], match: 99,
    director: "Denis Villeneuve", studio: "Warner Bros."
  },
  {
    id: 'interstellar', type: 'film', title: 'Interstellar', year: 2014, duration: '2h 49m', rating: 8.7,
    synopsis: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace pour assurer la survie de l'humanité.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    dominantColor: '#0B1026', badges: ['4K', 'HDR'], genres: ['Sci-Fi', 'Drame'], match: 95,
    director: "Christopher Nolan"
  },
  {
    id: 'spiderman', type: 'film', title: 'Spider-Man: Across the Spider-Verse', year: 2023, duration: '2h 20m', rating: 8.6,
    synopsis: "Miles Morales est catapulté à travers le Multivers, où il rencontre une équipe de Spider-People chargée de protéger son existence.",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    dominantColor: '#F21C4C', badges: ['4K', 'HDR'], genres: ['Animation', 'Action'], match: 97
  },
  {
    id: 'tlou', type: 'series', title: 'The Last of Us', year: 2023, duration: '1 Saison', rating: 9.2,
    synopsis: "Quand le monde tel que vous le connaissiez n'existe plus, jusqu'où iriez-vous pour survivre ?",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78Tw.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b9UCfDzwiWw7mIFsIQR9ZJUeh7q.jpg",
    dominantColor: '#2C3E50', badges: ['4K', 'HDR', 'Atmos'], genres: ['Action', 'Drame'], match: 99
  },
  {
    id: 'breaking-bad', type: 'series', title: 'Breaking Bad', year: 2008, duration: '5 Saisons', rating: 9.5,
    synopsis: "Walter White, professeur de chimie, se lance dans le crime pour subvenir aux besoins de sa famille.",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    dominantColor: '#1B4F25', badges: ['4K'], genres: ['Crime', 'Drame'], match: 98
  },
  {
    id: 'cyberpunk', type: 'series', title: 'Cyberpunk: Edgerunners', year: 2022, duration: '1 Saison', rating: 8.3,
    synopsis: "Dans une dystopie rongée par la corruption et les implants cybernétiques, un enfant des rues talentueux et impulsif tente de survivre.",
    poster: "https://image.tmdb.org/t/p/w500/7jM0W3eJ21lZkH7D1w0M5K3j1K.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2wM1bC1g1x1w1w1w1w1w1w1w1w.jpg",
    dominantColor: '#F21C4C', badges: ['4K', 'HDR'], genres: ['Animation', 'Sci-Fi'], match: 94
  },
  {
    id: 'succession', type: 'series', title: 'Succession', year: 2018, duration: '4 Saisons', rating: 8.9,
    synopsis: "La famille Roy, propriétaire d'un conglomérat médiatique mondial, se bat pour le contrôle de l'entreprise.",
    poster: "https://image.tmdb.org/t/p/w500/7bG9Y7aB1e0s5q0s5q0s5q0s5.jpg", 
    backdrop: "https://image.tmdb.org/t/p/original/k7sE3loF1BOJ47z70w9n6jW6L7.jpg",
    dominantColor: '#1F2937', badges: ['4K', 'HDR'], genres: ['Drame', 'Comédie'], match: 96
  }
];

const MOCK_USER: UserProfile = { id: 'u1', name: 'Alex', email: 'alex@dona.stream', avatar: 'https://i.pravatar.cc/150?img=32', plan: 'Dona+' };

// --- STORES ---
interface RouterState {
  currentPage: PageView;
  params: any;
  history: PageView[];
  navigateTo: (page: PageView, params?: any) => void;
  goBack: () => void;
}

const useRouterStore = create<RouterState>((set) => ({
  currentPage: 'landing',
  params: null,
  history: [],
  navigateTo: (page, params = null) => set((state) => ({ 
    currentPage: page, 
    params, 
    history: [...state.history, state.currentPage] 
  })),
  goBack: () => set((state) => {
    const newHistory = [...state.history];
    const prevPage = newHistory.pop() || 'landing';
    return { currentPage: prevPage, history: newHistory, params: null };
  }),
}));

interface UserState {
  myList: string[];
  toggleMyList: (id: string) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  myList: [],
  isAuthenticated: false,
  toggleMyList: (id) => set((state) => ({
    myList: state.myList.includes(id) ? state.myList.filter(item => item !== id) : [...state.myList, id]
  })),
  login: () => {
    useRouterStore.getState().navigateTo('browse');
    set({ isAuthenticated: true });
  },
  logout: () => {
    useRouterStore.getState().navigateTo('landing');
    set({ isAuthenticated: false });
  },
}));

// --- UI COMPONENTS ---

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-1.5 py-0.5 border border-white/20 bg-white/5 backdrop-blur-md rounded-[4px] text-[10px] font-bold tracking-wide text-white/90 uppercase shadow-sm", className)}>
    {children}
  </span>
);

const Button = ({ variant = 'primary', size = 'md', className, children, leftIcon, onClick, ...props }: any) => {
  const base = "relative inline-flex items-center justify-center rounded-full font-bold transition-all focus:outline-none tracking-tight select-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants: any = {
    primary: "text-white border border-transparent hover:brightness-110", 
    secondary: "bg-white text-black hover:bg-gray-100 border border-transparent",
    ghost: "bg-transparent text-white hover:bg-white/10",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-lg",
    outline: "border border-white/30 text-white hover:border-white hover:bg-white/5",
  };
  
  const sizes: any = {
    sm: "px-5 py-2 text-xs h-9",
    md: "px-7 py-3 text-sm h-11",
    lg: "px-9 py-4 text-base h-14",
    xl: "px-10 py-5 text-lg h-16 min-w-[200px]",
    icon: "p-3 h-12 w-12",
  };
  
  const style = variant === 'primary' ? { 
    backgroundColor: THEME.primary, 
    boxShadow: `0 8px 30px -5px ${THEME.primary}60` 
  } : {};

  return (
    <motion.button 
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={cn(base, variants[variant], sizes[size], className)} 
      style={style}
      onClick={onClick}
      {...props}
    >
      {leftIcon && <span className="mr-3 flex items-center justify-center">{leftIcon}</span>}
      {children}
    </motion.button>
  );
};

// --- CONTENT COMPONENTS ---

const MediaCard = ({ item, onClick }: { item: ContentItem, onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative aspect-[2/3] rounded-lg bg-[#1a1a1a] cursor-pointer group overflow-hidden border border-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img 
        src={item.poster} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy" 
      />
      
      <div className={cn("absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity")} />

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute inset-0 p-4 flex flex-col justify-end"
          >
            <div className="flex gap-2 mb-3">
              <div className="bg-white p-2 rounded-full shadow-lg"><Play className="w-3 h-3 text-black fill-black" /></div>
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20"><Plus className="w-3 h-3 text-white" /></div>
            </div>
            <h4 className="font-bold text-sm leading-tight mb-1 text-shadow-sm">{item.title}</h4>
            <div className="flex items-center gap-2 text-[10px] text-gray-300">
              <span style={{ color: THEME.primary }} className="font-bold">{item.match}% Match</span>
              <span>{item.year}</span>
              <span className="border border-white/20 px-1 rounded bg-black/50">{item.badges[0]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PlayerTabButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-6 py-3 text-sm font-bold transition-all border-b-2 tracking-wide uppercase text-[11px]",
      active ? `border-[${THEME.primary}] text-white` : "border-transparent text-white/40 hover:text-white"
    )}
    style={active ? { borderColor: THEME.primary } : {}}
  >
    {children}
  </button>
);

const PlayerOverlay = ({ content, onClose, isPaused, togglePlay }: any) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md"
    >
      {/* Top Bar - Branding and Actions */}
      <div className="flex justify-between items-center p-8 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-widest uppercase text-[12px]">LUMINA <span className="text-[#F21C4C]">PLAYER</span></span>
          </button>
        </div>
        
        {/* Play/Pause Indicator (Subtle) */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">
           <span className="text-xs font-bold tracking-[0.2em] text-[#F21C4C] uppercase flex items-center gap-2">
             <Pause className="w-3 h-3 fill-current" /> EN PAUSE
           </span>
        </div>

        <div className="flex gap-4">
           <button className="p-3 hover:bg-white/10 rounded-full transition-colors group relative">
             <MessageCircle className="w-5 h-5 text-white/90" />
             <span className="absolute -top-1 -right-1 bg-[#F21C4C] text-[8px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
           </button>
           <button className="p-3 hover:bg-white/10 rounded-full transition-colors"><Settings className="w-5 h-5 text-white/90" /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-24 relative max-w-7xl mx-auto w-full">
        
        {/* Title & Key Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
             <Badge className="bg-[#F21C4C] text-white border-transparent">EXCLUSIVITÉ</Badge>
             {content.type === 'film' ? <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Film</span> : <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Série</span>}
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{content.title}</h1>
          
          <div className="flex items-center gap-6 text-white/60 text-xs font-medium uppercase tracking-wide">
            <span className="text-white font-bold">{content.year}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"/>
            <span>{content.duration}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"/>
            <div className="flex gap-2">
               {content.badges.map((b: string) => <Badge key={b}>{b}</Badge>)}
            </div>
            <span className="w-1 h-1 bg-white/30 rounded-full"/>
            {content.match && <span className="text-[#F21C4C] font-bold flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {content.match}% Match</span>}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 w-full">
          <PlayerTabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>Infos</PlayerTabButton>
          <PlayerTabButton active={activeTab === 'audio'} onClick={() => setActiveTab('audio')}>Audio & Sous-titres</PlayerTabButton>
          <PlayerTabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>Avis ({MOCK_REVIEWS.length})</PlayerTabButton>
          <PlayerTabButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')}>
             Boutique <span className="ml-2 w-2 h-2 rounded-full bg-[#F21C4C] inline-block animate-pulse shadow-[0_0_8px_#F21C4C]" />
          </PlayerTabButton>
        </div>

        {/* Dynamic Panel Content */}
        <div className="h-72 w-full"> {/* Fixed height for panel stability */}
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col lg:flex-row gap-16"
              >
                <div className="flex-1 max-w-xl">
                  <p className="text-lg text-white/80 leading-relaxed font-light mb-6">{content.synopsis}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-white/50 border-t border-white/10 pt-4">
                     {content.director && <div><span className="text-white/30 uppercase tracking-wider block mb-1">De</span> <strong className="text-white text-sm">{content.director}</strong></div>}
                     {content.studio && <div><span className="text-white/30 uppercase tracking-wider block mb-1">Studio</span> <strong className="text-white text-sm">{content.studio}</strong></div>}
                     {content.genres && <div className="col-span-2"><span className="text-white/30 uppercase tracking-wider block mb-1">Genres</span> <strong className="text-white text-sm">{content.genres.join(', ')}</strong></div>}
                  </div>
                </div>
                
                <div className="flex-1 border-l border-white/5 pl-12">
                  <h4 className="text-xs font-bold uppercase text-white/30 mb-6 tracking-widest flex items-center gap-2"><Clapperboard className="w-3 h-3"/> Distribution</h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {(content.cast || MOCK_CAST).map((actor: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                          <img src={actor.image || "https://placehold.co/100x100"} className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#F21C4C] transition-colors" alt={actor.name} />
                          <div className="absolute inset-0 rounded-full bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[#F21C4C] transition-colors">{actor.name}</p>
                          <p className="text-[10px] text-white/40 uppercase font-medium">{actor.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'audio' && (
              <motion.div 
                key="audio"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-20 max-w-3xl"
              >
                <div>
                  <h4 className="text-xs font-bold uppercase text-white/30 mb-6 tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Audio</h4>
                  <div className="space-y-3">
                    {['Français (Original)', 'Anglais - Dolby Atmos', 'Espagnol', 'Allemand'].map((lang, i) => (
                      <div key={lang} className={cn("flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]", i === 0 ? "bg-[#F21C4C] border-[#F21C4C] shadow-lg shadow-[#F21C4C]/20" : "bg-white/5 border-white/5 hover:bg-white/10")}>
                        <span className={cn("text-sm font-bold", i === 0 ? "text-white" : "text-white/80")}>{lang}</span>
                        {i === 0 && <Check className="w-4 h-4 text-white" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white/30 mb-6 tracking-widest flex items-center gap-2"><MessageCircle className="w-3 h-3" /> Sous-titres</h4>
                  <div className="space-y-3">
                    {['Désactivé', 'Français', 'Anglais (CC)', 'Espagnol'].map((lang, i) => (
                      <div key={lang} className={cn("flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]", i === 1 ? "bg-white text-black border-white" : "bg-white/5 border-white/5 hover:bg-white/10")}>
                        <span className={cn("text-sm font-bold", i === 1 ? "text-black" : "text-white/80")}>{lang}</span>
                        {i === 1 && <Check className="w-4 h-4 text-black" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col justify-between h-full group hover:-translate-y-1 duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F21C4C] to-purple-600 flex items-center justify-center text-[10px] font-bold shadow-lg">
                             {review.user.charAt(0)}
                           </div>
                           <span className="font-bold text-xs uppercase tracking-wide text-white/90">{review.user}</span>
                        </div>
                        <div className="flex text-[#F21C4C] gap-0.5 bg-black/30 px-2 py-1 rounded-full">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed italic relative">
                        <span className="absolute -top-2 -left-1 text-2xl text-white/10 font-serif">"</span>
                        {review.text}
                        <span className="absolute bottom-0 ml-1 text-xl text-white/10 font-serif">"</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                       <span className="text-[10px] text-white/30 font-mono">IL Y A 2J</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div 
                key="shop"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex gap-12 items-center bg-gradient-to-br from-[#1a1a1a] to-black p-10 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl"
              >
                {/* Background Decor */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#F21C4C] rounded-full blur-[120px] opacity-20 pointer-events-none" />
                
                <div className="flex-1 z-10 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F21C4C]/20 text-[#F21C4C] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 border border-[#F21C4C]/20">
                      <Sparkles className="w-3 h-3" /> Offre Spéciale
                    </div>
                    <h3 className="text-4xl font-black mb-2 text-white tracking-tight">La Collection Officielle</h3>
                    <p className="text-white/60 max-w-md text-sm leading-relaxed">Replongez dans l'univers du film avec ces éditions limitées, disponibles uniquement pour les abonnés Dona+.</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="primary" size="lg" className="shadow-lg shadow-[#F21C4C]/20 text-sm h-12 px-8">
                      Accéder à la boutique
                    </Button>
                    <Button variant="outline" size="lg" className="text-sm h-12 px-6">
                      En savoir plus
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-6 z-10">
                  {MOCK_PRODUCTS.map((product, idx) => (
                    <div key={product.id} className="w-56 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#F21C4C]/50 hover:bg-white/10 cursor-pointer transition-all group hover:-translate-y-2 duration-300 shadow-xl">
                      <div className="aspect-square bg-gradient-to-b from-white/10 to-transparent rounded-xl mb-4 overflow-hidden relative flex items-center justify-center group-hover:scale-105 transition-transform">
                         <img src={product.image} className="w-32 h-32 object-contain drop-shadow-2xl" alt={product.name} />
                         <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-bold border border-white/10">{product.price}</div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-white group-hover:text-[#F21C4C] transition-colors line-clamp-1">{product.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Édition Limitée</p>
                          <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100">
                            <Plus className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls Bar - Timeline & Actions */}
      <div className="px-10 pb-10 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
         {/* Timeline */}
         <div className="flex items-center gap-6 mb-8 text-xs font-mono text-white/50 tracking-widest">
            <span className="w-12 text-right">34:12</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer hover:h-2 transition-all duration-300">
               <div className="absolute left-0 top-0 h-full w-[34%] bg-gradient-to-r from-[#F21C4C] to-[#ff4d73] rounded-full shadow-[0_0_15px_rgba(242,28,76,0.5)]" />
               {/* Buffer */}
               <div className="absolute left-0 top-0 h-full w-[45%] bg-white/5 rounded-full -z-10" />
               <div className="absolute left-[34%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-0 group-hover:scale-100 transition-transform flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-[#F21C4C] rounded-full" />
               </div>
               
               {/* Chapter Markers */}
               <div className="absolute left-[20%] top-0 h-full w-0.5 bg-black/50" />
               <div className="absolute left-[55%] top-0 h-full w-0.5 bg-black/50" />
               <div className="absolute left-[80%] top-0 h-full w-0.5 bg-black/50" />
            </div>
            <span className="w-12">{content.duration.replace('h', ':').replace('m', '')}</span>
         </div>
         
         {/* Playback Controls */}
         <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="hover:text-white transition-colors hover:scale-110 transform duration-200 bg-[#F21C4C] text-white p-5 rounded-full shadow-[0_0_30px_rgba(242,28,76,0.4)] border border-white/10">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              </div>
              
              <div className="flex items-center gap-8">
                <button className="text-white/60 hover:text-white transition-colors flex flex-col items-center gap-1 group">
                  <Rewind className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[9px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">-10s</span>
                </button>
                <button className="text-white/60 hover:text-white transition-colors flex flex-col items-center gap-1 group">
                  <SkipForward className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  <span className="text-[9px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">+10s</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/5">
              <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white relative group">
                <Volume2 className="w-5 h-5" />
                {/* Volume Slider Popup would go here */}
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function VideoPlayer({ content, onClose }: { content: ContentItem, onClose: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // State for Play/Pause logic
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = () => {
      setTimeout(() => {
        // Fallback video URL (Pexels/Vimeo open source)
        const demoVideo = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=164&oauth2_token_id=57447761";
        setVideoUrl(demoVideo);
        setLoading(false);
      }, 1500);
    };
    fetchVideo();
  }, [content.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
       {/* Layer 1: Video Content */}
       <div className="absolute inset-0 z-0">
         {error ? (
           <motion.div 
             initial={{ scale: 1 }}
             animate={{ scale: 1.1 }}
             transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
             className="w-full h-full"
           >
             <img src={content.backdrop} className="w-full h-full object-cover opacity-50" alt="Simulation" />
           </motion.div>
         ) : (
           videoUrl && !loading && (
             <video 
               ref={videoRef}
               autoPlay 
               className="w-full h-full object-cover"
               onError={() => setError(true)}
               src={videoUrl}
               onClick={togglePlay} // Click video to pause/play
             />
           )
         )}
         <div className="absolute inset-0 bg-black/20 pointer-events-none" />
       </div>

       {/* Layer 2: Loading or Paused UI */}
       <AnimatePresence>
         {loading && (
           <motion.div exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-50 bg-black">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#F21C4C] mx-auto mb-4" />
                <p className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Initialisation du flux sécurisé</p>
              </div>
           </motion.div>
         )}

         {!isPlaying && !loading && (
           <PlayerOverlay content={content} onClose={onClose} isPaused={!isPlaying} togglePlay={togglePlay} />
         )}
       </AnimatePresence>

       {/* Layer 3: Minimal Controls when Playing (Hover only) */}
       {isPlaying && !loading && (
         <motion.div 
           initial={{ opacity: 0 }}
           whileHover={{ opacity: 1 }}
           className="absolute inset-0 z-10 flex flex-col justify-between p-8 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300"
         >
            <button onClick={onClose} className="self-start bg-black/20 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all border border-white/5">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="self-center p-6 bg-black/40 backdrop-blur-xl rounded-full cursor-pointer hover:scale-110 transition-transform border border-white/10" onClick={togglePlay}>
               <Pause className="w-8 h-8 fill-white text-white" />
            </div>
            <div className="w-full h-1 bg-white/30 rounded-full">
               <div className="h-full w-[34%] bg-[#F21C4C] rounded-full" />
            </div>
         </motion.div>
       )}
    </div>
  );
}

// --- PAGES ---

// 1. DETAIL PAGE REFINED
function DetailPage() {
  const { params: id, goBack } = useRouterStore();
  const { toggleMyList, myList } = useUserStore();
  const item = MOCK_CONTENT.find(c => c.id === id) || MOCK_CONTENT[0];
  const inList = myList.includes(item.id);
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) return <VideoPlayer content={item} onClose={() => setIsPlaying(false)} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-y-auto pb-20">
      <div className="relative h-[90vh] w-full group">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={item.backdrop} 
            className="w-full h-full object-cover opacity-60" 
            alt="backdrop" 
          />
          {/* Advanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F21C4C]/10 via-transparent to-transparent opacity-60" />
        </div>

        <div className="absolute top-0 w-full p-8 z-50 flex justify-between">
          <button onClick={goBack} className="bg-black/20 border border-white/10 p-3 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-4">
             <button className="bg-black/20 border border-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2"><Share2 className="w-3 h-3" /> PARTAGER</button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-8 md:px-20 pb-20 max-w-5xl">
           <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
             {item.type === 'series' && (
                <div className="flex items-center gap-2 mb-4">
                   <span className="w-1 h-4 bg-[#F21C4C] rounded-full" />
                   <span className="text-xs font-black tracking-[0.2em] uppercase text-white/80">Série Originale Dona</span>
                </div>
             )}
             <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight drop-shadow-2xl">{item.title}</h1>
             
             <div className="flex items-center flex-wrap gap-4 mb-10 text-sm font-medium text-gray-300">
               <span className="text-[#F21C4C] font-bold flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {item.match}% recommandé</span>
               <span className="w-1 h-1 bg-white/30 rounded-full" />
               <span>{item.year}</span>
               <span className="w-1 h-1 bg-white/30 rounded-full" />
               <Badge>{item.badges[0]}</Badge>
               <Badge>Atmos</Badge>
               <span className="w-1 h-1 bg-white/30 rounded-full" />
               <span>{item.duration}</span>
             </div>

             <div className="flex flex-wrap items-center gap-6 mb-12">
               <Button size="xl" className="shadow-[0_0_40px_rgba(242,28,76,0.4)] hover:shadow-[0_0_60px_rgba(242,28,76,0.6)] transition-shadow duration-500" onClick={() => setIsPlaying(true)} leftIcon={<Play className="fill-current w-6 h-6" />}>
                 Lecture
               </Button>
               <Button 
                 variant="glass" 
                 size="xl" 
                 onClick={() => toggleMyList(item.id)}
                 leftIcon={inList ? <CheckIcon className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
               >
                 {inList ? 'Dans ma liste' : 'Ma liste'}
               </Button>
             </div>

             <p className="text-xl text-white/80 leading-relaxed max-w-3xl drop-shadow-lg font-light mb-12">
               {item.synopsis}
             </p>

             {/* Cast Row */}
             <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Distribution</h4>
                <div className="flex gap-6">
                   {(item.cast || MOCK_CAST).map((actor: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 pr-4 rounded-full border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                         <img src={actor.image} className="w-10 h-10 rounded-full object-cover" alt={actor.name} />
                         <span className="text-sm font-bold">{actor.name}</span>
                      </div>
                   ))}
                </div>
             </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}

// 2. SEARCH PAGE (Standardized)
function SearchPage() {
  const [query, setQuery] = useState('');
  const { navigateTo } = useRouterStore();
  
  const results = useMemo(() => {
    if (!query) return [];
    return MOCK_CONTENT.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="pt-24 px-6 md:px-16 min-h-screen bg-[#050505]">
      <div className="relative max-w-3xl mx-auto mb-16">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
        <input 
          autoFocus
          type="text" 
          placeholder="Quel film ou série cherchez-vous ?" 
          className="w-full bg-[#121212] border border-white/5 text-white text-2xl py-6 pl-16 pr-6 focus:ring-2 focus:ring-[#F21C4C] rounded-2xl placeholder:text-gray-600 transition-all shadow-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query && (
        <div className="animate-fade-in-up">
          <h2 className="text-xl text-gray-400 mb-8">Résultats pour <span className="text-white">"{query}"</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {results.map(c => (
              <MediaCard key={c.id} item={c} onClick={() => navigateTo('detail', c.id)} />
            ))}
            {results.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                <p className="text-xl">Aucun résultat trouvé.</p>
                <p className="text-sm mt-2">Essayez "Science Fiction" ou "Drame".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!query && (
        <div className="max-w-4xl mx-auto">
           <h2 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500">Genres Populaires</h2>
           <div className="flex flex-wrap gap-4">
             {['Science Fiction', 'Action', 'Comédie', 'Drame', 'Animation', 'Documentaire', 'Thriller'].map(tag => (
               <button key={tag} onClick={() => setQuery(tag)} className="px-6 py-3 bg-[#121212] hover:bg-[#1E1E1E] rounded-xl text-md font-medium transition-all hover:scale-105 border border-white/5">
                 {tag}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}

// 3. PROFILE PAGE (Standardized)
function ProfilePage() {
  const { logout } = useUserStore();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] pt-10">
      <div className="max-w-2xl w-full bg-[#121212] border border-white/5 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F21C4C] rounded-full blur-[100px] opacity-20" />

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative z-10">
          <div className="relative group cursor-pointer">
            <img src={MOCK_USER.avatar} className="w-32 h-32 rounded-full border-4 border-[#1E1E1E] group-hover:border-[#F21C4C] transition-colors" alt="avatar" />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold">Modifier</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-1">{MOCK_USER.name}</h2>
            <p className="text-gray-400 mb-3">{MOCK_USER.email}</p>
            <span className="inline-block px-3 py-1 bg-[#F21C4C]/20 text-[#F21C4C] rounded-full text-xs font-bold uppercase tracking-wider">Membre {MOCK_USER.plan}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
          <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <CreditCard className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] mb-4" />
            <h3 className="font-bold mb-1">Abonnement</h3>
            <p className="text-xs text-gray-500">Gérer votre plan et facturation</p>
          </div>
          <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <ShieldCheck className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] mb-4" />
            <h3 className="font-bold mb-1">Sécurité</h3>
            <p className="text-xs text-gray-500">Mot de passe et appareils</p>
          </div>
        </div>

        <Button variant="outline" className="w-full justify-center py-4 rounded-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/5" onClick={logout} leftIcon={<LogOut className="w-5 h-5" />}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}

// 4. LANDING PAGE (Standardized)
function LandingPage() {
  const { login } = useUserStore();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#F21C4C] selection:text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex items-center justify-between transition-all duration-300">
        <div className="text-2xl font-black tracking-tighter text-[#F21C4C]">DONA.</div>
        <div className="flex items-center gap-6">
          <button onClick={login} className="text-sm font-bold text-white/80 hover:text-white transition-colors">Se connecter</button>
          <Button variant="primary" size="sm" onClick={login}>S'abonner</Button>
        </div>
      </nav>

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#F21C4C] rounded-full blur-[180px] opacity-20 animate-pulse-glow" />
        
        <motion.div style={{ opacity, y }} className="relative z-10 max-w-5xl mx-auto">
          <Badge className="mb-6 inline-block bg-[#F21C4C]/10 text-[#F21C4C] border-[#F21C4C]/20 px-3 py-1">Nouveau : Le Pass Dona+</Badge>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
            Tout voir.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Sans limites.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Une expérience cinéma premium. <br className="hidden md:block"/>
            Films 4K, Séries Originales et Sport en direct.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-2xl shadow-[#F21C4C]/40" onClick={login}>
               Essai gratuit 30 jours
             </Button>
             <p className="text-xs text-gray-500 mt-4 sm:mt-0 sm:ml-4">Sans engagement.<br/>Annulation en 1 clic.</p>
          </div>
        </motion.div>

        <div className="w-full mt-24 rotate-[-2deg] scale-110 opacity-60 hover:opacity-100 transition-opacity duration-700">
           <InfiniteMarquee items={MOCK_CONTENT} speed={40} />
           <div className="mt-6">
             <InfiniteMarquee items={[...MOCK_CONTENT].reverse()} direction="right" speed={50} />
           </div>
        </div>
        
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent z-20" />
      </section>

      <section className="py-32 px-6 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Pourquoi choisir Dona ?</h2>
            <p className="text-xl text-gray-400">Plus qu'une plateforme de streaming, une expérience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Sparkles className="w-8 h-8 text-[#F21C4C]" />, title: "Qualité Cinéma", desc: "Dolby Vision & Atmos sur tous vos appareils compatibles." },
              { icon: <WifiOff className="w-8 h-8 text-[#F21C4C]" />, title: "Mode Hors-ligne", desc: "Téléchargez vos favoris et regardez-les partout, même dans l'avion." },
              { icon: <User className="w-8 h-8 text-[#F21C4C]" />, title: "Profils Multiples", desc: "Jusqu'à 5 profils personnalisés pour toute la famille." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-[#121212] rounded-3xl border border-white/5 hover:border-[#F21C4C]/30 transition-all hover:-translate-y-2">
                <div className="mb-6 bg-[#1E1E1E] w-16 h-16 rounded-2xl flex items-center justify-center">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F21C4C] rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Un Pass. Tout Inclus.</h2>
            <p className="text-xl text-gray-400">Simple, transparent, sans frais cachés.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-10 rounded-3xl border border-white/10 bg-[#050505] opacity-60 hover:opacity-100 transition-opacity">
              <h3 className="text-2xl font-bold mb-2">Découverte</h3>
              <div className="text-4xl font-black mb-6">Gratuit</div>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex gap-3"><Check className="w-5 h-5" /> Accès limité au catalogue</li>
                <li className="flex gap-3"><Check className="w-5 h-5" /> Qualité HD (720p)</li>
                <li className="flex gap-3"><Check className="w-5 h-5" /> Publicités incluses</li>
              </ul>
              <Button variant="outline" className="w-full py-4 rounded-xl" onClick={login}>Créer un compte</Button>
            </div>

            <div className="p-10 rounded-3xl border-2 border-[#F21C4C] bg-[#121212] shadow-2xl shadow-[#F21C4C]/20 relative transform scale-105">
              <div className="absolute top-0 right-0 bg-[#F21C4C] text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">Le plus populaire</div>
              <h3 className="text-2xl font-bold mb-2 text-[#F21C4C]">Le Pass Dona+</h3>
              <div className="text-5xl font-black mb-2">9.99€<span className="text-lg font-medium text-gray-500">/mois</span></div>
              <p className="text-sm text-gray-400 mb-8">Ou 99€/an (2 mois offerts)</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex gap-3 items-center"><div className="bg-[#F21C4C] rounded-full p-1"><Check className="w-3 h-3 text-white" /></div> Catalogue illimité</li>
                <li className="flex gap-3 items-center"><div className="bg-[#F21C4C] rounded-full p-1"><Check className="w-3 h-3 text-white" /></div> 4K HDR & Dolby Atmos</li>
                <li className="flex gap-3 items-center"><div className="bg-[#F21C4C] rounded-full p-1"><Check className="w-3 h-3 text-white" /></div> 4 Écrans simultanés</li>
                <li className="flex gap-3 items-center"><div className="bg-[#F21C4C] rounded-full p-1"><Check className="w-3 h-3 text-white" /></div> Sans publicité</li>
              </ul>
              <Button variant="primary" size="xl" className="w-full py-5 rounded-xl text-lg shadow-xl shadow-[#F21C4C]/20" onClick={login}>Essayer 30 jours gratuitement</Button>
              <p className="text-center text-xs text-gray-500 mt-4">Puis 9.99€/mois. Résiliable à tout moment.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-black border-t border-white/5 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="text-white font-bold mb-6">Dona.</h4>
            <p>Le futur du streaming est ici.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Explorer</h4>
            <ul className="space-y-3">
              <li>Films</li>
              <li>Séries</li>
              <li>Nouveautés</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Aide</h4>
            <ul className="space-y-3">
              <li>Compte</li>
              <li>Centre d'aide</li>
              <li>Appareils compatibles</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Légal</h4>
            <ul className="space-y-3">
              <li>Confidentialité</li>
              <li>Conditions d'utilisation</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/5">
          <p>© 2026 Dona Streaming Inc. Fait avec passion à Paris.</p>
        </div>
      </footer>
    </div>
  );
}

// 5. MAIN APP LAYOUT
function AppLayout() {
  const { currentPage, navigateTo } = useRouterStore();
  const [activeTab, setActiveTab] = useState(currentPage);

  useEffect(() => setActiveTab(currentPage), [currentPage]);

  const navItem = (id: PageView, icon: any, label: string) => (
    <div 
      className={cn("flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-2 group", activeTab === id ? "bg-[#F21C4C] text-white font-bold shadow-lg shadow-[#F21C4C]/30" : "text-gray-400 hover:text-white hover:bg-white/5")}
      onClick={() => navigateTo(id)}
    >
      <div className={cn("w-6 h-6 flex items-center justify-center")}>{icon}</div>
      <span className={cn("hidden lg:block text-sm")}>{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#050505] py-8 px-4 z-50">
        <div className="text-[#F21C4C] font-black text-3xl tracking-tighter px-4 mb-12 flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('browse')}>
           <span>D.</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItem('browse', <Home className="w-5 h-5" />, "Accueil")}
          {navItem('search', <Search className="w-5 h-5" />, "Rechercher")}
          {navItem('movies', <Film className="w-5 h-5" />, "Films")}
          {navItem('series', <Tv className="w-5 h-5" />, "Séries")}
          {navItem('profile', <User className="w-5 h-5" />, "Mon Profil")}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-[#050505]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentPage === 'browse' && <BrowsePage />}
            {currentPage === 'movies' && <GridPage title="Films" filter="film" />}
            {currentPage === 'series' && <GridPage title="Séries" filter="series" />}
            {currentPage === 'search' && <SearchPage />}
            {currentPage === 'profile' && <ProfilePage />}
            {currentPage === 'detail' && <DetailPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// SUB-PAGE: BROWSE
function BrowsePage() {
  const { navigateTo } = useRouterStore();
  const featured = MOCK_CONTENT.find(c => c.id === 'spiderman') || MOCK_CONTENT[3]; // Spider-verse for more vibrant look

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-20">
      {/* Billboard */}
      <div className="relative h-[75vh] w-full flex items-end pb-24 px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-[-1]">
          <img src={featured.backdrop} className="w-full h-full object-cover animate-slow-zoom" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>
        
        <div className="max-w-3xl relative z-10 animate-fade-in-up">
           <span className="text-[#F21C4C] font-bold tracking-widest text-xs uppercase mb-4 block">N°1 aujourd'hui</span>
           <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[0.9] drop-shadow-2xl">{featured.title}</h1>
           <p className="text-lg text-gray-200 line-clamp-2 mb-8 max-w-xl font-medium">{featured.synopsis}</p>
           {/* FIX: Increased gap between hero buttons */}
           <div className="flex gap-6">
             <Button size="xl" onClick={() => navigateTo('detail', featured.id)} leftIcon={<Play className="fill-current w-6 h-6" />}>Regarder</Button>
             <Button variant="glass" size="xl" onClick={() => navigateTo('detail', featured.id)} leftIcon={<Info className="w-6 h-6" />}>Plus d'infos</Button>
           </div>
        </div>
      </div>

      {/* Rails */}
      <div className="px-8 lg:px-16 space-y-16 -mt-10 relative z-10">
        <ContentRail title="Tendances actuelles" data={MOCK_CONTENT} />
        <ContentRail title="Films primés" data={[...MOCK_CONTENT].reverse()} />
        <ContentRail title="Séries à binger" data={MOCK_CONTENT.filter(c => c.type === 'series')} />
      </div>
    </div>
  );
}

// SUB-PAGE: GENERIC GRID
function GridPage({ title, filter }: { title: string, filter: ContentType }) {
  const { navigateTo } = useRouterStore();
  // Filter and then sort or shuffle could be added here to avoid seeing the same items in the same order if desired
  const data = MOCK_CONTENT.filter(c => c.type === filter);

  return (
    <div className="h-full overflow-y-auto pt-24 px-8 lg:px-16 pb-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4"/>}>Filtrer</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {data.map(item => (
          <MediaCard key={item.id} item={item} onClick={() => navigateTo('detail', item.id)} />
        ))}
        {/* Removed artificial duplication to respect "No Duplicates" rule, assuming MOCK_CONTENT is now sufficient */}
      </div>
    </div>
  );
}

const ContentRail = ({ title, data }: { title: string, data: ContentItem[] }) => {
  const { navigateTo } = useRouterStore();
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-white group cursor-pointer flex items-center gap-2">
          {title} <ChevronRight className="w-5 h-5 text-[#F21C4C] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
        </h2>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x">
        {data.map((item) => (
          <div key={item.id} className="w-[220px] flex-shrink-0 snap-start">
            <MediaCard item={item} onClick={() => navigateTo('detail', item.id)} />
          </div>
        ))}
      </div>
    </section>
  );
};

const InfiniteMarquee = ({ items, direction = 'left', speed = 30 }: { items: ContentItem[], direction?: 'left' | 'right', speed?: number }) => {
  return (
    <div className="flex overflow-hidden w-full relative mask-linear-fade">
      <motion.div 
        className="flex gap-6 min-w-full"
        animate={{ x: direction === 'left' ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {[...items, ...items].map((item, i) => ( 
          <div key={`${item.id}-${i}`} className="w-32 md:w-48 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden relative group bg-[#1a1a1a]">
             <img 
               src={item.poster} 
               className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" 
               alt={item.title} 
               loading="lazy"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
               <span className="text-xs font-bold truncate">{item.title}</span>
             </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- ROOT APP ---
export default function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <div className="text-white bg-[#050505]">
      {isAuthenticated ? <AppLayout /> : <LandingPage />}
    </div>
  );
}