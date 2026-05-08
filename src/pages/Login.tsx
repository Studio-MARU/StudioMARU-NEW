import { motion } from "motion/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("test@studiomaru.at");
  const [password, setPassword] = useState("passwort123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Test credentials
    if (email === "test@studiomaru.at" && password === "passwort123") {
      navigate("/dashboard");
    } else {
      setError("Ungültige Zugangsdaten. Bitte verwenden Sie den Testzugang.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-24 font-sans selection:bg-blue-100 bg-[#EBEBEB]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-glass p-8 md:p-10 rounded-[2rem] shadow-xl border border-white/50 bg-white/40 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-28 h-20 mx-auto mb-6 overflow-hidden rounded-[2.5rem] border-2 border-black flex items-center justify-center bg-[#F4F5FB] shadow-sm">
              <img src="/frog-bird.png" alt="Studio Maru Logo" className="w-full h-full object-cover object-center scale-[1.15] mix-blend-multiply flex-shrink-0" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Kundenportal</h1>
            <p className="text-gray-500 text-sm">Bitte logge dich ein, um fortzufahren.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-Mail Adresse</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-14 pr-8 py-5 border-2 border-black rounded-full focus:ring-black focus:border-black bg-transparent transition-all text-sm font-medium"
                  placeholder="name@beispiel.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Passwort</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-8 py-5 border-2 border-black rounded-full focus:ring-black focus:border-black bg-transparent transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium bg-red-50/50 p-3 rounded-xl border border-red-100">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-[#EBEBEB] hover:bg-gray-900 px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] transition-colors"
            >
              Anmelden
            </button>
          </form>

          <div className="mt-8 p-6 bg-white/40 rounded-[2rem] border border-white/50 backdrop-blur-sm text-center">
            <p className="text-sm text-gray-700 font-medium mb-4 leading-relaxed">
              Unser Kundenportal steht nur unseren Kunden zur Verfügung: Willst du einer werden? Dann schreib uns gerne :)
            </p>
            <a 
              href="mailto:info@studiomaru.at"
              className="w-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] px-8 py-5 rounded-full flex items-center justify-center font-bold uppercase text-sm tracking-[0.15em] transition-colors"
            >
              E-Mail Anfrage
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
