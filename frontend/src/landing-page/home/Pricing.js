import React from "react";

function Pricing() {
  return (
    <React.Fragment>

      <div className="container-fluid px-5 mb-5">
        <div className="row align-items-center">

          {/* LEFT SIDE */}
          <div className="col-lg-6">

            <h1 style={{ fontSize: "52px", fontWeight: "650" }} className="mb-4">
              Unbeatable Pricing
            </h1>

            <p style={{ fontSize: "20px", lineHeight: "1.9" }}>
              Experience simple and transparent pricing designed for modern
              traders. Our platform keeps costs predictable so you can focus
              on building wealth instead of worrying about hidden charges.
            </p>

            <p style={{ fontSize: "20px", lineHeight: "1.9" }}>
              Whether you are a beginner investor or an active trader,
              our pricing model ensures fairness and accessibility.
              No complicated fee structures, no surprises — just
              straightforward pricing that lets you trade confidently.
            </p>

            <p style={{ fontSize: "20px", lineHeight: "1.9" }}>
              We believe trading should be affordable for everyone.
              That's why we offer industry-leading pricing so you
              keep more of what you earn.
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6">

            <div className="row text-center g-4">

              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm h-100">

                  <h1 style={{ fontSize: "42px", fontWeight: "700" }}>$0</h1>

                  <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
                    Free equity delivery trades and direct mutual
                    fund investments with zero brokerage charges.
                  </p>

                </div>
              </div>

              <div className="col-md-6">
                <div className="p-4 border rounded shadow-sm h-100">

                  <h1 style={{ fontSize: "42px", fontWeight: "700" }}>$20</h1>

                  <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
                    Flat fee per executed order for intraday and F&O
                    trading with no percentage-based brokerage.
                  </p>

                </div>
              </div>

            </div>

            <div className="text-center mt-4">
              <a href="" style={{ fontSize: "18px", textDecoration: "none" }}>
                Explore our products →
              </a>
            </div>

          </div>

        </div>
      </div>

    </React.Fragment>
  );
}

export default Pricing;
