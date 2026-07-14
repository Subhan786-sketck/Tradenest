require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const { OrdersModel } = require('./models/OrdersModel');
const { HoldingsModel } = require('./models/HoldingsModel');
const { PositionsModel } = require('./models/PositionsModel');

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());


// ==================== GET ALL HOLDINGS ====================

app.get('/allHoldings', async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==================== GET ALL POSITIONS ====================

app.get('/allPositions', async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==================== GET ALL ORDERS ====================

app.get('/orders', async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ timestamp: -1 }); // Latest first
    res.json(allOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==================== GET SINGLE ORDER BY ID ====================

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await OrdersModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==================== PLACE NEW ORDER ====================

app.post('/orders', async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Validation
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({
        message: 'Missing required fields: name, qty, price, mode'
      });
    }

    if (qty <= 0 || price <= 0) {
      return res.status(400).json({
        message: 'Quantity and price must be greater than 0'
      });
    }

    if (mode !== 'BUY' && mode !== 'SELL') {
      return res.status(400).json({
        message: 'Mode must be either BUY or SELL'
      });
    }

    const newOrder = new OrdersModel({
      name,
      qty: Number(qty),
      price: Number(price),
      mode,
      timestamp: new Date()
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================== UPDATE ORDER ====================

app.put('/orders/:id', async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        qty: Number(qty),
        price: Number(price),
        mode,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================== DELETE ORDER ====================

app.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully',
      order: deletedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================== GET ORDERS BY STOCK NAME ====================

app.get('/orders/stock/:name', async (req, res) => {
  try {
    const orders = await OrdersModel.find({ name: req.params.name });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==================== FETCH STOCK FROM FINNHUB + UPDATE MONGODB ====================

app.get('/stock/finnhub/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    
    // For Indian stocks, add NSE: prefix
    let finnhubSymbol = symbol;
    const indianStocks = ['INFOSYS', 'TCS', 'RELIANCE', 'HDFC', 'WIPRO', 'INFY'];
    
    if (indianStocks.includes(symbol.toUpperCase()) || symbol === 'Infosys' || symbol === 'TCS') {
      finnhubSymbol = `NSE:${symbol}`;
    }

    const response = await axios.get(
      'https://finnhub.io/api/v1/quote',
      {
        params: {
          symbol: finnhubSymbol,
          token: process.env.FINNHUB_API_KEY,
        },
      }
    );

    const currentPrice = response.data?.c;  // Current price
    const change = response.data?.d;         // Change
    const changePercent = response.data?.dp; // Change percent

    console.log(`Finnhub Response for ${symbol}:`, {
      currentPrice,
      change,
      changePercent
    });

    if (currentPrice) {
      const updatedHolding = await HoldingsModel.findOneAndUpdate(
        { name: symbol },
        {
          ltp: Number(currentPrice),
          price: Number(currentPrice),
          net: change ? `${change > 0 ? '+' : ''}${change.toFixed(2)}` : '0',
          day: changePercent ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '0%',
          isLoss: change < 0,
          lastUpdated: new Date()
        },
        {
          new: true,
        }
      );

      console.log('✅ Updated Holding in MongoDB:', updatedHolding?.name, 'Price:', currentPrice);
      
      res.json({
        success: true,
        symbol: symbol,
        finnhubSymbol: finnhubSymbol,
        data: response.data,
        holding: updatedHolding
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No data received from Finnhub',
        response: response.data
      });
    }
  } catch (error) {
    console.error('Finnhub API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock data from Finnhub',
      error: error.message
    });
  }
});


// ==================== UPDATE ALL HOLDINGS USING FINNHUB ====================

app.post('/stock/update-all-finnhub', async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    const results = [];
    
    for (const holding of allHoldings) {
      try {
        let finnhubSymbol = holding.name;
        const indianStocks = ['Infosys', 'TCS', 'RELIANCE', 'HDFC', 'WIPRO'];
        
        if (indianStocks.includes(holding.name)) {
          finnhubSymbol = `NSE:${holding.name}`;
        }
        
        const response = await axios.get(
          'https://finnhub.io/api/v1/quote',
          {
            params: {
              symbol: finnhubSymbol,
              token: process.env.FINNHUB_API_KEY,
            },
          }
        );
        
        const currentPrice = response.data?.c;
        const change = response.data?.d;
        const changePercent = response.data?.dp;
        
        if (currentPrice) {
          const updated = await HoldingsModel.findOneAndUpdate(
            { name: holding.name },
            {
              ltp: Number(currentPrice),
              price: Number(currentPrice),
              net: change ? `${change > 0 ? '+' : ''}${change.toFixed(2)}` : '0',
              day: changePercent ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '0%',
              isLoss: change < 0,
              lastUpdated: new Date()
            },
            { new: true }
          );
          
          results.push({
            symbol: holding.name,
            success: true,
            oldPrice: holding.price,
            newPrice: currentPrice,
            change: change
          });
          
          console.log(`✅ Updated ${holding.name}: ${holding.price} → ${currentPrice}`);
        } else {
          results.push({
            symbol: holding.name,
            success: false,
            message: 'No price data'
          });
        }
        
        // Wait 1 second to avoid rate limiting (60 calls/minute)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error updating ${holding.name}:`, error.message);
        results.push({
          symbol: holding.name,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      total: allHoldings.length,
      updated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      details: results
    });
    
  } catch (error) {
    console.error('Update all error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==================== ALPHA VANTAGE ENDPOINT (Existing) ====================

app.get('/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: process.env.ALPHA_VANTAGE_KEY,
        },
      }
    );

    const price = response.data?.['Global Quote']?.['05. price'];
    const change = response.data?.['Global Quote']?.['09. change'];
    const changePercent = response.data?.['Global Quote']?.['10. change percent'];

    if (price) {
      const updatedHolding = await HoldingsModel.findOneAndUpdate(
        { name: symbol },
        {
          ltp: Number(price),
          price: Number(price),
          net: change,
          day: changePercent,
          isLoss: parseFloat(change) < 0,
          lastUpdated: new Date()
        },
        {
          new: true,
        }
      );

      console.log('Updated Holding (Alpha Vantage):', updatedHolding?.name, 'Price:', price);
    }

    res.json(response.data);
  } catch (error) {
    console.error('Stock API Error:', error);

    res.status(500).json({
      message: 'Failed to fetch stock data',
    });
  }
});

// ==================== DELETE HOLDING (when selling all shares) ====================

app.delete('/holdings/:id', async (req, res) => {
  try {
    const deletedHolding = await HoldingsModel.findByIdAndDelete(req.params.id);
    
    if (!deletedHolding) {
      return res.status(404).json({ success: false, message: 'Holding not found' });
    }
    
    res.json({
      success: true,
      message: 'Holding deleted successfully',
      holding: deletedHolding
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==================== CREATE HOLDING WHILE BUYING ====================

app.post('/holdings', async (req, res) => {
  try {
    const { name, qty, price, ltp, net, day, isLoss, dayChange } = req.body;
    
    console.log("📝 Creating holding:", { name, qty, price });
    
    const newHolding = new HoldingsModel({
      name,
      qty: Number(qty),
      price: Number(price),
      ltp: Number(ltp || price),
      net: net || "0.00",
      day: day || "0%",
      isLoss: isLoss || false,
      dayChange: dayChange || 0
    });
    
    await newHolding.save();
    console.log("✅ Holding created:", name);
    
    res.status(201).json({ success: true, message: 'Holding created', holding: newHolding });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== UPDATE HOLDING WHILE BUYING ====================

app.put('/holdings/:id', async (req, res) => {
  try {
    const { qty, price, ltp } = req.body;
    
    console.log("📝 Updating holding:", req.params.id, { qty, price });
    
    const updatedHolding = await HoldingsModel.findByIdAndUpdate(
      req.params.id,
      { qty, price, ltp },
      { new: true }
    );
    
    console.log("✅ Holding updated:", updatedHolding.name);
    
    res.json({ success: true, message: 'Holding updated', holding: updatedHolding });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== UPDATE HOLDING QUANTITY (when selling partial shares) ====================

app.put('/holdings/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    
    const updatedHolding = await HoldingsModel.findByIdAndUpdate(
      req.params.id,
      { qty: qty },
      { new: true }
    );
    
    if (!updatedHolding) {
      return res.status(404).json({ success: false, message: 'Holding not found' });
    }
    
    res.json({
      success: true,
      message: 'Holding updated successfully',
      holding: updatedHolding
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== POSITIONS ROUTES ====================

const yahooFinance = require('yahoo-finance2');

// 1. GET all positions (static se ya DB se)
app.get('/api/positions', async (req, res) => {
  try {
    // Pehle DB se try karega
    const dbPositions = await PositionsModel.find({});
    
    if (dbPositions && dbPositions.length > 0) {
      return res.json(dbPositions);
    }
    
    // otherwise static data import karega
    const { positions } = require('./data/data');
    res.json(positions);
    
  } catch (error) {
    const { positions } = require('./data/data');
    res.json(positions);
  }
});

// 2. GET live prices for positions
app.get('/api/positions/live/:symbol', async (req, res) => {
  try {
    let symbol = req.params.symbol;
    const nseStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'WIPRO', 'SBIN', 'ITC'];
    
    if (nseStocks.includes(symbol)) {
      symbol = `${symbol}.NS`;
    }
    
    const quote = await yahooFinance.quote(symbol);
    
    res.json({
      symbol: req.params.symbol,
      ltp: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. UPDATE all positions with live prices
app.post('/api/positions/update', async (req, res) => {
  try {
    const { positions } = req.body;
    const updatedPositions = [];
    
    for (const pos of positions) {
      try {
        let symbol = pos.name;
        const nseStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'WIPRO', 'SBIN', 'ITC'];
        
        if (nseStocks.includes(symbol)) {
          symbol = `${symbol}.NS`;
        }
        
        const quote = await yahooFinance.quote(symbol);
        const currentPrice = quote.regularMarketPrice;
        const changePercent = quote.regularMarketChangePercent;
        
        const currentValue = currentPrice * pos.qty;
        const costValue = pos.avg * pos.qty;
        const pnl = currentValue - costValue;
        const pnlPercent = (pnl / costValue) * 100;
        
        updatedPositions.push({
          ...pos,
          ltp: currentPrice,
          price: currentPrice,
          day: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          net: `${pnlPercent > 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`,
          isLoss: changePercent < 0
        });
        
        // Rate limit - 1 second delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        updatedPositions.push(pos);
      }
    }
    
    res.json({
      success: true,
      positions: updatedPositions
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Simple bulk price fetch
app.post('/api/positions/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    const prices = {};
    
    for (const symbol of symbols) {
      try {
        let yahooSymbol = symbol;
        const nseStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'WIPRO', 'SBIN', 'ITC'];
        
        if (nseStocks.includes(symbol)) {
          yahooSymbol = `${symbol}.NS`;
        }
        
        const quote = await yahooFinance.quote(yahooSymbol);
        
        prices[symbol] = {
          ltp: quote.regularMarketPrice,
          changePercent: quote.regularMarketChangePercent
        };
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        prices[symbol] = { ltp: 0, changePercent: 0 };
      }
    }
    
    res.json(prices);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await mongoose.connect(url);
    console.log('✅ Connected to MongoDB');
    console.log('✅ Finnhub API Key:', process.env.FINNHUB_API_KEY ? 'Configured' : 'Missing');
    console.log('✅ Alpha Vantage Key:', process.env.ALPHA_VANTAGE_KEY ? 'Configured' : 'Missing');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
});