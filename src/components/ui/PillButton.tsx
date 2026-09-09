import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { pillBase, pillCompact, pillLarge, pillOutline, pillSolid } from '@/config/theme';

type Variant = 'outline' | 'solid';

/**
 * `lg`      – die großen Aktions-Buttons (Desktop, Menü, Formulare)
 * `compact` – Dashboard-Navigation
 * `mobile`  – Startseite auf dem Handy: Höhe über Seitenverhältnis statt
 *             fixem Padding, dünnerer Rand auf schmalen Displays
 */
type Size = 'lg' | 'compact' | 'mobile';

const VARIANTS: Record<Variant, string> = {
  outline: pillOutline,
  solid: pillSolid,
};

const SIZES: Record<Size, string> = {
  lg: pillLarge,
  compact: pillCompact,
  mobile: 'px-6 aspect-[340/54] h-auto text-[clamp(12px,3vw,14px)] tracking-[0.15em]',
};

/** Auf schmalen Displays skaliert auch die Randstärke mit. */
const MOBILE_BORDER = 'border-[min(2px,0.5vw)]';

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Interner Router-Link */
  to?: string;
  /** Externer Link oder mailto: */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  title?: string;
};

export default function PillButton({
  children,
  variant = 'outline',
  size = 'lg',
  className,
  to,
  href,
  onClick,
  type = 'button',
  title,
}: Props) {
  const classes = cn(
    pillBase,
    VARIANTS[variant],
    SIZES[size],
    size === 'mobile' && variant === 'outline' && MOBILE_BORDER,
    className,
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} title={title}>
        {children}
      </Link>
    );
  }

  if (href) {
    // Nur echte Web-Adressen in neuem Tab öffnen — mailto:/tel: bleiben inline.
    const isWeb = href.startsWith('http');
    return (
      <a
        href={href}
        target={isWeb ? '_blank' : undefined}
        rel={isWeb ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className={classes}
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} title={title}>
      {children}
    </button>
  );
}
