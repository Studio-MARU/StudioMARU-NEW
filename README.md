# Studio Maru — Website & Kundenportal

Landingpage im Linktree-Stil plus Kundenportal für Studio Maru, Innsbruck.

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Motion

## Loslegen

```bash
npm install
npm run dev
```

Die Seite läuft dann auf http://localhost:3000.

Beim ersten Aufruf fragt die Seite nach einem **Zugangscode** (aktuell `6020`).
Für das Kundenportal unter `/login`: `test@studiomaru.at` / `passwort123`.

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | Den Build lokal testen |
| `npm run typecheck` | TypeScript prüfen, ohne zu bauen |

## Was wo liegt

```
src/
  config/
    site.ts            Alle Links, Kontaktdaten, Firmendaten, Texte
    theme.ts           Wiederkehrende Klassen-Bausteine (Buttons, Karten)
    auth.ts            Platzhalter-Zugangsdaten fürs Portal
  data/
    examples.ts        Beispielprojekte — für Portfolio UND Portal-Reiter
    formats.ts         Papierformate (A6, DIN Lang, C5, C4) + Textlängen
    news.ts            Meldungen im Portal-Reiter "Infos"
  lib/
    utils.ts           cn() für Klassen-Strings
    iauto.ts           Export für die IAuto-Software (Format-Annahme!)
    entwuerfe.ts       Projekte im Browser-Speicher, Entwurf oder Kampagne
    tabelle.ts         Liest .xlsx und .csv — eigener ZIP-/XML-Leser
  components/
    SiteGate.tsx       Vorschaltseite mit Zugangscode
    GlobalNav.tsx      Schwebende Navigation auf Unterseiten
    SearchModal.tsx    Suche
    Illustrations.tsx  Die Tier-Zeichnungen im Hintergrund
    ui/                PillButton, IconPill, LogoBadge, BackgroundGlow
  pages/
    LandingPage.tsx    Startseite: scrollbar, mit Kopfleiste, "Wer sind wir"
                       und "Unsere Arbeiten" als Abschnitte
    Portfolio.tsx  Login.tsx  AboutUs.tsx  Impressum.tsx
    dashboard/
      Dashboard.tsx    Rahmen, Reiter-Umschaltung, dunkler Modus
      Sidebar.tsx      Navigation (Desktop)
      MobileNav.tsx    Kopfzeile, Burger-Button, Vollbild-Menü
      navigation.ts    Die Reiter als Liste
      tabs/            Ein Modul pro Reiter
      components/      FileDropzone, CardPreview (3D), TabPanel
public/                Bilder — direkt über /dateiname.png erreichbar
```

## Häufige Änderungen

**Eine Telefonnummer, E-Mail oder einen Link ändern**
→ `src/config/site.ts`. Die fünf Haupt-Buttons stehen dort als `primaryActions`
und werden von Startseite und Menü gemeinsam genutzt.

**Ein neues Beispielprojekt**
→ Eintrag in `src/data/examples.ts` ergänzen. Es erscheint danach automatisch
auf der Portfolio-Seite *und* im Portal-Reiter "Beispiele". Ohne Bilddateien
wird die Karte aus Farbe, Name und Text gerendert; liegen echte Scans vor,
gehören sie nach `public/` und in die Felder `bildVorne` / `bildHinten`.

**Die Seite öffentlich schalten (Zugangscode entfernen)**
→ In `src/config/site.ts` bei `gate` auf `enabled: false` stellen.

**Einen neuen Reiter im Portal**
→ Modul unter `src/pages/dashboard/tabs/` anlegen, in `navigation.ts`
eintragen und in `Dashboard.tsx` einhängen.

**Das Aussehen der Buttons**
→ `src/config/theme.ts`. Die Klassen werden von `ui/PillButton.tsx` genutzt,
eine Änderung wirkt überall.

## Dateinamen in `public/`

Bitte **keine Umlaute oder Leerzeichen** in Bildnamen. macOS und Linux
speichern Umlaute unterschiedlich, wodurch das Bild auf dem Server nicht
gefunden wird — genau das ist bei `Flügel-Vogel-mobile.png` passiert.

## Noch offen

Diese Punkte sehen fertig aus, haben aber noch keine Funktion:

- **Anmeldung** — läuft nur im Browser gegen feste Werte. `/dashboard` ist
  ohne Anmeldung direkt aufrufbar. Details in `src/config/auth.ts`.
- **Zugangscode** — steht im ausgelieferten JavaScript, also reiner
  Sichtschutz, keine Sicherheit.
- **Nachrichten**, **Dokumenten-Download**, **E-Mail/Passwort ändern** —
  Oberfläche vorhanden, ohne Backend.
- **IAuto-Export**: Das CSV-Format in `src/lib/iauto.ts` ist eine *Annahme*.
  Die Import-Maske der Unnatek-Software wurde nie geprüft. Alles Formatspezifische
  steckt nur in dieser Datei — sobald die Doku vorliegt, wird dort getauscht.
- **Entwürfe und Kampagnen** liegen im localStorage, also nur auf dem
  jeweiligen Gerät. Entwürfe stehen unter „Vorlagen/Entwürfe", verschickte
  Kampagnen unter „Kampagnen". Beides bleibt bearbeitbar, Kampagnen sind
  aber vor dem Löschen geschützt.
- **Excel-Import** liest .xlsx ohne Fremdbibliothek (ZIP + XML im Browser).
  Nur das erste Arbeitsblatt, keine Formelberechnung, kein Passwortschutz.
- **Kalender-Link** zeigt auf `https://calendly.com/` ohne Konto.

Die Projekterstellung ist dagegen benutzbar: Empfängerliste einfügen oder
tippen, Text mit Platzhaltern schreiben, Entwurf speichern und als CSV für die
IAuto-Software exportieren. Zusätzlich öffnet "Anfrage per E-Mail" eine
vorbereitete Nachricht.

## Veröffentlichen

`.github/workflows/deploy.yml` baut bei jedem Push auf `main` und
veröffentlicht auf GitHub Pages. Der Build kopiert `index.html` zusätzlich
nach `404.html`, damit direkte Aufrufe wie `/portfolio` funktionieren.
