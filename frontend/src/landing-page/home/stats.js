import React from "react";

function Stats() {
  return (
    <React.Fragment>

      <div className="container-fluid px-5 py-5">
        <div className="row align-items-center">

          {/* LEFT TEXT */}
          <div className="col-lg-6">

            <h1 style={{ fontSize: "52px", fontWeight: "650" }} className="mb-4">
              Trust with confidence
            </h1>

            <h2 style={{ fontSize: "26px" }}>Customer first always</h2>
            <p className="text-muted" style={{ fontSize: "18px", lineHeight: "1.8" }}>
              We are trusted by over 2 million clients worldwide, with a track
              record of delivering exceptional service and support.
            </p>

            <h2 style={{ fontSize: "26px" }}>No spam or gimmicks</h2>
            <p className="text-muted" style={{ fontSize: "18px", lineHeight: "1.8" }}>
              We are trusted by over 2 million clients worldwide, with a track
              record of delivering exceptional service and support.
            </p>

            <h2 style={{ fontSize: "26px" }}>The Tradosteward universe</h2>
            <p className="text-muted" style={{ fontSize: "18px", lineHeight: "1.8" }}>
              We are trusted by over 2 million clients worldwide, with a track
              record of delivering exceptional service and support.
            </p>

            <h2 style={{ fontSize: "26px" }}>Do better with money</h2>
            <p className="text-muted" style={{ fontSize: "18px", lineHeight: "1.8" }}>
              We are trusted by over 2 million clients worldwide, with a track
              record of delivering exceptional service and support.
            </p>

          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6 text-center">

            <img
              src="media/images/statistics.png"
              alt="Stats"
              style={{ width: "100%",  }}
              className="mb-4"
            />

            <div style={{ fontSize: "18px" }}>
              <a href="" className="mx-4" style={{ textDecoration: "none" }}>
                Explore our products
              </a>

              <a href="" className="mx-4" style={{ textDecoration: "none" }}>
                Try kite
              </a>
            </div>

          </div>

        </div>
      </div>

    </React.Fragment>
  );
}

export default Stats;
