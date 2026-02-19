import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/../snapshots/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    deviceScaleFactor: 1.25,
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
    },
  },

  projects: [
    {
      name: "prod-desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1920, height: 1080 },
        baseURL: "https://www.kingspan.com",
      },
    },
    {
      name: "prod-tablet",
      use: {
        browserName: "chromium",
        ...devices["iPad Pro 11"],
        baseURL: "https://www.kingspan.com",
      },
    },
    {
      name: "prod-mobile",
      use: {
        browserName: "chromium",
        ...devices["Pixel 7"],
        baseURL: "https://www.kingspan.com",
      },
    },
    {
      name: "stage-desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1920, height: 1080 },
        baseURL: "https://stage.kingspan.com",
      },
    },
    {
      name: "stage-tablet",
      use: {
        browserName: "chromium",
        ...devices["iPad Pro 11"],
        baseURL: "https://stage.kingspan.com",
      },
    },
    {
      name: "stage-mobile",
      use: {
        browserName: "chromium",
        ...devices["Pixel 7"],
        baseURL: "https://stage.kingspan.com",
      },
    },
  ],
});
