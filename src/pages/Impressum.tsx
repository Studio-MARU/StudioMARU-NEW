import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-[#EBEBEB] selection:bg-black selection:text-white p-6 md:p-12 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Link to="/about" className="inline-flex items-center gap-2 mb-8 text-black hover:text-gray-600 transition-colors uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Zurück
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 section-glass p-8 md:p-12 rounded-[2rem] border border-white/50"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none text-[#1a1a1a]">
            IMPRESSUM
          </h1>
          
          <div className="prose prose-lg text-black max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Studio Maru OG</h2>
              <p className="text-gray-700">
                Dr. Stumpf-Straße 121<br />
                6020 Innsbruck<br />
                Österreich
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-white/40 rounded-2xl border border-white/50">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Rechtsform</p>
                <p className="font-medium">Offene Gesellschaft</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Geschäftszweig</p>
                <p className="font-medium">Marketing</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Firmenbuchnummer</p>
                <p className="font-medium">675244g</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Sitz</p>
                <p className="font-medium">Innsbruck</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Eintragungsdatum</p>
                <p className="font-medium">17.03.2026</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mt-12 pt-8 border-t border-black/10">
              <p>Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der EU zu richten: http://ec.europa.eu/odr.<br/>
              Sie können allfällige Beschwerde auch an die oben angegebene E-Mail-Adresse richten.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
