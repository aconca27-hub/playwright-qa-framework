import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testMatch: /tests\/api\/.*\.spec\.ts/ },
    { name: 'chromium', testMatch: /tests\/ui\/.*\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', testMatch: /tests\/ui\/.*\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
  ],
});
