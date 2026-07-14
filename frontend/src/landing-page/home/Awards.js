import React from "react";

function Awards() {
  return (
    <React.Fragment>

      <div className="container-fluid mt-5">
        <div className="row align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src="media/images/awards.png"
              alt="Awards"
              style={{ width: "100%",  }}
            />
          </div>

          {/* RIGHT TEXT */}
          <div className="col-md-6">

            <h1 style={{ fontSize: "48px", fontWeight: "700" }}>
              Largest stock broker in India
            </h1>

            <p
              className="mb-4"
              style={{ fontSize: "22px", lineHeight: "1.8", maxWidth: "650px" }}
            >
              2+ million clients contribute over 15% of all retail order volumes
              in India daily by trading and investing in:
            </p>

            <ul style={{ fontSize: "20px", lineHeight: "2" }}>
              <li>Lowest fees in the industry</li>
              <li>Best customer support</li>
              <li>Advanced trading platform</li>
            </ul>

            <img
              src="media/images/pressLogos.png"
              alt="Press Logos"
              style={{ width: "70%", marginTop: "25px" }}
            />

          </div>

        </div>
      </div>

    </React.Fragment>
  );
}

export default Awards;
