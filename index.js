const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // This tells puppeteer to use the Chrome browser already installed on the server
    const browser = await puppeteer.launch({ 
      executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    const productData = await page.evaluate(() => {
      // Robust selectors for Myntra
      const title = document.querySelector('h1.pdp-title')?.innerText || 'Title Not Found';
      const brand = document.querySelector('h3.pdp-name')?.innerText || 'Brand Not Found';
      const price = document.querySelector('span.pdp-price')?.innerText.trim() || 'Price Not Found';
      
      return { title, brand, price };
    });
    
    await browser.close();
    
    res.json({ 
      title: productData.title,
      brand: productData.brand,
      modelNumber: 'N/A', // We can extract this later if needed
      prices: [{ store: 'Myntra', price: productData.price, url: url }],
      success: true 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed: ' + error.message });
  }
});

app.listen(3000, () => console.log('Scraper running on port 3000'));