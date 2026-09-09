import { Bell, History, Image as ImageIcon, Layers, LayoutDashboard, PlusCircle } from 'lucide-react';

/**
 * Die Reiter des Kundenportals.
 *
 * Die Beschriftungen sind bewusst kurz: Neben dem Icon bleiben im Knopf nur
 * rund 145px, "Vorlagen/Entwürfe" bräuchte 170px und hätte das Icon
 * verdrängt. Die volle Bezeichnung steht als Überschrift im Reiter selbst.
 *
 * `profile` und `messenger` stehen bewusst NICHT hier — sie werden über
 * das Logo bzw. den Button "Nachricht senden" erreicht, nicht über die
 * Hauptnavigation.
 */
export const NAV_ITEMS = [
  { id: 'overview', label: 'Übersicht', icon: LayoutDashboard },
  { id: 'new_project', label: 'Neues Projekt', icon: PlusCircle },
  { id: 'templates', label: 'Entwürfe', icon: Layers },
  { id: 'examples', label: 'Beispiele', icon: ImageIcon },
  { id: 'news', label: 'Infos', icon: Bell },
  { id: 'history', label: 'Kampagnen', icon: History },
] as const;

export type TabId = (typeof NAV_ITEMS)[number]['id'] | 'profile' | 'messenger';
