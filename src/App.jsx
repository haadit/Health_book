import { useState } from "react";
import "./App.css";
import "./styles/Home.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import PoseValidator from "./components/PoseValidator";
import PoseLibrary from "./components/PoseLibrary";
import About from "./components/About";
import AnxietyDetection from "./components/AnxietyDetection";
import MeditationGuide from "./components/MeditationGuide";
import BlockchainFunding from "./components/blockchain/BlockchainFunding";
import {
  YogaHeroIcon,
  RealTimeIcon,
  LibraryIcon,
  ProgressIcon,
  AIIcon,
  PoseIcon,
  CameraIcon,
  FeedbackIcon,
  FlexibilityIcon,
  PostureIcon,
  StressIcon,
  StrengthIcon,
  WarriorPoseIcon,
  TreePoseIcon,
  MeditationIcon,
  SunSalutationIcon,
  YogaClassIcon,
  YogaJourneyIcon,
} from "./components/Icons";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title animate-fade-in">
                Master Your <span>Yoga Journey</span>
              </h1>
              <p className="hero-description animate-fade-in-delay">
                Transform your practice with AI-powered pose validation,
                real-time feedback, and personalized guidance. Join thousands of
                practitioners on their path to yoga mastery.
              </p>
              <div className="hero-cta-group">
                <a
                  href="#"
                  className="hero-cta primary animate-bounce"
                  onClick={() => setCurrentPage("validator")}
                >
                  Try Pose Validator
                </a>
                <a
                  href="#"
                  className="hero-cta secondary"
                  onClick={() => setCurrentPage("library")}
                >
                  Explore Poses
                </a>
              </div>
            </div>
            <div className="hero-illustration floating-animation">
              <YogaHeroIcon />
            </div>
          </section>

          <section className="quick-stats">
            <div className="stat-container">
              <div className="stat-item animate-on-scroll">
                <div className="stat-value">10,000+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item animate-on-scroll">
                <div className="stat-value">95%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-item animate-on-scroll">
                <div className="stat-value">50+</div>
                <div className="stat-label">Yoga Poses</div>
              </div>
              <div className="stat-item animate-on-scroll">
                <div className="stat-value">24/7</div>
                <div className="stat-label">AI Support</div>
              </div>
            </div>
          </section>

          <section className="main-features">
            <h2 className="section-title">Transform Your Practice</h2>
            <p className="section-description">
              Experience yoga like never before with our cutting-edge technology
            </p>
            <div className="features-grid">
              <div className="feature-card animate-on-scroll">
                <div className="feature-icon">
                  <AIIcon />
                </div>
                <h3>AI Pose Validation</h3>
                <p>
                  Get instant feedback on your form with our advanced pose
                  detection technology
                </p>
                <ul className="feature-list">
                  <li>Real-time analysis</li>
                  <li>Form correction</li>
                  <li>Alignment guidance</li>
                </ul>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="feature-icon">
                  <RealTimeIcon />
                </div>
                <h3>Real-Time Feedback</h3>
                <p>
                  Receive immediate guidance and corrections as you practice
                  your poses
                </p>
                <ul className="feature-list">
                  <li>Instant corrections</li>
                  <li>Audio guidance</li>
                  <li>Visual indicators</li>
                </ul>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="feature-icon">
                  <LibraryIcon />
                </div>
                <h3>Extensive Pose Library</h3>
                <p>
                  Access a comprehensive collection of yoga poses with detailed
                  instructions
                </p>
                <ul className="feature-list">
                  <li>50+ yoga poses</li>
                  <li>Detailed tutorials</li>
                  <li>Difficulty levels</li>
                </ul>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="feature-icon">
                  <ProgressIcon />
                </div>
                <h3>Progress Tracking</h3>
                <p>
                  Monitor your improvement over time with detailed analytics and
                  insights
                </p>
                <ul className="feature-list">
                  <li>Performance metrics</li>
                  <li>Progress charts</li>
                  <li>Achievement badges</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="testimonials">
            <h2 className="section-title">What Our Users Say</h2>
            <div className="testimonials-container">
              <div className="testimonial animate-on-scroll">
                <div className="testimonial-content">
                  "The AI feedback has completely transformed my practice. I can
                  now perfect my poses with confidence!"
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Sarah M.</div>
                  <div className="author-title">Yoga Enthusiast</div>
                </div>
              </div>

              <div className="testimonial animate-on-scroll">
                <div className="testimonial-content">
                  "As a yoga instructor, I recommend this app to all my
                  students. The real-time feedback is invaluable!"
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Michael R.</div>
                  <div className="author-title">Certified Yoga Instructor</div>
                </div>
              </div>

              <div className="testimonial animate-on-scroll">
                <div className="testimonial-content">
                  "The progress tracking keeps me motivated, and the pose
                  library is incredibly comprehensive."
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Emily K.</div>
                  <div className="author-title">Fitness Enthusiast</div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Ready to Transform Your Practice?</h2>
            <p>
              Join thousands of practitioners improving their yoga journey with
              AI guidance
            </p>
            <div className="cta-buttons">
              <button
                className="cta-button primary"
                onClick={() => setCurrentPage("validator")}
              >
                Start Free Trial
              </button>
              <button
                className="cta-button secondary"
                onClick={() => setCurrentPage("library")}
              >
                View Pose Library
              </button>
            </div>
          </section>
        </>
      )}

      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "validator" && <PoseValidator />}
      {currentPage === "library" && <PoseLibrary />}
      {currentPage === "about" && <About />}
      {currentPage === "anxiety" && <AnxietyDetection />}
      {currentPage === "meditation" && <MeditationGuide />}
      {currentPage === "funding" && <BlockchainFunding />}
    </div>
  );
}

export default App;
