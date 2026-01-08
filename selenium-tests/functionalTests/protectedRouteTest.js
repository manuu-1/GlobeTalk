// tests/protectedRouteTest.js
const { until } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./config');

(async function protectedRouteTest() {
  const driver = await createDriver();

  try {
    console.log('🔹 Starting Protected Route Test');

    await driver.manage().deleteAllCookies();

    // Try to directly access a protected page
    await driver.get(`${APP_URL}/home`); // or '/', depending on your routing logic

    // Wait for redirect to login
    await driver.wait(until.urlContains('/login'), 15000);

    const currentUrl = await driver.getCurrentUrl();
    console.log('✅ Protected Route Test Passed. Redirected to:', currentUrl);
  } catch (err) {
    console.error('❌ Protected Route Test Failed:', err);
  } finally {
    await driver.quit();
  }
})();
