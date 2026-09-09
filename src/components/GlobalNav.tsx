import { useEffect, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Home, Menu, X } from 'lucide-react';
import PillButton from '@/components/ui/PillButton';
import { primaryActions } from '@/config/site';

/** Auf diesen Seiten hat die Navigation ihren eigenen Platz und wird ausgeblendet. */
const HIDDEN_ON = ['/', '/dashboard'];

/**
 * Die schwebende Pille oben mitte auf allen Unterseiten.
 * Verschwindet beim Runterscrollen und kommt beim Hochscrollen zurück.
 */
export default function GlobalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 50));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (HIDDEN_ON.includes(location.pathname)) return null;

  // Kurz ausblenden, bevor die Startseite geladen wird — sonst blitzt die
  // Navigation auf der Startseite auf, wo sie nicht hingehört.
  const handleHomeClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    setTimeout(() => {
      navigate('/');
      setIsNavigatingHome(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isNavigatingHome && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="fixed inset-0 bg-[#EBEBEB]/80 pointer-events-auto"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
            <motion.div
              layout
              initial={{ y: 0, opacity: 1 }}
              animate={{
                y: isVisible || isMenuOpen ? 0 : -100,
                opacity: isVisible || isMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 bg-[#EBEBEB]/80 backdrop-blur-md border-2 border-black px-1 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-[#EBEBEB] transition-colors"
            >
              {!isMenuOpen ? (
                <>
                  <a
                    href="/"
                    onClick={handleHomeClick}
                    className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors px-3 py-2 rounded-full"
                  >
                    <Home size={18} strokeWidth={2} />
                    Home
                  </a>
                  <div className="w-0.5 h-5 bg-black mx-1" />
                  <button
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors px-3 py-2 rounded-full"
                  >
                    <Menu size={18} strokeWidth={2} />
                    Menü
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors px-4 py-2 rounded-full"
                >
                  <X size={18} strokeWidth={2} />
                  Zurück
                </button>
              )}
            </motion.div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div className="flex flex-col gap-4 mt-8 w-[90vw] md:w-[24rem]">
                  {primaryActions.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        scale: 0.9,
                        transition: { delay: (primaryActions.length - 1 - i) * 0.05 },
                      }}
                      transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                    >
                      <PillButton
                        to={item.external ? undefined : item.href}
                        href={item.external ? item.href : undefined}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-center w-full"
                      >
                        <span className="text-center">{item.label}</span>
                      </PillButton>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
