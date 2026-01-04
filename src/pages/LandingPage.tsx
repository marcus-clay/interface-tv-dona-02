import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, CaretRight, Check, Monitor, SpeakerHifi, EnvelopeSimple } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useViewport';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Landing() {
  const { login } = useAuthStore();
  const scrollY = useScrollPosition();
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <div className="bg-black-pure text-text-primary min-h-screen font-sans selection:bg-accent-primary selection:text-white overflow-x-hidden">
      
      {/* Sticky Header */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 flex items-center justify-between",
        scrollY > 50 ? "bg-black-elevated/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      )}>
        <div className="text-2xl font-bold tracking-tighter text-white">DONA</div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={login}>Sign In</Button>
          <Button variant="secondary" size="sm" onClick={login}>Start Free Trial</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/50 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60" 
            alt="Cinema Background"
          />
        </motion.div>

        <div className="relative z-20 text-center max-w-4xl px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-display-mobile md:text-display-desktop font-light tracking-wide mb-6 text-white"
          >
            CINEMA. <span className="font-medium text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">REDEFINED.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-text-secondary mb-10 font-light"
          >
            Unlimited movies, series, and exclusives in stunning 4K HDR.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" onClick={login} leftIcon={<Play weight="fill" />}>
              Start Your Journey
            </Button>
            <Button variant="glass" size="xl">
              Learn More
            </Button>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted"
        >
          <CaretRight className="rotate-90 w-6 h-6" />
        </motion.div>
      </section>

      {/* Value Props Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Monitor className="w-8 h-8" />, title: "Curated Excellence", desc: "Hand-picked selection of the world's finest cinema." },
            { icon: <SpeakerHifi className="w-8 h-8" />, title: "Immersive Audio", desc: "Dolby Atmos support for a theater experience at home." },
            { icon: <Check className="w-8 h-8" />, title: "Cancel Anytime", desc: "No commitments. Total freedom. Pure entertainment." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="p-8 border border-white/5 bg-surface-card/30 rounded-sm hover:bg-surface-card/50 hover:border-white/10 transition-all group"
            >
              <div className="text-accent-gold mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">{item.icon}</div>
              <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-primary/5 blur-[120px] rounded-full transform -translate-y-1/2" />
        <div className="max-w-xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-light mb-8">Ready to watch?</h2>
          <div className="flex flex-col gap-4">
            <Input 
              type="email" 
              placeholder="Email address" 
              icon={<EnvelopeSimple className="w-5 h-5" />} 
            />
            <Button size="lg" onClick={login}>Get Started</Button>
            <p className="text-xs text-text-muted mt-2">30-day free trial. Cancel anytime.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 text-center text-text-muted text-sm">
        <p>© 2024 Dona Streaming. Crafted with precision.</p>
      </footer>
    </div>
  );
}