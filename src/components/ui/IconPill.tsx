import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Die runde Icon-Schaltfläche aus der Navigationsleiste der Startseite.
 * Auf dem Desktop mit Tooltip darunter, auf dem Handy ohne.
 */

const ICON_CLASSES =
  'w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors text-black';

type Props = {
  children: ReactNode;
  /** Tooltip-Text; weggelassen = kein Tooltip (Mobile) */
  label?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
};

function Inner({ children, to, href, onClick }: Omit<Props, 'label'>) {
  if (to) {
    return (
      <Link to={to} className={ICON_CLASSES}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={ICON_CLASSES}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={ICON_CLASSES}>
      {children}
    </button>
  );
}

export default function IconPill({ label, ...rest }: Props) {
  if (!label) return <Inner {...rest} />;

  return (
    <div className="relative group flex items-center justify-center">
      <Inner {...rest} />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

/** Der senkrechte Trennstrich zwischen Icon-Gruppen. */
export function IconDivider({ className = 'w-0.5 h-6 bg-black mx-1' }: { className?: string }) {
  return <div className={className} />;
}
