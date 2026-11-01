import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Lock, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-blue-500/15 bg-space-950 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center shadow-glass-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">Resumind AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              AI-driven resume intelligence and ATS optimization. Evaluates candidate resumes against real industry rubrics, identifies missing keywords, and formats selectable-text PDFs without fabricating career facts.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-electric-400" /> Client-side parsing
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-electric-400" /> Private & Secure
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-electric-400" /> Advanced AI Engine
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/analyzer" className="hover:text-electric-400 transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/builder" className="hover:text-electric-400 transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-electric-400 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Attribution */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Developer</h4>
            <div className="p-3.5 rounded-xl bg-space-900 border border-blue-500/20 text-xs space-y-2">
              <p className="text-slate-300">
                Crafted with care by <strong className="text-white">Daniyal</strong>
              </p>
              <a
                href="https://m-daniyal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric-400 hover:text-white transition-colors group"
              >
                <span>Visit Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Developer Credit Bar */}
        <div className="pt-8 border-t border-space-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            Disclaimer: Resumind AI provides automated scoring estimates based on professional resume standards.
          </p>
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <a
              href="https://m-daniyal.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-electric-400 transition-colors inline-flex items-center gap-1"
            >
              Daniyal
              <ExternalLink className="w-3 h-3 text-electric-400" />
            </a>
            <span>• &copy; {new Date().getFullYear()} Resumind AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
