// tests/config.js
const { Builder } = require('selenium-webdriver');

// Change this if your frontend is on different URL or port
const APP_URL = 'http://localhost:5173';

async function createDriver() {
  const driver = await new Builder().forBrowser('chrome').build();
  return driver;
}

module.exports = { createDriver, APP_URL };
