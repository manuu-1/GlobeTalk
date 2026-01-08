// tests/loginInvalidTest.js
const { By, until } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./config');

(async function loginInvalidTest() {
  const driver = await createDriver();

  try {
    console.log('🔹 Starting Invalid Login Functional Test');

    // 1. Open /login
    await driver.get(`${APP_URL}/login`);

    // 2. Wait for the form to load
    await driver.wait(until.elementLocated(By.css('form')), 10000);

    // 3. Use the placeholders from YOUR component
    const emailInput = await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    );
    const passwordInput = await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    );

    await emailInput.sendKeys('wrong@example.com');
    await passwordInput.sendKeys('wrongPassword123');

    // 4. Click Sign In
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // 5. Wait for backend + UI to respond
    await driver.sleep(2000);

    // 6. Check your alert element:
    // {error && <div className="alert alert-error mb-4"><span>...</span></div>}
    const alerts = await driver.findElements(
      By.css('.alert.alert-error span')
    );

    if (alerts.length > 0) {
      const errorText = await alerts[0].getText();
      console.log('✅ Invalid Login Test PASSED. Error message shown:', errorText);
    } else {
      console.log('⚠ No alert-error found. Printing body snapshot for debugging:');
      const bodyText = await driver.findElement(By.css('body')).getText();
      console.log(bodyText.slice(0, 400));
    }
  } catch (err) {
    console.error('❌ Invalid Login Test FAILED:', err);
  } finally {
    await driver.quit();
  }
})();
