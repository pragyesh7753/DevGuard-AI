import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-primary/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DevGuard AI" className="w-8 h-8" />
          <span className="text-xl font-bold">
            DevGuard{" "}
            <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="hover:text-accent-blue transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-accent-blue transition">
            How It Works
          </a>
          <a href="#comparison" className="hover:text-accent-blue transition">
            Why DevGuard
          </a>
          <a
            href="#"
            className="px-6 py-2 rounded-full bg-linear-to-r from-cyan-400 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            Install Extension
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10">
          <div className="flex flex-col gap-4 px-6 py-4">
            <a href="#features" className="hover:text-accent-blue transition">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-accent-blue transition"
            >
              How It Works
            </a>
            <a href="#comparison" className="hover:text-accent-blue transition">
              Why DevGuard
            </a>
            <a
              href="#"
              className="px-6 py-2 rounded-full bg-linear-to-r from-cyan-400 to-purple-600 text-white font-semibold text-center"
            >
              Install Extension
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
