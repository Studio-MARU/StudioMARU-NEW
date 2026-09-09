import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import BackgroundGlow from '@/components/ui/BackgroundGlow';
import LogoBadge from '@/components/ui/LogoBadge';
import PillButton from '@/components/ui/PillButton';
import { demoAccount } from '@/config/auth';
import { site } from '@/config/site';

const INPUT_CLASSES =
  'block w-full pl-14 pr-8 py-5 border-2 border-black rounded-full focus:ring-black focus:border-black bg-transparent transition-all text-sm font-medium';

export default function Login() {
  const [email, setEmail] = useState(demoAccount.email);
  const [password, setPassword] = useState(demoAccount.password);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Platzhalter-Prüfung, siehe src/config/auth.ts
    if (email === demoAccount.email && password === demoAccount.password) {
      navigate('/dashboard');
    } else {
      setError('Ungültige Zugangsdaten. Bitte verwenden Sie den Testzugang.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-24 font-sans selection:bg-blue-100 bg-[#EBEBEB]">
      <BackgroundGlow />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-glass p-8 md:p-10 rounded-[2rem] shadow-xl border border-white/50 bg-white/40 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <LogoBadge className="w-20 h-16 mx-auto mb-6 rounded-[2rem] shadow-sm" alt="Studio Maru Logo" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Kundenportal</h1>
            <p className="text-gray-500 text-sm">Bitte logge dich ein, um fortzufahren.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Field label="E-Mail Adresse" icon={<Mail className="h-5 w-5 text-gray-400" />}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASSES}
                placeholder="name@beispiel.com"
                required
              />
            </Field>

            <Field label="Passwort" icon={<Lock className="h-5 w-5 text-gray-400" />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLASSES}
                placeholder="••••••••"
                required
              />
            </Field>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium bg-red-50/50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <PillButton type="submit" variant="solid" className="w-full">
              Anmelden
            </PillButton>
          </form>

          <div className="mt-8 p-6 bg-white/40 rounded-[2rem] border border-white/50 backdrop-blur-sm text-center">
            <p className="text-sm text-gray-700 font-medium mb-4 leading-relaxed">
              Unser Kundenportal steht nur unseren Kunden zur Verfügung: Willst du einer werden? Dann
              schreib uns gerne :)
            </p>
            <PillButton href={`mailto:${site.contact.email}`} className="w-full">
              E-Mail Anfrage
            </PillButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Beschriftetes Eingabefeld mit Icon im linken Innenrand. */
function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
