import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Understand Every Code Change Before It Becomes a{" "}
          <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Problem
          </span>
        </h1>

        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          DevGuard AI is a smart VS Code extension that analyzes code changes,
          detects risks, and suggests fixes in real-time.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <a
            href="#"
            className="px-8 py-3 rounded-full bg-linear-to-r from-cyan-400 to-purple-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:-translate-y-1"
          >
            Install Extension <ArrowRight size={20} />
          </a>
          <a
            href="#features"
            className="px-8 py-3 rounded-full bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition"
          >
            View Demo
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-600/20 to-purple-600/20 blur-3xl rounded-3xl"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <img
                src="/real-dashboard.png"
                alt="DevGuard Dashboard"
                className="w-full rounded-lg"
              />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <img
                src="/terminal-dashboard.png"
                alt="Terminal Integration"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
