import { defineConfig } from '@playwright/test';
export default defineConfig({
  timeout: 60000,
  testDir: './tests/browser',
  use: { reducedMotion: 'reduce', baseURL: 'http://127.0.0.1:4173', launchOptions: process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}, headless: true },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false, env: { VITE_SUPABASE_URL: 'https://auth.test', VITE_SUPABASE_ANON_KEY: 'public-test-key' } },
});
