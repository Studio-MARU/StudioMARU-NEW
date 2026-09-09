/** Weiche blau-violette Farbschleier im Hintergrund (Login & Dashboard). */
export default function BackgroundGlow({
  className = 'fixed inset-0 -z-10 overflow-hidden pointer-events-none',
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/20 blur-[120px]" />
    </div>
  );
}
