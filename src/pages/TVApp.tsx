import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { House, MagnifyingGlass, FilmStrip, Television, User, Play, Info, SignOut } from '@phosphor-icons/react';
import { useContentStore, useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Film } from '@/types';
import { Button } from '@/components/ui/Button';
import VideoPlayer from '@/components/player/VideoPlayer';

// Card Component isolated for cleaner code
const TVCard = ({ item, isActive }: { item: Film, isActive: boolean }) => (
  <motion.div
    animate={{ 
      scale: isActive ? 1.15 : 1,
      zIndex: isActive ? 10 : 1,
      opacity: isActive ? 1 : 0.6 
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn(
      "relative aspect-[2/3] rounded-sm overflow-hidden transition-shadow duration-300",
      isActive ? "ring-[3px] ring-white shadow-glow" : "grayscale-[40%]"
    )}
  >
    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
    {isActive && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black-pure/90 via-transparent to-transparent p-4 flex flex-col justify-end"
      >
        <h3 className="text-lg font-bold leading-tight text-white">{item.title}</h3>
        <div className="flex gap-2 mt-1">
           <span className="text-[10px] font-bold bg-white/20 px-1 rounded text-white">4K</span>
           <span className="text-[10px] text-accent-gold">★ {item.rating}</span>
        </div>
      </motion.div>
    )}
  </motion.div>
);

const MenuItem = ({ icon: Icon, label, isActive }: any) => (
  <div className={cn(
    "flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300 mb-2 cursor-pointer",
    isActive ? "bg-white text-black font-bold translate-x-2" : "text-text-secondary hover:text-white"
  )}>
    <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6" />
    <span className={cn("text-lg whitespace-nowrap", isActive ? "opacity-100" : "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all")}>
      {label}
    </span>
  </div>
);

export default function TVApp() {
  const { films, featured } = useContentStore();
  const { logout } = useAuthStore();
  
  // State
  const [activeMenu, setActiveMenu] = useState('home');
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState(false);

  // Background Ambient Logic
  const activeFilm = focusedCard ? films.find(f => f.id === focusedCard) : featured;
  const ambientColor = activeFilm?.dominantColor || featured.dominantColor;
  const backdropImage = activeFilm?.backdrop || featured.backdrop;

  return (
    <div className="flex h-screen w-screen bg-black-pure text-white overflow-hidden font-sans select-none">
      
      {/* Immersive Video Player Overlay */}
      <AnimatePresence>
        {viewingPlayer && (
          <VideoPlayer 
            content={featured} 
            onClose={() => setViewingPlayer(false)} 
          />
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          key={backdropImage}
          src={backdropImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover blur-3xl scale-110"
          alt="Ambient Background"
        />
        <div 
          className="absolute inset-0 opacity-60 transition-colors duration-1000 ease-in-out mix-blend-multiply"
          style={{ background: `radial-gradient(circle at 80% 20%, ${ambientColor}, transparent 80%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black-pure via-black-pure/80 to-transparent" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-24 hover:w-72 transition-all duration-500 ease-out-expo h-full z-50 flex flex-col py-10 pl-6 group relative border-r border-white/5 bg-black-pure/20 backdrop-blur-xl">
        <div className="text-accent-primary font-bold text-3xl tracking-widest mb-12 pl-2">D</div>
        
        <nav className="flex-1 w-full">
          <MenuItem icon={House} label="Home" isActive={activeMenu === 'home'} />
          <MenuItem icon={MagnifyingGlass} label="Search" isActive={activeMenu === 'search'} />
          <MenuItem icon={FilmStrip} label="Movies" isActive={activeMenu === 'movies'} />
          <MenuItem icon={Television} label="Series" isActive={activeMenu === 'series'} />
          <MenuItem icon={User} label="Profile" isActive={activeMenu === 'profile'} />
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-4 px-4 text-text-muted hover:text-white text-sm transition-colors">
          <SignOut className="w-5 h-5" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar pb-20 z-10">
        
        {/* Featured Billboard */}
        <section className="relative h-[85vh] w-full flex items-end pb-24 px-16">
          <div className="absolute inset-0 z-[-1] overflow-hidden rounded-bl-[4rem]">
             <img src={featured.backdrop} className="w-full h-full object-cover" alt="Hero" />
             <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-transparent to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-black-pure via-black-pure/20 to-transparent" />
          </div>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               {/* Metadata Tags */}
               <div className="flex items-center gap-4 mb-6 text-white/90 font-medium tracking-wide">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/2560px-Netflix_logo.svg.png" className="h-6 opacity-0" alt="Studio" /> {/* Placeholder spacing */}
                 <span className="bg-white/10 px-2 py-0.5 rounded text-sm border border-white/20 backdrop-blur-sm">4K HDR</span>
                 <span>{featured.year}</span>
                 <span>{featured.duration}</span>
                 <span className="text-accent-gold">★ {featured.rating}</span>
               </div>

               {/* Title Display */}
               <h1 className="text-display-desktop font-bold mb-6 leading-[0.9] drop-shadow-2xl text-white">
                 {featured.title}
               </h1>
               
               <p className="text-xl text-text-secondary line-clamp-2 mb-10 max-w-xl drop-shadow-md">
                 {featured.synopsis}
               </p>

               <div className="flex gap-6">
                 <Button size="xl" onClick={() => setViewingPlayer(true)} leftIcon={<Play weight="fill" />}>
                   Play Now
                 </Button>
                 <Button variant="glass" size="xl" leftIcon={<Info weight="bold" />}>
                   More Info
                 </Button>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Rails */}
        <div className="space-y-16 pl-16 relative z-20 -mt-10">
          {[
            { title: "Trending Now", data: films },
            { title: "Critically Acclaimed", data: [...films].reverse() },
            { title: "Watch It Again", data: films.slice(2, 7) }
          ].map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-medium mb-6 text-white/90 flex items-center gap-2">
                {section.title} <span className="text-accent-primary text-sm opacity-0 group-hover:opacity-100">See All</span>
              </h2>
              <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10 pr-16 mask-linear-fade">
                {section.data.map((film) => (
                  <div 
                    key={film.id} 
                    className="w-[16vw] min-w-[200px] flex-shrink-0 cursor-pointer"
                    onMouseEnter={() => setFocusedCard(film.id)}
                    onMouseLeave={() => setFocusedCard(null)}
                    onClick={() => setViewingPlayer(true)}
                  >
                    <TVCard item={film} isActive={focusedCard === film.id} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}