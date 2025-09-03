import React from "react";
import "./DynamicDashboard.css";
import checkboxes from "../../../assets/icons/Checkboxes.png";
import dynamicdashboard from "../../../assets/images/dynamic_dashboard.png";

const DynamicDashboard = () => {
  return (
    <section className="dynamic-dashboard-section py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Image */}
          <div className="col-lg-6 col-md-12 text-center mb-4 mb-lg-0">
            <img
              src={dynamicdashboard}
              alt="Dynamic Dashboard Insights"
              className="img-fluid dynamic-dashboard-img"
            />
          </div>

          {/* Right Side - Content */}
          <div className="col-lg-6 col-md-12">
            <h2 className="dashboard-title mb-3">
              Dynamic Dashboard <span className="highlight">Insights</span>
            </h2>
            <p className="dashboard-description">
              Gain a complete, real-time overview of your operations with
              interactive, data-driven dashboards tailored for your business.
            </p>

            {/* Features */}
            <div className="dashboard-features mt-4">
              <div className="feature-item d-flex align-items-center mb-3">
                <img
                  src={checkboxes}
                  alt="Visualize workflows"
                  className="feature-icon"
                />
                <span>Visualize workflows</span>
              </div>

              <div className="feature-item d-flex align-items-center mb-3">
                <img
                  src={checkboxes}
                  alt="Track KPIs instantly"
                  className="feature-icon"
                />
                <span>Track KPIs instantly</span>
              </div>

              <div className="feature-item d-flex align-items-center">
                <img
                  src={checkboxes}
                  alt="Make smarter decisions faster"
                  className="feature-icon"
                />
                <span>Make smarter decisions faster</span>
              </div>
              <button className="get_started">Get started</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicDashboard;
