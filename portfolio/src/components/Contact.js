import React, { useState } from 'react';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, message } = formData;

    // Validate if email is entered
    if (!email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Encode subject and body
    const subject = encodeURIComponent(`Contact Message from ${email}`);
    const body = encodeURIComponent(`Message: ${message}`);

    // Gmail URL to compose an email, with the user's email address in the subject
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ragavan.v2023aiml@sece.ac.in&su=${subject}&body=${body}`;

    // Open the Gmail compose window, the sender is whoever is logged into Gmail
    window.open(gmailUrl, '_blank');

    // Clear the form after sending
    setFormData({
      name: '',
      email: '',
      message: '',
    });
};


  return (
    <div id="contact" className="contact-container">
      <h2 className="contact-header">Connect</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            placeholder="Your Message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">Send</button>
      </form>

      <div className="contact-info">
        <p><strong>Email:</strong> ragavan.v2023aiml@sece.ac.in</p>
        <p><strong>Phone:</strong> +91-9500472742</p>
      </div>
    </div>
  );
};

export default Contact;
