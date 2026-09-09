import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Gemeinsamer Rahmen aller Portal-Reiter: sanftes Einblenden von unten.
 *
 * Die Inhaltsbreite steckt hier, nicht in den einzelnen Reitern — vorher trug
 * jeder ein eigenes `max-w-5xl` (1024px), was auf einem Desktop neben der
 * 256px-Sidebar ein Drittel der Fläche leer ließ. Reiter mit Fließtext oder
 * Formularen dürfen enger sein und geben dafür ein eigenes max-w mit; dank
 * tailwind-merge gewinnt ihr Wert.
 */
export function TabPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('mx-auto w-full max-w-[1400px]', className)}
    >
      {children}
    </motion.div>
  );
}

/** Überschrift + Untertitel. Auf dem Handy zentriert, ab Tablet linksbündig. */
export function TabHeader({
  title,
  subtitle,
  className,
  spacing = 'mb-12',
}: {
  title: string;
  subtitle: string;
  className?: string;
  /** Abstand unter dem Untertitel — der Messenger braucht weniger. */
  spacing?: string;
}) {
  return (
    <div className={cn('md:text-left text-center', className)}>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-[#EBEBEB]">{title}</h1>
      <p className={cn('text-gray-500 dark:text-[#a3a3a3]', spacing)}>{subtitle}</p>
    </div>
  );
}
