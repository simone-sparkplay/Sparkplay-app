import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookHeart, Plus, Quote, Send } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useDiaryEntries, useCreateDiaryEntry } from "@/hooks/use-diary";

export default function Diary() {
  const { data: entries, isLoading } = useDiaryEntries();
  const createEntry = useCreateDiaryEntry();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    
    createEntry.mutate({ content: newContent }, {
      onSuccess: () => {
        setNewContent("");
        setIsAdding(false);
      }
    });
  };

  return (
    <div className="px-6 pt-12 pb-8 min-h-full flex flex-col relative">
      <header className="mb-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-3 bg-accent/10 rounded-2xl text-accent">
            <BookHeart className="w-8 h-8 fill-accent/20" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">I Tuoi Ricordi</h1>
            <p className="text-muted-foreground font-medium text-sm">Il tuo diario personale</p>
          </div>
        </motion.div>
      </header>

      {/* Diary Entries List */}
      <div className="space-y-6 flex-1 relative z-10 pb-20">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-white/50 animate-pulse rounded-[2rem] border border-border/50" />
            ))}
          </div>
        ) : entries?.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50">
              <Quote className="w-8 h-8 text-accent/50" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2 text-foreground">Diario Vuoto</h3>
            <p className="text-muted-foreground text-lg mb-8">Nessun ricordo registrato ancora. Scrivi qualcosa di bello accaduto oggi!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {entries?.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  className="bg-white p-6 rounded-[2rem] shadow-card-playful relative group border-2 border-transparent hover:border-accent/10 transition-colors"
                >
                  <div className="absolute top-6 right-6 opacity-10">
                    <Quote className="w-12 h-12 text-accent" />
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {format(new Date(entry.createdAt), "d MMMM yyyy", { locale: it })}
                    </span>
                  </div>
                  <p className="text-foreground/90 font-medium text-lg leading-relaxed relative z-10 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Add Button & Overlay Form */}
      <AnimatePresence>
        {isAdding ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-auto sm:w-full max-w-md mx-auto bg-white rounded-t-[2.5rem] p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t-4 border-accent"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
              <h3 className="font-display font-bold text-2xl mb-4 text-foreground">Nuovo Ricordo</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  autoFocus
                  placeholder="Caro diario, oggi è successo che..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full h-40 bg-accent/5 rounded-2xl p-4 text-lg font-medium resize-none border-2 border-transparent focus:border-accent/30 focus:bg-white transition-colors outline-none"
                />
                <button
                  type="submit"
                  disabled={!newContent.trim() || createEntry.isPending}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-xl shadow-pushable flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                  {createEntry.isPending ? "Salvataggio..." : "Salva Ricordo"}
                  {!createEntry.isPending && <Send className="w-5 h-5" />}
                </button>
              </form>
            </motion.div>
          </>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="fixed bottom-28 right-6 z-30 w-16 h-16 bg-accent text-white rounded-full shadow-pushable flex items-center justify-center"
          >
            <Plus className="w-8 h-8" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
