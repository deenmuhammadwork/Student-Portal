import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-start p-0 overflow-auto">
      <div className="w-100 p-5">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="mb-4 text-white bg-dark p-3 rounded">About Us</h1>
          <p className="lead">Empowering young minds with practical IT skills since 2016</p>
        </header>

        {/* Mission */}
        <section className="mb-5">
          <h2 className="mb-3">Our Mission</h2>
          <p>
            We aim to equip students and professionals with hands-on, career-focused IT skills.
            Our vision is to help young minds become confident, skilled, and financially independent 
            in today’s digital-first world.
          </p>
        </section>

        {/* Journey Highlights */}
        <section className="mb-5">
          <h2 className="mb-3">Journey Highlights</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Established in 2021 under Hello World Technologies</li>
            <li className="list-group-item">3,500+ students trained across 40+ batches</li>
            <li className="list-group-item">Community of 400+ professionals inside Cubicle Co-working</li>
            <li className="list-group-item">20+ IT companies working within Cubicle</li>
            <li className="list-group-item">Partnerships with PSEB & PITB</li>
            <li className="list-group-item">2,000+ success stories — jobs, freelancing & career launches</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="mb-5">
          <h2 className="mb-4">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li><FaCheckCircle className="text-success me-2" /> Free Career Guidance</li>
                    <li><FaCheckCircle className="text-success me-2" /> Freelancing Mentorship</li>
                    <li><FaCheckCircle className="text-success me-2" /> Real-Time Projects</li>
                    <li><FaCheckCircle className="text-success me-2" /> Quizzes & Tests</li>
                    <li><FaCheckCircle className="text-success me-2" /> Resume Building</li>
                    <li><FaCheckCircle className="text-success me-2" /> Career Counseling</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li><FaCheckCircle className="text-success me-2" /> Interview Preparation</li>
                    <li><FaCheckCircle className="text-success me-2" /> Industry Exposure</li>
                    <li><FaCheckCircle className="text-success me-2" /> Internship Opportunities</li>
                    <li><FaCheckCircle className="text-success me-2" /> Placement Assistance</li>
                    <li><FaCheckCircle className="text-success me-2" /> Completion Certificate</li>
                    <li><FaCheckCircle className="text-success me-2" /> Outsourcing Opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
