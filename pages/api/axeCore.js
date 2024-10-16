async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const chromium = await import("@sparticuz/chromium").then(
      (mod) => mod.default
    );

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

    // Load the axe-core script
    const axe = require("axe-core");
    // Navigate to the provided URL
    await page.goto(url, { waitUntil: "networkidle0" });

    // Load the axe-core script
    const axeScript = axe.source; // This will give you the axe-core source

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
