import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const generalContext = useContext(GeneralContext);

  const calculateMargin = () => {
    const totalValue = Number(stockQuantity) * Number(stockPrice);
    return totalValue * 0.2;
  };

  const handleBuyClick = async () => {
    if (stockQuantity <= 0) {
      setError("Please enter valid quantity");
      return;
    }
    if (stockPrice <= 0) {
      setError("Please enter valid price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Place BUY order
      const orderResponse = await axios.post("http://localhost:3002/orders", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      });

      if (orderResponse.data.success) {
        console.log("✅ Order placed successfully");
        
        // 2. Update/Create holding in database
        // First check if holding exists
        const holdingsResponse = await axios.get("http://localhost:3002/allHoldings");
        const existingHolding = holdingsResponse.data.find(h => h.name === uid);
        
        if (existingHolding) {
          // Update existing holding
          const totalQty = existingHolding.qty + Number(stockQuantity);
          const totalValue = (existingHolding.price * existingHolding.qty) + (Number(stockPrice) * Number(stockQuantity));
          const newAvgPrice = totalValue / totalQty;
          
          await axios.put(`http://localhost:3002/holdings/${existingHolding._id}`, {
            qty: totalQty,
            price: newAvgPrice,
            ltp: Number(stockPrice)
          });
          console.log(`✅ Updated holding: ${uid} - New Qty: ${totalQty}, Avg: ₹${newAvgPrice.toFixed(2)}`);
        } else {
          // Create new holding
          await axios.post("http://localhost:3002/holdings", {
            name: uid,
            qty: Number(stockQuantity),
            price: Number(stockPrice),
            ltp: Number(stockPrice),
            net: "0.00",
            day: "0%",
            isLoss: false,
            dayChange: 0
          });
          console.log(`✅ Created new holding: ${uid} - Qty: ${stockQuantity}, Price: ₹${stockPrice}`);
        }
        
        generalContext.closeBuyWindow();
        window.location.reload();
      } else {
        setError("Failed to place order");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  const margin = calculateMargin();
  const totalValue = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              min="1"
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
              min="0.01"
            />
          </fieldset>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "5px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div className="buttons">
        <span>
          {stockPrice > 0 ? (
            <>
              Total: ₹{totalValue} | Margin (20%): ₹{margin.toFixed(2)}
            </>
          ) : (
            "Enter price to calculate margin"
          )}
        </span>
        <div>
          <button 
            className="btn btn-blue" 
            onClick={handleBuyClick}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Placing..." : "Buy"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;