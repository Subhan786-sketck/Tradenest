import React from 'react';

function Hero() {
  return (
    <React.Fragment>
      <div className="container border-bottom">
        <div className="row align-items-center p-5 mt-5 border-top">

       
          <div className="col-md-6">
            <h1 style={{ fontSize: "80px", fontWeight: "700", color: "#222" }}>
              Simple & Transparent Pricing 💸
            </h1>

            <p className="mt-4 text-muted" style={{ fontSize: "25px", lineHeight: "1.6" }}>
              No hidden charges. No confusion. Calculate your brokerage instantly 
              and choose the best plan that suits your trading style.
            </p>

           
          </div>

          <div className="col-md-6 text-center">
            <img
              src="media/images/pricing.png"
              alt="Pricing Illustration"
              className="img-fluid"
              style={{ maxWidth: "130%" }}
            />
          </div>

        </div>
      </div>
    </React.Fragment>
  );
}

export default Hero;
