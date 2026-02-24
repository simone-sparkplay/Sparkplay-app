import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Trophy, Plus, Circle } from "lucide-react";
import confetti from "canvas-confetti";
import { useMissions, useCreateMission, useUpdateMission } from "@/hooks/use-missions";
export default function Missions() {
  const { data: missions, isLoading } = useMissions();
  const createMission = useCreateMission();
  const updateMission = useUpdateMission();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleToggle = (id: number, currentStatus: boolean, e: React.MouseEvent) => {
    // Only fire confetti when completing, not when un-completing
    if (!currentStatus) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#8b5cf6', '#fb923c', '#f472b6', '#fef08a']
      });
    }
    
    updateMission.mutate({ id, completed: !currentStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    createMission.mutate({ title: newTaskTitle, completed: false }, {
      onSuccess: () => {
        setNewTaskTitle("");
        setIsAdding(false);
      }
    });
  };

  const todayMissions = missions || [];
  const completedCount = todayMissions.filter(m => m.completed).length;

  return (
    <div className="px-6 pt-12 pb-8 min-h-full flex flex-col">
      <header className="mb-8">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <Flame className="w-8 h-8 fill-secondary/20" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">Missioni</h1>
            <p className="text-muted-foreground font-medium text-sm">Completa le tue sfide quotidiane</p>
          </div>
        </motion.div>
      </header>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-sm text-foreground uppercase tracking-wide">Progresso</span>
          <div className="flex items-center gap-1 font-display font-bold text-secondary">
            <Trophy className="w-4 h-4" />
            <span>{completedCount}/{Math.max(3, todayMissions.length)}</span>
          </div>
        </div>
        <div className="h-4 bg-white rounded-full overflow-hidden border border-border shadow-inner p-0.5">
          <motion.div 
            className="h-full bg-gradient-to-r from-secondary to-[#f43f5e] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, (completedCount / Math.max(3, todayMissions.length)) * 100))}%` }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          />
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/50 animate-pulse rounded-2xl border border-border/50" />
            ))}
          </div>
        ) : todayMissions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/50 rounded-3xl border border-dashed border-border">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Nessuna Missione!</h3>
            <p className="text-muted-foreground mb-6">Aggiungi la tua prima missione di oggi per iniziare.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-pushable mx-auto flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Creane una
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {todayMissions.map((mission, idx) => (
              <motion.div
                key={mission.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative overflow-hidden bg-white rounded-2xl p-4 border-2 transition-all duration-300 ${
                  mission.completed 
                    ? "border-green-400 bg-green-50/50 shadow-sm" 
                    : "border-border shadow-card-playful hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <button
                    onClick={(e) => handleToggle(mission.id, mission.completed, e)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      mission.completed
                        ? "bg-green-400 border-green-400 text-white scale-110"
                        : "border-muted-foreground/30 text-transparent hover:border-primary hover:text-primary/20"
                    }`}
                  >
                    {mission.completed ? <Check className="w-5 h-5" strokeWidth={3} /> : <Circle className="w-5 h-5 fill-current" />}
                  </button>
                  <span className={`font-medium text-lg transition-all duration-300 ${
                    mission.completed ? "text-green-800 line-through opacity-70" : "text-foreground"
                  }`}>
                    {mission.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Add Mission Form/Button */}
        <div className="pt-4 pb-8">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreate}
                className="bg-white p-4 rounded-2xl border-2 border-primary shadow-lg overflow-hidden"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Cosa devi fare?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-lg font-medium bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/50 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                  >
                    Annulla
                  </button>
                  <button 
                    type="submit"
                    disabled={!newTaskTitle.trim() || createMission.isPending}
                    className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-pushable disabled:opacity-50 disabled:shadow-none transition-all"
                  >
                    {createMission.isPending ? "..." : "Aggiungi"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-5 h-5" /> Aggiungi Missione
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
