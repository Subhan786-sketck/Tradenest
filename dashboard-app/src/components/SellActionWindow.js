import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid, holdingInfo = {}, onClose }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const generalContext = useContext(GeneralContext);

  const totalValue = Number(stockQuantity) * Number(stockPrice);

  const handleSellClick = async () => {
    if (stockQuantity <= 0) {
      setError("Please enter valid quantity");
      return;
    }
    if (stockPrice <= 0) {
      setError("Please enter valid price");
      return;
    }
    if (stockQuantity > (holdingInfo.currentQty || 0)) {
      setError(`You only have ${holdingInfo.currentQty || 0} shares to sell`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Place SELL order
      const orderResponse = await axios.post("http://localhost:3002/orders", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "SELL",
      });

      if (orderResponse.data.success) {
        console.log("✅ Sell order placed successfully");
        
        // 2. Update holdings (reduce quantity or delete if all sold)
        const remainingQty = (holdingInfo.currentQty || 0) - stockQuantity;
        
        if (remainingQty <= 0) {
          // Delete holding if all shares are sold
          if (holdingInfo.holdingId) {
            await axios.delete(`http://localhost:3002/holdings/${holdingInfo.holdingId}`);
            console.log(`✅ All ${uid} shares sold, holding deleted`);
          }
        } else {
          // Update holding quantity
          if (holdingInfo.holdingId) {
            await axios.put(`http://localhost:3002/holdings/${holdingInfo.holdingId}`, {
              qty: remainingQty
            });
            console.log(`✅ Sold ${stockQuantity} shares of ${uid}. Remaining: ${remainingQty}`);
          }
        }
        
        // Close window and refresh
        if (onClose) {
          onClose();
        }
        generalContext.closeSellWindow();
        window.location.reload();
      } else {
        setError("Failed to place sell order");
      }
    } catch (err) {
      console.error("Error in sell order:", err);
      setError(err.response?.data?.message || "Failed to place sell order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (onClose) {
      onClose();
    }
    generalContext.closeSellWindow();
  };

  return (
    <div className="sell-container" id="sell-window">
      <div className="sell-regular-order">
        <div className="sell-header">
          <h3>Sell {uid}</h3>
          <button className="sell-close-btn" onClick={handleCancelClick}>×</button>
        </div>

        <div className="sell-inputs">
          <fieldset>
            <legend>Qty. (Max: {holdingInfo.currentQty || 0})</legend>
            <input
              type="number"
              name="qty"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
              min="1"
              max={holdingInfo.currentQty || 0}
              autoFocus
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
              min="0.01"
            />
          </fieldset>
        </div>

        {error && (
          <div className="sell-error" style={{ color: "red", fontSize: "12px", marginTop: "5px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div className="sell-info">
          <div className="sell-detail">
            <span>Available to sell:</span>
            <strong>{holdingInfo.currentQty || 0} shares</strong>
          </div>
          <div className="sell-detail">
            <span>Total Value:</span>
            <strong>₹{totalValue.toFixed(2)}</strong>
          </div>
          <div className="sell-detail">
            <span>You will receive:</span>
            <strong style={{ color: "#28a745" }}>₹{totalValue.toFixed(2)}</strong>
          </div>
        </div>

        <div className="sell-buttons">
          <button 
            className="btn-sell" 
            onClick={handleSellClick}
            disabled={loading}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              flex: 1
            }}
          >
            {loading ? "Processing..." : "Confirm Sell"}
          </button>
          <button 
            className="btn-cancel" 
            onClick={handleCancelClick}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;