/**
 * PLATZHALTER-ANMELDUNG für das Kundenportal.
 *
 * Aktuell wird nur im Browser gegen diese festen Werte geprüft — es gibt
 * keinen Server, keine echten Benutzerkonten und keinen Schutz der Daten
 * dahinter. Jede/r kann `/dashboard` direkt aufrufen.
 *
 * Bevor echte Kundendaten ins Portal kommen, braucht es eine richtige
 * Anmeldung (z. B. Supabase, Clerk oder Auth0) plus einen geschützten
 * Router-Bereich.
 */
export const demoAccount = {
  email: 'test@studiomaru.at',
  password: 'passwort123',
  displayName: 'Test Musterkunde',
  initials: 'TM',
};
