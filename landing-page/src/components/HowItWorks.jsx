import { Code2, Brain, Lightbulb } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: <Code2 className="w-12 h-12" />,
      title: "Write Code",
      desc: "Write or modify code as you normally would in VS Code.",
    },
    {
      number: 2,
      icon: <Brain className="w-12 h-12" />,
      title: "AI Analyzes",
      desc: "DevGuard AI instantly analyzes your changes in the background.",
    },
    {
      number: 3,
      icon: <Lightbulb className="w-12 h-12" />,
      title: "Get Insights",
      desc: "Receive instant security insights and one-click auto-fixes.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          How It{" "}
          <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Works
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative w-20 h-20 bg-linear-to-r from-cyan-400/20 to-purple-600/20 rounded-full flex items-center justify-center border border-cyan-400/50">
                  <div className="text-cyan-400">{step.icon}</div>
                  <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-text-secondary">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
