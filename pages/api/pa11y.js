import pa11y from 'pa11y';

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      // Run Pa11y on the provided URL
      const results = await pa11y(url);

      // Return the results as JSON
      return res.status(200).json(results);
    } catch (error) {
      console.error('Pa11y error:', error);
      return res.status(500).json({ error: 'Failed to run accessibility tests' });
    }
  } else {
    // Handle any other HTTP method
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}