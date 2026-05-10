import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  BrainCircuit,
  Globe,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import "../styles/landing.scss";

const features = [
  {
    icon: <Zap size={26} />,
    title: "AI Hiring Engine",
    desc: "Instantly identify top candidates using intelligent ranking.",
  },
  {
    icon: <BrainCircuit size={26} />,
    title: "Smart Matching",
    desc: "Connect talent with the right opportunities automatically.",
  },
  {
    icon: <Mail size={26} />,
    title: "Seamless Workflow",
    desc: "Manage hiring and applications in one unified dashboard.",
  },
  {
    icon: <Globe size={26} />,
    title: "Global Platform",
    desc: "Built for both recruiters and candidates worldwide.",
  },
];

const steps = [
  "Create Profile",
  "Explore Opportunities",
  "AI Matches You",
  "Get Hired Faster",
];

document.addEventListener("mousemove", (e) => {
  document.querySelectorAll("button").forEach(btn => {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="bg-grid"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">
          Smart<span>Hire</span>
        </h2>

        <div className="nav-buttons">
          <button onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="badge">
            <Sparkles size={14} />
            AI Powered Platform
          </div>

          <h1>
            Hire smarter. <br />
            Get hired faster.
          </h1>

          <p>
            SmartHire brings recruiters and candidates together with AI-powered
            insights, automation, and seamless workflows.
          </p>

          <div className="buttons">
            <button
              className="primary"
              onClick={() => navigate("/register")}
            >
              Get Started <ArrowRight size={18} />
            </button>

            <button onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="dashboard-card">
            <h4>Top Candidate</h4>
            <p>Frontend Developer</p>

            <div className="score">92</div>

            <div className="progress">
              <div></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why SmartHire?</h2>

        <div className="grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="card"
              whileHover={{ y: -10 }}
            >
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="workflow">
        <h2>How it works</h2>

        <div className="grid">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="step"
              whileHover={{ y: -8 }}
            >
              <span>0{i + 1}</span>
              <h3>{s}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start your journey today</h2>

        <button onClick={() => navigate("/register")}>
          Get Started <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
};

export default LandingPage;