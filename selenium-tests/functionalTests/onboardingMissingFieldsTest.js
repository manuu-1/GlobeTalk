// tests/onboardingMissingFieldsTest.js
const { By, until } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./config');

(async function onboardingMissingFieldsTest() {
  const driver = await createDriver();

  try {
    console.log('🔹 Starting Onboarding Missing Fields Functional Test');

    // --- STEP 1: SIGNUP A NEW USER ---
    const unique = Date.now();
    const email = `onboard_missing_${unique}@example.com`;
    const password = 'password123';

    await driver.get(`${APP_URL}/signup`);
    await driver.wait(until.elementLocated(By.css('form')), 10000);

    // Full Name
    await driver.findElement(
      By.css('input[placeholder="Enter your full name"]')
    ).sendKeys('Onboarding Missing Fields User');

    // Email
    await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    ).sendKeys(email);

    // Password
    await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    ).sendKeys(password);

    // Terms checkbox
    await driver.findElement(
      By.css('input[type="checkbox"].checkbox')
    ).click();

    // Submit signup
    await driver.findElement(
      By.css('button.btn.btn-primary[type="submit"]')
    ).click();

    // Wait for /onboarding
    await driver.wait(until.urlContains('/onboarding'), 15000);
    console.log('✅ Reached Onboarding page');

    // --- STEP 2: FILL ONLY SOME FIELDS (leave some missing) ---

    // Full Name – should already be prefilled from authUser, but we’ll ensure it
    const fullNameInput = await driver.findElement(By.css('input[name="fullName"]'));
    await fullNameInput.clear();
    await fullNameInput.sendKeys('User Missing Fields');

    // Bio – fill
    const bioTextarea = await driver.findElement(By.css('textarea[name="bio"]'));
    await bioTextarea.clear();
    await bioTextarea.sendKeys('Testing onboarding validation for missing fields.');

    // DO NOT select nativeLanguage, DO NOT select learningLanguage, DO NOT enter location

    // Submit onboarding
    const submitButton = await driver.findElement(
      By.css('button.btn.btn-primary[type="submit"]')
    );
    await submitButton.click();

    // Wait a bit for backend/ toast error
    await driver.sleep(2000);

    // At minimum: ensure we are STILL on /onboarding (i.e., onboarding not accepted)
    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes('/onboarding')) {
      console.log('✅ Onboarding Missing Fields Test PASSED – still on /onboarding');
    } else {
      console.log('⚠ Expected to stay on /onboarding but got:', currentUrl);
    }

    // OPTIONAL: try to detect error text from toast or body
    const bodyText = await driver.findElement(By.css('body')).getText();
    console.log('Body snapshot (for checking error message):');
    console.log(bodyText.slice(0, 400));

  } catch (err) {
    console.error('❌ Onboarding Missing Fields Test FAILED:', err);
  } finally {
    await driver.quit();
  }
})();
