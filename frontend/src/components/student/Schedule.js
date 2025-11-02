// src/components/student/Schedule.js
import React, { useState } from 'react';

const Schedule = () => {
  const [selectedCourse, setSelectedCourse] = useState('');

  const courses = [
    { id: 'web-dev', name: 'Web Development (MERN Stack)' },
    { id: 'app-dev', name: 'App Development' },
    { id: 'graphic-design', name: 'Graphic Designing' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'ecommerce', name: 'Shopify / Ecommerce' },
    { id: 'business-dev', name: 'Business Development' },
    { id: 'icr-kids', name: 'ICR For Kids' },
    { id: 'youtube-automation', name: 'YouTube Automation' },
    { id: 'ui-ux', name: 'UI/UX Design' },
    { id: 'english', name: 'English Language' },
    { id: 'ielts', name: 'IELTS' }
  ];

  const timetableData = {
    'web-dev': {
      '2-Month Training Series': [
        { day: 'Monday', time: '9:00 AM - 11:00 AM', subject: 'HTML & CSS Fundamentals' },
        { day: 'Tuesday', time: '9:00 AM - 11:00 AM', subject: 'JavaScript Basics' },
        { day: 'Wednesday', time: '9:00 AM - 11:00 AM', subject: 'React.js Introduction' },
        { day: 'Thursday', time: '9:00 AM - 11:00 AM', subject: 'Node.js & Express' },
        { day: 'Friday', time: '9:00 AM - 11:00 AM', subject: 'MongoDB & Project Work' }
      ],
      '3-Month Training Series': [
        { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'Advanced HTML/CSS' },
        { day: 'Tuesday', time: '2:00 PM - 4:00 PM', subject: 'JavaScript Deep Dive' },
        { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'React.js Advanced' },
        { day: 'Thursday', time: '2:00 PM - 4:00 PM', subject: 'Backend Development' },
        { day: 'Friday', time: '2:00 PM - 4:00 PM', subject: 'Deployment & Projects' }
      ],
      'Pro-20 Training Series': [
        { day: 'Monday', time: '9:00 AM - 1:00 PM', subject: 'Full Stack Fundamentals' },
        { day: 'Tuesday', time: '9:00 AM - 1:00 PM', subject: 'Advanced React Concepts' },
        { day: 'Wednesday', time: '9:00 AM - 1:00 PM', subject: 'Backend & APIs' },
        { day: 'Thursday', time: '9:00 AM - 1:00 PM', subject: 'Database Management' },
        { day: 'Friday', time: '9:00 AM - 1:00 PM', subject: 'Project Development' },
        { day: 'Saturday', time: '9:00 AM - 12:00 PM', subject: 'Weekly Review & Q&A' }
      ]
    },
    'app-dev': {
      '2-Month Training Series': [
        { day: 'Monday', time: '11:00 AM - 1:00 PM', subject: 'UI Components Basics' },
        { day: 'Tuesday', time: '11:00 AM - 1:00 PM', subject: 'Navigation & Styling' },
        { day: 'Wednesday', time: '11:00 AM - 1:00 PM', subject: 'State Management' },
        { day: 'Thursday', time: '11:00 AM - 1:00 PM', subject: 'API Integration' },
        { day: 'Friday', time: '11:00 AM - 1:00 PM', subject: 'Firebase Basics' }
      ],
      '3-Month Training Series': [
        { day: 'Monday', time: '4:00 PM - 6:00 PM', subject: 'Advanced UI Components' },
        { day: 'Tuesday', time: '4:00 PM - 6:00 PM', subject: 'Complex Navigation' },
        { day: 'Wednesday', time: '4:00 PM - 6:00 PM', subject: 'Redux & State' },
        { day: 'Thursday', time: '4:00 PM - 6:00 PM', subject: 'Advanced APIs' },
        { day: 'Friday', time: '4:00 PM - 6:00 PM', subject: 'Push Notifications' }
      ],
      'Pro-20 Training Series': [
        { day: 'Monday', time: '2:00 PM - 6:00 PM', subject: 'App Fundamentals' },
        { day: 'Tuesday', time: '2:00 PM - 6:00 PM', subject: 'Advanced Components' },
        { day: 'Wednesday', time: '2:00 PM - 6:00 PM', subject: 'State & Data Management' },
        { day: 'Thursday', time: '2:00 PM - 6:00 PM', subject: 'API Integration & Testing' },
        { day: 'Friday', time: '2:00 PM - 6:00 PM', subject: 'Deployment & Projects' }
      ]
    },
    // Add similar data for other courses...
    'graphic-design': {
      '2-Month Training Series': [
        { day: 'Monday', time: '9:00 AM - 11:00 AM', subject: 'Photoshop Basics' },
        { day: 'Tuesday', time: '9:00 AM - 11:00 AM', subject: 'Illustrator Introduction' },
        { day: 'Wednesday', time: '9:00 AM - 11:00 AM', subject: 'Canva & Design Principles' },
        { day: 'Thursday', time: '9:00 AM - 11:00 AM', subject: 'Figma Basics' },
        { day: 'Friday', time: '9:00 AM - 11:00 AM', subject: 'Social Media Design' }
      ],
      '3-Month Training Series': [
        { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Photoshop' },
        { day: 'Tuesday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Illustrator' },
        { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'Branding Essentials' },
        { day: 'Thursday', time: '2:00 PM - 4:00 PM', subject: 'Portfolio Development' },
        { day: 'Friday', time: '2:00 PM - 4:00 PM', subject: 'Client Projects' }
      ],
      'Pro-20 Training Series': [
        { day: 'Monday', time: '9:00 AM - 1:00 PM', subject: 'Design Fundamentals' },
        { day: 'Tuesday', time: '9:00 AM - 1:00 PM', subject: 'Advanced Tools' },
        { day: 'Wednesday', time: '9:00 AM - 1:00 PM', subject: 'Branding & Identity' },
        { day: 'Thursday', time: '9:00 AM - 1:00 PM', subject: 'Portfolio Development' },
        { day: 'Friday', time: '9:00 AM - 1:00 PM', subject: 'Real-world Projects' }
      ]
    },
    'digital-marketing': {
  '2-Month Training Series': [
    { day: 'Monday', time: '9:00 AM - 11:00 AM', subject: 'Introduction to Social Media Marketing' },
    { day: 'Tuesday', time: '9:00 AM - 11:00 AM', subject: 'Meta Ads Basics (Facebook & Instagram)' },
    { day: 'Wednesday', time: '9:00 AM - 11:00 AM', subject: 'SEO Fundamentals' },
    { day: 'Thursday', time: '9:00 AM - 11:00 AM', subject: 'Google Ads & Analytics Basics' },
    { day: 'Friday', time: '9:00 AM - 11:00 AM', subject: 'Content Strategy & Branding' }
  ],
  '3-Month Training Series': [
    { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Social Media Campaigns' },
    { day: 'Tuesday', time: '2:00 PM - 4:00 PM', subject: 'Conversion-based Facebook & Instagram Ads' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'SEO & Google Analytics Advanced' },
    { day: 'Thursday', time: '2:00 PM - 4:00 PM', subject: 'Email Marketing & Funnels' },
    { day: 'Friday', time: '2:00 PM - 4:00 PM', subject: 'Client Reporting & Case Studies' }
  ],
  'Pro-20 Training Series': [
    { day: 'Monday', time: '4:00 PM - 8:00 PM', subject: 'Comprehensive Digital Marketing Strategy' },
    { day: 'Tuesday', time: '4:00 PM - 8:00 PM', subject: 'Advanced Paid Campaigns & Retargeting' },
    { day: 'Wednesday', time: '4:00 PM - 8:00 PM', subject: 'SEO & Content Marketing Mastery' },
    { day: 'Thursday', time: '4:00 PM - 8:00 PM', subject: 'Lead Generation & Automation' },
    { day: 'Friday', time: '4:00 PM - 8:00 PM', subject: 'Real-world Projects & Freelance Toolkit' }
  ]
},
'ecommerce': {
  '2-Month Training Series': [
    { day: 'Monday', time: '9:00 AM - 11:00 AM', subject: 'Shopify Store Setup & Theme Customization' },
    { day: 'Tuesday', time: '9:00 AM - 11:00 AM', subject: 'Product Listing & Inventory Management' },
    { day: 'Wednesday', time: '9:00 AM - 11:00 AM', subject: 'Payment Gateway & Shipping Settings' },
    { day: 'Thursday', time: '9:00 AM - 11:00 AM', subject: 'Order Handling & Customer Support' },
    { day: 'Friday', time: '9:00 AM - 11:00 AM', subject: 'Basic E-commerce Marketing (FB Ads, Email, SEO)' }
  ],
  '3-Month Training Series': [
    { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Shopify Customization' },
    { day: 'Tuesday', time: '2:00 PM - 4:00 PM', subject: 'Inventory Automation & Product Management' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Payment & Shipping Solutions' },
    { day: 'Thursday', time: '2:00 PM - 4:00 PM', subject: 'Customer Engagement & Retention Strategies' },
    { day: 'Friday', time: '2:00 PM - 4:00 PM', subject: 'E-commerce Marketing & Ads Optimization' }
  ],
  'Pro-20 Training Series': [
    { day: 'Monday', time: '4:00 PM - 8:00 PM', subject: 'Complete Shopify Automation & Store Management' },
    { day: 'Tuesday', time: '4:00 PM - 8:00 PM', subject: 'Advanced Marketing & FB/Google Ads Mastery' },
    { day: 'Wednesday', time: '4:00 PM - 8:00 PM', subject: 'Analytics, Reporting & Conversion Optimization' },
    { day: 'Thursday', time: '4:00 PM - 8:00 PM', subject: 'Email Marketing Automation & CRM' },
    { day: 'Friday', time: '4:00 PM - 8:00 PM', subject: 'Real-world Projects & Freelance E-commerce Toolkit' }
  ]
},
'business-dev': {
  '1-Month Training Series': [
    { day: 'Monday', time: '10:00 AM - 12:00 PM', subject: 'Freelancing Platforms Overview (Upwork, Fiverr, LinkedIn, Indeed)' },
    { day: 'Tuesday', time: '10:00 AM - 12:00 PM', subject: 'Proposal Writing & Business Communication' },
    { day: 'Wednesday', time: '10:00 AM - 12:00 PM', subject: 'Client Handling & Negotiation Techniques' },
    { day: 'Thursday', time: '10:00 AM - 12:00 PM', subject: 'Project Management & Workflow Setup' },
    { day: 'Friday', time: '10:00 AM - 12:00 PM', subject: 'Practical Exercises: Real Client Projects' }
  ],
  '2-Month Training Series': [
    { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'Advanced Client Acquisition & Networking' },
    { day: 'Tuesday', time: '2:00 PM - 4:00 PM', subject: 'Proposal Optimization & Pricing Strategy' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'Negotiation & Communication Mastery' },
    { day: 'Thursday', time: '2:00 PM - 4:00 PM', subject: 'Managing Multiple Projects & Clients' },
    { day: 'Friday', time: '2:00 PM - 4:00 PM', subject: 'Hands-on: Freelance Real-world Project Simulation' }
  ],
  'Pro-20 Training Series': [
    { day: 'Monday', time: '4:00 PM - 8:00 PM', subject: 'Freelancing Strategy & Portfolio Building' },
    { day: 'Tuesday', time: '4:00 PM - 8:00 PM', subject: 'Client Retention & Relationship Management' },
    { day: 'Wednesday', time: '4:00 PM - 8:00 PM', subject: 'Advanced Negotiation & Deal Closing' },
    { day: 'Thursday', time: '4:00 PM - 8:00 PM', subject: 'Project Delivery & Quality Assurance' },
    { day: 'Friday', time: '4:00 PM - 8:00 PM', subject: 'Capstone Project & Freelance Starter Kit' }
  ]
},
'icr-kids': {
  '2-Month Training Series': [
    { day: 'Monday', time: '10:00 AM - 12:00 PM', subject: 'Basic Graphic Designing & Canva Fun Projects' },
    { day: 'Tuesday', time: '10:00 AM - 12:00 PM', subject: 'Video Editing Basics + Simple Animations' },
    { day: 'Wednesday', time: '10:00 AM - 12:00 PM', subject: 'HTML/CSS Basics for Kids' },
    { day: 'Thursday', time: '10:00 AM - 12:00 PM', subject: 'English Language & Typing Games' },
    { day: 'Friday', time: '10:00 AM - 12:00 PM', subject: 'YouTube & Social Media Fun Learning + AI Tools Intro' }
  ],
  'Pro-20 Training Series': [
    { day: 'Monday', time: '2:00 PM - 6:00 PM', subject: 'Creative Digital Projects & Mini Portfolio' },
    { day: 'Tuesday', time: '2:00 PM - 6:00 PM', subject: 'Interactive Web Elements & Fun Coding' },
    { day: 'Wednesday', time: '2:00 PM - 6:00 PM', subject: 'AI Tools Exploration (ChatGPT, Image AI, etc.)' },
    { day: 'Thursday', time: '2:00 PM - 6:00 PM', subject: 'Video Editing & Animation Projects' },
    { day: 'Friday', time: '2:00 PM - 6:00 PM', subject: 'Showcase Day: Present Projects & Creative Work' }
  ]
},
'youtube-automation': {
  '1-Month Training Series': [
    { day: 'Monday', time: '3:00 PM - 5:00 PM', subject: 'YouTube Niche & Channel Strategy' },
    { day: 'Tuesday', time: '3:00 PM - 5:00 PM', subject: 'Scriptwriting & AI Tools Integration' },
    { day: 'Wednesday', time: '3:00 PM - 5:00 PM', subject: 'Voiceover & Editing Workflow' },
    { day: 'Thursday', time: '3:00 PM - 5:00 PM', subject: 'Monetization & Channel Growth' },
    { day: 'Friday', time: '3:00 PM - 5:00 PM', subject: 'Automation & Scheduling Content' }
  ]
},
'ui-ux': {
  '1-Month Training Series': [
    { day: 'Monday', time: '10:00 AM - 12:00 PM', subject: 'UI Design Principles & Layouts' },
    { day: 'Tuesday', time: '10:00 AM - 12:00 PM', subject: 'User Research & Wireframing' },
    { day: 'Wednesday', time: '10:00 AM - 12:00 PM', subject: 'Figma Tools & Prototypes' },
    { day: 'Thursday', time: '10:00 AM - 12:00 PM', subject: 'Mobile & Web App Interface Design' },
    { day: 'Friday', time: '10:00 AM - 12:00 PM', subject: 'Clickable Prototypes & Project Work' }
  ]
},
'english': {
  '2-Month Training Series': [
    { day: 'Monday', time: '9:00 AM - 11:00 AM', subject: 'Grammar & Vocabulary' },
    { day: 'Tuesday', time: '9:00 AM - 11:00 AM', subject: 'Reading Comprehension' },
    { day: 'Wednesday', time: '9:00 AM - 11:00 AM', subject: 'Writing Practice' },
    { day: 'Thursday', time: '9:00 AM - 11:00 AM', subject: 'Speaking & Pronunciation' },
    { day: 'Friday', time: '9:00 AM - 11:00 AM', subject: 'Listening & Conversation Skills' }
  ]
},
'ielts': {
  '2-Month Training Series': [
    { day: 'Monday', time: '10:00 AM - 12:00 PM', subject: 'Listening Practice & Strategies' },
    { day: 'Tuesday', time: '10:00 AM - 12:00 PM', subject: 'Reading Techniques & Exercises' },
    { day: 'Wednesday', time: '10:00 AM - 12:00 PM', subject: 'Writing Task 1 & Task 2' },
    { day: 'Thursday', time: '10:00 AM - 12:00 PM', subject: 'Speaking Practice & Fluency' },
    { day: 'Friday', time: '10:00 AM - 12:00 PM', subject: 'Mock Tests & Band Score Analysis' }
  ]
},


  };

  const handleCourseChange = (e) => setSelectedCourse(e.target.value);

  const selectedTimetables = selectedCourse ? timetableData[selectedCourse] : null;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="mb-4 text-white bg-dark p-3 rounded">Course Schedule</h1>
        <p className="lead">View timetables for all available course options</p>
      </div>

      <div className="mb-4">
        <label htmlFor="course-select" className="form-label">Select Your Course:</label>
        <select
          id="course-select"
          className="form-select"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <option value="">-- Choose a Course --</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      {selectedCourse && selectedTimetables ? (
        <div>
          <h2 className="mb-4">{courses.find(c => c.id === selectedCourse).name} Schedules</h2>
          {Object.entries(selectedTimetables).map(([seriesName, schedule]) => (
            <div key={seriesName} className="mb-5">
              <h4 className="mb-3">{seriesName}</h4>
              <div className="table-responsive">
                <table className="table table-striped table-bordered shadow-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.day}</td>
                        <td>{item.time}</td>
                        <td>{item.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <h5>Select a course to view the schedule</h5>
          <p className="text-muted">Choose from the dropdown menu above to see detailed timetables.</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;