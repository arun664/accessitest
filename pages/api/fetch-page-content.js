// pages/api/fetch-page-content.js
export default async function handler(req, res) {
    const { url } = req.query;
  
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
  
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch page content.' });
      }
  
      const html = await response.text();
      res.status(200).send(html);
    } catch (error) {
      console.error('Error fetching page content:', error);
      res.status(500).json({ error: 'Failed to fetch page content.' });
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
  