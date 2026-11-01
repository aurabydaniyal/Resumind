import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Lock, ExternalLink } from 'lucide-react';
import ElectricLogo from './react-bits/ElectricLogo';
import GlassSurface from './react-bits/GlassSurface';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#33415c]/50 bg-[#001233]/90 backdrop-blur-xl text-[#979dac] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <ElectricLogo size={36} />
              <span className="font-extrabold text-lg tracking-tight flex items-center gap-1">
                <span className="text-white">Resumind</span>
                <span className="text-[#0466c8]">AI</span>
              </span>
            </Link>
            <p className="text-[#979dac] text-xs leading-relaxed max-w-md">
              AI-driven resume intelligence and ATS optimization. Evaluates candidate resumes against real industry rubrics, identifies missing keywords, and formats selectable-text PDFs without fabricating career facts.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7d8597]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#3b9eff]" /> Client-side parsing
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#3b9eff]" /> Private & Secure
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#3b9eff]" /> Advanced AI Engine
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/analyzer" className="hover:text-[#3b9eff] transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/builder" className="hover:text-[#3b9eff] transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#3b9eff] transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Attribution */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Developer</h4>
            <GlassSurface borderRadius={14} className="p-3.5 text-xs space-y-2">
              <p className="text-[#979dac]">
                Crafted with care by <strong className="text-white">Daniyal</strong>
              </p>
              <a
                href="https://m-daniyal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b9eff] hover:text-white transition-colors group"
              >
                <span>Visit Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </GlassSurface>
          </div>
        </div>

        {/* Disclaimer & Developer Credit Bar */}
        <div className="pt-8 border-t border-[#33415c]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d8597]">
          <p className="text-center sm:text-left">
            Disclaimer: Resumind AI provides automated scoring estimates based on professional resume standards.
          </p>
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <a
              href="https://m-daniyal.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-[#3b9eff] transition-colors inline-flex items-center gap-1"
            >
              Daniyal
              <ExternalLink className="w-3 h-3 text-[#3b9eff]" />
            </a>
            <span>• &copy; {new Date().getFullYear()} Resumind AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
