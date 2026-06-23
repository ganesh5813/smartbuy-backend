const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Evaluate the price directly on the page
    const price = await page.evaluate(() => {
      return document.querySelector('.pdp-price')?.innerText.trim();
    });
    
    await browser.close();
    res.json({ price: price, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape: ' + error.message });
  }
});

app.listen(3000, () => console.log('Scraper running on port 3000'));