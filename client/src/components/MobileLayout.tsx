import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Sparkles, BookHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/missions", label: "Missioni", icon: Sparkles },
    { href: "/diary", label: "Ricordi", icon: BookHeart },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-background relative overflow-hidden shadow-2xl sm:rounded-3xl sm:h-[90dvh] sm:my-auto sm:border-8 sm:border-primary/20">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[20%] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[30%] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar relative z-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-2 flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href} className="relative z-10 p-3 rounded-2xl flex-1 flex flex-col items-center justify-center gap-1 group">
                {isActive && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon 
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary/70"}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
