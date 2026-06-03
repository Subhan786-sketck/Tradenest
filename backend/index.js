require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const { OrdersModel } = require('./models/OrdersModel');
const { HoldingsModel } = require('./models/HoldingsModel');
const { PositionsModel } = require('./models/PositionsModel');
const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.get('/addHoldings', async (req, res) => {
//   let tempPositions =[
//     {
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   ];
//  tempPositions.forEach((item) => {
//   let newPosition = new PositionsModel({
//     product: item.product,
//     name: item.name,
//     avg: item.avg,
//     price: item.price,
//     net: item.net,
//     day: item.day,
//     isLoss: item.isLoss,
//   });
//   newPosition.save();
//  });
//  res.send("Holdings added to database");
// });

app.get('/allHoldings', async (req, res) => {
let allHoldings = await HoldingsModel.find({});
res.json(allHoldings);
});

app.get('/allPositions', async (req, res) => {
let allPositions = await PositionsModel.find({});
res.json(allPositions);
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
});