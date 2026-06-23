const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const $ = cheerio.load(data);
    
    // This looks for the price on the page
    const price = $('.pdp-price').first().text();
    
    res.json({ price: price, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape' });
  }
});

app.listen(3000, () => console.log('Scraper running on port 3000'));