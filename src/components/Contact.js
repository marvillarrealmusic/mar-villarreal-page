import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });
  const [active, setActive] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { email, name, phone, message } = form;

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && name && phone && message) {
      emailjs
        .send("service_9dps9dd", "template_h7bob5f", form, "0r6pa5iarIa8SHb_U")
        .then(
          (result) => {
            setSuccess(true);
            setTimeout(() => {
              setForm({ email: "", name: "", phone: "", message: "" });
              setSuccess(false);
            }, 5000);
          },
          (error) => {
            setError(true);
            setTimeout(() => {
              setError(false);
            }, 5000);
          }
        );
    } else {
      setValidationError(true);
      setTimeout(() => {
        setValidationError(false);
      }, 3000);
    }
  };
  return (
    <section id="contact">
      <div className="container">
        <div className="roww resumo_fn_contact">
          {/* Main Title */}
          <div className="resumo_fn_main_title">
            <h3 className="subtitle">Contact</h3>
            <h3 className="title">Get In Touch</h3>
            <p className="desc">
              I'd love to hear from you! For any suggestion, booking inquiries,
              collaborations or general information, please fill out the form
              below and I will reply you shortly.
            </p>
          </div>
          {/* /Main Title */}
          {/* Contact Form */}
          <form className="contact_form" onSubmit={(e) => onSubmit(e)}>
            <div
              className="success"
              data-success="Your message has been received, we will contact you soon."
              style={{ display: success ? "block" : "none" }}
            >
              <span className="contact_success">
                Your message has been received, we will contact you soon.
              </span>
            </div>
            <div
              className="empty_notice"
              style={{ display: validationError ? "block" : "none" }}
            >
              <span>Please Fill Required Fields!</span>
            </div>
            <div
              className="empty_notice"
              style={{ display: error ? "block" : "none" }}
            >
              <span>Error submitting the form</span>
            </div>
            {/* */}
            <div className="items_wrap">
              <div className="items">
                <div className="item half">
                  <div
                    className={`input_wrapper ${
                      active === "name" || name ? "active" : ""
                    }`}
                  >
                    <input
                      onFocus={() => setActive("name")}
                      onBlur={() => setActive(null)}
                      onChange={(e) => onChange(e)}
                      value={name}
                      name="name"
                      id="name"
                      type="text"
                    />
                    <label for="name" className="moving_placeholder">
                      Name *
                    </label>
                  </div>
                </div>
                <div className="item half">
                  <div
                    className={`input_wrapper ${
                      active === "email" || email ? "active" : ""
                    }`}
                  >
                    <input
                      onFocus={() => setActive("email")}
                      onBlur={() => setActive(null)}
                      onChange={(e) => onChange(e)}
                      value={email}
                      name="email"
                      id="email"
                      type="email"
                    />
                    <label for="email" className="moving_placeholder">
                      Email *
                    </label>
                  </div>
                </div>
                <div className="item">
                  <div
                    className={`input_wrapper ${
                      active === "phone" || phone ? "active" : ""
                    }`}
                  >
                    <input
                      onFocus={() => setActive("phone")}
                      onBlur={() => setActive(null)}
                      id="phone"
                      onChange={(e) => onChange(e)}
                      value={phone}
                      name="phone"
                      type="text"
                    />
                    <label for="phone" className="moving_placeholder">
                      Phone
                    </label>
                  </div>
                </div>
                <div className="item">
                  <div
                    className={`input_wrapper ${
                      active === "message" || message ? "active" : ""
                    }`}
                  >
                    <textarea
                      onFocus={() => setActive("message")}
                      onBlur={() => setActive(null)}
                      name="message"
                      onChange={(e) => onChange(e)}
                      value={message}
                      id="message"
                    />
                    <label for="message" className="moving_placeholder">
                      Message
                    </label>
                  </div>
                </div>
                <div className="item">
                  {/* <a id="send_message" href="#">
                    Send Message
                  </a> */}
                  <input
                    className="a"
                    type="submit"
                    id="send_message"
                    value="Send Message"
                  />
                </div>
              </div>
            </div>
          </form>
          {/* /Contact Form */}
          {/* Contact Info */}
          <div className="resumo_fn_contact_info">
            {/* <p>Address</p>
            <h3>69 Queen St, London, United Kingdom</h3>
            <p>Phone</p>
            <h3>
              <a href="tel:+7068980751">(+706) 898-0751</a>
            </h3> */}
            <p>
              <a className="fn__link" href="mailto:info@marvillarreal.com">
                info@marvillarreal.com
              </a>
            </p>
          </div>
          {/* /Contact Info */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
