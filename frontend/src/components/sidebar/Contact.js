import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (This is a demo)');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-start p-0 overflow-auto">
      <div className="w-100 p-5">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="mb-4 text-white bg-dark p-3 rounded">Contact Us</h1>
          <p className="lead">We'd love to hear from you — let’s connect!</p>
        </header>

        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-md-5">
            <h3>Our Office</h3>
            <p><strong>Address:</strong> MD Plaza Basement, Canal Road, near Canal View Hotel, Rahim Yar Khan</p>
            <p><strong>Phone:</strong> 0302-8882969</p>
            <p><strong>Email:</strong> itcentreryk@gmail.com</p>
            <p><strong>Website:</strong> <a href="https://www.itcentre.pk" target="_blank" rel="noopener noreferrer">www.itcentre.pk</a></p>

            <h3 className="mt-4">Find Us Online</h3>
            <div className="d-flex gap-2 mt-2">
              <a href="https://www.facebook.com/ITCentreRYK" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/itcentreryk/" target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
                <FaInstagram />
              </a>
              <a href="https://twitter.com/rahim_it" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm text-white">
                <FaTwitter />
              </a>
              <a href="https://www.linkedin.com/company/itcentre-ryk" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <FaLinkedinIn />
              </a>
              <a href="https://www.youtube.com/@itcentrery" target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-7">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Message</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className="form-control" required></textarea>
              </div>
              <button type="submit" className="btn btn-success">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
