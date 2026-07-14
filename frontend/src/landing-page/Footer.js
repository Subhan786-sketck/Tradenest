import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(193, 217, 235)", marginTop: "50px" }}>
      <div className="container py-5">
        <div className="row">

          {/* Logo + Description */}
          <div className="col-md-3">
            <img
              src="media/images/tradenest.png"
              alt="TradeNest logo"
              style={{ width: "70%", marginBottom: "15px" }}
            />
          
          </div>

            <div className="col">
            <p>Company</p>
            <a href="">About</a>
            <br />
            <a href="">Products</a>
            <br />
            <a href="">Pricing</a>
            <br />
            <a href="">Referral programme</a>
            <br />
            <a href="">Careers</a>
            <br />
            <a href="">Zerodha.tech</a>
            <br />
            <a href="">Press & media</a>
            <br />
            <a href="">Zerodha cares (CSR)</a>
            <br />
          </div>
          <div className="col">
            <p>Support</p>
            <a href="">Contact</a>
            <br />
            <a href="">Support portal</a>
            <br />
            <a href="">Z-Connect blog</a>
            <br />
            <a href="">List of charges</a>
            <br />
            <a href="">Downloads & resources</a>
            <br />
          </div>
          <div className="col">
            <p>Account</p>
            <a href="">Open an account</a>
            <br />
            <a href="">Fund transfer</a>
            <br />
            <a href="">60 day challenge</a>
            <br />
          </div>

         

          
        </div>

        {/* Bottom Section */}
        <hr />

        <div className="text-center">
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            © 2024 TradeNest. All rights reserved.
          </p>
        </div>
      </div>
<div className="container mb-5 text-small text-muted">
  <p>
    TradeNest is a technology platform designed for market analysis, portfolio
    tracking, and trading simulations. TradeNest is not a registered stock
    broker, financial advisor, or investment intermediary and does not execute
    real securities transactions.
  </p>

  <p>
    Investments in the securities market are subject to market risks. Users
    should carefully read all related documents and understand the risks before
    making any investment decisions. TradeNest provides tools, analytics, and
    market data for educational and informational purposes only.
  </p>

  <p>
    To prevent unauthorized access to your account:
    <br />
    Keep your login credentials secure <br />
    Enable email verification for account activity <br />
    Monitor your account regularly for suspicious activity <br />
    If you notice any unauthorized activity, immediately contact the TradeNest
    support team.
  </p>

  <p>
    TradeNest does not provide stock tips or guaranteed investment returns. If
    anyone claims to represent TradeNest and offers trading services, portfolio
    management, or guaranteed profits, please report the incident immediately.
  </p>

  <p>
    TradeNest is built as a learning and market exploration platform to help
    users understand financial markets, analyze stocks, and track portfolios.
  </p>
</div>

    </footer>
  );
}

export default Footer;
