import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import "../../styles/contact.css";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [messageStatus, setMessageStatus] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await emailjs.send(
        "service_h21foc9", // Replace with your Email.js Service ID
        "template_t64w4wp", // Replace with your Email.js Template ID
        data,
        "PV9slaOWlMSALkZ3v" // Replace with your Email.js Public Key
      );

      if (response.status === 200) {
        setMessageStatus("Message sent successfully! ✅");
        reset();
      } else {
        setMessageStatus("Failed to send message. Please try again later. ❌");
      }
    } catch (error) {
      console.error("Email Error:", error);
      setMessageStatus("Error sending message. Please check your details.");
    }
  };

  return (
    <section id="contact" className="contact-container">
      <div className="frame-container">
        <h2 className="section-title">
          <span className="highlight">Get in Touch</span> with Us
        </h2>
        <p className="section-description">
          Have questions about pet adoption? Need assistance? Contact us!
        </p>

        <form
          className="contact-form-container"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <label className="contact-label">
            <span>Name</span>
            <input
              type="text"
              className="contact-input"
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only letters are allowed",
                },
              })}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </label>

          {/* Email */}
          <label className="contact-label">
            <span>Email</span>
            <input
              type="email"
              className="contact-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </label>

          {/* Inquiry Topic */}
          <label className="contact-label">
            <span>Topic</span>
            <select
              className="contact-input"
              {...register("topic", { required: "Please select a topic" })}
            >
              <option value="">Select One...</option>
              <option value="Adoption Process">Adoption Process</option>
              <option value="Volunteering">Volunteering</option>
              <option value="Donation">Donations & Support</option>
              <option value="Pet Care Tips">Pet Care Tips</option>
              <option value="Report a Lost Pet">Report a Lost Pet</option>
            </select>
            {errors.topic && (
              <p className="error-message">{errors.topic.message}</p>
            )}
          </label>

          {/* Message */}
          <label className="contact-label">
            <span>Message</span>
            <textarea
              className="contact-input"
              {...register("message", {
                required: "Message cannot be empty",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Message cannot exceed 500 characters",
                },
              })}
              rows="6"
            ></textarea>
            {errors.message && (
              <p className="error-message">{errors.message.message}</p>
            )}
          </label>

          {/* Terms Checkbox */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register("terms", { required: "You must accept the terms" })}
            />
            <span>I accept the terms and conditions.</span>
          </label>
          {errors.terms && (
            <p className="error-message">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn contact-form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {/* Status Message */}
          {messageStatus && <p className="message-status">{messageStatus}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;
