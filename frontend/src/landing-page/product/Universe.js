import React from "react";

function Universe() {
  const universeContent = {
    title: "The TradeNest Universe",
    subtitle:
      "Everything you need to trade smarter, faster, and better — all in one powerful ecosystem.",

    platforms: [
      {
        name: "Trade Terminal",
        desc: "Advanced trading interface with real-time data and lightning-fast execution.",
      },
      {
        name: "Analytics AI",
        desc: "AI-driven insights to help you identify trends and make better decisions.",
      },
      {
        name: "Portfolio Tracker",
        desc: "Track, analyze, and optimize your investments in one place.",
      },
      {
        name: "Learning Hub",
        desc: "Master trading with curated resources, tutorials, and strategies.",
      },
      {
        name: "API Access",
        desc: "Build and automate your own trading strategies with robust APIs.",
      },
      {
        name: "Community",
        desc: "Connect with traders, share ideas, and grow together.",
      },
    ],

    highlight:
      "TradeNest isn’t just a platform — it’s your complete trading ecosystem.",
  };

  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
        {universeContent.title}
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "40px" }}>
        {universeContent.subtitle}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {universeContent.platforms.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              background: "#fff",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{item.name}</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: "40px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {universeContent.highlight}
      </p>
    </div>
  );
}

export default Universe;
