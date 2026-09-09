import { cn } from '@/lib/utils';

/**
 * Das gerahmte Logo-Kästchen (Login, Dashboard-Sidebar, Messenger-Kopf).
 * Das Bild ist bewusst leicht überskaliert, damit der weiße Rand der PNG
 * außerhalb des Rahmens landet.
 */

const BOX =
  'overflow-hidden border-2 border-black flex items-center justify-center bg-[#F4F5FB] dark:border-[#EBEBEB] dark:bg-[#EBEBEB]';
const IMG = 'w-full h-full object-cover object-center scale-[1.15] mix-blend-multiply flex-shrink-0';

type Props = {
  /** Größe, Rundung, Schatten — z. B. "w-20 h-16 rounded-[2rem] shadow-md" */
  className?: string;
  alt?: string;
  /** Wenn gesetzt, wird das Kästchen zur Schaltfläche. */
  onClick?: () => void;
  title?: string;
};

export default function LogoBadge({ className, alt = 'Studio Maru', onClick, title }: Props) {
  const image = <img src="/logoicon.png" alt={alt} className={IMG} />;

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(BOX, 'hover:scale-105 transition-transform', className)} title={title}>
        {image}
      </button>
    );
  }

  return <div className={cn(BOX, className)}>{image}</div>;
}
