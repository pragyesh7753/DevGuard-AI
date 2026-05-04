import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="DevGuard AI" className="w-8 h-8" />
              <span className="text-lg font-bold">
                DevGuard{" "}
                <span className="bg-linear-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
            <p className="text-text-secondary">
              Built for developers, by developers.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="#features" className="hover:text-cyan-400 transition">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-cyan-400 transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-cyan-400 transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-cyan-400 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-cyan-400 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-text-secondary text-sm">
          <p>&copy; 2024 DevGuard AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-400 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
