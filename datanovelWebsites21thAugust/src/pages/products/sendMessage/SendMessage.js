import React from "react";
import "./SendMessage.css";
import logo from '../../../assets/images/companyLogo.png';

const SendMessage = ({heading}) => {
  return (
    <section className="send-message-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">
          {heading || "Contact Us today to learn more or schedule your personalized demo!"}
        </h2>

        <div className="card  p-4 mx-auto form-wrapper">
          <form>
            <div className="row">
              <div className="col-lg-12 d-flex">
                <img src={logo} alt="Company Logo" className="me-2" height={20} width={30} />
                <h5 style={{color:'#263238'}}>DataNovel</h5>
              </div>
            </div>
            <div className="row my-1">
              {/* Left side */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                     Name
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
                     Email
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
                     Message
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
