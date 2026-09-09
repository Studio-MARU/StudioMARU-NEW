/** Meldungen im Reiter "Infos" des Kundenportals. Neueste zuerst. */

export type NewsItem = {
  badge: string;
  /** Farbgebung des Etiketts */
  tone: 'dark' | 'blue';
  date: string;
  title: string;
  body: string;
};

export const news: NewsItem[] = [
  {
    badge: 'Neu',
    tone: 'dark',
    date: '12. April 2026',
    title: 'Neue Formate nach Post.at Standard',
    body: 'Wir haben unsere Formate aktualisiert, um perfekt mit den Vorgaben der Österreichischen Post (post.at) übereinzustimmen. Ab sofort stehen Ihnen C5 und C4 Maxi-Briefe sowie DIN Lang Postkarten mit exakten Trennstrichen und Adressfeldern zur Verfügung.',
  },
  {
    badge: 'Info',
    tone: 'blue',
    date: '28. März 2026',
    title: 'Erweiterte 360° Vorschau',
    body: 'Unser Kundenportal bietet nun eine verbesserte 360-Grad-Vorschau. Sie können Ihre Designs jetzt in alle Richtungen drehen, um jedes Detail vor der Bestellung genau zu prüfen.',
  },
];
