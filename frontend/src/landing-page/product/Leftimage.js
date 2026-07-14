import React from 'react';

function Leftimage() {
  return (
    <React.Fragment>
    <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
          <h1>📊 Market Dashboard</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
            TradeNest provides a real-time market dashboard that aggregates and visualizes financial data in a structured format.
            It displays live price movements, trends, and key indicators to help users make informed trading decisions.
            The dashboard is optimized for high-frequency updates with minimal latency and efficient re-rendering.
          </p>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
          <img 
            src="media/images/dashboard.png" 
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        </div>

      </div>
    </div>
      <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
           <img 
            src="media/images/engine.png" 
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
           <h1>📈 Advanced Charting Engine</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
            The platform includes an interactive charting system for analyzing market trends. 
            Users can visualize historical and real-time data with multiple timeframes and indicators. 
            The charting module is designed to be scalable and can be extended with technical analysis tools.
          </p>
        </div>

      </div>
    </div>
     <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
          <h1>⚡ Order Execution Module</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
            The order execution system simulates real-world trading workflows including buy/sell operations. 
            It handles order placement, validation, and status tracking in a structured manner. 
            The architecture is designed to support both simulated and real broker integrations in the future. 
            Now provide for this realistic colourful highly dynamic suitable for white background</p>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
          <img 
            src="media/images/order.png" 
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        </div>

      </div>
    </div>
    <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
           <img 
            src="media/images/portfolio.png" 
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
           <h1>💼 Portfolio Management System</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
           TradeNest allows users to track their investments, holdings, and overall portfolio performance.
           It maintains structured records of transactions, profit/loss, and asset allocation.
           The system is designed for accuracy, consistency, and real-time synchronization.now provide for this
          </p>
        </div>

      </div>
    </div>
    </React.Fragment>
  );
}

export default Leftimage;
