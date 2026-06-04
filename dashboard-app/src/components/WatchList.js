import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import SellActionWindow from "./SellActionWindow";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const labels = watchlist.map((subArray) => subArray["name"]);

const WatchList = () => {
  const [holdings, setHoldings] = useState([]);
  const [holdingsMap, setHoldingsMap] = useState({});
  const [showSellWindow, setShowSellWindow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch holdings to check which stocks are owned
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get("http://localhost:3002/allHoldings");
        const holdingsData = response.data;
        setHoldings(holdingsData);
        
        const map = {};
        holdingsData.forEach(holding => {
          map[holding.name] = holding;
        });
        setHoldingsMap(map);
      } catch (err) {
        console.error("Error fetching holdings:", err);
      }
    };
    fetchHoldings();
  }, []);

  // Handle sell click
  const handleSellClick = (stock, holdingInfo, quantity) => {
    if (!holdingInfo || quantity === 0) {
      alert(`You don't own any shares of ${stock.name} to sell!`);
      return;
    }
    
    setSelectedStock({
      name: stock.name,
      holdingId: holdingInfo._id,
      currentQty: quantity,
      avgPrice: holdingInfo.price,
      ltp: stock.price
    });
    setShowSellWindow(true);
  };

  // Close sell window
  const handleCloseSellWindow = () => {
    setShowSellWindow(false);
    setSelectedStock(null);
    // Refresh holdings after sell
    const fetchHoldings = async () => {
      try {
        const response = await axios.get("http://localhost:3002/allHoldings");
        const holdingsData = response.data;
        const map = {};
        holdingsData.forEach(holding => {
          map[holding.name] = holding;
        });
        setHoldingsMap(map);
      } catch (err) {
        console.error("Error fetching holdings:", err);
      }
    };
    fetchHoldings();
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      {/* Sell Action Window - Direct Rendering */}
      {showSellWindow && selectedStock && (
        <SellActionWindow 
          uid={selectedStock.name}
          holdingInfo={{
            holdingId: selectedStock.holdingId,
            currentQty: selectedStock.currentQty,
            avgPrice: selectedStock.avgPrice
          }}
          onClose={handleCloseSellWindow}
        />
      )}

      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => {
          const holding = holdingsMap[stock.name];
          const quantity = holding ? holding.qty : 0;
          
          return (
            <WatchListItem 
              stock={stock} 
              key={index} 
              quantity={quantity}
              holdingInfo={holding}
              onSellClick={handleSellClick}
            />
          );
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, quantity, holdingInfo, onSellClick }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);
  const generalContext = useContext(GeneralContext);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  const handleBuyClick = () => {
    generalContext.openBuyWindow(stock.name);
  };

  const handleSellClick = () => {
    onSellClick(stock, holdingInfo, quantity);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">₹{stock.price.toFixed(2)}</span>
        </div>
        {quantity > 0 && (
          <span style={{ 
            fontSize: "11px", 
            color: "#666", 
            marginLeft: "10px",
            backgroundColor: "#e9ecef",
            padding: "2px 6px",
            borderRadius: "10px"
          }}>
            Holdings: {quantity}
          </span>
        )}
      </div>
      {showWatchlistActions && (
        <WatchListActions 
          onBuyClick={handleBuyClick}
          onSellClick={handleSellClick}
        />
      )}
    </li>
  );
};

const WatchListActions = ({ onBuyClick, onSellClick }) => {
  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="buy" onClick={onBuyClick}>Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell" onClick={onSellClick}>Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};