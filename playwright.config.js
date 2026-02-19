import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/../snapshots/prod/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1.25,
  },
  expect: {
    toHaveScreenshot: {
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
  ],
});
