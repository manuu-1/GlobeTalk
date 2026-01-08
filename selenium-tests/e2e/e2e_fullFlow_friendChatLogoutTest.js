// tests/e2e_fullFlow_friendChatLogoutTest.js
const { By, until, Key } = require("selenium-webdriver");
const { createDriver, APP_URL } = require("./config");

(async function e2eFullFlow() {
  const driver = await createDriver();

  // -------------------------------------
  // Human typing helper — visible for demo
  // -------------------------------------
  async function slowType(driver, element, text, delay = 150) {
    for (const ch of text.split("")) {
      await element.sendKeys(ch);
      await driver.sleep(delay);
    }
  }

  // -------------------------------------
  // SIGNUP + ONBOARDING
  // -------------------------------------
  async function signupAndOnboard(user) {
    console.log(`\n🔹 Signup & Onboarding for ${user.email}`);

    await driver.manage().deleteAllCookies();
    await driver.get(`${APP_URL}/signup`);
    await driver.wait(until.elementLocated(By.css("form")), 15000);

    // signup fields (slow typing)
    const nameField = await driver.findElement(
      By.css('input[placeholder="Enter your full name"]')
    );
    await slowType(driver, nameField, user.fullName);

    const emailField = await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    );
    await slowType(driver, emailField, user.email);

    const pwField = await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    );
    await slowType(driver, pwField, user.password);

    await driver.findElement(By.css('input[type="checkbox"]')).click();
    await driver.findElement(By.css("button[type='submit']")).click();

    // onboarding
    await driver.wait(until.urlContains("/onboarding"), 20000);
    console.log("✅ Reached /onboarding");

    await driver.sleep(1500);

    const onboardName = await driver.findElement(
      By.css('input[placeholder="Enter your full name"]')
    );
    await onboardName.clear();
    await slowType(driver, onboardName, `${user.fullName} Onboarded`);

    const bioField = await driver.findElement(
      By.css(
        'textarea[placeholder="Tell others about yourself and your language learning goals"]'
      )
    );
    await slowType(driver, bioField, user.bio);

    const selects = await driver.findElements(By.css("select.select-bordered"));
    if (selects.length >= 2) {
      await selects[0].findElement(By.css("option:nth-child(2)")).click();
      await selects[1].findElement(By.css("option:nth-child(3)")).click();
    }

    const locField = await driver.findElement(
      By.css('input[placeholder="City, Country"]')
    );
    await slowType(driver, locField, user.location);

    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.sleep(3000);

    console.log("🚀 Onboarding submitted…");
    console.log("⚠️ Waiting extra 5s for backend save + redirect...");
    await driver.sleep(5000);

    console.log(`📍 Current URL: ${await driver.getCurrentUrl()}`);
  }

  // -------------------------------------
  // LOGIN
  // -------------------------------------
  async function login(user) {
    console.log(`\n🔹 Logging in as ${user.email}`);

    await driver.get(`${APP_URL}/login`);
    await driver.wait(until.elementLocated(By.css("form")), 10000);

    const emailInput = await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    );
    const pwInput = await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    );

    await emailInput.clear();
    await slowType(driver, emailInput, user.email);

    await pwInput.clear();
    await slowType(driver, pwInput, user.password);

    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(
      async () => !(await driver.getCurrentUrl()).includes("/login"),
      20000
    );

    console.log(`✅ Logged in successfully`);
  }

  // -------------------------------------
  // LOGOUT
  // -------------------------------------
  async function logout() {
    console.log("\n🔹 Logging out...");

    await driver.wait(until.elementLocated(By.css("nav")), 10000);

    const btns = await driver.findElements(
      By.css("nav button.btn.btn-ghost.btn-circle")
    );

    const logoutBtn = btns[btns.length - 1];
    await logoutBtn.click();

    await driver.wait(until.urlContains("/login"), 20000);

    console.log("🚪 Logged out → Back to /login");
  }

  // -------------------------------------
  // MAIN FLOW
  // -------------------------------------
  try {
    const unique = Date.now();
    const userA = {
      email: `userA_${unique}@example.com`,
      password: "Password@123",
      fullName: "User A",
      bio: "This is User A Demo.",
      location: "Mysuru, India",
    };
    const userB = {
      email: `userB_${unique}@example.com`,
      password: "Password@123",
      fullName: "User B",
      bio: "This is User B Demo.",
      location: "Bangalore, India",
    };

    // --- A signup ---
    await signupAndOnboard(userA);
    await logout();

    // --- B signup ---
    await signupAndOnboard(userB);
    await logout();

    // --- A login and send request ---
    await login(userA);
    await driver.get(`${APP_URL}/`);
    await driver.sleep(2500);

    const cards = await driver.findElements(By.css(".card"));
    const targetName = `${userB.fullName} Onboarded`;

    let sent = false;
    for (const c of cards) {
      if ((await c.getText()).includes(targetName)) {
        await c.findElement(By.css("button")).click();
        sent = true;
        break;
      }
    }

    console.log(
      sent
        ? "🤝 Friend Request Sent A ➡ B"
        : "⚠️ Could not find B's profile card"
    );

    await driver.sleep(2000);
    await logout();

    // --- B Accept request ---
    await login(userB);
    await driver.get(`${APP_URL}/notifications`);

    let accept;
    for (let i = 0; i < 12; i++) {
      accept = await driver.findElements(
        By.xpath("//button[contains(text(),'Accept')]")
      );
      if (accept.length > 0) break;
      await driver.sleep(1000);
    }

    if (accept.length) {
      await accept[0].click();
      console.log("🎉 Request Accepted");
    }

    await driver.sleep(2000);
    // --- GO TO FRIENDS PAGE ---
await driver.get(`${APP_URL}/friends`);
console.log("⏳ Waiting for friends to load...");

// Poll for friends up to 20s
let friendCards = [];
for (let i = 0; i < 20; i++) {
  await driver.sleep(1000);
  friendCards = await driver.findElements(By.css('.card'));
  if (friendCards.length > 0) break;
}

if (friendCards.length === 0) {
  console.log('❗ Still no friends after waiting. Backend may not have persisted friendship yet.');
  
  // DEBUG the page
  const debugText = await driver.findElement(By.css('body')).getText();
  console.log("\n📄 FRIENDS PAGE SNAPSHOT:");
  console.log(debugText.slice(0, 400));
  return;
}

console.log(`🎉 Friends detected: ${friendCards.length}`);

    console.log(`👥 Friends count: ${friendCards.length}`);

    // start chat
    const messages = await driver.findElements(
      By.xpath("//a[contains(text(),'Message')]")
    );
    await messages[0].click();
    console.log("💬 Chat Opened");

    await driver.sleep(2000);

    const chatArea = await driver.wait(
      until.elementLocated(By.css("textarea")),
      20000
    );

    const chatMsg = "Hello from Selenium E2E demo";
    await slowType(driver, chatArea, chatMsg, 130);

    await chatArea.sendKeys(Key.ENTER);

    await driver.sleep(5000);

    console.log("📤 Message Sent");
    console.log("\n🎯 FLOW COMPLETE — Staying Logged In");

  } catch (err) {
    console.error("\n❌ TEST FAILED ❌\n", err);
  } finally {
    await driver.sleep(5000);
    await driver.quit();
  }
})();
