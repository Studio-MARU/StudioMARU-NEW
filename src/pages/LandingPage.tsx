import { motion } from "motion/react";
import { Instagram, Search, User, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SearchModal from "../components/SearchModal";

export default function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#EBEBEB] flex items-center justify-center overflow-hidden selection:bg-black selection:text-white">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Illustrations */}
      <div className="absolute left-0 top-1/2 -translate-y-[53%] w-72 md:w-[40rem] pointer-events-none z-0 -translate-x-8">
        <img src="/bird-wing.png" alt="Bird Wing" className="w-full h-auto object-contain object-left mix-blend-multiply" />
      </div>
      <div className="absolute right-0 bottom-0 w-80 md:w-[45rem] pointer-events-none z-0">
        <img src="/frog-bird.png" alt="Frog and Bird" className="w-full h-auto object-contain mix-blend-multiply object-right-bottom" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-start justify-between gap-16">
        
        {/* Left Column */}
        <div className="flex flex-col gap-16 max-w-3xl pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center flex-wrap gap-6">
              <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-none text-[#1a1a1a] whitespace-nowrap">
                STUDIO MARU
              </h1>
              
              {/* Functional Buttons next to Title */}
              <div className="flex items-center gap-4 bg-[#EBEBEB] border-2 border-black px-5 py-3 rounded-full">
                <div className="relative group flex items-center justify-center">
                  <a href="https://instagram.com/studiomaru.at" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-[#EBEBEB] transition-colors text-black">
                    <Instagram size={22} strokeWidth={2} />
                  </a>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Instagram
                  </div>
                </div>
                <div className="relative group flex items-center justify-center">
                  <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-[#EBEBEB] transition-colors text-black">
                    <Search size={22} strokeWidth={2} />
                  </button>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Suche
                  </div>
                </div>
                <div className="relative group flex items-center justify-center">
                  <Link to="/login" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-[#EBEBEB] transition-colors text-black">
                    <User size={22} strokeWidth={2} />
                  </Link>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Kundenportal
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-black mx-1" />
                <div className="relative group flex items-center justify-center">
                  <Link to="/about" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-[#EBEBEB] transition-colors text-black">
                    <Info size={22} strokeWidth={2} />
                  </Link>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Über uns
                  </div>
                </div>
              </div>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-3xl text-black leading-snug max-w-2xl font-medium"
            >
              Wir schreiben Briefe, die gelesen werden. <br />
              <span className="text-lg md:text-2xl text-black/70 mt-2 block">
                &gt; Echte Tinte, echtes Papier, maximale Aufmerksamkeit für deine Botschaft.
              </span>
            </motion.p>
          </motion.div>
        </div>

        {/* Right Column - Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 w-full md:w-auto z-10 pt-10"
        >
          <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-black px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] text-black hover:bg-black hover:text-[#EBEBEB] transition-colors w-full md:w-[24rem]">
            Kostenloses Erstgespräch
          </a>
          <Link to="/portfolio" className="bg-transparent border-2 border-black px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] text-black hover:bg-black hover:text-[#EBEBEB] transition-colors w-full md:w-[24rem]">
            Unsere Arbeiten
          </Link>
          <Link to="/login" className="bg-transparent border-2 border-black px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] text-black hover:bg-black hover:text-[#EBEBEB] transition-colors w-full md:w-[24rem]">
            Kundenportal
          </Link>
          <a href="mailto:info@studiomaru.at" className="bg-transparent border-2 border-black px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] text-black hover:bg-black hover:text-[#EBEBEB] transition-colors w-full md:w-[24rem]">
            E-Mail senden
          </a>
          <a href="https://wa.me/436642766355" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-black px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] text-black hover:bg-black hover:text-[#EBEBEB] transition-colors w-full md:w-[24rem]">
            WhatsApp Anfrage
          </a>
        </motion.div>
      </div>
    </div>
  );
}
