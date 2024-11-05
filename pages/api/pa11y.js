import { pa11y } from 'pa11y';
import { getBrowser } from './axeCore'; // Adjusted path to the same folder

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser;

  try {
    // Initialize the custom browser
    browser = await getBrowser();

    // Customize Pa11y to use the existing Puppeteer instance
    const results = await pa11y(url, {
      browser: browser,
      page: await browser.newPage(),
      launchOptions: { ignoreHTTPSErrors: true }
    });

    // Close the browser and return results
    await browser.close();
    return res.status(200).json(results);

  } catch (error) {
    console.error('Pa11y error:', error);
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Failed to run accessibility tests' });
  }
}