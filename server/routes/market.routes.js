const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/coins', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ error: 'Failed to fetch coin data' });
  }
});

module.exports = router;
