import React, { useState } from "react";

function Brokerage() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState(null);

  const calculateBrokerage = () => {
    const bp = parseFloat(buyPrice);
    const sp = parseFloat(sellPrice);
    const qty = parseInt(quantity);

    if (!bp || !sp || !qty) return;

    const turnover = (bp + sp) * qty;

    const brokerage = Math.min(20, turnover * 0.0003);
    const gst = brokerage * 0.18;
    const sebi = turnover * 0.0001;

    const totalCharges = brokerage + gst + sebi;
    const profit = (sp - bp) * qty - totalCharges;

    setResult({
      turnover: turnover.toFixed(2),
      brokerage: brokerage.toFixed(2),
      charges: totalCharges.toFixed(2),
      profit: profit.toFixed(2),
    });
  };

  return (<>
    <div style={{ padding: "60px 20px", background: "#f9fbff" }}>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          marginTop: "40px",
        }}
      >
        <img
          src="media/images/brockerage.png"
          alt="Brokerage Calculator"
          style={{ width: "1100px", maxWidth: "150%" }}
        />

        
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            width: "320px",
          }}
        >
          <input
            type="number"
            placeholder="Buy Price"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Sell Price"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyle}
          />

          <button onClick={calculateBrokerage} style={btnStyle}>
            Calculate
          </button>

          {result && (
            <div style={{ marginTop: "20px" }}>
              <p>Turnover: ₹{result.turnover}</p>
              <p>Brokerage: ₹{result.brokerage}</p>
              <p>Total Charges: ₹{result.charges}</p>
              <p
                style={{
                  color: result.profit >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                Profit: ₹{result.profit}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>);
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};
const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2962ff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
export default Brokerage;