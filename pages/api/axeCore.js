import path from "path";
import fs from "fs";

async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const chromium = await import("@sparticuz/chromium-min").then(
      (mod) => mod.default
    );

    const puppeteerCore = await import("puppeteer-core").then(
      (mod) => mod.default
    );

    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
			headless: "new",
			ignoreHTTPSErrors: true,
    });
    return browser;
  } else {
    const puppeteer = await import("puppeteer").then((mod) => mod.default);

    const browser = await puppeteer.launch();
    return browser;
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
  const browser = await getBrowser();

  const { url } = req.body;

  // Validate the URL
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL provided." });
  }

  try {
    // Launch the Chromium browser
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: "networkidle0" });

    // Load the axe-core script
    const axeScriptPath = path.resolve("./node_modules/axe-core/axe.min.js");
    const axeScript = fs.readFileSync(axeScriptPath, "utf-8");

    // Inject axe-core into the page
    await page.evaluate((axeScript) => {
      const script = document.createElement("script");
      script.textContent = axeScript;
      document.head.appendChild(script);
    }, axeScript);

    // Run axe-core and get results
    const axeResults = await page.evaluate(async () => {
      return await axe.run();
    });

    // Send back the axe results
    res.status(200).json(axeResults);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error fetching axe-core results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
