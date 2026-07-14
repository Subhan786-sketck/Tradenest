import React from "react";
import CreateTicket from "./CreateTicket";

function Heros() {
  return (
    <React.Fragment>
      <div className="container border-bottom">
        <div className="row align-items-center p-5 mt-5 border-top">

          {/* LEFT SIDE */}
          <div className="col-md-6">
            <h1 style={{ fontSize: "44px", fontWeight: "700", color: "#222" }}>
              How can we help you? 🤝
            </h1>

            <p className="mt-4 text-muted" style={{ fontSize: "18px", lineHeight: "1.6" }}>
              Get quick solutions for your trading, account, and brokerage queries. 
              Our support team is here to assist you anytime.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-4">
              <input
                type="text"
                className="form-control p-3"
                placeholder="Search your issue (e.g. brokerage, withdrawal...)"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src="media/images/support.png"
              alt="Support Illustration"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>

        </div>
      </div>
      <CreateTicket/>
    </React.Fragment>
  );
}

export default Heros;
