import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // MUD's Stencil bundle lazy-imports its p-*.entry.js chunks relative to its
  // own URL. Pre-bundling moves it into .vite/deps without those chunks, so
  // every component 404s. Serve it from its own dist folder instead.
  optimizeDeps: { exclude: ['@egov-moldova/mud'] },
  // PORT lets a second checkout (e.g. a git worktree) run alongside the main one.
  server: { port: Number(process.env.PORT) || 5173 },
});
