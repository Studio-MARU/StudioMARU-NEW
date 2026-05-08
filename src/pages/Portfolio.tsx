import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    { 
      id: "01", 
      title: "Almi's Berghotel", 
      category: "Postkarte",
      image: "/almis-front.png",
      images: ["/almis-front.png", "/almis-back.png"],
      description: "Eine persönliche Postkarte an Gäste nach einer Alpenüberquerung. Die handgeschriebene Nachricht lädt zu Kaffee & Kuchen ein und stärkt die Kundenbindung auf eine sehr persönliche Art."
    },
    { id: "02", title: "Brand Identity", category: "Design" },
    { id: "03", title: "Digital Platform", category: "Development" },
    { id: "04", title: "Creative Campaign", category: "Marketing" },
  ];

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-24 px-6 md:px-[10%] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-px bg-gray-300" />
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">Unsere Arbeiten</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-[4/3] rounded-[2rem] bg-white border border-gray-100 overflow-hidden relative mb-6 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100 opacity-50 group-hover:scale-105 transition-transform duration-700" />
                {project.image ? (
                  <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-200 font-bold text-8xl opacity-30 select-none">
                    {project.id}
                  </div>
                )}
                <div className="absolute bottom-8 left-8">
                  <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold border border-gray-200 shadow-sm text-gray-600">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center px-4">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#EBEBEB] w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">{selectedProject.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                {selectedProject.description && (
                  <p className="text-gray-700 text-lg mb-8 max-w-3xl">{selectedProject.description}</p>
                )}
                
                {selectedProject.images ? (
                  <div className="space-y-8">
                    {selectedProject.images.map((img: string, idx: number) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-4">
                        <img src={img} alt={`${selectedProject.title} - Bild ${idx + 1}`} className="w-full h-auto object-contain max-h-[60vh]" />
                      </div>
                    ))}
                  </div>
                ) : selectedProject.image ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-4">
                    <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-auto object-contain max-h-[60vh]" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-2xl">
                    Keine Bilder verfügbar
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
