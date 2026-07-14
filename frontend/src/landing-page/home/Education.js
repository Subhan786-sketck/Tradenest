import React from "react";

function Education() {
  return (
    <React.Fragment>

      <div className="container-fluid mt-5 px-5">
        <div className="row align-items-center">

          {/* LEFT SIDE IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src="media/images/education.png"
              alt="Education"
              style={{
                width: "100%",
                
              }}
            />
          </div>

          {/* RIGHT SIDE TEXT */}
          <div className="col-md-6">

            <h1 style={{ fontSize: "52px", fontWeight: "650" }}>
              Free and open market education
            </h1>

            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              Varsity, the largest online stock market education book in the world
              covering everything from the basics to advanced trading.
            </p>

            <a href="" style={{ textDecoration: "none", fontSize: "18px" }}>
              Varsity <i className="fa fa-long-arrow-right"></i>
            </a>

            <p className="mt-5" style={{ fontSize: "18px", lineHeight: "1.8" }}>
              We pioneered the concept of discount broking and price
              transparency in India. Flat fees and no hidden charges.
            </p>

            <a href="" style={{ textDecoration: "none", fontSize: "18px" }}>
              Trading Q&A <i className="fa fa-long-arrow-right"></i>
            </a>

          </div>

        </div>
      </div>

    </React.Fragment>
  );
}

export default Education;
