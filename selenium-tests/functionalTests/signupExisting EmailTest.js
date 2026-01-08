// tests/signupExistingEmailTest.js
const { By, until } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./config');

(async function signupExistingEmailTest() {
  const driver = await createDriver();

  try {
    console.log('🔹 Starting Signup Existing Email Test');

    // ⚠️ Put an email that is ALREADY registered in your database
    const existingEmail = 'existinguser@example.com';
    const password = 'password123';

    // 1. Open Signup page
    await driver.get(`${APP_URL}/signup`);

    // 2. Wait for form
    await driver.wait(until.elementLocated(By.css('form')), 10000);

    // 3. Fill Full Name
    const fullNameInput = await driver.findElement(
      By.css('input[placeholder="Enter your full name"]')
    );
    await fullNameInput.sendKeys('Existing User');

    // 4. Fill Email (already used)
    const emailInput = await driver.findElement(
      By.css('input[placeholder="Enter email id"]')
    );
    await emailInput.sendKeys(existingEmail);

    // 5. Fill Password
    const passwordInput = await driver.findElement(
      By.css('input[placeholder="Enter your Password"]')
    );
    await passwordInput.sendKeys(password);

    // 6. Check terms checkbox
    const termsCheckbox = await driver.findElement(
      By.css('input[type="checkbox"].checkbox')
    );
    await termsCheckbox.click();

    // 7. Submit form
    const submitButton = await driver.findElement(
      By.css('button.btn.btn-primary[type="submit"]')
    );
    await submitButton.click();

    // 8. Wait a bit for backend response + error render
    await driver.sleep(2000);

    // Try to find your error alert:
    // {error && (<div className="alert alert-error mb-4"><span>{error.response.data.message}</span></div>)}
    const alerts = await driver.findElements(
      By.css('.alert.alert-error span')
    );

    if (alerts.length > 0) {
      const errorText = await alerts[0].getText();
      console.log('✅ Signup Existing Email Test Passed. Error message:', errorText);
    } else {
      console.log('⚠ No .alert.alert-error displayed. Check backend response or selector.');
      const bodyText = await driver.findElement(By.css('body')).getText();
      console.log('Body snapshot:\n', bodyText.slice(0, 400));
    }
  } catch (err) {
    console.error('❌ Signup Existing Email Test Failed:', err);
  } finally {
    await driver.quit();
  }
})();
