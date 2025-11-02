// src/components/student/MyCourses.js
import React from 'react';

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Web Development (MERN Stack)",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 16,000",
          tools: "HTML, CSS, Intro to JS, Full MERN Stack (React, Node, Mongo, Deployment)",
          outcome: "Strong foundation in frontend + basic projects"
        },
        {
          type: "3-Month Training Series",
          duration: "3 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 21,000",
          tools: "HTML, CSS, Intro to JS, Full MERN Stack (React, Node, Mongo, Deployment)",
          outcome: "Functional websites + internship ready projects"
        },
        {
          type: "Pro-20 Training Series",
          duration: "3 Months",
          dailyTime: "8 hrs",
          fee: "Rs. 35,000",
          tools: "HTML, CSS, Intro to JS, Full MERN Stack (React, Node, Mongo, Deployment)",
          outcome: "Job-ready portfolio + freelance starter kit"
        }
      ]
    },
    {
      id: 2,
      title: "App Development",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 16,000",
          tools: "UI Components, Navigation, Styling, State, API Integration, Firebase, Push Notifications, Data handling with Redux & APIs, Testing & Deployment, Real-time project",
          outcome: "Mobile app basics + simple UI projects"
        },
        {
          type: "3-Month Training Series",
          duration: "3 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 21,000",
          tools: "UI Components, Navigation, Styling, State, API Integration, Firebase, Push Notifications, Data handling with Redux & APIs, Testing & Deployment, Real-time project",
          outcome: "Functional cross-platform apps + internship"
        },
        {
          type: "Pro-20 Training Series",
          duration: "3 Months",
          dailyTime: "8 hrs",
          fee: "Rs. 35,000",
          tools: "UI Components, Navigation, Styling, State, API Integration, Firebase, Push Notifications, Data handling with Redux & APIs, Testing & Deployment, Real-time project",
          outcome: "Job-ready apps + freelancing starter pack"
        }
      ]
    },
    {
      id: 3,
      title: "Graphic Designing",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 16,000",
          tools: "Adobe Photoshop, Illustrator, Canva, Figma Basics, Branding Essentials, Social Media Design, Portfolio Projects",
          outcome: "Design basics + simple UI projects"
        },
        {
          type: "3-Month Training Series",
          duration: "3 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 21,000",
          tools: "Adobe Photoshop, Illustrator, Canva, Figma Basics, Branding Essentials, Social Media Design, Portfolio Projects",
          outcome: "Functional brand designs + internship opportunity"
        },
        {
          type: "Pro-20 Training Series",
          duration: "3 Months",
          dailyTime: "8 hrs",
          fee: "Rs. 35,000",
          tools: "Adobe Photoshop, Illustrator, Canva, Figma Basics, Branding Essentials, Social Media Design, Portfolio Projects",
          outcome: "Job-ready portfolio + freelancing starter pack"
        }
      ]
    },
    {
      id: 4,
      title: "Digital Marketing",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 16,000",
          tools: "Meta Ads (Facebook & Instagram), Social Media Marketing (Paid & Organic), Search Engine Optimization (SEO), Google Ads & Analytics, Content Strategy & Branding",
          outcome: "Basic social & search campaigns, Organic + paid strategy skills, Content calendar creation, Internship-ready portfolio"
        },
        {
          type: "3-Month Training Series",
          duration: "3 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 21,000",
          tools: "Meta Ads (Facebook & Instagram), Social Media Marketing (Paid & Organic), Search Engine Optimization (SEO), Google Ads & Analytics, Content Strategy & Branding",
          outcome: "Advanced ad campaign handling, Conversion-based strategies, Real projects + freelance toolkit, Client reporting & placements"
        },
        {
          type: "Pro-20 Training Series",
          duration: "3 Months",
          dailyTime: "8 hrs",
          fee: "Rs. 35,000",
          tools: "Meta Ads (Facebook & Instagram), Social Media Marketing (Paid & Organic), Search Engine Optimization (SEO), Google Ads & Analytics, Content Strategy & Branding",
          outcome: "Advanced ad campaign handling, Conversion-based strategies, Real projects + freelance toolkit, Client reporting & placements"
        }
      ]
    },
    {
      id: 5,
      title: "Shopify / Ecommerce",
      options: [
        {
          type: "2 Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 16,000",
          tools: "Shopify Store Setup & Theme Customization, Product Listing & Inventory Management, Payment Gateway & Shipping Settings, Order Handling & Customer Support, E-commerce Marketing (FB Ads, Email, SEO), Store Automation & Analytics",
          outcome: "Complete Shopify store setup, E-commerce management skills, Marketing and analytics knowledge"
        }
      ]
    },
    {
      id: 6,
      title: "Business Development",
      options: [
        {
          type: "1-Month Training Series",
          duration: "1 Month",
          dailyTime: "2 hrs",
          fee: "Rs. 15,000",
          tools: "Work on Upwork, Fiverr, LinkedIn & Indeed, Proposal Writing & Business Communication, Client Handling & Negotiation Techniques, Freelancing Tools & Strategy Building",
          outcome: "Strong BD basics + communication practice, Freelancing-ready profile + real client strategy projects"
        }
      ]
    },
    {
      id: 7,
      title: "ICR For Kids",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 10,000",
          tools: "Basic Graphic Designing, Video Editing + Computer Basics, Web Development (HTML/CSS Basics), English Language & Typing Practice, YouTube & Social Media Fun Learning, AI Tools like ChatGPT & More, Tech Trends for Young Minds",
          outcome: "Digital skills fun-based introduction, Boost in creativity, typing & confidence, Tech awareness from an early age"
        }
      ]
    },
    {
      id: 8,
      title: "YouTube Automation",
      options: [
        {
          type: "1-Month Training Series",
          duration: "1 Month",
          dailyTime: "2 hrs",
          fee: "Rs. 20,000",
          tools: "YouTube Niche & Channel Strategy, Scriptwriting & AI Tools, Voiceover & Editing Workflow, Monetization, Growth & Scaling",
          outcome: "Channel-ready skills to start automation, AI-powered content planning & production, Monetization complete roadmap"
        }
      ]
    },
    {
      id: 9,
      title: "UI/UX Design",
      options: [
        {
          type: "1-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 15,000",
          tools: "UI Design Principles & Layouts, User Research & Wireframing, Figma Tools & Prototypes, Mobile & Web App Interface Design",
          outcome: "Design functional app & web UI, Build clickable prototypes in Figma, Ready for internships & freelance gigs"
        }
      ]
    },
    {
      id: 10,
      title: "English Language",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 20,000",
          tools: "Grammar & Vocabulary, Reading, Writing, Speaking Practice",
          outcome: "Improved fluency & sentence structure, Confident communication in English"
        }
      ]
    },
    {
      id: 11,
      title: "IELTS",
      options: [
        {
          type: "2-Month Training Series",
          duration: "2 Months",
          dailyTime: "2 hrs",
          fee: "Rs. 25,000",
          tools: "IELTS Listening, Reading, Writing & Speaking, Timed Mock Tests, Exam Strategies & Band Score Tips, Speaking Fluency & Essay Writing Practice",
          outcome: "Familiarity with actual IELTS format, Better time & pressure management, Band-focused preparation for study/work abroad"
        }
      ]
    }
  ];

  const whyChooseUs = [
    { title: "Expert Instructors", desc: "Learn from industry professionals with years of experience" },
    { title: "Career Support", desc: "Get placement assistance and career guidance" },
    { title: "Hands-on Projects", desc: "Work on real-world projects to build your portfolio" },
    { title: "Certification", desc: "Receive a recognized certificate upon completion" }
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="mb-4 text-white bg-dark p-3 rounded">Our Courses</h1>
        <p className="lead">Comprehensive IT training programs designed to launch your career in technology</p>
      </div>

      {courses.map(course => (
        <div key={course.id} className="mb-5">
          <h2 className="mb-4">{course.title}</h2>
          <div className="row g-4">
            {course.options.map((option, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{option.type}</h5>
                    <span className="badge bg-success mb-2 align-self-start">{option.fee}</span>
                    <p className="mb-1"><strong>Duration:</strong> {option.duration}</p>
                    <p className="mb-1"><strong>Daily Time:</strong> {option.dailyTime}</p>
                    <p className="mb-1"><strong>Tools & Topics:</strong> {option.tools}</p>
                    <p className="mt-auto"><strong>Outcome:</strong> {option.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="my-5">
        <h3 className="text-center mb-4">Why Choose Our Courses?</h3>
        <div className="row g-4">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="card h-100 text-center shadow-sm p-3">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
