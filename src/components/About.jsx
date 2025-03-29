import React from "react";
import "../styles/About.css";
import { GithubIcon, LinkedInIcon, TwitterIcon } from "./Icons";

function About() {
  const teamMembers = [
    {
      name: "Aakash Singh",
      role: "AI Specialist",
      image:
        "https://i.pinimg.com/736x/e6/3a/ab/e63aab82ee9ec452e5d1b93e87105dc9.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
      bio: "Full-stack developer with expertise in AI and machine learning.",
    },
    {
      name: "Ananya Kanthraj",
      role: "Frontend Developer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCvTrUGSCZo920TjHoAvWnjoTD9LD3OL26Nw&s",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
      bio: "Passionate about creating intuitive and accessible user experiences. Leading the design of our yoga platform.",
    },
    {
      name: "Bhoomika Mohan",
      role: "Backend Developer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaHztmljGJuHSVw8kgycDEXa5uCxZ9paKQ4w&s",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
      bio: "A great backend developer with knowledge of AI and machine learning.",
    },
    {
      name: "Aditya Anjan Jha",
      role: "Blockchain Developer",
      image:
        "https://i.pinimg.com/736x/b9/b0/3f/b9b03f73e300846543fdb63b2afd4ab9.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
      bio: "A new developer in the web3 world excited to use the defi and make interesting dapps helping people",
    },
  ];

  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Us</h1>
        <p className="about-mission">
          We're on a mission to make yoga accessible to everyone through
          technology. Our team combines expertise in AI, development, design,
          and yoga to create an innovative learning platform.
        </p>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="card-header">
                <img
                  src={member.image}
                  alt={member.name}
                  className="profile-image"
                />
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
              </div>
              <p className="bio">{member.bio}</p>
              <div className="social-links">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Innovation</h3>
            <p>Pushing the boundaries of technology to enhance yoga practice</p>
          </div>
          <div className="value-card">
            <h3>Accessibility</h3>
            <p>Making yoga learning available to everyone, everywhere</p>
          </div>
          <div className="value-card">
            <h3>Quality</h3>
            <p>Ensuring accurate and reliable pose detection and feedback</p>
          </div>
        </div>
      </section>

      <section className="help-section">
        <h2>Need Financial Support?</h2>
        <div className="help-content">
          <p>
            We understand that financial constraints shouldn't prevent anyone
            from accessing quality yoga education. If you're interested in our
            platform but need financial assistance, please reach out to us.
          </p>
          <div className="email-contact">
            <h3>Contact Us</h3>
            <p>
              Email us at:{" "}
              <a href="mailto:aakashsgbp@gmail.com">aakashsgbp@gmail.com</a>
            </p>
            <p className="email-note">
              Please include your name, contact information, and a brief
              description of your situation in your email. Our team will review
              your request and get back to you within 2-3 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
