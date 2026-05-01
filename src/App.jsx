import React, { useEffect } from 'react';
import { Shield, Code, ArrowRight, Activity, ShieldCheck, Zap, Clock, Wrench, FileText, Lightbulb, XCircle, CheckCircle } from 'lucide-react';
import './index.css';

function App() {
  
  // Subtle scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.glass-card, .step');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight * 0.9) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    };
    
    // Initial setup
    const cards = document.querySelectorAll('.glass-card, .step');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100); // Trigger once on load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Activity />, title: "Change Tracking", desc: "Monitor every line of code modified across your entire branch in real-time." },
    { icon: <Code />, title: "AI Code Review", desc: "Instantly receive AI-powered feedback on your code architecture, logic, and style." },
    { icon: <ShieldCheck />, title: "Security Scanner", desc: "Detect vulnerabilities and zero-day exploits before they are ever committed." },
    { icon: <Zap />, title: "Performance Analysis", desc: "Identify performance bottlenecks and memory leaks automatically." },
    { icon: <Clock />, title: "Risk Timeline", desc: "Visualize the potential impact of your changes over the lifetime of the project." },
    { icon: <Wrench />, title: "Auto Fix Suggestions", desc: "One-click application of AI-generated fixes for bugs and security flaws." },
    { icon: <FileText />, title: "Smart Summary", desc: "Generate a TL;DR of your PRs for faster reviewer comprehension." },
    { icon: <Lightbulb />, title: "Developer Insights", desc: "Learn and improve with personalized suggestions based on your coding habits." }
  ];

  return (
    <>
      <div className="grid-bg"></div>
      
      <div className="container">
        {/* Navbar */}
        <nav className="nav">
          <div className="logo-container">
            <img src="/logo.png" alt="DevGuard AI Logo" className="logo-icon" />
            <span>DevGuard <span className="gradient-text">AI</span></span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Log In</a>
            <a href="#" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Get Early Access</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <h1>Understand Every Code Change Before It Becomes a <span className="gradient-text">Problem</span></h1>
          <p>
            DevGuard AI is a smart VS Code extension that analyzes code changes, 
            detects risks, and suggests fixes in real-time.
          </p>
          <div className="hero-cta">
            <a href="#" className="btn btn-primary">
              Install Extension <ArrowRight size={20} />
            </a>
            <a href="#demo" className="btn btn-secondary">
              View Demo
            </a>
          </div>

          <div className="dashboard-showcase" id="demo">
            <div className="dashboard-glow"></div>
            <div className="dashboard-images">
              <div className="dashboard-img-wrapper main-img">
                <img src="/real-dashboard.png" alt="DevGuard AI Overview" />
              </div>
              <div className="dashboard-img-wrapper secondary-img">
                <img src="/terminal-dashboard.png" alt="DevGuard AI Terminal Log" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <h2 className="text-center mb-8" style={{ fontSize: '2.5rem' }}>Comprehensive <span className="gradient-text">Protection</span></h2>
          <p className="text-center text-secondary mb-8" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
            Everything you need to write secure, optimized, and bug-free code natively in your editor.
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="glass-card" key={index}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="section">
          <h2 className="text-center mb-8" style={{ fontSize: '2.5rem' }}>How It <span className="gradient-text">Works</span></h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Write Code</h3>
              <p>Write or modify code as you normally would in VS Code.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analyzes</h3>
              <p>DevGuard AI instantly analyzes your changes in the background.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Insights</h3>
              <p>Receive instant security insights and one-click auto-fixes.</p>
            </div>
          </div>
        </section>

        {/* Unique Value Section */}
        <section className="section">
          <div className="text-center mb-8">
            <h2 style={{ fontSize: '2.5rem' }}>Not just code review — <span className="gradient-text">Change Intelligence</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>See why the best teams are migrating to DevGuard AI.</p>
          </div>

          <div className="comparison-grid">
            <div className="glass-card compare-card compare-bad">
              <h3>Traditional Tools</h3>
              <ul className="compare-list">
                <li><XCircle className="bad-icon" size={20} /> Slow, blocks CI/CD pipelines</li>
                <li><XCircle className="bad-icon" size={20} /> False positives create alert fatigue</li>
                <li><XCircle className="bad-icon" size={20} /> Tells you what's wrong, not how to fix it</li>
                <li><XCircle className="bad-icon" size={20} /> Disconnected from your editor context</li>
              </ul>
            </div>
            
            <div className="glass-card compare-card compare-good">
              <h3>DevGuard AI</h3>
              <ul className="compare-list">
                <li><CheckCircle className="good-icon" size={20} /> Real-time feedback as you type</li>
                <li><CheckCircle className="good-icon" size={20} /> Context-aware AI reduces false positives</li>
                <li><CheckCircle className="good-icon" size={20} /> Provides 1-click applyable code fixes</li>
                <li><CheckCircle className="good-icon" size={20} /> Native VS Code extension integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="logo-container" style={{ fontSize: '1.2rem' }}>
              <img src="/logo.png" alt="DevGuard AI Logo" className="logo-icon" style={{ width: '30px', height: '30px' }} />
              <span>DevGuard <span className="gradient-text">AI</span></span>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Built for developers, by developers.
            </div>
            
            <div className="footer-links">
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <Code size={20} /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
