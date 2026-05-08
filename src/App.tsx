import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Impressum from "./pages/Impressum";
import GlobalNav from "./components/GlobalNav";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("site_access") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "6020") {
      setIsAuthenticated(true);
      localStorage.setItem("site_access", "true");
    } else {
      setError("Falscher Code. Bitte erneut versuchen.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EBEBEB] text-black flex items-center justify-center p-6 relative overflow-hidden selection:bg-black selection:text-white">
        <div className="absolute left-0 top-1/2 -translate-y-[53%] w-72 md:w-[40rem] pointer-events-none z-0 -translate-x-8 opacity-40">
          <img src="/bird-wing.png" alt="Bird Wing" className="w-full h-auto object-contain object-left mix-blend-multiply" />
        </div>
        <div className="absolute right-0 bottom-0 w-80 md:w-[45rem] pointer-events-none z-0 opacity-40">
          <img src="/frog-bird.png" alt="Frog and Bird" className="w-full h-auto object-contain mix-blend-multiply object-right-bottom" />
        </div>
        
        <div className="relative z-10 section-glass p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/50 bg-white/60 max-w-2xl w-full text-center">
            
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
             Wir arbeiten im Hintergrund an etwas Besonderem.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Bald sind wir hier für dich da.
          </p>
          
          <form onSubmit={handleLogin} className="max-w-xs mx-auto flex flex-col gap-4">
             <div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Zugangscode"
                  className="w-full px-5 py-4 rounded-full border-2 border-black bg-white/50 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-center tracking-widest text-xl font-mono"
                  autoFocus
                />
             </div>
             {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
             <button type="submit" className="w-full bg-black text-[#EBEBEB] font-bold uppercase tracking-[0.15em] text-sm py-4 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform">
               Eintreten
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <GlobalNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </BrowserRouter>
  );
}

