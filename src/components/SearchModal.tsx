import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const options = [
    { title: "Unsere Arbeiten (Portfolio)", path: "/portfolio", keywords: ["portfolio", "arbeiten", "projekte", "works"] },
    { title: "Wer wir sind (Info)", path: "/about", keywords: ["info", "about", "wer wir sind", "über uns", "agentur"] },
    { title: "Kundenportal", path: "/login", keywords: ["kunden", "portal", "login", "dashboard"] }
  ];

  const filteredOptions = query ? options.filter(opt => 
    opt.title.toLowerCase().includes(query.toLowerCase()) || 
    opt.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredOptions.length > 0) {
      navigate(filteredOptions[0].path);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center bg-[#EBEBEB] border-2 border-black rounded-full px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Search className="w-6 h-6 text-black mr-4" />
              <input
                type="text"
                autoFocus
                placeholder="SUCHEN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-xl font-bold bg-transparent outline-none placeholder:text-black/30 text-black uppercase tracking-widest"
              />
              <button type="button" onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-black" />
              </button>
            </form>
            
            {query && filteredOptions.length > 0 && (
              <div className="mt-4 bg-[#EBEBEB] border-2 border-black rounded-3xl p-6 shadow-lg">
                <h3 className="text-sm font-bold text-black/50 uppercase tracking-wider mb-4">Ergebnisse</h3>
                <div className="space-y-2">
                  {filteredOptions.map((opt, idx) => (
                    <button key={idx} onClick={() => { navigate(opt.path); onClose(); }} className="w-full flex items-center justify-between p-4 hover:bg-black/5 rounded-xl transition-colors text-left border border-transparent hover:border-black/10">
                      <span className="font-bold text-black uppercase tracking-widest">{opt.title}</span>
                      <span className="text-sm text-black/50 font-medium">Seite</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {query && filteredOptions.length === 0 && (
              <div className="mt-4 bg-[#EBEBEB] border-2 border-black rounded-3xl p-6 shadow-lg text-center">
                <p className="font-bold text-black uppercase tracking-widest">Keine Ergebnisse gefunden</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
