// tests/signupValidTest.js
const { By, until } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./config');

(async function signupValidTest() {
  const driver = await createDriver();

  try {
    console.log('🔹 Starting Signup Valid Functional Test');

    // unique email so we can run test multiple times
    const unique = Date.now();
    const email = `selenium_user_${unique}@example.com`;
    const password = 'password123';

    // 1. Open /signup
    await driver.get(`${APP_URL}/signup`);

    // 2. Wait for form
    await driver.wait(until.elementLocated(By.css('form')), 10000);

    // 3. Full Name
    const fullNameInput = await driver.findElement(
      By.css('input[placeholder="Enter your full name"]')
    );
    await fullNameInput.sendKeys('Selenium Test User');

    // 4. Email
    const emailInput = await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    );
    await emailInput.sendKeys(email);

    // 5. Password
    const passwordInput = await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    );
    await passwordInput.sendKeys(password);

    // 6. Checkbox (terms)
    const termsCheckbox = await driver.findElement(
      By.css('input[type="checkbox"].checkbox')
    );
    await termsCheckbox.click();

    // 7. Submit
    const submitButton = await driver.findElement(
      By.css('button.btn.btn-primary[type="submit"]')
    );
    await submitButton.click();

    // 8. After signup, tutorial usually redirects to /onboarding
    await driver.wait(until.urlContains('/onboarding'), 15000);

    const currentUrl = await driver.getCurrentUrl();
    console.log('✅ Signup Valid Test PASSED. Redirected to:', currentUrl);
  } catch (err) {
    console.error('❌ Signup Valid Test FAILED:', err);
  } finally {
    await driver.quit();
  }
})();
