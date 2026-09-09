/**
 * Die handgezeichneten Tier-Illustrationen im Hintergrund.
 *
 * `mix-blend-multiply` lässt das Weiß der PNGs verschwinden, damit sie
 * direkt auf dem grauen Papierton sitzen.
 */

/** Flügel links — bricht am linken Bildrand ab. */
export function BirdWing({ className }: { className: string }) {
  return (
    <div className={className}>
      <img
        src="/bird-wing.png"
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-contain object-left mix-blend-multiply"
      />
    </div>
  );
}

/** Frosch auf Vogel, unten rechts. */
export function FrogBird({ className }: { className: string }) {
  return (
    <div className={className}>
      <img
        src="/frog-bird.png"
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-contain mix-blend-multiply object-right-bottom"
      />
    </div>
  );
}

/** Mobile Variante des Flügels (eigener Bildausschnitt). */
export function BirdWingMobile({ className }: { className: string }) {
  return (
    <div className={className}>
      <img
        src="/wing-bird-mobile.png"
        alt=""
        aria-hidden="true"
        className="w-[110%] h-auto object-contain mix-blend-multiply"
      />
    </div>
  );
}

/** Mobile Variante von Frosch & Vogel. */
export function FrogBirdMobile({ className }: { className: string }) {
  return (
    <div className={className}>
      <img
        src="/frog-bird-mobile.png"
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-contain mix-blend-multiply"
      />
    </div>
  );
}
