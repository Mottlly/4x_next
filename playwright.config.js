// @ts-check
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Manually load .env.local
dotenv.config({ path: ".env.local" });

console.log("Auth0 Email:", process.env.AUTH0_TEST_EMAIL); // Debugging

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000", // Ensure it matches your Next.js dev server port
    trace: "on-first-retry",
    headless: true, // Run in headless mode (set to false to see the UI)
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* 🚀 Start the Next.js server before running tests */
  webServer: {
    command: "npm run dev", // Ensures Playwright starts Next.js locally
    url: "http://localhost:3000",
    reuseExistingServer: true, // If already running, don't restart
  },
});
