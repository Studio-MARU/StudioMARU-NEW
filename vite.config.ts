import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // Vite liest PORT nicht von allein. Über die Umgebungsvariable kann die
    // Entwicklungsumgebung einen freien Port zuweisen, wenn 3000 schon von
    // einem anderen Projekt belegt ist. Ohne Vorgabe bleibt es bei 3000.
    port: Number(process.env.PORT) || 3000,
  },
});
