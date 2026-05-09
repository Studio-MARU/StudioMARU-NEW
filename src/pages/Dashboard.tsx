import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, FileText, Download, MessageSquare, LayoutDashboard, PlusCircle, History, Menu, Maximize, Minimize, RefreshCw, Layers, Image as ImageIcon, Bell, Send, User, Moon, Sun } from "lucide-react";
import React, { useState } from "react";

const FORMATS = [
  { id: "A6", name: "A6 Postkarte (148x105mm)", ratio: 1.414, type: "postcard" },
  { id: "DIN_LANG", name: "DIN Lang (220x110mm)", ratio: 2, type: "postcard" },
  { id: "C5", name: "C5 Brief (229x162mm)", ratio: 1.414, type: "letter" },
  { id: "C4", name: "C4 Maxi-Brief (324x229mm)", ratio: 1.414, type: "letter" },
];

function FileDropzone({ onDrop, label, image }: { onDrop: (file: File) => void, label: string, image: string | null }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) onDrop(e.dataTransfer.files[0]);
      }}
      className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all h-32 ${isDragging ? 'border-black bg-black/5' : 'border-gray-300 bg-white/30 hover:bg-white/50'}`}
    >
      {image ? (
        <div className="relative w-full h-full">
          <img src={image} className="w-full h-full object-contain" alt="Preview" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <span className="text-white text-sm font-bold">Ändern</span>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>
          <p className="text-xs text-gray-500">Klicken oder Ziehen</p>
        </>
      )}
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
        if (e.target.files && e.target.files[0]) onDrop(e.target.files[0]);
      }} />
    </div>
  );
}

function NewProjectView() {
  const [formatId, setFormatId] = useState("A6");
  const [quantity, setQuantity] = useState(50);
  const [designType, setDesignType] = useState("template");
  const [text, setText] = useState("Liebe/r [Vorname],\n\nvielen Dank für das tolle Projekt!\n\nHerzliche Grüße,\nStudio Maru");
  const [firstName, setFirstName] = useState("Max");
  const [lastName, setLastName] = useState("Mustermann");
  
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // 3D & Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [isDragging3D, setIsDragging3D] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const selectedFormat = FORMATS.find(f => f.id === formatId) || FORMATS[0];
  const previewText = text.replace(/\[Vorname\]/g, firstName).replace(/\[Nachname\]/g, lastName);

  const handleImageDrop = (file: File, side: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (side === 'front') setFrontImage(e.target?.result as string);
      else setBackImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const insertPlaceholder = (placeholder: string) => {
    setText(prev => prev + placeholder);
  };

  // 3D Handlers
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging3D(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging3D) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    setRotY(prev => prev + deltaX * 0.5);
    setRotX(prev => prev - deltaY * 0.5);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging3D(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSideToggle = (side: 'front' | 'back') => {
    const currentTurns = Math.round(rotY / 360);
    setRotY(side === 'front' ? currentTurns * 360 : currentTurns * 360 + 180);
  };

  const normalizedRot = ((rotY % 360) + 360) % 360;
  const isFrontVisible = normalizedRot < 90 || normalizedRot > 270;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="md:text-left text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Neues Projekt starten</h1>
        <p className="text-gray-500 mb-12">Bestelle handgeschriebene Postkarten oder Briefe für deine Kunden.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Details zur Bestellung</h2>
          
          {/* Format & Menge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Format</label>
              <select value={formatId} onChange={e => setFormatId(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all">
                {FORMATS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Menge / Stück</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all" />
            </div>
          </div>

          {/* Design */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Design</label>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button 
                onClick={() => setDesignType('template')} 
                className={`flex-1 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors border-2 ${designType === 'template' ? 'bg-black text-[#EBEBEB] border-black' : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
              >
                Vorgefertigt
              </button>
              <button 
                onClick={() => setDesignType('upload')} 
                className={`flex-1 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors border-2 ${designType === 'upload' ? 'bg-black text-[#EBEBEB] border-black' : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
              >
                Individuell (Upload)
              </button>
            </div>
            
            {designType === 'upload' && (
              <div className="grid grid-cols-2 gap-4">
                <FileDropzone label="Vorderseite" image={frontImage} onDrop={(f) => handleImageDrop(f, 'front')} />
                <FileDropzone label="Rückseite (Optional)" image={backImage} onDrop={(f) => handleImageDrop(f, 'back')} />
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">Dein Text</label>
              <div className="flex gap-2">
                <button onClick={() => insertPlaceholder('[Vorname]')} className="text-[10px] uppercase tracking-widest font-bold bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] px-4 py-2 rounded-full transition-colors">+ Vorname</button>
                <button onClick={() => insertPlaceholder('[Nachname]')} className="text-[10px] uppercase tracking-widest font-bold bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] px-4 py-2 rounded-full transition-colors">+ Nachname</button>
              </div>
            </div>
            <textarea 
              rows={5} 
              value={text} 
              onChange={e => setText(e.target.value)} 
              className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all resize-none" 
              placeholder="Dein handgeschriebener Text..." 
            />
          </div>

          {/* Optionale Felder */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Test-Daten (für Vorschau)</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Vorname" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all text-sm" />
              <input type="text" placeholder="Nachname" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all text-sm" />
            </div>
          </div>

          <button className="w-full bg-black text-[#EBEBEB] hover:bg-gray-900 px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] transition-colors mt-4">
            Projekt anfragen
          </button>
        </div>

        {/* Preview */}
        <div className={isFullscreen ? "fixed inset-0 z-50 bg-gray-100/95 backdrop-blur-md p-4 md:p-12 flex flex-col" : "section-glass p-6 rounded-3xl shadow-sm border border-white/50 flex flex-col h-full"}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Live Vorschau {isFullscreen && "- Fullscreen"}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSideToggle('front')}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors border-2 ${isFrontVisible ? 'bg-black text-[#EBEBEB] border-black' : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
                >
                  Vorderseite
                </button>
                <button 
                  onClick={() => handleSideToggle('back')}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors border-2 ${!isFrontVisible ? 'bg-black text-[#EBEBEB] border-black' : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
                >
                  Rückseite
                </button>
              </div>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] transition-colors"
                title={isFullscreen ? "Minimieren" : "Vollbild"}
              >
                {isFullscreen ? <Minimize size={16} strokeWidth={2} /> : <Maximize size={16} strokeWidth={2} />}
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-gray-100/50 rounded-2xl p-4 overflow-hidden min-h-[400px]" style={{ perspective: '1200px' }}>
            <div 
              className="relative shadow-2xl cursor-grab active:cursor-grabbing"
              style={{
                aspectRatio: selectedFormat.ratio,
                width: selectedFormat.ratio >= 1 ? (isFullscreen ? '80%' : '100%') : 'auto',
                height: selectedFormat.ratio >= 1 ? 'auto' : (isFullscreen ? '80%' : '100%'),
                maxHeight: '100%',
                maxWidth: '100%',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transition: isDragging3D ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* FRONT FACE */}
              <div 
                className="absolute inset-0 w-full h-full bg-[#fdfbf7] overflow-hidden rounded-md"
                style={{ backfaceVisibility: 'hidden', containerType: 'inline-size' }}
              >
                {designType === 'upload' && frontImage ? (
                  <img src={frontImage} className="w-full h-full object-cover" alt="Front Design" />
                ) : designType === 'template' ? (
                  <div className="w-full h-full bg-blue-50/50 flex flex-col items-center justify-center border-4 border-blue-100/50">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-400">🎨</div>
                    <span className="text-blue-400 font-bold text-sm">Vorgefertigtes Design</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 font-bold">Vorderseite</span>
                  </div>
                )}
                {/* Briefe haben den Text oft auf der Vorderseite */}
                {selectedFormat.type === 'letter' && (
                  <div className="absolute inset-0 font-['Caveat'] text-blue-900 whitespace-pre-wrap overflow-hidden" style={{ padding: '6cqi', fontSize: '4cqi', lineHeight: '1.5' }}>
                    {previewText}
                  </div>
                )}
              </div>

              {/* BACK FACE */}
              <div 
                className="absolute inset-0 w-full h-full bg-[#fdfbf7] flex overflow-hidden rounded-md"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', containerType: 'inline-size' }}
              >
                {selectedFormat.type === 'postcard' ? (
                  <>
                    <div className="w-1/2 h-full font-['Caveat'] text-blue-900 whitespace-pre-wrap border-r-2 border-dashed border-gray-400 overflow-hidden" style={{ padding: '4cqi', fontSize: '4cqi', lineHeight: '1.5' }}>
                      {previewText}
                    </div>
                    <div className="w-1/2 h-full relative flex flex-col justify-end" style={{ padding: '4cqi' }}>
                      <div className="absolute border-2 border-gray-300 flex items-center justify-center" style={{ top: '4cqi', right: '4cqi', width: '12cqi', height: '16cqi' }}>
                        <span className="text-gray-400 text-center" style={{ fontSize: '2cqi' }}>Frankierung</span>
                      </div>
                      <div className="w-4/5 ml-auto flex flex-col justify-between" style={{ height: '20cqi', marginBottom: '4cqi' }}>
                        <div className="w-full h-px bg-gray-400"></div>
                        <div className="w-full h-px bg-gray-400"></div>
                        <div className="w-full h-px bg-gray-400"></div>
                        <div className="w-full h-px bg-gray-400"></div>
                      </div>
                    </div>
                  </>
                ) : selectedFormat.type === 'card' ? (
                  <div className="w-full h-full font-['Caveat'] text-blue-900 whitespace-pre-wrap overflow-hidden relative" style={{ padding: '6cqi', fontSize: '4cqi', lineHeight: '1.5' }}>
                    {previewText}
                    {designType === 'upload' && backImage && (
                      <img src={backImage} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply pointer-events-none" alt="Back Design" />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    Rückseite (leer)
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-400 flex items-center justify-center gap-2">
            <RefreshCw size={12} /> 360° drehbar (Ziehen zum Drehen) • Maßstab: {selectedFormat.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className={`relative min-h-screen flex selection:bg-blue-100 transition-colors duration-300 ${isDarkMode ? 'dark-mode-active bg-[#1a1a1a] text-[#EBEBEB]' : 'bg-[#EBEBEB] text-black'}`}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/20 blur-[120px]" />
      </div>

      <div className="fixed right-0 bottom-0 w-80 md:w-[45rem] z-0 pointer-events-none transition-opacity">
        <img src="/frog-bird.png" alt="Frog and Bird bg" className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen object-right-bottom opacity-100" />
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="w-64 section-glass border-r border-white/50 h-screen sticky top-0 hidden md:flex flex-col z-40">
        <div className={`p-6 border-b border-white/50 ${!isDarkMode ? 'bg-[#F3F3F4]' : ''}`}>
          <div className="flex flex-col items-center justify-center gap-4">
            <button onClick={() => setActiveTab('profile')} className="w-20 h-16 overflow-hidden rounded-[2rem] border-2 border-black flex items-center justify-center shrink-0 bg-[#F4F5FB] shadow-md hover:scale-105 transition-transform" title="Profil & Einstellungen">
              <img src="/logoicon.png" alt="Studio Maru Profil" className="w-full h-full object-cover object-center scale-[1.15] mix-blend-multiply flex-shrink-0" />
            </button>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Kundenportal</span>
          </div>
        </div>
        <nav className={`flex-1 p-4 space-y-4 ${!isDarkMode ? 'bg-[#F3F3F4]' : ''}`}>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'overview' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <LayoutDashboard size={18} /> Übersicht
          </button>
          <button 
            onClick={() => setActiveTab('new_project')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'new_project' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <PlusCircle size={18} /> Neues Projekt
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'templates' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <Layers size={18} /> Vorlagen
          </button>
          <button 
            onClick={() => setActiveTab('examples')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'examples' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <ImageIcon size={18} /> Beispiele
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'news' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <Bell size={18} /> Infos
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${activeTab === 'history' ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB]'}`}
          >
            <History size={18} /> Historie
          </button>
        </nav>
        <div className={`p-4 border-t border-white/50 ${!isDarkMode ? 'bg-[#F3F3F4]' : ''}`}>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent border-2 border-[#e78806] text-[#e78806] hover:bg-[#e78806] hover:text-[#EBEBEB]">
            <LogOut size={18} /> Abmelden
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 px-6 pt-6 pb-[18px] flex flex-col items-center justify-center gap-1 z-[40] bg-[#f3f3f4] border-b border-[#FFFFFF]">
        <button onClick={() => setActiveTab('profile')} className="w-20 h-16 overflow-hidden rounded-[2rem] border-2 border-black flex items-center justify-center shrink-0 bg-[#F4F5FB] shadow-sm hover:scale-105 transition-transform" title="Profil & Einstellungen">
          <img src="/logoicon.png" alt="Studio Maru Profil" className="w-full h-full object-cover object-center scale-[1.15] mix-blend-multiply flex-shrink-0" />
        </button>
        <span className="text-[28px] font-bold text-gray-900 tracking-tight">Kundenportal</span>
      </div>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden fixed right-6 top-6 py-2 px-[12px] mt-[13px] border-2 border-black rounded-full text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors z-[60] bg-white/80 backdrop-blur-md">
        <Menu size={20} className="hover:text-current" />
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="md:hidden fixed inset-0 bg-[#EBEBEB]/80 z-50 pointer-events-auto flex items-start justify-center pt-[100px] overflow-y-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="flex flex-col gap-4 w-[90vw] pb-12"
              onClick={e => e.stopPropagation()}
            >
              {[
                { id: 'overview', label: 'Übersicht', icon: LayoutDashboard },
                { id: 'new_project', label: 'Neues Projekt', icon: PlusCircle },
                { id: 'templates', label: 'Vorlagen', icon: Layers },
                { id: 'examples', label: 'Beispiele', icon: ImageIcon },
                { id: 'news', label: 'Infos', icon: Bell },
                { id: 'history', label: 'Historie', icon: History }
              ].map((item, i) => (
                <motion.button 
                  key={item.id}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9, transition: { delay: (5 - i) * 0.05 } }}
                  transition={{ delay: i * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 24 }}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-colors ${activeTab === item.id ? 'bg-black text-[#EBEBEB]' : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB]'}`}
                >
                  <item.icon size={18} /> {item.label}
                </motion.button>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9, transition: { delay: 0 } }}
                transition={{ delay: 6 * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 24 }}
              >
                <div className="h-px bg-black/20 my-2" />
                <button onClick={handleLogout} className="mt-[21px] w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-colors bg-transparent border-2 border-[#e78806] text-[#e78806] hover:bg-[#e78806] hover:text-[#EBEBEB] active:bg-[#e78806] active:text-[#EBEBEB]">
                  <LogOut size={18} /> Abmelden
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 p-6 pt-[190px] md:pt-12 md:p-12 overflow-y-auto relative z-10 ${!isDarkMode ? 'bg-[#EBEBEB]' : ''}`}>
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto lg:mx-0 lg:max-w-2xl"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil & Einstellungen</h1>
              <p className="text-gray-500 mb-12">Verwalten Sie Ihr Konto und das Erscheinungsbild des Portals.</p>
            </div>

            <div className="section-glass rounded-3xl p-6 md:p-8 border border-white/50 space-y-6">
              <div className="flex items-center gap-4 border-b border-black/10 pb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-2xl font-bold">
                  TM
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Test Musterkunde</h3>
                  <p className="text-gray-500">test@studiomaru.at</p>
                </div>
              </div>

              <div className="pt-2 border-b border-black/10 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Kontodetails</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">E-Mail Adresse</label>
                    <div className="flex gap-2">
                       <input type="email" value="test@studiomaru.at" disabled className="flex-1 bg-white/50 border border-black/20 rounded-xl px-4 py-3 text-gray-900 focus:outline-none" />
                       <button className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">ÄNDERN</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Passwort</label>
                    <div className="flex gap-2">
                       <input type="password" value="**************" disabled className="flex-1 bg-white/50 border border-black/20 rounded-xl px-4 py-3 text-gray-900 focus:outline-none" />
                       <button className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">ÄNDERN</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Erscheinungsbild</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Dunkles Design</h4>
                    <p className="text-sm text-gray-500">Aktivieren Sie das dunkle Portal-Design für reduzierte Blendung.</p>
                  </div>
                  
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative w-16 h-8 rounded-full transition-colors duration-300 border-2 border-black flex items-center px-1 ${isDarkMode ? 'bg-black' : 'bg-[#EBEBEB]'}`}
                  >
                    <motion.div
                      layout
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                      animate={{ x: isDarkMode ? 32 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {isDarkMode ? <Moon size={12} className="text-black" /> : <Sun size={12} className="text-white" />}
                    </motion.div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Willkommen zurück!</h1>
              <p className="text-gray-500 mb-12">Hier finden Sie alle aktuellen Dokumente und Projektfortschritte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Status Card */}
              <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 col-span-1 lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-8">Aktuelles Projekt: Rebranding 2026</h2>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-gray-700">Fortschritt</span>
                      <span className="font-bold text-black">65%</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-3 border border-white/50 overflow-hidden">
                      <div className="bg-black h-full rounded-full relative overflow-hidden" style={{ width: "65%" }}>
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100/80 border border-green-200 flex items-center justify-center text-green-600 shrink-0 shadow-sm">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Phase 1: Discovery & Strategie</p>
                        <p className="text-xs text-gray-500 mt-0.5">Abgeschlossen am 12. März</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Phase 2: Visual Identity Design</p>
                        <p className="text-xs text-gray-500 mt-0.5">In Bearbeitung (Feedback erwartet)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-50">
                      <div className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Phase 3: Rollout & Guidelines</p>
                        <p className="text-xs text-gray-500 mt-0.5">Geplant für April</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="section-glass p-6 rounded-3xl shadow-sm border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Dokumente</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] transition-colors group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em]">Angebot_v2.pdf</span>
                      </div>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] transition-colors group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em]">Moodboard.pdf</span>
                      </div>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h2 className="text-lg font-bold mb-2 relative z-10">Fragen zum Projekt?</h2>
                  <p className="text-sm text-gray-400 mb-6 relative z-10">Wir sind jederzeit für Sie erreichbar.</p>
                  <button
                    onClick={() => setActiveTab('messenger')}
                    className="w-full bg-[#EBEBEB] text-black flex items-center justify-center gap-2 px-8 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] hover:bg-white transition-colors relative z-10"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Nachricht senden
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messenger' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto h-[600px] flex flex-col"
          >
            <div className="md:text-left text-center shrink-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nachrichten</h1>
              <p className="text-gray-500 mb-6">Ihr direkter Draht zu Studio Maru.</p>
            </div>
            
            <div className="flex-1 section-glass rounded-3xl border border-white/50 flex flex-col overflow-hidden z-10 relative">
              <div className="p-4 border-b border-white/50 bg-white/50 backdrop-blur-md flex items-center gap-3">
                <div className="w-[3.75rem] h-[3rem] overflow-hidden rounded-[1rem] border-2 border-black flex items-center justify-center shrink-0 bg-[#F4F5FB] shadow-sm">
                    <img src="/logoicon.png" alt="Studio Maru" className="w-full h-full object-cover object-center scale-[1.15] mix-blend-multiply flex-shrink-0" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Studio Maru Support</h3>
                    <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-white/20">
                <div className="self-start max-w-[80%] bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                    <p className="text-sm">Hallo! Wie können wir Ihnen heute bei Ihrem Projekt helfen?</p>
                    <p className="text-[10px] text-gray-400 mt-2">10:00</p>
                </div>
              </div>
              <div className="p-4 bg-white/50 backdrop-blur-md border-t border-white/50">
                <div className="flex items-center gap-2 relative">
                    <input type="text" placeholder="Ihre Nachricht..." className="w-full border-2 border-black rounded-full pl-6 pr-12 py-3 bg-transparent text-sm focus:outline-none" />
                    <button className="absolute right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Send size={16} />
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'new_project' && (
          <div className="w-full h-full">
            <div className="md:hidden flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-4">
               <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-4">
                 <Maximize className="text-black w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900">Desktop benötigt<br />für die Erstellung</h2>
               <p className="text-gray-600 max-w-xs">
                 Ein neues Projekt kann detailliert nur über die Desktop-Version gestartet werden. Bitte loggen Sie sich an einem Computer ein.
               </p>
               <button onClick={() => setActiveTab('overview')} className="mt-6 border-2 border-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent text-black hover:bg-black hover:text-white">
                 Zurück zur Übersicht
               </button>
            </div>
            <div className="hidden md:block w-full h-full">
              <NewProjectView />
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vorlagen</h1>
              <p className="text-gray-500 mb-12">Nutzen Sie unsere vorgefertigten Designs für Ihre Postkarten und Briefe.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="section-glass p-4 rounded-3xl shadow-sm border border-white/50 group cursor-pointer hover:shadow-md transition-all">
                  <div className="bg-gray-100 rounded-2xl h-48 mb-4 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-blue-50/50 flex flex-col items-center justify-center border-4 border-blue-100/50 group-hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-400">🎨</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900">Design Vorlage {i}</h3>
                  <p className="text-sm text-gray-500">Für A6 Postkarte</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'examples' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Beispiele</h1>
              <p className="text-gray-500 mb-12">Lassen Sie sich von erfolgreichen Kampagnen unserer Kunden inspirieren.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="section-glass p-6 rounded-3xl shadow-sm border border-white/50">
                <div tabIndex={0} className="bg-gray-200 rounded-2xl h-64 mb-6 flex items-center justify-center overflow-hidden relative group outline-none">
                  <img src="/almis-front.png" alt="Almi's Berghotel Vorderseite" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0 transition-opacity duration-500" />
                  <img src="/almis-back.png" alt="Almi's Berghotel Rückseite" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0">
                    Tap / Hover
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Almi's Berghotel</h3>
                <p className="text-gray-600 text-sm">Eine persönliche Postkarte an Gäste nach einer Alpenüberquerung. Die handgeschriebene Nachricht lädt zu Kaffee & Kuchen ein und stärkt die Kundenbindung auf eine sehr persönliche Art.</p>
              </div>
              {[2, 3, 4].map((i) => (
                <div key={i} className="section-glass p-6 rounded-3xl shadow-sm border border-white/50">
                  <div className="bg-gray-200 rounded-2xl h-64 mb-6 flex items-center justify-center">
                    <span className="text-gray-400 font-bold">Beispielbild {i}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Erfolgreiche Kampagne {i}</h3>
                  <p className="text-gray-600 text-sm">Eine kurze Beschreibung, wie diese Postkarte oder dieser Brief eingesetzt wurde und welche Erfolge damit erzielt wurden.</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'news' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Infos & Neuheiten</h1>
              <p className="text-gray-500 mb-12">Bleiben Sie auf dem Laufenden über neue Formate, Preise und Updates.</p>
            </div>
            <div className="space-y-6">
              <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">Neu</span>
                  <span className="text-sm text-gray-500">12. April 2026</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Neue Formate nach Post.at Standard</h3>
                <p className="text-gray-700">
                  Wir haben unsere Formate aktualisiert, um perfekt mit den Vorgaben der Österreichischen Post (post.at) übereinzustimmen. Ab sofort stehen Ihnen C5 und C4 Maxi-Briefe sowie DIN Lang Postkarten mit exakten Trennstrichen und Adressfeldern zur Verfügung.
                </p>
              </div>
              <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Info</span>
                  <span className="text-sm text-gray-500">28. März 2026</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Erweiterte 360° Vorschau</h3>
                <p className="text-gray-700">
                  Unser Kundenportal bietet nun eine verbesserte 360-Grad-Vorschau. Sie können Ihre Designs jetzt in alle Richtungen drehen, um jedes Detail vor der Bestellung genau zu prüfen.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vergangene Projekte</h1>
              <p className="text-gray-500 mb-12">Eine Übersicht Ihrer bisherigen Aufträge und abgeschlossenen Projekte.</p>
            </div>
            
            <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 text-center">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Noch keine vergangenen Projekte</h3>
              <p className="text-gray-500">Sobald ein Projekt abgeschlossen ist, finden Sie es hier.</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
