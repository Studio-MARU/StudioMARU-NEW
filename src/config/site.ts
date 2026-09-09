/**
 * Zentrale Stelle für alle Inhalte, die sich häufig ändern:
 * Links, Kontaktdaten, Firmendaten, Texte.
 *
 * Faustregel: Wenn du eine Telefonnummer, eine URL oder einen Satz
 * ändern willst, änderst du ihn HIER — nicht in den Komponenten.
 */

export const site = {
  name: 'Studio Maru',

  /** Slogan auf der Startseite */
  tagline: 'Wir schreiben Briefe, die gelesen werden.',
  subline: ['Echte Tinte, echtes Papier, maximale', 'Aufmerksamkeit für deine Botschaft.'],

  /**
   * Zugangscode für die "Coming Soon"-Sperre vor der ganzen Seite.
   *
   * ACHTUNG: Das ist reiner Sichtschutz, keine Sicherheit — der Code steht im
   * ausgelieferten JavaScript und ist für jeden lesbar. Nichts Vertrauliches
   * dahinter legen. Setze `enabled: false`, um die Seite öffentlich zu schalten.
   */
  gate: {
    enabled: true,
    code: '6020',
    heading: 'Wir arbeiten im Hintergrund an etwas Besonderem.',
    subheading: 'Bald sind wir hier für dich da.',
  },

  contact: {
    email: 'info@studiomaru.at',
    instagram: 'https://instagram.com/studiomaru.at',
    whatsapp: 'https://wa.me/436642766355',
    calendly: 'https://calendly.com/',
  },

  /** Impressumsdaten */
  company: {
    legalName: 'Studio Maru OG',
    street: 'Dr. Stumpf-Straße 121',
    zip: '6020',
    city: 'Innsbruck',
    country: 'Österreich',
    legalForm: 'Offene Gesellschaft',
    industry: 'Marketing',
    registerNumber: '675244g',
    registeredOffice: 'Innsbruck',
    registrationDate: '17.03.2026',
  },

  about: {
    intro:
      'Studio Maru ist ein kreatives Designstudio aus Innsbruck. Wir gestalten digitale Erlebnisse, visuelle Identitäten und kreative Konzepte, die im Gedächtnis bleiben.',
    vision:
      'Wir glauben an Design, das nicht nur gut aussieht, sondern auch funktioniert. Jedes Projekt ist eine neue Möglichkeit, Marken eine einzigartige Stimme zu geben und ihre Geschichte visuell zu erzählen.',
    approach: 'Vom ersten Buchstaben bis zum letzten Punkt.',
  },
} as const;

/**
 * Die fünf Haupt-Aktionen. Sie erscheinen sowohl auf der Startseite
 * als auch im Menü der Unterseiten — einmal ändern reicht.
 */
export const primaryActions = [
  { label: 'Kostenloses Erstgespräch', href: site.contact.calendly, external: true },
  { label: 'Unsere Arbeiten', href: '/portfolio', external: false },
  { label: 'Kundenportal', href: '/login', external: false },
  { label: 'E-Mail senden', href: `mailto:${site.contact.email}`, external: true },
  { label: 'WhatsApp Anfrage', href: site.contact.whatsapp, external: true },
] as const;

export type PrimaryAction = (typeof primaryActions)[number];
