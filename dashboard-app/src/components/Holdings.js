import React, { useEffect, useState } from "react";
import axios from "axios";
import { holdings as staticHoldings } from "../data/data";

// Import SellActionWindow directly
import SellActionWindow from "./SellActionWindow";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingStaticData, setUsingStaticData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // State for Sell Window
  const [showSellWindow, setShowSellWindow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch holdings from API
  const fetchHoldings = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get("http://localhost:3002/allHoldings");
      
      if (response.data && response.data.length > 0) {
        setHoldings(response.data);
        setUsingStaticData(false);
        setLastUpdated(new Date());
        console.log("✅ Using API data:", response.data.length, "holdings");
      } else {
        console.log("⚠️ API returned empty, using static data from file");
        setHoldings(staticHoldings);
        setUsingStaticData(true);
        setError("No holdings found in database. Showing sample data.");
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching holdings:", err);
      setHoldings(staticHoldings);
      setUsingStaticData(true);
      setError("Failed to fetch from API. Showing sample data from file.");
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const refreshHoldings = () => {
    fetchHoldings();
  };

  // Handle sell button click - opens sell window
  const handleSellClick = (stock) => {
    console.log("Opening sell window for:", stock.name);
    setSelectedStock(stock);
    setShowSellWindow(true);
  };

  // Close sell window and refresh
  const handleCloseSellWindow = () => {
    setShowSellWindow(false);
    setSelectedStock(null);
    refreshHoldings(); // Refresh after selling
  };

  // Calculate totals
  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalCurrentValue = holdings.reduce((sum, stock) => sum + (stock.ltp * stock.qty), 0);
  const totalPL = totalCurrentValue - totalInvestment;
  const totalPLPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const todaysPL = holdings.reduce((sum, stock) => sum + (stock.dayChange || 0), 0);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
        <p>Loading holdings...</p>
      </div>
    );
  }

  return (
    <>
      {/* Sell Action Window - Direct Rendering */}
      {showSellWindow && selectedStock && (
        <SellActionWindow 
          uid={selectedStock.name}
          holdingInfo={{
            holdingId: selectedStock._id,
            currentQty: selectedStock.qty,
            avgPrice: selectedStock.price
          }}
          onClose={handleCloseSellWindow}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h3 className="title">
          Holdings ({holdings.length})
          {usingStaticData && (
            <span style={{ fontSize: "12px", color: "#ff9800", marginLeft: "10px" }}>
              ⚡ Sample Data
            </span>
          )}
        </h3>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {lastUpdated && (
            <span style={{ fontSize: "11px", color: "#666" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {usingStaticData && (
            <button 
              onClick={refreshHoldings}
              style={{
                padding: "5px 12px",
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              🔄 Try API Again
            </button>
          )}
          <button 
            onClick={refreshHoldings}
            style={{
              padding: "5px 12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: "#ff9800", 
          fontSize: "12px", 
          marginBottom: "10px",
          marginTop: "10px",
          padding: "8px",
          backgroundColor: "#fff3cd",
          borderRadius: "4px",
          borderLeft: "4px solid #ff9800"
        }}>
          ⚠️ {error}
        </div>
      )}

      {holdings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No holdings found</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            Buy some stocks to see them in your holdings
          </p>
        </div>
      ) : (
        <>
          <div className="holdings-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Instrument</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Qty.</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Avg. Cost</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>LTP</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Cur. Val</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>P&L</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Net Chg.</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Day Chg.</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((stock, index) => {
                  const currentValue = stock.ltp * stock.qty;
                  const investment = stock.price * stock.qty;
                  const pnl = currentValue - investment;
                  const isProfit = pnl >= 0;
                  const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

                  return (
                    <tr key={stock._id || index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {stock.name}
                        <span style={{ fontSize: "11px", color: "#666", marginLeft: "8px" }}>
                          {stock.isin || ""}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{stock.qty}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>₹{stock.price.toFixed(2)}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                        ₹{stock.ltp?.toFixed(2) || stock.price.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>₹{currentValue.toFixed(2)}</td>
                      <td 
                        style={{ 
                          padding: "12px", 
                          textAlign: "right",
                          color: isProfit ? "#28a745" : "#dc3545",
                          fontWeight: "bold"
                        }}
                      >
                        {isProfit ? "+" : ""}{pnl.toFixed(2)}
                        <span style={{ fontSize: "11px", marginLeft: "5px", fontWeight: "normal" }}>
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
                        {stock.net || "0.00"}
                      </td>
                      <td 
                        style={{ 
                          padding: "12px", 
                          textAlign: "right",
                          color: stock.day?.startsWith("-") ? "#dc3545" : "#28a745"
                        }}
                      >
                        {stock.day || "0%"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => handleSellClick(stock)}
                          disabled={stock.qty === 0}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "4px",
                            cursor: stock.qty === 0 ? "not-allowed" : "pointer",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div style={{ 
            marginTop: "20px", 
            padding: "15px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px"
          }}>
            <div>
              <strong>📊 Total Holdings:</strong> {holdings.length}
            </div>
            <div>
              <strong>💰 Total Investment:</strong> ₹{totalInvestment.toFixed(2)}
            </div>
            <div>
              <strong>📈 Current Value:</strong> ₹{totalCurrentValue.toFixed(2)}
            </div>
            <div>
              <strong>📉 Total P&L:</strong> 
              <span style={{
                color: totalPL >= 0 ? "#28a745" : "#dc3545",
                fontWeight: "bold",
                marginLeft: "5px"
              }}>
                {totalPL >= 0 ? "+" : ""}₹{totalPL.toFixed(2)}
                <span style={{ fontSize: "11px", marginLeft: "3px" }}>
                  ({totalPL >= 0 ? "+" : ""}{totalPLPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
            <div>
              <strong>📅 Today's P&L:</strong>
              <span style={{
                color: todaysPL >= 0 ? "#28a745" : "#dc3545",
                fontWeight: "bold",
                marginLeft: "5px"
              }}>
                {todaysPL >= 0 ? "+" : ""}₹{todaysPL.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Holdings;