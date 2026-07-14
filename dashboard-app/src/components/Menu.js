import React, { useState } from "react";
import { Link } from "react-router-dom";
import tradenestLogo from "./tradenest.png";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(1);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "#387ed1",
    color: "#fff",
    textAlign: "center",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    transition: "0.3s",
    border: "none",
    cursor: "pointer",
    marginBottom: "12px",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#0056d2",
    boxShadow: "0 4px 12px rgba(56,126,209,0.4)",
  };

  return (
    <div className="menu-container">
      {/* Logo */}
      <div
        className="logo-section"
        style={{ textAlign: "center", marginBottom: "25px" }}
      >
        <img
          src={tradenestLogo}
          alt="TradeNest Logo"
          style={{ width: "130px" }}
        />
      </div>

      {/* Menu */}
      <div className="menus">
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li>
            <Link
              to="/orders"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(1)}
            >
              <div
                style={
                  selectedMenu === 1
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Orders
              </div>
            </Link>
          </li>

          <li>
            <Link
              to="/holdings"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(2)}
            >
              <div
                style={
                  selectedMenu === 2
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Holdings
              </div>
            </Link>
          </li>

          <li>
            <Link
              to="/positions"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(3)}
            >
              <div
                style={
                  selectedMenu === 3
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Positions
              </div>
            </Link>
          </li>
        </ul>

        <hr style={{ marginTop: "20px" }} />
      </div>
    </div>
  );
};

export default Menu;