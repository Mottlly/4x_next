import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

test.describe("User API Routes (/api/userTable)", () => {
  let authToken;
  let userId;
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

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

    console.log("🔹 Waiting for game page...");
    await page.waitForURL("/game", { timeout: 30000 });

    console.log("✅ Successfully reached /game page");

    // ✅ Fetch session from /api/auth/session
    console.log("🔹 Fetching session from /api/auth/session...");
    const sessionResponse = await page.request.get(
      "http://localhost:3000/api/auth/session"
    );
    const sessionData = await sessionResponse.json();

    console.log("🔍 Session Data:", sessionData);

    if (!sessionData || !sessionData.user?.id || !sessionData.accessToken) {
      throw new Error("🔴 ERROR: No valid user ID or token found in session.");
    }

    userId = sessionData.user.id;
    authToken = sessionData.accessToken; // ✅ Extract the JWT

    console.log("🔍 Extracted User ID:", userId);
    console.log("🔍 Extracted JWT:", authToken);
  });

  test("GET /api/userTable - should return user data if authenticated", async ({
    request,
  }) => {
    console.log("🔹 Attempting API call with JWT...", authToken);

    const response = await request.get("http://localhost:3000/api/userTable", {
      headers: {
        Authorization: `Bearer ${authToken}`, // ✅ Send JWT to API
      },
    });

    console.log("🔍 Debug: API Response Status ->", response.status());

    try {
      const responseBody = await response.json();
      console.log("🔍 Debug: API Response JSON ->", responseBody);
    } catch (e) {
      console.log("🔴 Debug: API Response is not JSON.");
    }

    expect(response.status()).toBe(200);
  });

  test("POST /api/userTable - should create a new user", async ({
    request,
  }) => {
    console.log("🔹 Creating new user...");
    const response = await request.post("http://localhost:3000/api/userTable", {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { auth_id: "auth0|newUser123" },
    });

    console.log("🔍 Debug: API Response Status ->", response.status());
    expect(response.status()).toBe(201);
    const result = await response.json();
    expect(result.message).toBe("User created.");
  });

  test("DELETE /api/userTable - should deny non-admins", async ({
    request,
  }) => {
    console.log("🔹 Attempting to delete user (non-admin)...");
    const response = await request.delete(
      "http://localhost:3000/api/userTable",
      {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { auth_id: "auth0|someUserToDelete" },
      }
    );

    console.log("🔍 Debug: API Response Status ->", response.status());
    expect(response.status()).toBe(403); // Only admins can delete users
  });
});
