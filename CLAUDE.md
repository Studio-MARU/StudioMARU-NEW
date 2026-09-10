# Hinweise für Claude Code

Website und Kundenportal von Studio Maru. React 19 + TypeScript + Vite +
Tailwind CSS v4 + React Router 7 + Motion. Die Oberfläche ist durchgehend
auf Deutsch — auch Code-Kommentare und Commit-Nachrichten auf Deutsch.

## Befehle

```bash
npm run dev        # Server auf Port 3000
npm run typecheck  # tsc --noEmit, strict
npm run build      # nach dist/
```

Node liegt unter `~/.local/node/bin` (nicht systemweit installiert).

## Design nicht verändern

Das Design ist gesetzt und wurde vom Kunden abgenommen. Änderungen an
Abständen, Farben, Schriftgrößen oder Rundungen nur, wenn ausdrücklich
danach gefragt wird. Beim Umbauen von Code: Klassen unverändert übernehmen.

Prüfen lässt sich das, indem man vor und nach einer Änderung für jedes
Element unter `#root` Position, Größe und die berechneten Styles vergleicht.
Zwei Fallstricke dabei: In Hintergrund-Tabs pausieren die Motion-Animationen
(Elemente bleiben bei `opacity: 0`), und `animate-pulse`-Elemente ändern ihre
Opazität laufend — beides erzeugt Unterschiede, die keine sind.

## Konventionen

- **Inhalte gehören in `src/config/site.ts`**, nicht ins JSX. Links,
  Adressen, Texte. Neue Seite mit Kontaktdaten? Von dort importieren.
- **Wiederkehrende Klassen-Kombinationen** stehen in `src/config/theme.ts`
  und werden über `src/components/ui/PillButton.tsx` verwendet. Keine
  16-Klassen-Strings ins JSX kopieren.
- **Importe** über den Alias `@/` (zeigt auf `src/`), nicht über `../../`.
- **Der dunkle Modus** des Portals läuft über `dark:`-Klassen. Die Variante
  ist in `src/index.css` per `@custom-variant` an `.dark-mode-active`
  gebunden, nicht an die Systemeinstellung — sie greift also nur im Portal.
  Jede neue Fläche, jeder neue Text im Dashboard braucht seine eigene
  `dark:`-Entsprechung; es gibt keinen Automatismus mehr, der das auffängt.
- **Bilder in `public/`**: nur ASCII-Dateinamen, keine Umlaute (ein Umlaut
  hatte schon dazu geführt, dass ein Bild auf dem Server nicht lud).

## Das Kundenportal

Die Reiter werden per State umgeschaltet, nicht per Router — die Adresse
bleibt `/dashboard`. Neuer Reiter: Modul unter `pages/dashboard/tabs/`,
Eintrag in `navigation.ts`, Zeile in `Dashboard.tsx`.

`profile` und `messenger` stehen bewusst nicht in `NAV_ITEMS` — sie werden
über das Logo bzw. den Button "Nachricht senden" erreicht.

**Breite:** Die Inhaltsbreite setzt `TabPanel` (max. 1400px), nicht der
einzelne Reiter. Wer es enger braucht — Formulare, Chat —, gibt ein eigenes
`max-w-*` mit; tailwind-merge lässt das gewinnen.

**Umbruchpunkte liegen im Portal eine Stufe höher.** Zwischen Fensterbreite
und Inhaltsbreite liegen 352px (256px Sidebar + 2×48px Innenabstand). Ein
`lg:grid-cols-3` greift also bei 1024px Fenster auf nur 672px Inhalt — die
Spalten wurden 208px breit. Mehrspaltige Raster im Dashboard deshalb ab
`xl:`, nicht ab `lg:`.

**Kein `overflow` auf `<main>`.** `<main>` wächst mit dem Inhalt und scrollt
nie selbst, wäre als Scroll-Container aber der Grund, dass jedes `sticky`
darin wirkungslos bleibt (die mitlaufende Vorschau im Projekt-Editor hing
genau daran). Gescrollt wird das Fenster.

## Veröffentlichen

Die Seite liegt auf **studiomaru.at** und wird aus dem *öffentlichen* Repo
`Studio-MARU/StudioMARU-NEW` ausgeliefert. Dieses hier (`studio-maru`) ist
privat — GitHub Pages ist für private Repos im aktuellen Tarif gesperrt.

Die DNS-Einträge stehen bei GoDaddy und sind fertig: Apex auf die vier
GitHub-Pages-Adressen, `www` als CNAME auf `studio-maru.github.io`.

Ein Push hierher ändert die Live-Seite **nicht**. Veröffentlicht wird ein
Schnappschuss des aktuellen Baums als ein Commit auf die Historie des
öffentlichen Repos — die private Commit-Historie bleibt dabei privat:

```bash
git fetch live main
git push live "$(git commit-tree "$(git rev-parse main^{tree})" -p live/main -m 'Neuer Stand')":refs/heads/main
```

(`live` = https://github.com/Studio-MARU/StudioMARU-NEW.git; einmalig mit
`git remote add live …` einrichten. In zsh die Klammern nicht weglassen,
sonst frisst `:r` einen Teil des Refs.)

Den Rest erledigt `deploy.yml` im öffentlichen Repo. Drei Dinge müssen dafür
im Baum bleiben: `public/CNAME` (Domain), `public/.nojekyll` und das
`postbuild`-Skript, das `index.html` als `404.html` kopiert — ohne die
letzte liefert Pages bei `/dashboard` oder `/portfolio` einen Fehler statt
der App.

## Kein Backend

Anmeldung, Zugangscode, Projektanfrage, Chat und Downloads sind reine
Oberfläche. Nichts davon als funktionsfähig behandeln oder darstellen.
`/dashboard` ist ohne Anmeldung erreichbar. Siehe Abschnitt "Noch offen"
im README.
