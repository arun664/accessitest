import path from 'path';
import fs from 'fs';

export async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const chromium = await import("@sparticuz/chromium").then((mod) => mod.default);
    const puppeteer = await import("puppeteer-core").then((mod) => mod.default);

    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log("Browser launched.");
    return browser;
  } else {
    const puppeteer = await import("puppeteer").then((mod) => mod.default);
    return await puppeteer.launch();
  }
}

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL provided." });
  }

  let browser;
  try {
    // Initialize the browser
    browser = await getBrowser();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: "networkidle0" });

    // Attempt to load axe-core from the local file system
    let axeScript;
    try {
      const axeScriptPath = path.resolve("node_modules/axe-core/axe.min.js");
      axeScript = fs.readFileSync(axeScriptPath, "utf-8");

      // Inject axe-core script content into the page
      await page.evaluate(axeScript => {
        const script = document.createElement("script");
        script.textContent = axeScript;
        document.head.appendChild(script);
      }, axeScript);

    } catch (err) {
      console.error("Local axe-core script not found, using CDN instead:", err);
      // Fallback to injecting axe-core from CDN if local script fails
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.4.1/axe.min.js' });
    }

    // Run axe-core on the page and get results
    const axeResults = await page.evaluate(async () => await axe.run());
    res.status(200).json(axeResults);

  } catch (error) {
    console.error("Error fetching axe-core results:", error);
    res.status(500).json({ error: "Internal Server Error" });

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}