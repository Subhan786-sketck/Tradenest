import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
        <div className="container">

          {/* LOGO */}
          <Link className="navbar-brand" to="/">
            <img
              src="media/images/tradenest.png"
              alt="TradeNest Logo"
              style={{ width: "250px" }}
            />
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* NAV ITEMS */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">

              <li className="nav-item mx-2">
                <Link
                  className="btn btn-primary text-white"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link
                  className="btn btn-primary text-white"
                  to="/about"
                >
                  About
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link
                  className="btn btn-primary text-white"
                  to="/product"
                >
                  Products
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link
                  className="btn btn-primary text-white"
                  to="/pricing"
                >
                  Pricing
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link
                  className="btn btn-primary text-white"
                  to="/support"
                >
                  Support
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </React.Fragment>
  );
}

export default Navbar;