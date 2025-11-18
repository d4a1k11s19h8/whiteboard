import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="container">
          <h1>Create Together, In Real-Time</h1>
          <p className="hero-subtitle">
            A powerful collaborative whiteboard where teams draw, brainstorm, and chat together instantly
          </p>
          <div className="cta-buttons">
            <Link to="/auth" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2>Start Drawing Now</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Drawing Tools</h3>
              <p>Professional pen, colors, and eraser for creative freedom</p>
            </div>
            <div className="feature-card">
              <h3>Real-Time Sync</h3>
              <p>See everyone's drawings appear instantly as they create</p>
            </div>
            <div className="feature-card">
              <h3>Live Chat</h3>
              <p>Communicate with your team while collaborating</p>
            </div>
            <div className="feature-card">
              <h3>Save & Export</h3>
              <p>Save your boards and export as images anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;