import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

test("User can open splash page, authenticate, and reach menu page", async ({
  page,
}) => {
  console.log("🔹 Opening homepage...");
  await page.goto("/");

  console.log("🔹 Clicking login button...");
  await page.click("text=Login");

  console.log("🔹 Waiting for Auth0 login page...");
  await page.waitForURL(/auth0\.com/);

  console.log("🔹 Inserting login credentials...");
  await page.fill('input[name="username"]', process.env.AUTH0_TEST_EMAIL);
  await page.fill('input[name="password"]', process.env.AUTH0_TEST_PASSWORD);
  await page.click('button[type="submit"]');

  console.log("🔹 Waiting for menu page...");
  await page.waitForURL("/menu", { timeout: 30000 });

  console.log("✅ Successfully reached /menu page");
  expect(page.url()).toBe("http://localhost:3000/menu");
});
