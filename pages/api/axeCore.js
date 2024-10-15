// pages/api/axeCore.js
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { url } = req.body;

  // Validate the URL
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL provided.' });
  }

  let browser;

  try {
    // Launch Puppeteer and open a new page
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Get the axe-core script path
    const axeScriptPath = path.resolve('./node_modules/axe-core/axe.min.js');
    const axeScript = fs.readFileSync(axeScriptPath, 'utf-8');

    // Inject axe-core directly into the page
    await page.evaluate(axeScript => {
      const script = document.createElement('script');
      script.textContent = axeScript;
      document.head.appendChild(script);
    }, axeScript);

    // Run axe-core in the page context
    const axeResults = await page.evaluate(async () => {
      return await axe.run();
    });

    await browser.close();

    // Send back the axe results
    res.status(200).json(axeResults);
  } catch (error) {
    console.error('Error fetching axe-core results:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: error.message });
  }
}

// Utility function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
};
