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
import {
  Fire, FilmSlate, Moon, GlobeHemisphereWest, Trophy, Target,
  Lightning, Medal, Heart, BookmarkSimple, Clock, TrendUp
} from '@phosphor-icons/react';
import DesignSystem from './DesignSystem';

// Local images
import coverCyberpunk from './images/cover cyberpunk.jpeg';
import coverSuccession from './images/cover succession.jpg';
import coverTLOU from './images/cover the last of us.webp';
import bannerSpiderman from './images/banner spiderman.png';
import donaSplashscreen from './images/dona_splashscreen_2x.webp';
import donaLogoBanner from './images/dona_logo_banner_2x.webp';
import donaLogoMacaron from './images/dona_logo_macaron_2x.webp';

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
// Cast pour Oppenheimer
const CAST_OPPENHEIMER = [
  { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://image.tmdb.org/t/p/w200/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg" },
  { name: "Emily Blunt", role: "Katherine Oppenheimer", image: "https://image.tmdb.org/t/p/w200/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg" },
  { name: "Matt Damon", role: "Leslie Groves", image: "https://image.tmdb.org/t/p/w200/ehBCD4tpPPOCs0vPgESI6lYn0Q3.jpg" },
  { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://image.tmdb.org/t/p/w200/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg" },
];

// Cast pour Dune 2
const CAST_DUNE2 = [
  { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://image.tmdb.org/t/p/w200/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
  { name: "Zendaya", role: "Chani", image: "https://image.tmdb.org/t/p/w200/tylFh8XNKH2V1TgD7gXUDgwTTcN.jpg" },
  { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://image.tmdb.org/t/p/w200/lJloTOheuQSirSLXNA3JHsrMNfH.jpg" },
  { name: "Josh Brolin", role: "Gurney Halleck", image: "https://image.tmdb.org/t/p/w200/sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg" },
];

// Cast pour Interstellar
const CAST_INTERSTELLAR = [
  { name: "Matthew McConaughey", role: "Cooper", image: "https://image.tmdb.org/t/p/w200/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg" },
  { name: "Anne Hathaway", role: "Dr. Brand", image: "https://image.tmdb.org/t/p/w200/s6tflSD93fGVWrIfjJEfKYxWrEY.jpg" },
  { name: "Jessica Chastain", role: "Murph (adulte)", image: "https://image.tmdb.org/t/p/w200/lodMzLKSdrPcBry6TdoDsMN3Vge.jpg" },
  { name: "Michael Caine", role: "Professeur Brand", image: "https://image.tmdb.org/t/p/w200/hZruclwEPCKw3e83rnFc5zpXRjK.jpg" },
];

// Cast pour Spider-Man: Across the Spider-Verse
const CAST_SPIDERMAN = [
  { name: "Shameik Moore", role: "Miles Morales (voix)", image: "https://image.tmdb.org/t/p/w200/fkOWzAK4V3seIQWlCXQULgQiP5R.jpg" },
  { name: "Hailee Steinfeld", role: "Gwen Stacy (voix)", image: "https://image.tmdb.org/t/p/w200/dxSDWkiVaC6JYjrV3XRAZI7HOSS.jpg" },
  { name: "Oscar Isaac", role: "Miguel O'Hara (voix)", image: "https://image.tmdb.org/t/p/w200/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg" },
  { name: "Jake Johnson", role: "Peter B. Parker (voix)", image: "https://image.tmdb.org/t/p/w200/5BqNwjC7IvPgtkPABc25Kx7FWZR.jpg" },
];

// Cast pour The Last of Us
const CAST_TLOU = [
  { name: "Pedro Pascal", role: "Joel Miller", image: "https://image.tmdb.org/t/p/w200/9VYK7oxcqhjd5LAH6ZFJ3XzOlID.jpg" },
  { name: "Bella Ramsey", role: "Ellie Williams", image: "https://image.tmdb.org/t/p/w200/xO0n6OXzSmgZ2U8ST15a4euGvS8.jpg" },
  { name: "Anna Torv", role: "Tess", image: "https://image.tmdb.org/t/p/w200/yLKYFDwabUCRkp2IdTv2W0N5vf9.jpg" },
  { name: "Nick Offerman", role: "Bill", image: "https://image.tmdb.org/t/p/w200/aFrryTfIKvbhhYFrgFrQjoTljKZ.jpg" },
];

// Cast pour Breaking Bad
const CAST_BREAKING_BAD = [
  { name: "Bryan Cranston", role: "Walter White", image: "https://image.tmdb.org/t/p/w200/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg" },
  { name: "Aaron Paul", role: "Jesse Pinkman", image: "https://image.tmdb.org/t/p/w200/u8UdsB9yenM4uHEjgcRAw3aLlMj.jpg" },
  { name: "Anna Gunn", role: "Skyler White", image: "https://image.tmdb.org/t/p/w200/adppyeu1a4REN3khtgmXusrapFi.jpg" },
  { name: "Dean Norris", role: "Hank Schrader", image: "https://image.tmdb.org/t/p/w200/yJcjMX2GccfBKmj6v3bVT4BfqW5.jpg" },
];

// Cast pour Cyberpunk Edgerunners
const CAST_CYBERPUNK = [
  { name: "Kenn", role: "David Martinez (voix JP)", image: "https://image.tmdb.org/t/p/w200/bJ5YUJcwz99I4QU5H1SHN0dPmEb.jpg" },
  { name: "Aoi Yuki", role: "Lucy (voix JP)", image: "https://image.tmdb.org/t/p/w200/lGdXgGuxhdqRDWHuEn3rAoSvKqP.jpg" },
  { name: "Zach Aguilar", role: "David Martinez (voix EN)", image: "https://image.tmdb.org/t/p/w200/nraZoTzwJQPHspAVsKfgl3RXKKa.jpg" },
  { name: "Emi Lo", role: "Lucy (voix EN)", image: "https://image.tmdb.org/t/p/w200/yGeN8PmZzb2LTdgj2hYAPDVXpCq.jpg" },
];

// Cast pour Succession
const CAST_SUCCESSION = [
  { name: "Jeremy Strong", role: "Kendall Roy", image: "https://image.tmdb.org/t/p/w200/yA3mJBu77k8BNSo9z0DOpqTsL8D.jpg" },
  { name: "Sarah Snook", role: "Siobhan Roy", image: "https://image.tmdb.org/t/p/w200/8Ak6eXKEeZpgNaoIpoQiMnT4B99.jpg" },
  { name: "Kieran Culkin", role: "Roman Roy", image: "https://image.tmdb.org/t/p/w200/fVD8LbI5AMpY0qwlcSGZ7LhKXhN.jpg" },
  { name: "Brian Cox", role: "Logan Roy", image: "https://image.tmdb.org/t/p/w200/6SlC0e9mDYxsW8bLfB1LovZw0KK.jpg" },
];

// Cast par défaut (Oppenheimer)
const MOCK_CAST = CAST_OPPENHEIMER;

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
    backdrop: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    dominantColor: '#D86626', badges: ['4K', 'HDR', 'Atmos'], genres: ['Drame', 'Histoire'], match: 98,
    director: "Christopher Nolan", studio: "Universal Pictures", cast: CAST_OPPENHEIMER
  },
  {
    id: 'dune2', type: 'film', title: 'Dune: Deuxième Partie', year: 2024, duration: '2h 46m', rating: 8.8,
    synopsis: "Paul Atreides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont anéanti sa famille.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    dominantColor: '#C6823F', badges: ['4K', 'Dolby Vision', 'Atmos'], genres: ['Sci-Fi', 'Aventure'], match: 99,
    director: "Denis Villeneuve", studio: "Warner Bros.", cast: CAST_DUNE2
  },
  {
    id: 'interstellar', type: 'film', title: 'Interstellar', year: 2014, duration: '2h 49m', rating: 8.7,
    synopsis: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace pour assurer la survie de l'humanité.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    dominantColor: '#0B1026', badges: ['4K', 'HDR'], genres: ['Sci-Fi', 'Drame'], match: 95,
    director: "Christopher Nolan", cast: CAST_INTERSTELLAR
  },
  {
    id: 'spiderman', type: 'film', title: 'Spider-Man: Across the Spider-Verse', year: 2023, duration: '2h 20m', rating: 8.6,
    synopsis: "Miles Morales est catapulté à travers le Multivers, où il rencontre une équipe de Spider-People chargée de protéger son existence.",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: bannerSpiderman,
    dominantColor: '#F21C4C', badges: ['4K', 'HDR'], genres: ['Animation', 'Action'], match: 97,
    cast: CAST_SPIDERMAN
  },
  {
    id: 'tlou', type: 'series', title: 'The Last of Us', year: 2023, duration: '1 Saison', rating: 9.2,
    synopsis: "Quand le monde tel que vous le connaissiez n'existe plus, jusqu'où iriez-vous pour survivre ?",
    poster: coverTLOU,
    backdrop: coverTLOU,
    dominantColor: '#2C3E50', badges: ['4K', 'HDR', 'Atmos'], genres: ['Action', 'Drame'], match: 99,
    cast: CAST_TLOU
  },
  {
    id: 'breaking-bad', type: 'series', title: 'Breaking Bad', year: 2008, duration: '5 Saisons', rating: 9.5,
    synopsis: "Walter White, professeur de chimie, se lance dans le crime pour subvenir aux besoins de sa famille.",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    dominantColor: '#1B4F25', badges: ['4K'], genres: ['Crime', 'Drame'], match: 98,
    cast: CAST_BREAKING_BAD
  },
  {
    id: 'cyberpunk', type: 'series', title: 'Cyberpunk: Edgerunners', year: 2022, duration: '1 Saison', rating: 8.3,
    synopsis: "Dans une dystopie rongée par la corruption et les implants cybernétiques, un enfant des rues talentueux et impulsif tente de survivre.",
    poster: coverCyberpunk,
    backdrop: coverCyberpunk,
    dominantColor: '#F21C4C', badges: ['4K', 'HDR'], genres: ['Animation', 'Sci-Fi'], match: 94,
    cast: CAST_CYBERPUNK
  },
  {
    id: 'succession', type: 'series', title: 'Succession', year: 2018, duration: '4 Saisons', rating: 8.9,
    synopsis: "La famille Roy, propriétaire d'un conglomérat médiatique mondial, se bat pour le contrôle de l'entreprise.",
    poster: coverSuccession,
    backdrop: coverSuccession,
    dominantColor: '#1F2937', badges: ['4K', 'HDR'], genres: ['Drame', 'Comédie'], match: 96,
    cast: CAST_SUCCESSION
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
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  finishLoading: () => void;
}

const useUserStore = create<UserState>((set) => ({
  myList: [],
  isAuthenticated: false,
  isLoading: false,
  toggleMyList: (id) => set((state) => ({
    myList: state.myList.includes(id) ? state.myList.filter(item => item !== id) : [...state.myList, id]
  })),
  login: () => {
    set({ isLoading: true });
    // Simulate loading time for splashscreen
    setTimeout(() => {
      useRouterStore.getState().navigateTo('browse');
      set({ isAuthenticated: true, isLoading: false });
    }, 2500);
  },
  logout: () => {
    useRouterStore.getState().navigateTo('landing');
    set({ isAuthenticated: false });
  },
  finishLoading: () => set({ isLoading: false }),
}));

// --- SPLASHSCREEN COMPONENT ---
const Splashscreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      {/* Splashscreen Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={donaSplashscreen}
          alt="Dona"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      {/* Loading indicator at bottom */}
      <div className="absolute bottom-20 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Loader */}
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 border-2 border-white/10 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-t-[#F21C4C] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-white/50 text-sm font-medium tracking-wider uppercase">
            Chargement de votre expérience...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

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
  const [showOptIn, setShowOptIn] = useState(true);

  // Suggested content when paused
  const suggestedContent = MOCK_CONTENT.filter(c => c.id !== content.id).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="absolute inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl overflow-y-auto"
    >
      {/* Top Bar - Branding and Actions */}
      <div className="flex justify-between items-center p-8 bg-gradient-to-b from-black/80 to-transparent sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </button>
          <img src={donaLogoMacaron} alt="Dona" className="h-10 w-10 object-contain" />
        </div>

        {/* Play/Pause Indicator - Apple style */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="absolute left-1/2 -translate-x-1/2 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/10"
        >
           <span className="text-xs font-semibold tracking-wide text-white/80 uppercase flex items-center gap-2">
             <Pause className="w-3 h-3" /> En pause
           </span>
        </motion.div>

        <div className="flex gap-3">
           <button className="p-3 hover:bg-white/10 rounded-full transition-colors group relative">
             <MessageCircle className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
             <span className="absolute -top-1 -right-1 bg-[#FF375F] text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
           </button>
           <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
             <Settings className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-12 lg:px-24 relative max-w-7xl mx-auto w-full">

        {/* Central Play Button - Apple TV style */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={togglePlay}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Button */}
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 ease-out">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </motion.div>
            </div>
          </button>
        </motion.div>

        {/* Title & Key Stats */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
             <Badge className="bg-white/10 text-white border-white/10">{content.type === 'film' ? 'Film' : 'Série'}</Badge>
             {content.badges.slice(0, 2).map((b: string) => <Badge key={b} className="bg-white/5 text-white/70 border-white/5">{b}</Badge>)}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{content.title}</h1>

          <div className="flex items-center justify-center gap-4 text-white/50 text-sm">
            <span>{content.year}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"/>
            <span>{content.duration}</span>
            {content.match && (
              <>
                <span className="w-1 h-1 bg-white/30 rounded-full"/>
                <span className="text-[#30D158] font-medium">{content.match}% Match</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Promotional Nudge Banner */}
        <AnimatePresence>
          {showOptIn && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mb-10 relative"
            >
              <div className="bg-gradient-to-r from-[#5E5CE6]/20 via-[#1c1c1e] to-[#BF5AF2]/20 rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden">
                <button
                  onClick={() => setShowOptIn(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5E5CE6] to-[#BF5AF2] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Passez à Dona+ pour une expérience sans pub</h3>
                    <p className="text-sm text-white/50">Profitez de contenus exclusifs, 4K HDR et téléchargements illimités.</p>
                  </div>
                  <Button variant="glass" size="sm" className="flex-shrink-0">
                    En savoir plus
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-xl w-fit"
        >
          {[
            { id: 'info', label: 'Infos' },
            { id: 'audio', label: 'Audio' },
            { id: 'suggested', label: 'À suivre' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Panel Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex-1 pb-8"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                <div>
                  <p className="text-lg text-white/70 leading-relaxed mb-6">{content.synopsis}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     {content.director && (
                       <div className="bg-white/5 rounded-xl p-4">
                         <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Réalisateur</span>
                         <strong className="text-white">{content.director}</strong>
                       </div>
                     )}
                     {content.studio && (
                       <div className="bg-white/5 rounded-xl p-4">
                         <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Studio</span>
                         <strong className="text-white">{content.studio}</strong>
                       </div>
                     )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide">Distribution</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(content.cast || MOCK_CAST).slice(0, 4).map((actor: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors cursor-pointer">
                        <img src={actor.image} className="w-10 h-10 rounded-full object-cover" alt={actor.name} />
                        <div>
                          <p className="text-sm font-medium text-white">{actor.name}</p>
                          <p className="text-xs text-white/40">{actor.role}</p>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Audio
                  </h4>
                  <div className="space-y-2">
                    {['Français (Original)', 'Anglais - Dolby Atmos', 'Espagnol', 'Allemand'].map((lang, i) => (
                      <div key={lang} className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all",
                        i === 0
                          ? "bg-white text-black"
                          : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      )}>
                        <span className="text-sm font-medium">{lang}</span>
                        {i === 0 && <Check className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Sous-titres
                  </h4>
                  <div className="space-y-2">
                    {['Désactivé', 'Français', 'Anglais (CC)', 'Espagnol'].map((lang, i) => (
                      <div key={lang} className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all",
                        i === 1
                          ? "bg-white text-black"
                          : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      )}>
                        <span className="text-sm font-medium">{lang}</span>
                        {i === 1 && <Check className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'suggested' && (
              <motion.div
                key="suggested"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wide">Si vous aimez {content.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestedContent.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 relative">
                          <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs font-medium text-[#30D158]">
                            {item.match}%
                          </div>
                        </div>
                        <h5 className="font-medium text-sm text-white/90 group-hover:text-white transition-colors truncate">{item.title}</h5>
                        <p className="text-xs text-white/40">{item.year} • {item.type === 'film' ? 'Film' : 'Série'}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controls Bar - Timeline & Actions */}
      <div className="px-10 pb-8 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent sticky bottom-0">
         {/* Timeline */}
         <div className="flex items-center gap-4 mb-6 text-xs font-mono text-white/40">
            <span className="w-10 text-right tabular-nums">34:12</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
               <div className="absolute left-0 top-0 h-full w-[34%] bg-white/80 rounded-full" />
               <div className="absolute left-0 top-0 h-full w-[45%] bg-white/10 rounded-full -z-10" />
               <div className="absolute left-[34%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
            <span className="w-10 tabular-nums">{content.duration.replace('h', ':').replace('m', '')}</span>
         </div>

         {/* Playback Controls */}
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              {/* Skip back */}
              <button className="text-white/50 hover:text-white transition-colors p-2">
                <Rewind className="w-5 h-5" />
              </button>

              {/* Main play button */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Play className="w-6 h-6 text-black fill-black ml-0.5" />
              </button>

              {/* Skip forward */}
              <button className="text-white/50 hover:text-white transition-colors p-2">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(34);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVideo = () => {
      setTimeout(() => {
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

  const handleMouseMove = () => {
    if (isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls || !isPlaying ? 'default' : 'none' }}
    >
       {/* Layer 1: Video Content */}
       <div className="absolute inset-0 z-0">
         {error ? (
           <motion.div
             initial={{ scale: 1 }}
             animate={{ scale: 1.05 }}
             transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
             className="w-full h-full"
           >
             <img src={content.backdrop} className="w-full h-full object-cover opacity-60" alt="Simulation" />
           </motion.div>
         ) : (
           videoUrl && !loading && (
             <video
               ref={videoRef}
               autoPlay
               className="w-full h-full object-cover"
               onError={() => setError(true)}
               src={videoUrl}
               onClick={togglePlay}
             />
           )
         )}
       </div>

       {/* Layer 2: Loading */}
       <AnimatePresence>
         {loading && (
           <motion.div
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
             className="absolute inset-0 flex items-center justify-center z-50 bg-black"
           >
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-white/20 border-t-white rounded-full"
                  />
                </div>
                <p className="text-sm text-white/50">Chargement...</p>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Layer 3: Paused Overlay */}
       <AnimatePresence>
         {!isPlaying && !loading && (
           <PlayerOverlay content={content} onClose={onClose} isPaused={!isPlaying} togglePlay={togglePlay} />
         )}
       </AnimatePresence>

       {/* Layer 4: Minimal Controls when Playing */}
       <AnimatePresence>
         {isPlaying && !loading && showControls && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none"
           >
             {/* Top gradient */}
             <div className="bg-gradient-to-b from-black/60 to-transparent p-8 pointer-events-auto">
               <div className="flex items-center gap-4">
                 <button onClick={onClose} className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all">
                   <ArrowLeft className="w-5 h-5 text-white" />
                 </button>
                 <img src={donaLogoMacaron} alt="Dona" className="h-8 w-8 object-contain opacity-80" />
               </div>
             </div>

             {/* Center Play/Pause Button - Apple style */}
             <div className="flex-1 flex items-center justify-center pointer-events-auto" onClick={togglePlay}>
               <motion.div
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.8, opacity: 0 }}
                 transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                 className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-black/60 hover:scale-110 transition-all duration-200"
               >
                 <AnimatePresence mode="wait">
                   <motion.div
                     key="pause"
                     initial={{ scale: 0, rotate: -90 }}
                     animate={{ scale: 1, rotate: 0 }}
                     exit={{ scale: 0, rotate: 90 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Pause className="w-8 h-8 text-white fill-white" />
                   </motion.div>
                 </AnimatePresence>
               </motion.div>
             </div>

             {/* Bottom Controls */}
             <div className="bg-gradient-to-t from-black/80 to-transparent p-8 pointer-events-auto">
               {/* Title */}
               <div className="mb-4">
                 <h2 className="text-xl font-semibold text-white">{content.title}</h2>
                 <p className="text-sm text-white/50">{content.year} • {content.duration}</p>
               </div>

               {/* Progress Bar */}
               <div className="flex items-center gap-4 text-xs text-white/50">
                 <span className="tabular-nums w-12">34:12</span>
                 <div className="flex-1 h-1 bg-white/20 rounded-full relative group cursor-pointer">
                   <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                   <div
                     className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                     style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                   />
                 </div>
                 <span className="tabular-nums w-12">{content.duration.replace('h', ':').replace('m', '')}</span>
               </div>

               {/* Control Buttons */}
               <div className="flex items-center justify-between mt-4">
                 <div className="flex items-center gap-4">
                   <button className="text-white/60 hover:text-white transition-colors p-2">
                     <Rewind className="w-5 h-5" />
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                     className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                   >
                     <Pause className="w-5 h-5 text-black fill-black" />
                   </button>
                   <button className="text-white/60 hover:text-white transition-colors p-2">
                     <SkipForward className="w-5 h-5" />
                   </button>
                 </div>

                 <div className="flex items-center gap-2">
                   <button className="text-white/60 hover:text-white transition-colors p-2">
                     <Volume2 className="w-5 h-5" />
                   </button>
                   <button className="text-white/60 hover:text-white transition-colors p-2">
                     <Maximize2 className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Click anywhere to toggle when playing without controls visible */}
       {isPlaying && !loading && !showControls && (
         <div
           className="absolute inset-0 z-5"
           onClick={togglePlay}
         />
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

  // Mock data for sections
  const recentSearches = ['Oppenheimer', 'Succession', 'Science Fiction', 'Christopher Nolan'];
  const recommendedContent = MOCK_CONTENT.slice(0, 6);
  const leavingSoonContent = MOCK_CONTENT.slice(2, 6);

  return (
    <div className="pt-24 px-6 md:px-16 min-h-screen bg-[#050505] pb-20">
      {/* Search Input */}
      <div className="relative max-w-3xl mx-auto mb-12">
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

      {/* Search Results */}
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

      {/* Default State - No Query */}
      {!query && (
        <div className="space-y-16">
          {/* Promotional Banner - Apple Style */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a0f] via-[#120808] to-[#0a0505] border border-white/5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI0YyMUM0QyIgZmlsbC1vcGFjaXR5PSIwLjAzIiBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F21C4C] rounded-full blur-[150px] opacity-20" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#F21C4C] rounded-full blur-[120px] opacity-10" />

            <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F21C4C]/20 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-[#F21C4C]" />
                  <span className="text-[#F21C4C] text-sm font-semibold uppercase tracking-wider">Offre limitée</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  3 mois de <span className="text-[#F21C4C]">Dona+</span><br />
                  pour le prix d'un
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                  Accédez à tout le catalogue en 4K HDR, téléchargements illimités et 4 écrans simultanés.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="px-8 py-4 bg-[#F21C4C] hover:bg-[#D9123C] text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#F21C4C]/30">
                    Profiter de l'offre
                  </button>
                  <span className="text-gray-500 text-sm">Jusqu'au 31 janvier 2026</span>
                </div>
              </div>

              {/* Visual */}
              <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F21C4C]/30 to-transparent rounded-3xl" />
                <img
                  src={coverCyberpunk}
                  alt="Dona+ Premium"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#F21C4C] text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">
                  -66%
                </div>
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h2 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500 flex items-center gap-3">
              <Search className="w-5 h-5" />
              Recherches récentes
            </h2>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="group flex items-center gap-3 px-5 py-3 bg-[#121212] hover:bg-[#1E1E1E] rounded-full text-md transition-all border border-white/5 hover:border-white/10"
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors">{term}</span>
                  <X className="w-4 h-4 text-gray-600 hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div>
            <h2 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500 flex items-center gap-3">
              <Star className="w-5 h-5" />
              Recommandés pour vous
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {recommendedContent.map(c => (
                <MediaCard key={c.id} item={c} onClick={() => navigateTo('detail', c.id)} />
              ))}
            </div>
          </div>

          {/* Leaving Soon */}
          <div>
            <h2 className="text-lg font-bold mb-6 uppercase tracking-widest text-[#F21C4C] flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Bientôt hors catalogue
            </h2>
            <p className="text-gray-500 mb-6 -mt-4">Ces contenus quittent Dona dans les 30 prochains jours</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {leavingSoonContent.map(c => (
                <div key={c.id} className="relative group">
                  <MediaCard item={c} onClick={() => navigateTo('detail', c.id)} />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#F21C4C] text-white text-xs font-bold rounded-full">
                    Encore {Math.floor(Math.random() * 25) + 5} jours
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Genres */}
          <div>
            <h2 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500">Genres Populaires</h2>
            <div className="flex flex-wrap gap-4">
              {['Science Fiction', 'Action', 'Comédie', 'Drame', 'Animation', 'Documentaire', 'Thriller'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)} className="px-6 py-3 bg-[#121212] hover:bg-[#1E1E1E] rounded-full text-md font-medium transition-all hover:scale-105 border border-white/5">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. PROFILE PAGE (Standardized)
function ProfilePage() {
  const { logout } = useUserStore();
  const { navigateTo } = useRouterStore();
  const [showSettings, setShowSettings] = useState(false);

  // Mock user stats for gamification
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    hoursWatched: 156,
    moviesWatched: 47,
    seriesCompleted: 8,
    streak: 14,
    badges: [
      { name: 'Binge Watcher', icon: 'fire', description: '10 épisodes en un jour' },
      { name: 'Cinéphile', icon: 'film', description: '50 films regardés' },
      { name: 'Noctambule', icon: 'moon', description: 'Regarder après minuit' },
      { name: 'Explorateur', icon: 'globe', description: '10 genres différents' },
    ],
    recentAchievement: { name: 'Critique en herbe', icon: 'trophy', progress: 80 },
  };

  // Badge icon renderer
  const BadgeIcon = ({ type, className }: { type: string; className?: string }) => {
    const iconClass = className || "w-8 h-8";
    switch (type) {
      case 'fire': return <Fire weight="fill" className={iconClass} />;
      case 'film': return <FilmSlate weight="fill" className={iconClass} />;
      case 'moon': return <Moon weight="fill" className={iconClass} />;
      case 'globe': return <GlobeHemisphereWest weight="fill" className={iconClass} />;
      case 'trophy': return <Trophy weight="fill" className={iconClass} />;
      case 'target': return <Target weight="fill" className={iconClass} />;
      default: return <Medal weight="fill" className={iconClass} />;
    }
  };

  // Mock taste profile
  const tasteProfile = [
    { genre: 'Science Fiction', score: 92 },
    { genre: 'Thriller', score: 85 },
    { genre: 'Drame', score: 78 },
    { genre: 'Action', score: 72 },
    { genre: 'Documentaire', score: 65 },
  ];

  // Mock recommendations based on profile
  const personalizedRecs = MOCK_CONTENT.slice(0, 4);
  const watchlist = MOCK_CONTENT.slice(2, 5);
  const continueWatching = MOCK_CONTENT.slice(0, 3);

  // Settings panel component
  const SettingsPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/5 z-50 overflow-y-auto"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Paramètres</h2>
          <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] transition-colors" />
              <div className="flex-1">
                <h3 className="font-bold">Abonnement</h3>
                <p className="text-xs text-gray-500">Plan Dona+ • Renouvellement le 15 fév</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] transition-colors" />
              <div className="flex-1">
                <h3 className="font-bold">Sécurité</h3>
                <p className="text-xs text-gray-500">Mot de passe et authentification</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <Monitor className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] transition-colors" />
              <div className="flex-1">
                <h3 className="font-bold">Appareils</h3>
                <p className="text-xs text-gray-500">3 appareils connectés</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] transition-colors" />
              <div className="flex-1">
                <h3 className="font-bold">Langue & Sous-titres</h3>
                <p className="text-xs text-gray-500">Français • Sous-titres activés</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6 text-gray-500 group-hover:text-[#F21C4C] transition-colors" />
              <div className="flex-1">
                <h3 className="font-bold">Préférences de lecture</h3>
                <p className="text-xs text-gray-500">Qualité auto • Lecture auto activée</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowSettings(false)}
            />
            <SettingsPanel />
          </>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 px-8 lg:px-16">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={MOCK_USER.avatar} className="w-24 h-24 rounded-full border-4 border-white/10" alt="avatar" />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[#5E5CE6] to-[#BF5AF2] text-white text-xs font-bold px-2 py-1 rounded-full">
                Niv.{userStats.level}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Bonjour, {MOCK_USER.name.split(' ')[0]} !</h1>
              <p className="text-gray-400">Membre {MOCK_USER.plan} depuis mars 2024</p>
              {/* XP Bar - Apple style subtle gradient */}
              <div className="mt-3 flex items-center gap-3">
                <div className="w-48 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5E5CE6] to-[#BF5AF2] rounded-full transition-all"
                    style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{userStats.xp}/{userStats.xpToNext} XP</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
        </div>
      </div>

      <div className="px-8 lg:px-16 space-y-12">
        {/* Stats Cards - Apple style muted colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04]">
            <Clock weight="fill" className="w-5 h-5 text-[#64D2FF] mb-2" />
            <div className="text-3xl font-semibold text-white">{userStats.hoursWatched}h</div>
            <div className="text-sm text-gray-500 mt-1">de visionnage</div>
          </div>
          <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04]">
            <FilmSlate weight="fill" className="w-5 h-5 text-[#FF9F0A] mb-2" />
            <div className="text-3xl font-semibold text-white">{userStats.moviesWatched}</div>
            <div className="text-sm text-gray-500 mt-1">films regardés</div>
          </div>
          <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04]">
            <BookmarkSimple weight="fill" className="w-5 h-5 text-[#30D158] mb-2" />
            <div className="text-3xl font-semibold text-white">{userStats.seriesCompleted}</div>
            <div className="text-sm text-gray-500 mt-1">séries terminées</div>
          </div>
          <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04] relative overflow-hidden">
            <Fire weight="fill" className="w-5 h-5 text-[#FF9500] mb-2" />
            <div className="text-3xl font-semibold text-white">{userStats.streak}</div>
            <div className="text-sm text-gray-500 mt-1">jours de suite</div>
          </div>
        </div>

        {/* Achievement Progress - Apple style */}
        <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD60A]/20 to-[#FF9F0A]/20 flex items-center justify-center">
                <BadgeIcon type={userStats.recentAchievement.icon} className="w-6 h-6 text-[#FFD60A]" />
              </div>
              <div>
                <h3 className="font-semibold">Prochain succès : {userStats.recentAchievement.name}</h3>
                <p className="text-sm text-gray-500">Note 10 contenus pour débloquer</p>
              </div>
            </div>
            <span className="text-white/60 font-medium">{userStats.recentAchievement.progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FFD60A] to-[#FF9F0A] rounded-full"
              style={{ width: `${userStats.recentAchievement.progress}%` }}
            />
          </div>
        </div>

        {/* Badges - Apple style */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Medal weight="fill" className="w-6 h-6 text-[#FFD60A]" />
            Vos badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.badges.map((badge, i) => {
              const colors = [
                { bg: 'from-[#FF9500]/20 to-[#FF6B00]/20', icon: 'text-[#FF9500]' },
                { bg: 'from-[#5E5CE6]/20 to-[#BF5AF2]/20', icon: 'text-[#BF5AF2]' },
                { bg: 'from-[#64D2FF]/20 to-[#5AC8FA]/20', icon: 'text-[#64D2FF]' },
                { bg: 'from-[#30D158]/20 to-[#34C759]/20', icon: 'text-[#30D158]' },
              ];
              const color = colors[i % colors.length];
              return (
                <div key={badge.name} className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/[0.04] text-center hover:bg-[#2c2c2e] transition-colors cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center mx-auto mb-3`}>
                    <BadgeIcon type={badge.icon} className={`w-7 h-7 ${color.icon}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Taste Profile - Apple style */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Heart weight="fill" className="w-6 h-6 text-[#FF375F]" />
            Votre profil cinématographique
          </h2>
          <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/[0.04]">
            <div className="space-y-4">
              {tasteProfile.map((taste, i) => {
                const barColors = [
                  'from-[#5E5CE6] to-[#BF5AF2]',
                  'from-[#64D2FF] to-[#5AC8FA]',
                  'from-[#FF9F0A] to-[#FF9500]',
                  'from-[#30D158] to-[#34C759]',
                  'from-[#FF375F] to-[#FF2D55]',
                ];
                return (
                  <div key={taste.genre} className="flex items-center gap-4">
                    <span className="w-32 text-sm text-gray-400">{taste.genre}</span>
                    <div className="flex-1 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${barColors[i % barColors.length]} rounded-full transition-all`}
                        style={{ width: `${taste.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{taste.score}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-white/[0.04]">
              Basé sur vos 156 heures de visionnage et vos évaluations
            </p>
          </div>
        </section>

        {/* Continue Watching */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Play className="w-6 h-6 text-[#64D2FF]" />
              Reprendre
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {continueWatching.map((item, i) => (
              <div key={item.id} className="flex gap-4 bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.04] cursor-pointer hover:bg-[#2c2c2e] transition-colors group" onClick={() => navigateTo('detail', item.id)}>
                <div className="relative w-28 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[#64D2FF]" style={{ width: `${40 + i * 20}%` }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500">Il reste {30 - i * 10} min</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personalized Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#FFD60A]" />
                Rien que pour vous
              </h2>
              <p className="text-gray-500 text-sm mt-1">Sélectionnés selon vos goûts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {personalizedRecs.map(item => (
              <div key={item.id} className="relative">
                <MediaCard item={item} onClick={() => navigateTo('detail', item.id)} />
                <div className="absolute top-3 right-3 px-2 py-1 bg-[#30D158] text-white text-xs font-bold rounded-full">
                  {item.match}% match
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Watchlist */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <BookmarkSimple weight="fill" className="w-6 h-6 text-[#BF5AF2]" />
              Ma liste
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
            {watchlist.map(item => (
              <div key={item.id} className="w-[180px] flex-shrink-0">
                <MediaCard item={item} onClick={() => navigateTo('detail', item.id)} />
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Challenge - Apple style */}
        <div className="bg-gradient-to-br from-[#5E5CE6]/20 via-[#1c1c1e] to-[#BF5AF2]/20 rounded-3xl p-8 border border-white/[0.04] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5E5CE6] rounded-full blur-[150px] opacity-10" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5E5CE6]/20 rounded-full mb-4">
                <Lightning weight="fill" className="w-4 h-4 text-[#FFD60A]" />
                <span className="text-sm font-semibold text-white/80">Défi de la semaine</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Découvrez 3 documentaires</h3>
              <p className="text-gray-400 mb-4">Élargissez vos horizons et gagnez 500 XP bonus</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/[0.08] rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-gradient-to-r from-[#FFD60A] to-[#FF9F0A] rounded-full" style={{ width: '33%' }} />
                </div>
                <span className="text-sm text-white/60">1/3</span>
              </div>
            </div>
            <Button variant="glass" size="lg">Relever le défi</Button>
          </div>
        </div>
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
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 bg-gradient-to-b from-black/50 to-transparent">
        <img src={donaLogoBanner} alt="Dona" className="h-8 object-contain" />
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

      {/* Mobile Apps Section */}
      <section className="py-32 bg-[#0A0A0A] border-t border-b border-white/5 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F21C4C] rounded-full blur-[200px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[180px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
                <Smartphone className="w-4 h-4 text-[#F21C4C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Applications natives</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Dona dans<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F21C4C] to-purple-500">votre poche.</span>
              </h2>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Téléchargez l'application Dona et emportez vos films et séries préférés partout avec vous. Mode hors-ligne, notifications et streaming en haute qualité.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: <WifiOff className="w-5 h-5" />, text: "Téléchargement hors-ligne illimité" },
                  { icon: <Cast className="w-5 h-5" />, text: "AirPlay & Chromecast intégré" },
                  { icon: <Sparkles className="w-5 h-5" />, text: "Qualité adaptative jusqu'en 4K" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-[#F21C4C]/10 border border-[#F21C4C]/20 flex items-center justify-center text-[#F21C4C]">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* App Store Buttons */}
              <div className="flex flex-wrap gap-4">
                <a href="#" className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wide text-white/60">Télécharger sur</div>
                    <div className="text-lg font-bold -mt-1">App Store</div>
                  </div>
                </a>

                <a href="#" className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wide text-white/60">Disponible sur</div>
                    <div className="text-lg font-bold -mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F21C4C]/40 to-purple-600/40 blur-[100px] scale-90" />

                {/* Phone Frame */}
                <div className="relative w-[300px] md:w-[340px] aspect-[9/19] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[45px] p-2 border border-gray-700 shadow-2xl shadow-black/80">
                  {/* Phone Inner Screen */}
                  <div className="w-full h-full bg-black rounded-[38px] overflow-hidden relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-30 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-800" />
                    </div>

                    {/* Full Screen Video Player */}
                    <div className="w-full h-full relative">
                      {/* Video Background - Action Movie Scene */}
                      <img
                        src={coverTLOU}
                        className="w-full h-full object-cover"
                        alt="Film en cours de lecture"
                      />

                      {/* Cinematic Letterbox Effect */}
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />

                      {/* Player Controls Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 pt-14">
                        {/* Top Bar */}
                        <div className="flex justify-between items-start">
                          <div className="bg-black/40 backdrop-blur-md rounded-full p-2">
                            <ArrowLeft className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex gap-2">
                            <div className="bg-black/40 backdrop-blur-md rounded-full p-2">
                              <Cast className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Center Play Button */}
                        <div className="flex-1 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-xl rounded-full p-4 border border-white/30">
                            <Pause className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="space-y-3">
                          {/* Title Info */}
                          <div>
                            <div className="text-[10px] text-[#F21C4C] font-bold uppercase tracking-wider mb-0.5">En lecture</div>
                            <div className="text-base font-bold text-white">The Last of Us</div>
                            <div className="text-[10px] text-white/60">S1 E3 • Long Long Time</div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-[45%] bg-[#F21C4C] rounded-full" />
                            </div>
                            <div className="flex justify-between text-[9px] text-white/50 font-medium">
                              <span>32:15</span>
                              <span>1:16:42</span>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-center gap-8 pb-2">
                            <Rewind className="w-5 h-5 text-white/70" />
                            <div className="bg-[#F21C4C] rounded-full p-3 shadow-lg shadow-[#F21C4C]/30">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                            <SkipForward className="w-5 h-5 text-white/70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -left-12 top-1/4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/60 uppercase tracking-wider">Téléchargé</div>
                      <div className="text-sm font-bold text-white">Dune: Part 2</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -right-8 bottom-1/3 bg-[#F21C4C] rounded-2xl px-5 py-3 shadow-2xl shadow-[#F21C4C]/40"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">4K HDR</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute -right-6 top-1/4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-bold text-white">Mode Avion</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#050505] relative overflow-hidden">
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
              <Button variant="outline" className="w-full" size="lg" onClick={login}>Créer un compte</Button>
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
              <Button variant="primary" size="xl" className="w-full shadow-xl shadow-[#F21C4C]/20" onClick={login}>Essayer 30 jours gratuitement</Button>
              <p className="text-center text-xs text-gray-500 mt-4">Puis 9.99€/mois. Résiliable à tout moment.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-black border-t border-white/5 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <img src={donaLogoBanner} alt="Dona" className="h-6 mb-6" />
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
              <li>
                <a
                  href="#/design-system"
                  className="hover:text-white transition-colors"
                >
                  Design System
                </a>
              </li>
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
        <div className="px-4 mb-12 cursor-pointer" onClick={() => navigateTo('browse')}>
           <img src={donaLogoBanner} alt="Dona" className="h-6 lg:h-8 object-contain" />
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
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[#050505]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {currentPage === 'browse' && <BrowsePage />}
            {currentPage === 'movies' && <MoviesPage />}
            {currentPage === 'series' && <SeriesPage />}
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
// Premium Movies Page
function MoviesPage() {
  const { navigateTo } = useRouterStore();
  const films = MOCK_CONTENT.filter(c => c.type === 'film');
  const featuredFilm = films[0];
  const newReleases = films.slice(0, 4);
  const actionFilms = films.filter(f => f.genres?.includes('Action') || f.genres?.includes('Science Fiction'));
  const dramaFilms = films.filter(f => f.genres?.includes('Drame'));

  // Mock directors collection
  const directors = [
    { name: 'Christopher Nolan', image: 'https://image.tmdb.org/t/p/w200/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg', films: 12 },
    { name: 'Denis Villeneuve', image: 'https://image.tmdb.org/t/p/w200/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg', films: 8 },
    { name: 'Martin Scorsese', image: 'https://image.tmdb.org/t/p/w200/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg', films: 15 },
    { name: 'Quentin Tarantino', image: 'https://image.tmdb.org/t/p/w200/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg', films: 9 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={featuredFilm?.backdrop || coverCyberpunk} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#F21C4C] text-white text-xs font-bold rounded-full uppercase">Exclusivité</span>
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full">4K HDR</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-4">{featuredFilm?.title || 'Film à la Une'}</h1>
            <p className="text-lg text-gray-300 mb-6 line-clamp-2">{featuredFilm?.synopsis}</p>
            <div className="flex items-center gap-4">
              <Button variant="primary" size="lg" leftIcon={<Play className="w-5 h-5" />} onClick={() => navigateTo('detail', featuredFilm?.id)}>
                Regarder
              </Button>
              <Button variant="glass" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                Ma liste
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-16 space-y-16 -mt-20 relative z-10">
        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a0a0f] to-[#0a0505] border border-white/5 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F21C4C] rounded-full blur-[120px] opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[#F21C4C] text-sm font-bold uppercase tracking-wider">Offre Cinéma</span>
              <h3 className="text-2xl font-bold mt-2">2 films loués = 1 film offert</h3>
              <p className="text-gray-400 mt-1">Valable sur notre sélection Premium jusqu'au 31 janvier</p>
            </div>
            <Button variant="primary" size="md">Voir la sélection</Button>
          </div>
        </div>

        {/* New Releases - Large Cards */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Nouveautés</h2>
              <p className="text-gray-500 mt-1">Les derniers films ajoutés cette semaine</p>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((film, i) => (
              <div key={film.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigateTo('detail', film.id)}>
                <img src={film.poster} alt={film.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-xl font-bold">{film.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{film.year} • {film.duration}</p>
                </div>
                {i === 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#F21C4C] text-white text-xs font-bold rounded-full">
                    Nouveau
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Directors Collection */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Collections Réalisateurs</h2>
              <p className="text-gray-500 mt-1">Explorez par vos cinéastes préférés</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {directors.map(director => (
              <div key={director.name} className="group p-6 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#F21C4C]/50 transition-all cursor-pointer hover:bg-[#1a1a1a]">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] mx-auto mb-4 overflow-hidden border-2 border-white/10 group-hover:border-[#F21C4C]/50 transition-colors">
                  <img src={director.image} alt={director.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-center">{director.name}</h3>
                <p className="text-gray-500 text-sm text-center mt-1">{director.films} films</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action & Sci-Fi */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#F21C4C]" />
              Action & Science Fiction
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
            {(actionFilms.length > 0 ? actionFilms : films).map(film => (
              <div key={film.id} className="w-[200px] flex-shrink-0">
                <MediaCard item={film} onClick={() => navigateTo('detail', film.id)} />
              </div>
            ))}
          </div>
        </section>

        {/* Drama */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Film className="w-6 h-6 text-[#F21C4C]" />
              Drames Acclamés
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
            {(dramaFilms.length > 0 ? dramaFilms : films).map(film => (
              <div key={film.id} className="w-[200px] flex-shrink-0">
                <MediaCard item={film} onClick={() => navigateTo('detail', film.id)} />
              </div>
            ))}
          </div>
        </section>

        {/* All Films Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Tous les Films</h2>
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtrer</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {films.map(film => (
              <MediaCard key={film.id} item={film} onClick={() => navigateTo('detail', film.id)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Premium Series Page
function SeriesPage() {
  const { navigateTo } = useRouterStore();
  const series = MOCK_CONTENT.filter(c => c.type === 'series');
  const featuredSeries = series[0];
  const trendingSeries = series.slice(0, 5);

  // Mock collections
  const collections = [
    { name: 'Thrillers Addictifs', count: 24, color: '#F21C4C', image: coverTLOU },
    { name: 'Comédies Feel-Good', count: 18, color: '#4CAF50', image: coverSuccession },
    { name: 'Drames Familiaux', count: 15, color: '#2196F3', image: coverCyberpunk },
    { name: 'Documentaires', count: 32, color: '#FF9800', image: coverTLOU },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Hero Section with Featured Series */}
      <div className="relative h-[75vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={featuredSeries?.backdrop || coverSuccession} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#F21C4C] text-white text-xs font-bold rounded-full uppercase">Série Originale</span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white text-sm font-bold">{featuredSeries?.rating || 9.2}</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-4">{featuredSeries?.title || 'Série à la Une'}</h1>
            <p className="text-lg text-gray-300 mb-2">Saison 4 • 10 épisodes</p>
            <p className="text-gray-400 mb-6 line-clamp-2">{featuredSeries?.synopsis}</p>
            <div className="flex items-center gap-4">
              <Button variant="primary" size="lg" leftIcon={<Play className="w-5 h-5" />} onClick={() => navigateTo('detail', featuredSeries?.id)}>
                Reprendre S4E3
              </Button>
              <Button variant="glass" size="lg" leftIcon={<Info className="w-5 h-5" />}>
                Plus d'infos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-16 space-y-16 -mt-16 relative z-10">
        {/* Continue Watching - Series specific */}
        <section className="bg-[#121212] rounded-3xl p-8 border border-white/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Play className="w-5 h-5 text-[#F21C4C]" />
            Continuer à regarder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {series.slice(0, 3).map((s, i) => (
              <div key={s.id} className="flex gap-4 group cursor-pointer" onClick={() => navigateTo('detail', s.id)}>
                <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={s.poster} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[#F21C4C]" style={{ width: `${30 + i * 25}%` }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate group-hover:text-[#F21C4C] transition-colors">{s.title}</h3>
                  <p className="text-sm text-gray-500">S{i + 1}E{i + 3} • Il reste 35 min</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promotional Offer */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-[#F21C4C]/30" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 lg:p-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Binge-Watch Weekend</span>
              </div>
              <h3 className="text-3xl font-bold mb-3">Toutes les saisons disponibles</h3>
              <p className="text-gray-400 mb-6">Profitez de nos séries complètes pendant tout le week-end. Pas de pub, pas d'interruption.</p>
              <Button variant="primary" size="md">Découvrir les séries</Button>
            </div>
            <div className="flex -space-x-4">
              {series.slice(0, 4).map((s, i) => (
                <div key={s.id} className="w-24 h-36 rounded-xl overflow-hidden border-2 border-[#050505] shadow-xl" style={{ transform: `rotate(${(i - 1.5) * 5}deg)` }}>
                  <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collections */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Collections</h2>
              <p className="text-gray-500 mt-1">Des sélections thématiques pour tous les goûts</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map(collection => (
              <div key={collection.name} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
                <img src={collection.image} alt={collection.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${collection.color}40, transparent)` }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold">{collection.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{collection.count} séries</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#F21C4C]" />
              Tendances cette semaine
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Tout voir</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {trendingSeries.map((s, i) => (
              <div key={s.id} className="relative group cursor-pointer" onClick={() => navigateTo('detail', s.id)}>
                <div className="absolute -left-4 -top-4 text-8xl font-black text-white/5 z-0 select-none">{i + 1}</div>
                <div className="relative z-10">
                  <MediaCard item={s} onClick={() => {}} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Series Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Toutes les Séries</h2>
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtrer</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {series.map(s => (
              <MediaCard key={s.id} item={s} onClick={() => navigateTo('detail', s.id)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

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
  const { isAuthenticated, isLoading } = useUserStore();
  const [showDesignSystem, setShowDesignSystem] = useState(false);

  // Check URL hash for design-system route
  useEffect(() => {
    const checkHash = () => {
      setShowDesignSystem(window.location.hash === '#/design-system');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Show Design System page if URL hash matches
  if (showDesignSystem) {
    return <DesignSystem />;
  }

  return (
    <div className="text-white bg-[#050505]">
      <AnimatePresence mode="wait">
        {isLoading && <Splashscreen key="splash" />}
      </AnimatePresence>
      {!isLoading && (isAuthenticated ? <AppLayout /> : <LandingPage />)}
    </div>
  );
}