import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch positions from backend
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3002/api/positions");
      
      console.log("📦 Raw API Response:", response.data);
      
      if (response.data && response.data.length > 0) {
        // Check if qty exists
        response.data.forEach((pos, idx) => {
          console.log(`Position ${idx}:`, {
            name: pos.name,
            qty: pos.qty,
            avg: pos.avg,
            price: pos.price
          });
        });
        setPositions(response.data);
        setError("");
      } else {
        setPositions([]);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  // Update live prices
  const updateLivePrices = async () => {
    if (positions.length === 0) return;
    
    setUpdating(true);
    try {
      const response = await axios.post("http://localhost:3002/api/positions/update", {
        positions: positions
      });
      
      if (response.data.success) {
        setPositions(response.data.positions);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error updating prices:", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading positions...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <p>{error}</p>
        <button onClick={fetchPositions}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 className="title">Positions ({positions.length})</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {lastUpdated && <span style={{ fontSize: "11px", color: "#666" }}>Updated: {lastUpdated.toLocaleTimeString()}</span>}
          <button onClick={updateLivePrices} disabled={updating} style={{ padding: "5px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {updating ? "Updating..." : "🔄 Live Prices"}
          </button>
          <button onClick={fetchPositions} style={{ padding: "5px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {positions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No positions found</p>
        </div>
      ) : (
        <>
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
                  // Safely access values with fallbacks
                  const qty = Number(stock.qty) || 0;
                  const avg = Number(stock.avg) || 0;
                  const currentPrice = Number(stock.ltp || stock.price) || 0;
                  
                  const currentValue = currentPrice * qty;
                  const costValue = avg * qty;
                  const pnl = currentValue - costValue;
                  const isProfit = pnl >= 0;
                  const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;

                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>{stock.product || "CNC"}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{stock.name}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{qty}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>₹{avg.toFixed(2)}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>₹{currentPrice.toFixed(2)}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: isProfit ? "#28a745" : "#dc3545" }}>
                        {isProfit ? "+" : ""}{pnl.toFixed(2)}
                        <span style={{ fontSize: "11px", marginLeft: "5px" }}>
                          ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", color: stock.isLoss ? "#dc3545" : "#28a745" }}>
                        {stock.day || "0%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {positions.length > 0 && (
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
              <div><strong>Total Positions:</strong> {positions.length}</div>
              <div><strong>Total Investment:</strong> ₹{positions.reduce((sum, p) => sum + ((Number(p.avg) || 0) * (Number(p.qty) || 0)), 0).toFixed(2)}</div>
              <div><strong>Current Value:</strong> ₹{positions.reduce((sum, p) => sum + ((Number(p.ltp || p.price) || 0) * (Number(p.qty) || 0)), 0).toFixed(2)}</div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Positions;