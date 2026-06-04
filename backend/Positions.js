import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/positions");
      setPositions(response.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update live prices
  const updateLivePrices = async () => {
    setUpdating(true);
    try {
      const response = await axios.post("http://localhost:3002/api/positions/update", {
        positions: positions
      });
      
      if (response.data.success) {
        setPositions(response.data.positions);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Auto update every 10 seconds
  useEffect(() => {
    if (positions.length > 0) {
      const interval = setInterval(updateLivePrices, 10000);
      return () => clearInterval(interval);
    }
  }, [positions.length]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Loading positions...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "15px"
      }}>
        <h3 className="title">Positions ({positions.length})</h3>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {lastUpdated && (
            <span style={{ fontSize: "11px", color: "#666" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={updateLivePrices} 
            disabled={updating}
            style={{
              padding: "5px 12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: updating ? "not-allowed" : "pointer",
              fontSize: "12px"
            }}
          >
            {updating ? "Updating..." : "🔄 Live Prices"}
          </button>
        </div>
      </div>

      <div className="order-table">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Instrument</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Qty.</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Avg.</th>
              <th style={{ padding: "12px", textAlign: "right" }}>LTP</th>
              <th style={{ padding: "12px", textAlign: "right" }}>P&L</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((stock, index) => {
              const currentValue = (stock.ltp || stock.price) * stock.qty;
              const costValue = stock.avg * stock.qty;
              const pnl = currentValue - costValue;
              const isProfit = pnl >= 0;
              const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;

              return (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{stock.product}</td>
                  <td style={{ padding: "12px", fontWeight: "500" }}>{stock.name}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>{stock.qty}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>₹{stock.avg.toFixed(2)}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                    ₹{(stock.ltp || stock.price).toFixed(2)}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "right",
                      color: isProfit ? "#28a745" : "#dc3545",
                      fontWeight: "bold"
                    }}
                  >
                    {isProfit ? "+" : ""}{pnl.toFixed(2)}
                    <span style={{ fontSize: "11px", marginLeft: "5px" }}>
                      ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
                    </span>
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "right",
                      color: stock.isLoss ? "#dc3545" : "#28a745"
                    }}
                  >
                    {stock.day}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {positions.length > 0 && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div>
            <strong>Total Positions:</strong> {positions.length}
          </div>
          <div>
            <strong>Total Investment:</strong> ₹
            {positions.reduce((sum, p) => sum + (p.avg * p.qty), 0).toFixed(2)}
          </div>
          <div>
            <strong>Current Value:</strong> ₹
            {positions.reduce((sum, p) => sum + ((p.ltp || p.price) * p.qty), 0).toFixed(2)}
          </div>
          <div>
            <strong>Total P&L:</strong> 
            <span style={{
              color: positions.reduce((sum, p) => sum + ((p.ltp || p.price) - p.avg) * p.qty, 0) >= 0 
                ? "green" : "red"
            }}>
              ₹{positions.reduce((sum, p) => sum + ((p.ltp || p.price) - p.avg) * p.qty, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Positions;