import { Activity, Zap, ShieldCheck, Code, Wrench, Clock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Change Intelligence",
      desc: "Track every code modification and instantly understand what changed and why it matters.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Impact Visualization",
      desc: "Visualize how each change affects performance, dependencies, and system behavior.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Vulnerability Detection",
      desc: "Identify security risks and unsafe patterns before they reach production.",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Quality Analysis",
      desc: "Detect complex, poorly written functions and maintain clean, scalable code.",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "AI Fix Engine",
      desc: "Get precise, one-click fixes for bugs, performance issues, and bad code patterns.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Command Tracking",
      desc: "Monitor terminal commands and understand their real impact on your codebase.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comprehensive{" "}
            <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Protection
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to write secure, optimized, and bug-free code
            natively in your editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 hover:bg-white/10 transition transform hover:-translate-y-1 group"
            >
              <div className="text-cyan-400 mb-4 group-hover:text-purple-400 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
