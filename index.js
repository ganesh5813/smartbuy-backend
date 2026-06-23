const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  try {
    const { data } = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      }
    });
    
    const $ = cheerio.load(data);
    
    // Target the specific pdp-price class and get the text
    const priceText = $('.pdp-price').text().trim();
    const title = $('h1.pdp-title').text().trim();
    
    res.json({ 
      title: title || "Product Title Not Found",
      price: priceText, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape', message: error.message });
  }
});

app.listen(3000, () => console.log('Scraper running on port 3000'));