import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";
import { useMissions } from "@/hooks/use-missions";

export default function Home() {
  const { data: missions, isLoading } = useMissions();
  
  // Calculate stats safely
  const todayMissions = missions || [];
  const completedCount = todayMissions.filter(m => m.completed).length;
  const totalCount = Math.max(3, todayMissions.length); // Assuming min 3 daily as per design
  const progress = Math.min(100, Math.round((completedCount / totalCount) * 100)) || 0;

  return (
    <div className="px-6 pt-12 pb-8 min-h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white px-6 py-2 rounded-full shadow-sm border border-primary/10 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-xl text-primary tracking-wider">SPARKPLAY</h1>
        </motion.div>
      </header>

      {/* Hero Image Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative w-full aspect-square max-h-[300px] mx-auto mb-8 rounded-[2.5rem] overflow-hidden shadow-card-playful bg-white flex items-center justify-center p-4 border-4 border-white"
      >
        {/* Dynamic Image from Prompt */}
        <img 
          src="https://sparkplay-sand.vercel.app/home-hero.png" 
          alt="Sparkplay Hero Characters" 
          className="w-full h-full object-contain object-center z-10"
        />
        
        {/* Decorative elements behind image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10 z-0" />
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 text-yellow-300/30 w-40 h-40 z-0"
        >
          <Star className="w-full h-full fill-current" />
        </motion.div>
      </motion.div>

      {/* Main Action Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 mt-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-5xl md:text-6xl text-foreground mb-2 drop-shadow-sm">
            PRONTI?
          </h2>
          <p className="text-muted-foreground font-medium">La tua avventura ti aspetta!</p>
        </motion.div>

        <Link href="/missions" className="w-full max-w-xs block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-primary to-[#8b5cf6] text-white py-5 px-8 rounded-3xl font-display font-bold text-2xl shadow-pushable flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Zap className="w-7 h-7 fill-white/50" />
            INIZIA MISSIONE
          </motion.div>
        </Link>

        {/* Stats Row */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex w-full gap-4 mt-4"
        >
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-green-100/50 -z-10 transition-all duration-1000"
              style={{ height: `${progress}%` }}
            />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">OGGI</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-3xl text-foreground">{isLoading ? "-" : completedCount}</span>
              <span className="text-muted-foreground font-medium">/{totalCount}</span>
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">ETÀ</span>
            <div className="font-display font-bold text-3xl text-foreground">--</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
