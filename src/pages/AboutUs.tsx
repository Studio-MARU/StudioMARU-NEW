import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#EBEBEB] selection:bg-black selection:text-white p-6 md:p-12 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-[#1a1a1a]">
            WER WIR SIND
          </h1>
          
          <div className="prose prose-lg text-black max-w-none">
            <p className="text-2xl font-medium leading-snug">
              Studio Maru ist ein kreatives Designstudio aus Innsbruck. Wir gestalten digitale Erlebnisse, visuelle Identitäten und kreative Konzepte, die im Gedächtnis bleiben.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Unsere Vision</h2>
                <p className="text-gray-700">
                  Wir glauben an Design, das nicht nur gut aussieht, sondern auch funktioniert. Jedes Projekt ist eine neue Möglichkeit, Marken eine einzigartige Stimme zu geben und ihre Geschichte visuell zu erzählen.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Unser Ansatz</h2>
                <p className="text-gray-700">
                  vom ersten Buchstaben bis zum letzten Punkt.
                </p>
              </div>
            </div>
            
            <div className="mt-16 bg-black text-white p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-6">Lass uns zusammenarbeiten</h2>
              <p className="text-gray-300 mb-8 max-w-xl">
                Bereit für das nächste Projekt? Wir freuen uns darauf, von dir zu hören und gemeinsam etwas Beeindruckendes zu erschaffen.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-gray-200 transition-colors">
                  Kostenloses Erstgespräch
                </a>
                <a href="https://wa.me/436642766355" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors">
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-24 mb-8 flex justify-center">
               <Link to="/impressum" className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-gray-500 transition-colors underline underline-offset-4">
                 Impressum
               </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
