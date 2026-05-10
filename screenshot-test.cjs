const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://qq249587541-cyber.github.io/iztro-dashboard/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/iztro-github-pages.png', fullPage: true });
  console.log('Screenshot saved to /tmp/iztro-github-pages.png');
  await browser.close();
})();
