import { XCircle, CheckCircle } from "lucide-react";

export default function Comparison() {
  return (
    <section id="comparison" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stop Guessing — Start{" "}
            <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Understanding
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Most developers write code blindly. DevGuard shows the real impact
            behind every action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without DevGuard */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-red-400">
              Without DevGuard
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <span>Run commands without knowing consequences</span>
              </li>
              <li className="flex gap-3 items-start">
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <span>Bugs detected only after breaking things</span>
              </li>
              <li className="flex gap-3 items-start">
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <span>No visibility into code impact</span>
              </li>
              <li className="flex gap-3 items-start">
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <span>Hard to trace what caused issues</span>
              </li>
            </ul>
          </div>

          {/* With DevGuard */}
          <div className="bg-white/5 backdrop-blur border border-cyan-400/50 rounded-2xl p-8 ring-1 ring-cyan-400/20">
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">
              With DevGuard
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <span>Track every command and code change</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <span>See impact before it becomes a problem</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <span>Visualize dependencies and performance shifts</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <span>Get instant fixes with full context</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
