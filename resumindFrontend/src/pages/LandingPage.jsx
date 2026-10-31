import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Sparkles,
  FileSearch,
  PenTool,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  LayoutDashboard,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroVisual from '../components/HeroVisual';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import A4ResumeViewport from '../components/templates/A4ResumeViewport';
import ColorPickerPopover from '../components/templates/ColorPickerPopover';
import { RESUME_TEMPLATES } from '../components/templates/themeUtils';
import { DEMO_RESUME_DATA } from '../components/templates/demoResumeData';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [activeColor, setActiveColor] = useState('#2563eb');
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: -16, duration: 0.6, ease: 'power2.out' });
      gsap.from('.hero-title', { opacity: 0, y: 24, duration: 0.8, delay: 0.15, ease: 'power2.out' });
      gsap.from('.hero-subtitle', { opacity: 0, y: 16, duration: 0.7, delay: 0.3, ease: 'power2.out' });
      gsap.from('.hero-cta', { opacity: 0, y: 16, duration: 0.6, delay: 0.45, ease: 'power2.out' });
      gsap.from('.feature-card', {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.7,
        delay: 0.6,
        ease: 'power2.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const renderActivePreview = () => {
    const data = {
      ...DEMO_RESUME_DATA,
      selectedTemplate: activeTemplate,
      accentColor: activeColor
    };
    if (activeTemplate === 'classic') return <ClassicTemplate data={data} />;
    if (activeTemplate === 'minimal') return <MinimalTemplate data={data} />;
    if (activeTemplate === 'executive') return <ExecutiveTemplate data={data} />;
    if (activeTemplate === 'creative') return <CreativeTemplate data={data} />;
    return <ModernTemplate data={data} />;
  };

  return (
    <div ref={heroRef} className="relative overflow-hidden radial-bg min-h-screen">
      {/* Three.js Hero Visual Background */}
      <HeroVisual />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-space-850/90 border border-electric-500/30 text-electric-400 text-xs font-medium shadow-glass-glow mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real AI Resume Intelligence — No Fabricated Credentials</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Analyze, Optimize, and Build <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-electric-400 via-electric-500 to-blue-300 bg-clip-text text-transparent">
            High-Impact Resumes with AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload your existing resume to identify keyword gaps against target job descriptions, or build a polished, ATS-optimized resume with verified selectable-text PDF export.
        </p>

        {/* Dual CTAs */}
        <div className="hero-cta mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-blue-glow transition-all group"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/builder"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-space-800/80 hover:bg-space-700/80 border border-blue-500/20 hover:border-blue-500/40 transition-all"
              >
                <PenTool className="w-4 h-4 text-electric-400" />
                <span>Resume Builder</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-blue-glow transition-all group"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-space-800/80 hover:bg-space-700/80 border border-blue-500/20 hover:border-blue-500/40 transition-all"
              >
                <span>Sign In to Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-electric-400" />
            <span>100-Point Transparent Rubric</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-electric-400" />
            <span>Selectable-Text Vector PDFs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-electric-400" />
            <span>Zero Server Stored Files</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-electric-400" />
            <span>Truthfulness Protocol</span>
          </div>
        </div>
      </section>

      {/* Core Workflow Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-blue-500/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-electric-400 tracking-wider uppercase mb-2">Two Distinct Modules</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">Engineered for Honest Career Acceleration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Module 1: Analyzer */}
          <div className="feature-card glass-panel rounded-2xl p-8 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center mb-6">
              <FileSearch className="w-6 h-6 text-electric-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Module 1 — Resume Analyzer</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Extracts text client-side from your PDF or DOCX file, compares it against an optional target role and job description, and evaluates it across 6 clear categories.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Overall 0-100 score with exact category breakdowns</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Strengths backed by direct evidence from your resume text</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Job description keyword gaps & prioritized recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Before-and-after bullet rewrites with strong action verbs</span>
              </li>
            </ul>
            <Link
              to={isAuthenticated ? '/analyzer' : '/register'}
              className="inline-flex items-center gap-2 text-xs font-semibold text-electric-400 hover:text-white transition-colors"
            >
              <span>{isAuthenticated ? 'Test Your Resume' : 'Sign Up to Test Resume'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 2: Builder */}
          <div className="feature-card glass-panel rounded-2xl p-8 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center mb-6">
              <PenTool className="w-6 h-6 text-electric-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Module 2 — Resume Builder</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              A structured form builder allowing you to add, edit, and organize your genuine career facts. Real AI helps polish phrasing without ever inventing fake credentials.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Multi-section guided forms: Experience, Skills, Education, Projects</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>AI improvement proposals with review/accept/reject controls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>Five ATS-friendly templates with custom color themes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
                <span>One-click selectable-text vector PDF export</span>
              </li>
            </ul>
            <Link
              to={isAuthenticated ? '/builder' : '/register'}
              className="inline-flex items-center gap-2 text-xs font-semibold text-electric-400 hover:text-white transition-colors"
            >
              <span>{isAuthenticated ? 'Launch Builder' : 'Sign Up to Build Resume'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive A4 Template Preview Section */}
      <section id="templates" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-blue-500/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xs font-bold text-electric-400 tracking-wider uppercase mb-2">Interactive A4 Showcase</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">Five Distinct ATS-Ready Templates</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Switch between templates and choose your preferred accent color. Displayed in true A4 paper proportions across both desktop and mobile.
          </p>

          {/* Single-Line Template Switcher + Popup Color Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-space-850/90 border border-blue-500/20 shadow-glass overflow-x-auto no-scrollbar max-w-full">
              {RESUME_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTemplate === tmpl.id
                      ? 'bg-electric-600 text-white shadow-glass-glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tmpl.name}</span>
                  {tmpl.badge === 'New' && (
                    <span className="text-[8px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      New
                    </span>
                  )}
                </button>
              ))}
            </div>

            <ColorPickerPopover
              value={activeColor}
              onChange={setActiveColor}
              buttonClassName="h-10 px-3.5 rounded-xl text-xs font-semibold text-slate-200 bg-space-850/90 hover:bg-space-800 border border-blue-500/25 flex items-center justify-center gap-1.5 shadow-glass transition-all whitespace-nowrap"
            />
          </div>
        </div>

        {/* Full A4 Sheet Container without internal scrollbars */}
        <div className="glass-panel p-3 sm:p-6 md:p-8 rounded-2xl max-w-4xl mx-auto">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400 border-b border-space-800 pb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>A4 Paper Preview:</span>
              <strong className="text-white capitalize">{activeTemplate}</strong>
            </span>
            <Link
              to={isAuthenticated ? '/builder' : '/register'}
              className="text-electric-400 hover:text-white font-semibold flex items-center gap-1"
            >
              <span>{isAuthenticated ? 'Edit in Builder' : 'Customize Yours'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <A4ResumeViewport>{renderActivePreview()}</A4ResumeViewport>
        </div>
      </section>

      {/* Transparent Scoring Rubric Breakdown */}
      <section id="rubric" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-blue-500/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-electric-400 tracking-wider uppercase mb-2">Scoring Rubric</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">How Resumind Scores Your Resume</p>
          <p className="text-slate-400 text-sm mt-3">
            Every analysis calculates an honest 100-point total backed by clear criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Content & Relevance</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                25 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Depth of professional accomplishments, scope of responsibility, and relevance to industry expectations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Impact & Clarity</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                20 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use of strong action verbs, quantifiable metrics, and concise phrasing over vague passive bullet points.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Skills & Job Alignment</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                20 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Match against target job description keywords and relevant hard/soft competencies.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Structure & Readability</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                15 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logical ordering, section hierarchy, bullet point density, and scan-ability for ATS parsing systems.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Completeness & Consistency</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                10 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Presence of contact details, uniform date formats, and lack of unexplained gaps or disjointed sections.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">Language & Grammar</h4>
              <span className="text-xs font-bold text-electric-400 bg-electric-950 px-2 py-0.5 rounded border border-electric-500/30">
                10 pts
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional voice, active phrasing, correct grammar, and absence of spelling errors.
            </p>
          </div>
        </div>
      </section>

      {/* Truthfulness & Privacy Notice */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel p-6 rounded-xl border-blue-500/30 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-electric-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Our Strict Truthfulness Protocol</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Resumind AI never fabricates employers, degrees, certifications, or metrics. While AI can improve phrasing and identify keywords, career credibility relies on authentic experience. Documents are parsed directly inside your browser.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-blue-500/10">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold text-electric-400 tracking-wider uppercase mb-2">Frequently Asked Questions</h2>
          <p className="text-2xl font-bold text-white">Everything You Need to Know</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-electric-400" />
              Will my exported PDF pass through Applicant Tracking Systems (ATS)?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. All Resumind AI templates export genuine vector PDFs generated with selectable text and clean hierarchy. We do not flatten resumes into screenshots or unsearchable images.
            </p>
          </div>

          <div className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-electric-400" />
              Is my resume stored or shared?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you upload a file, text is parsed entirely in your browser using client-side JavaScript. Only the extracted text is processed for the evaluation. You can delete your saved resumes and analyses anytime.
            </p>
          </div>

          <div className="glass-card p-5 rounded-xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-electric-400" />
              Can the AI write fake accomplishments for me?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. Our AI is prompted with a strict truthfulness protocol. It helps reorganize and strengthen your real bullet points with powerful action verbs, but prompts you with targeted questions whenever facts or metrics are missing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
