import { useEffect } from "react";
import {
  Code,
  ArrowRight,
  Activity,
  ShieldCheck,
  Zap,
  Clock,
  Wrench,
  XCircle,
  CheckCircle,
} from "lucide-react";
import "./index.css";

function App() {
  // Subtle scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".glass-card, .step");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }
      });
    };

    // Initial setup
    const cards = document.querySelectorAll(".glass-card, .step");
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100); // Trigger once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Activity />,
      title: "Change Intelligence",
      desc: "Track every code modification and instantly understand what changed and why it matters.",
    },
    {
      icon: <Zap />,
      title: "Impact Visualization",
      desc: "Visualize how each change affects performance, dependencies, and system behavior.",
    },
    {
      icon: <ShieldCheck />,
      title: "Vulnerability Detection",
      desc: "Identify security risks and unsafe patterns before they reach production.",
    },
    {
      icon: <Code />,
      title: "Code Quality Analysis",
      desc: "Detect complex, poorly written functions and maintain clean, scalable code.",
    },
    {
      icon: <Wrench />,
      title: "AI Fix Engine",
      desc: "Get precise, one-click fixes for bugs, performance issues, and bad code patterns.",
    },
    {
      icon: <Clock />,
      title: "Command Tracking",
      desc: "Monitor terminal commands and understand their real impact on your codebase.",
    },
  ];

  return (
    <>
      <div className="grid-bg"></div>

      <div className="container">
        {/* Navbar */}
        <nav className="nav">
          <div className="logo-container">
            <img src="/logo.png" alt="DevGuard AI Logo" className="logo-icon" />
            <span>
              DevGuard <span className="gradient-text">AI</span>
            </span>
          </div>
        </nav>
        {/* Hero Section */}
        <section className="hero">
          <h1>
            Understand Every Code Change Before It Becomes a{" "}
            <span className="gradient-text">Problem</span>
          </h1>
          <p>
            DevGuard AI is a smart VS Code extension that analyzes code changes,
            detects risks, and suggests fixes in real-time.
          </p>
          <div className="hero-cta">
            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://marketplace.visualstudio.com/items?itemName=pragyeshKumarSeth.devguard-ai",
                  "_blank",
                )
              }
              className="btn btn-primary"
            >
              Install Extension <ArrowRight size={20} />
            </button>
          </div>

          <div className="dashboard-showcase" id="demo">
            <div className="dashboard-glow"></div>
            <div className="dashboard-images">
              <div className="dashboard-img-wrapper main-img">
                <img src="/real-dashboard.png" alt="DevGuard AI Overview" />
              </div>
              <div className="dashboard-img-wrapper secondary-img">
                <img
                  src="/terminal-dashboard.png"
                  alt="DevGuard AI Terminal Log"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="section">
          <h2 className="text-center mb-8" style={{ fontSize: "2.5rem" }}>
            Comprehensive <span className="gradient-text">Protection</span>
          </h2>
          <p
            className="text-center text-secondary mb-8"
            style={{ maxWidth: "600px", margin: "0 auto 3rem" }}
          >
            Everything you need to write secure, optimized, and bug-free code
            natively in your editor.
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="glass-card" key={index}>
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="mb-2">{feature.title}</h3>
                <p style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* How It Works */}
        <section className="section">
          <h2 className="text-center mb-8" style={{ fontSize: "2.5rem" }}>
            How It <span className="gradient-text">Works</span>
          </h2>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Write Code</h3>
              <p>Write or modify code as you normally would in VS Code.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analyzes</h3>
              <p>
                DevGuard AI instantly analyzes your changes in the background.
              </p>
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
            <h2 style={{ fontSize: "2.5rem" }}>
              Stop Guessing — Start{" "}
              <span className="gradient-text">Understanding</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
              Most developers write code blindly. DevGuard shows the real impact
              behind every action.
            </p>
          </div>

          <div className="comparison-grid">
            <div className="glass-card compare-card compare-bad">
              <h3>Without DevGuard</h3>
              <ul className="compare-list">
                <li>
                  <XCircle className="bad-icon" size={20} /> Run commands
                  without knowing consequences
                </li>
                <li>
                  <XCircle className="bad-icon" size={20} /> Bugs detected only
                  after breaking things
                </li>
                <li>
                  <XCircle className="bad-icon" size={20} /> No visibility into
                  code impact
                </li>
                <li>
                  <XCircle className="bad-icon" size={20} /> Hard to trace what
                  caused issues
                </li>
              </ul>
            </div>

            <div className="glass-card compare-card compare-good">
              <h3>With DevGuard</h3>
              <ul className="compare-list">
                <li>
                  <CheckCircle className="good-icon" size={20} /> Track every
                  command and code change
                </li>
                <li>
                  <CheckCircle className="good-icon" size={20} /> See impact
                  before it becomes a problem
                </li>
                <li>
                  <CheckCircle className="good-icon" size={20} /> Visualize
                  dependencies and performance shifts
                </li>
                <li>
                  <CheckCircle className="good-icon" size={20} /> Get instant
                  fixes with full context
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="logo-container" style={{ fontSize: "1.2rem" }}>
              <img
                src="/logo.png"
                alt="DevGuard AI Logo"
                className="logo-icon"
                style={{ width: "30px", height: "30px" }}
              />
              <span>
                DevGuard <span className="gradient-text">AI</span>
              </span>
            </div>

            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Built for developers, by developers.
            </div>

            <div className="footer-links">
              <button
                type="button"
                onClick={() => window.open("https://github.com/pragyesh7753/DevGuard-AI", "_blank")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "bold",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  padding: 0,
                }}
              >
                <Code size={20} /> GitHub
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
