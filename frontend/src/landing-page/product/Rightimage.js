import React from 'react';

function Rightimage() {
  return (
    <React.Fragment>
    <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
          <h1>🔐 Authentication & User Management</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
           TradeNest includes a secure authentication system for managing user sessions and access control. 
           It ensures that user data, transactions, and account details remain protected. 
           The module is designed with scalability to support multiple users concurrently.
          </p>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
          <img 
            src="media/images/authentication.png" 
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
            src="media/images/api.png" 
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
           <h1>🔌 API Integration Layer</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
            🔌
The platform is built with a modular API layer that allows integration with external trading services.
It supports seamless data exchange between frontend and backend systems.
This makes TradeNest extensible for future integration with broker APIs like Zerodha.
          </p>
        </div>

      </div>
    </div>
     <div className="container-fluid px-5">
      <div className="row align-items-center">

        {/* LEFT - TEXT */}
        <div className="col-md-6">
          <h1>🚀 Performance & Scalability Layer</h1>
          <p className="mt-4" style={{ fontSize: "22px", lineHeight: "1.8" }}>
           TradeNest is optimized using modern frontend and backend performance techniques. 
           This includes efficient state management, lazy loading, and API optimization. 
           The system is designed to handle increasing user load without degrading performance.</p>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="col-md-6 text-end">
          <img 
            src="media/images/performance.png"            
            alt="Market Dashboard" 
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        </div>

      </div>
    </div>
    
    </React.Fragment>
  );
}

export default Rightimage;
