import React from "react";

function CreateTicket() {
  return (
    <React.Fragment>
      <div className="container">

        {/* HEADER */}
        <div className="row p-5 mt-5 text-center">
          <h1 className="fs-2 fw-bold">
            Create a Support Ticket 🎫
          </h1>
          <p className="text-muted mt-3">
            Select a topic below and we’ll help you resolve your issue quickly.
          </p>
        </div>

        {/* TOPICS */}
        <div className="row text-center mb-5">

          {/* CARD 1 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Account Opening</h4>
              <p className="text-muted">
                Issues related to account signup, KYC, and verification.
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Brokerage & Charges</h4>
              <p className="text-muted">
                Understand brokerage, fees, and transaction charges.
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Trading Issues</h4>
              <p className="text-muted">
                Problems with orders, execution, or platform errors.
              </p>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Payments & Refunds</h4>
              <p className="text-muted">
                Queries related to deposits, withdrawals, and refunds.
              </p>
            </div>
          </div>

          {/* CARD 5 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Technical Support</h4>
              <p className="text-muted">
                Bugs, crashes, or performance issues in TradeNest.
              </p>
            </div>
          </div>

          {/* CARD 6 */}
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <h4>Other Queries</h4>
              <p className="text-muted">
                Anything else not covered in the above categories.
              </p>
            </div>
          </div>

        </div>

        {/* CONTACT SECTION */}
        <div className="row text-center p-5 border-top">
          <h3>Still need help? 🤔</h3>
          <p className="text-muted mt-2">
            Email us at <b>support@tradenest.com</b> <br />
            We usually respond within 24 hours.
          </p>
        </div>

        {/* FAQ SECTION */}
        <div className="row p-5">
          <h3 className="text-center mb-4">Frequently Asked Questions</h3>

          <div className="col-md-6">
            <h5>How is brokerage calculated?</h5>
            <p className="text-muted">
              Brokerage is charged per order based on your selected plan.
            </p>
          </div>

          <div className="col-md-6">
            <h5>How long does withdrawal take?</h5>
            <p className="text-muted">
              Withdrawals are processed within 24–48 working hours.
            </p>
          </div>

          <div className="col-md-6 mt-3">
            <h5>Is there any hidden charge?</h5>
            <p className="text-muted">
              No, TradeNest follows a transparent pricing model.
            </p>
          </div>

          <div className="col-md-6 mt-3">
            <h5>Can I cancel my order?</h5>
            <p className="text-muted">
              Orders can be canceled before execution from the dashboard.
            </p>
          </div>
        </div>

      </div>
    </React.Fragment>
  );
}

export default CreateTicket;
