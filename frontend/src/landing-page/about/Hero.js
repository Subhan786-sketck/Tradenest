import React from "react";

function Hero() {
  return (
    <React.Fragment>
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col">
            <h1 className="display-4 fw-bold mb-4">
              Welcome to <span className="text-primary">TradeNest</span>
            </h1>

            <p className="lead text-muted">
              We pioneered the discount broking model in India.
              <br />
              Now we are breaking ground with technology.
            </p>

            <h4 className="mt-4 fw-light">
              Discover the power of our software and how it can transform your
              trading experience.
            </h4>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-5 border-top">
        <div className="row">

          {/* Left */}
          <div className="col-lg-6 col-md-12 mb-4">
            <h2 className="fw-bold mb-4">
              About <span className="text-primary">TradeNest</span>
            </h2>

            <p className="text-secondary text-justify">
              TradeNest is a full-stack trading platform designed to simulate
              real-world financial markets. It delivers a seamless and
              low-latency user experience using a React-based frontend and a
              scalable backend architecture.
            </p>

            <p className="text-secondary text-justify">
              The platform ensures efficient data flow, fast rendering, and
              real-time updates. Rather than simply replicating existing trading
              applications, TradeNest focuses on building a modular and
              extensible system capable of evolving into a production-grade
              fintech solution.
            </p>

            <p className="text-secondary text-justify">
              From a user's perspective, TradeNest offers a clean and intuitive
              interface inspired by modern trading platforms while maintaining a
              strong emphasis on scalability, maintainability, and structured
              API communication.
            </p>
          </div>

          {/* Right */}
          <div className="col-lg-6 col-md-12">
            <h2 className="fw-bold mb-4">
              Why Choose <span className="text-primary">TradeNest?</span>
            </h2>

            <p className="text-secondary text-justify">
              TradeNest emphasizes performance optimization through lazy
              loading, route-based code splitting, efficient API caching, and a
              scalable project architecture that minimizes response time.
            </p>

            <p className="text-secondary text-justify">
              The modular design allows easy integration of advanced features
              such as algorithmic trading, AI-powered recommendations, risk
              analysis, and portfolio analytics without major architectural
              changes.
            </p>

            <p className="text-secondary text-justify">
              Overall, TradeNest demonstrates practical implementation of
              frontend engineering, backend architecture, REST APIs, and system
              design principles required for developing modern financial
              technology platforms.
            </p>
          </div>

        </div>
      </section>
    </React.Fragment>
  );
}

export default Hero;