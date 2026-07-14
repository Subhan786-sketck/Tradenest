import React, { useState } from "react";

const Dashboard = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isImageHovering, setIsImageHovering] = useState(false);

  const goToDashboard = () => {
    window.location.href = "http://localhost:3000/dashboard";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.heading}>Welcome to TradeNest</h1>
        <p style={styles.subtitle}>
          Experience a modern trading platform with powerful analytics and a
          seamless dashboard.
        </p>

        {/* Dashboard Image */}
        <div
          onClick={goToDashboard}
          onMouseEnter={() => setIsImageHovering(true)}
          onMouseLeave={() => setIsImageHovering(false)}
          style={{
            ...styles.imageWrapper,
            transform: isImageHovering ? "scale(1.05)" : "scale(1)",
          }}
        >
          <img
            src="media/images/dashboard.png"
            alt="Dashboard"
            style={styles.image}
          />
        </div>

        {/* Button */}
        <button
          onClick={goToDashboard}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            ...styles.button,
            backgroundColor: isHovering ? "#0056d2" : "#387ed1",
            transform: isHovering ? "scale(1.03)" : "scale(1)",
          }}
        >
           Launch Dashboard
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

card: {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "70px 60px",
  width: "100%",
  maxWidth: "700px",   
  textAlign: "center",
  boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
  border: "1px solid #eaeaea",
},

heading: {
  fontSize: "48px",
  fontWeight: "700",
  marginBottom: "20px",
  color: "#222",
},

subtitle: {
  color: "#666",
  fontSize: "22px",
  lineHeight: "1.7",
  marginBottom: "45px",
},
  imageWrapper: {
    display: "inline-block",
    cursor: "pointer",
    marginBottom: "35px",
    transition: "all 0.3s ease",
  },

 image: {
  width: "350px",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
},

button: {
  padding: "22px 70px",
  fontSize: "24px",
  fontWeight: "700",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 20px rgba(56,126,209,0.35)",
  minWidth: "380px",
},
};

export default Dashboard;