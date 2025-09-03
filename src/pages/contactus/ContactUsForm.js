import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContactUsForm.css'

const ContactUsForm = () => {
    return (
        <section className="contact-us-form py-5">
            <div className="container">
                <form>
                    <div className="row">
                        <div className="col-md-1"></div> {/* Empty space left */}
                        <div className="col-md-10 p-4 shadow-sm">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input type="text" className="form-control" id="firstName" placeholder="First Name" required />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" id="lastName" placeholder="Last Name" required />
                                </div>

                                <div className="col-md-6">
                                    <input type="email" className="form-control" id="email" placeholder="Email Address" required />
                                </div>
                                <div className="col-md-6">
                                    <input type="tel" className="form-control" id="phone" placeholder="Phone Number" required />
                                </div>

                                <div className="col-md-6">
                                    <input type="text" className="form-control" id="organization" placeholder="Organization Name" />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" id="jobTitle" placeholder="Job Title" />
                                </div>

                                <div className="col-md-6">
                                    <select className="form-select" id="enquiryType" required>
                                        <option value="">Select Enquiry Type</option>
                                        <option value="general">General</option>
                                        <option value="sales">Sales</option>
                                        <option value="support">Support</option>
                                        <option value="partnership">Partnership</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <select className="form-select" id="country" required>
                                        <option value="">Select Country</option>
                                        <option value="usa">United States</option>
                                        <option value="india">India</option>
                                        <option value="uk">United Kingdom</option>
                                        <option value="canada">Canada</option>
                                        <option value="australia">Australia</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <textarea className="form-control" id="message" rows="5" placeholder="Write your message here" required></textarea>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary px-5">Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1"></div> {/* Empty space right */}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ContactUsForm;
