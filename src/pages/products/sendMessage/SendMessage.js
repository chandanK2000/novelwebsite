import React from "react";
import "./SendMessage.css";

const SendMessage = () => {
  return (
    <section className="send-message-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">
          Contact Us today to learn more or schedule your personalized demo!
        </h2>

        <div className="card  p-4 mx-auto form-wrapper">
          <form>
            <div className="row">
              {/* Left side */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="form-control"
                    placeholder="Enter subject"
                    required
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="6"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SendMessage;
