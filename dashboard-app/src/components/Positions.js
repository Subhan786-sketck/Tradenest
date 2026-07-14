import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [summary, setSummary] = useState({
    totalPositions: 0,
    totalInvestment: 0,
    totalCurrentValue: 0,
    totalPnL: 0
  });

  // API URLs
  const BACKEND_API = "http://localhost:3002/api";
  const YAHOO_API = "https://query1.finance.yahoo.com/v8/finance/chart";

  // 📌 Hardcoded stocks list (agar backend se kam aaye toh ye use honge)
  const DEFAULT_STOCKS = [
    { name: "RELIANCE", qty: 10, avg: 2450.50, product: "CNC" },
    { name: "TCS", qty: 5, avg: 3800.00, product: "CNC" },
    { name: "HDFCBANK", qty: 15, avg: 1650.75, product: "CNC" },
    { name: "INFOSYS", qty: 8, avg: 1520.25, product: "CNC" },
    { name: "ICICIBANK", qty: 20, avg: 980.00, product: "CNC" },
    { name: "WIPRO", qty: 25, avg: 450.50, product: "CNC" },
    { name: "SUNPHARMA", qty: 30, avg: 850.00, product: "CNC" },
    { name: "TATAMOTORS", qty: 40, avg: 650.00, product: "CNC" },
    { name: "MARUTI", qty: 6, avg: 10500.00, product: "CNC" },
    { name: "BAJAJFINSV", qty: 3, avg: 7200.00, product: "CNC" },
    { name: "ASIANPAINT", qty: 18, avg: 2800.00, product: "CNC" },
    { name: "HCLTECH", qty: 12, avg: 1200.00, product: "CNC" },
    { name: "ITC", qty: 50, avg: 430.00, product: "CNC" },
    { name: "SBIN", qty: 35, avg: 560.00, product: "CNC" },
    { name: "BHARTIARTL", qty: 22, avg: 1050.00, product: "CNC" },
    { name: "KOTAKBANK", qty: 8, avg: 1750.00, product: "CNC" },
    { name: "LT", qty: 12, avg: 2800.00, product: "CNC" },
    { name: "AXISBANK", qty: 25, avg: 1100.00, product: "CNC" },
    { name: "HINDUNILVR", qty: 15, avg: 2450.00, product: "CNC" },
    { name: "TITAN", qty: 7, avg: 3200.00, product: "CNC" }
  ];

  // =============================================
  // Yahoo Finance से लाइव प्राइस fetch करो
  // =============================================
  const fetchLivePriceFromYahoo = async (stockName) => {
    try {
      const symbol = `${stockName}.NS`;
      const url = `${YAHOO_API}/${symbol}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const result = response.data.chart.result[0];
      const currentPrice = result.meta.regularMarketPrice;
      
      return currentPrice;
      
    } catch (err) {
      console.error(`❌ ${stockName} price not found`);
      return null;
    }
  };

  // =============================================
  // सभी stocks के लिए live prices fetch करो
  // =============================================
  const fetchAllLivePrices = async (stocksList) => {
    const updatedStocks = await Promise.all(
      stocksList.map(async (stock) => {
        const livePrice = await fetchLivePriceFromYahoo(stock.name);
        const currentPrice = livePrice || stock.avg;
        const dayChange = ((currentPrice - stock.avg) / stock.avg) * 100;
        
        return {
          ...stock,
          id: stock.id || Math.random().toString(36).substr(2, 9),
          price: currentPrice,
          ltp: currentPrice,
          day: `${dayChange >= 0 ? '+' : ''}${dayChange.toFixed(2)}%`,
          isLoss: dayChange < 0,
          isYahooLive: livePrice !== null
        };
      })
    );
    
    return updatedStocks;
  };

  // =============================================
  // Main function - Backend + Default stocks merge
  // =============================================
  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError("");
      
      let stocksToShow = [];
      
      // 1️⃣ Try to get from backend
      try {
        const response = await axios.get(`${BACKEND_API}/positions`);
        console.log("📦 Backend data:", response.data);
        
        if (response.data && response.data.length > 0) {
          stocksToShow = response.data;
          console.log(`✅ ${stocksToShow.length} stocks from backend`);
        }
      } catch (backendErr) {
        console.log("⚠️ Backend not available, using default stocks");
      }
      
      // 2️⃣ Agar backend se kam stocks aaye toh default stocks add karo
      if (stocksToShow.length < DEFAULT_STOCKS.length) {
        console.log(`📌 Adding ${DEFAULT_STOCKS.length - stocksToShow.length} default stocks`);
        
        // Backend stocks ke names ka set banao
        const backendNames = new Set(stocksToShow.map(s => s.name));
        
        // Jo stocks backend me nahi hain, unhe default se add karo
        const additionalStocks = DEFAULT_STOCKS.filter(
          defaultStock => !backendNames.has(defaultStock.name)
        );
        
        stocksToShow = [...stocksToShow, ...additionalStocks];
      }
      
      console.log(`📊 Total stocks to show: ${stocksToShow.length}`);
      
      // 3️⃣ Yahoo Finance se live prices fetch karo
      const updatedPositions = await fetchAllLivePrices(stocksToShow);
      
      setPositions(updatedPositions);
      calculateSummary(updatedPositions);
      setLastUpdated(new Date());
      setError("");
      
      console.log(`✅ ${updatedPositions.length} positions loaded successfully!`);
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to fetch positions. Using default stocks.");
      
      // Error mein bhi default stocks dikhao
      const defaultWithPrices = await fetchAllLivePrices(DEFAULT_STOCKS);
      setPositions(defaultWithPrices);
      calculateSummary(defaultWithPrices);
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Update only live prices
  // =============================================
  const updateLivePrices = async () => {
    if (positions.length === 0) {
      alert("No positions to update");
      return;
    }
    
    setUpdating(true);
    try {
      const updatedPositions = await fetchAllLivePrices(positions);
      
      setPositions(updatedPositions);
      calculateSummary(updatedPositions);
      setLastUpdated(new Date());
      
      console.log("✅ Live prices updated!");
    } catch (err) {
      console.error("❌ Error updating prices:", err);
      alert("Failed to update prices");
    } finally {
      setUpdating(false);
    }
  };

  // =============================================
  // Calculate Summary
  // =============================================
  const calculateSummary = (positionsList) => {
    const totalPositions = positionsList.length;
    const totalInvestment = positionsList.reduce((sum, p) => sum + (p.avg * p.qty), 0);
    const totalCurrentValue = positionsList.reduce((sum, p) => sum + ((p.ltp || p.price) * p.qty), 0);
    const totalPnL = totalCurrentValue - totalInvestment;
    
    setSummary({
      totalPositions,
      totalInvestment,
      totalCurrentValue,
      totalPnL
    });
  };

  // =============================================
  // Sync with backend
  // =============================================
  const syncWithBackend = async () => {
    try {
      await axios.post(`${BACKEND_API}/positions/sync`, {
        positions: positions
      });
      console.log("✅ Backend synced!");
      alert("Positions synced with backend!");
    } catch (err) {
      console.error("❌ Sync error:", err);
      alert("Failed to sync with backend");
    }
  };

  // =============================================
  // Add new stock manually
  // =============================================
  const addNewStock = async () => {
    const name = prompt("Enter stock name (e.g., RELIANCE):");
    if (!name) return;
    
    const qty = prompt("Enter quantity:");
    if (!qty) return;
    
    const avg = prompt("Enter average price:");
    if (!avg) return;
    
    const newStock = {
      name: name.toUpperCase(),
      qty: Number(qty),
      avg: Number(avg),
      product: "CNC"
    };
    
    const livePrice = await fetchLivePriceFromYahoo(newStock.name);
    const currentPrice = livePrice || newStock.avg;
    const dayChange = ((currentPrice - newStock.avg) / newStock.avg) * 100;
    
    const newPosition = {
      ...newStock,
      id: Math.random().toString(36).substr(2, 9),
      price: currentPrice,
      ltp: currentPrice,
      day: `${dayChange >= 0 ? '+' : ''}${dayChange.toFixed(2)}%`,
      isLoss: dayChange < 0,
      isYahooLive: livePrice !== null
    };
    
    setPositions([...positions, newPosition]);
    calculateSummary([...positions, newPosition]);
  };

  // =============================================
  // Component mount
  // =============================================
  useEffect(() => {
    fetchPositions();
    
    const interval = setInterval(() => {
      if (positions.length > 0) {
        updateLivePrices();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // =============================================
  // Loading and Error States
  // =============================================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div>⏳ Loading positions...</div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          Fetching live prices from Yahoo Finance...
        </div>
      </div>
    );
  }

  // =============================================
  // Main UI Render
  // =============================================
  return (
    <div style={{ padding: "20px" }}>
      
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <h3 style={{ margin: 0 }}>
          📊 Positions 
          <span style={{ fontSize: "14px", color: "#666", marginLeft: "10px" }}>
            ({positions.length})
          </span>
          <span style={{ fontSize: "11px", color: "#999", marginLeft: "10px" }}>
            (Backend: {positions.filter(p => p.fromBackend).length || 'N/A'} + Yahoo: {positions.filter(p => !p.fromBackend).length || positions.length})
          </span>
        </h3>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          
          {lastUpdated && (
            <span style={{ fontSize: "11px", color: "#666" }}>
              🕐 Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          
          <button 
            onClick={addNewStock}
            style={{
              padding: "6px 16px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            ➕ Add Stock
          </button>
          
          <button 
            onClick={updateLivePrices} 
            disabled={updating}
            style={{
              padding: "6px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: updating ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            {updating ? "⏳ Updating..." : "🔄 Live Prices"}
          </button>
          
          <button 
            onClick={fetchPositions}
            style={{
              padding: "6px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            🔄 Refresh
          </button>
          
          <button 
            onClick={syncWithBackend}
            style={{
              padding: "6px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            💾 Sync
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {positions.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "20px"
        }}>
          <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>Total Positions</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{summary.totalPositions}</div>
          </div>
          
          <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>Total Investment</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.totalInvestment.toFixed(2)}</div>
          </div>
          
          <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>Current Value</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.totalCurrentValue.toFixed(2)}</div>
          </div>
          
          <div style={{ 
            padding: "15px", 
            backgroundColor: summary.totalPnL >= 0 ? "#d4edda" : "#f8d7da",
            borderRadius: "8px" 
          }}>
            <div style={{ fontSize: "12px", color: "#666" }}>Total P&L</div>
            <div style={{ 
              fontSize: "24px", 
              fontWeight: "bold",
              color: summary.totalPnL >= 0 ? "#28a745" : "#dc3545"
            }}>
              {summary.totalPnL >= 0 ? "+" : ""}₹{summary.totalPnL.toFixed(2)}
              <span style={{ fontSize: "14px", marginLeft: "5px" }}>
                ({summary.totalInvestment > 0 ? ((summary.totalPnL / summary.totalInvestment) * 100).toFixed(2) : 0}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Positions Table */}
      {positions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <p style={{ fontSize: "16px", color: "#666" }}>📭 No positions found</p>
          <button 
            onClick={fetchPositions}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            🔄 Load Default Stocks
          </button>
        </div>
      ) : (
        <div className="order-table" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>#</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Instrument</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Qty.</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Avg.</th>
                <th style={{ padding: "12px", textAlign: "right" }}>LTP</th>
                <th style={{ padding: "12px", textAlign: "right" }}>P&L</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Chg.</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((stock, index) => {
                const qty = Number(stock.qty) || 0;
                const avg = Number(stock.avg) || 0;
                const currentPrice = Number(stock.ltp || stock.price) || 0;
                
                const currentValue = currentPrice * qty;
                const costValue = avg * qty;
                const pnl = currentValue - costValue;
                const isProfit = pnl >= 0;
                const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;

                return (
                  <tr key={stock.id || index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "12px" }}>{stock.product || "CNC"}</td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {stock.name}
                      <span style={{ fontSize: "10px", color: "#999", marginLeft: "5px" }}>
                        (NSE)
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{qty}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>₹{avg.toFixed(2)}</td>
                    <td style={{ 
                      padding: "12px", 
                      textAlign: "right", 
                      fontWeight: "bold",
                      color: currentPrice > avg ? "#28a745" : currentPrice < avg ? "#dc3545" : "#666"
                    }}>
                      ₹{currentPrice.toFixed(2)}
                      {stock.isYahooLive && (
                        <span style={{ fontSize: "10px", color: "#28a745", marginLeft: "5px" }}>🟢</span>
                      )}
                    </td>
                    <td style={{ 
                      padding: "12px", 
                      textAlign: "right", 
                      color: isProfit ? "#28a745" : "#dc3545",
                      fontWeight: "bold"
                    }}>
                      {isProfit ? "+" : ""}₹{pnl.toFixed(2)}
                      <span style={{ fontSize: "11px", marginLeft: "5px" }}>
                        ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td style={{ 
                      padding: "12px", 
                      textAlign: "right", 
                      color: Number(stock.day?.replace('%', '')) >= 0 ? "#28a745" : "#dc3545",
                      fontWeight: "500"
                    }}>
                      {stock.day || "0%"}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontSize: "11px" }}>
                      {stock.fromBackend ? (
                        <span style={{ color: "#007bff" }}>Backend</span>
                      ) : (
                        <span style={{ color: "#28a745" }}>Yahoo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Footer Info */}
      <div style={{ 
        marginTop: "15px", 
        padding: "10px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "12px",
        color: "#666",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div>
          🔗 Data Source: {positions.filter(p => p.isYahooLive).length > 0 ? 'Yahoo Finance API' : 'Backend + Default Stocks'}
        </div>
        <div>
          {positions.length > 0 && `⏱️ Last sync: ${lastUpdated?.toLocaleString() || 'Never'}`}
        </div>
        <div>
          🟢 Live: {positions.filter(p => p.isYahooLive).length} stocks
        </div>
        <div>
          📦 Total: {positions.length} stocks
        </div>
      </div>
    </div>
  );
};

export default Positions;