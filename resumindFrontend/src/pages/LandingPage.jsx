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
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassSurface from '../components/react-bits/GlassSurface';
import WeeklyLimitModal from '../components/WeeklyLimitModal';
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
  const { isAuthenticated, user } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [activeColor, setActiveColor] = useState('#0466c8');
  const [limitModalType, setLimitModalType] = useState(null);
  const heroRef = useRef(null);

  const quota = user?.weeklyQuota || {
    resumesRemaining: 10,
    analysesRemaining: 10
  };
  const resumeLimitFull = isAuthenticated && quota.resumesRemaining <= 0;
  const analysisLimitFull = isAuthenticated && quota.analysesRemaining <= 0;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
      gsap.fromTo('.hero-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, delay: 0.08, ease: 'power2.out', clearProps: 'all' });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.16, ease: 'power2.out', clearProps: 'all' });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.24, ease: 'power2.out', clearProps: 'all' });
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
    <div ref={heroRef} className="relative overflow-x-hidden min-h-screen">
      <WeeklyLimitModal
        open={Boolean(limitModalType)}
        onClose={() => setLimitModalType(null)}
        limitType={limitModalType || 'resume'}
        quota={user?.weeklyQuota}
      />

      {/* Hero Section floating above @react-bits/Galaxy-JS-CSS */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-24 text-center">
          {/* Badge */}
          <GlassSurface
            borderRadius={999}
            className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 text-[#3b9eff] text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Real AI Resume Intelligence — No Fabricated Credentials</span>
          </GlassSurface>

          {/* Headline */}
          <h1 className="hero-title text-3xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Analyze, Optimize, and Build <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3b9eff] via-[#0466c8] to-[#979dac] bg-clip-text text-transparent">
              High-Impact Resumes with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle mt-6 text-sm sm:text-lg text-[#979dac] max-w-2xl mx-auto leading-relaxed">
            Upload your existing resume to identify keyword gaps against target job descriptions, or build a polished, ATS-optimized resume with verified selectable-text PDF export.
          </p>

          {/* Dual CTAs */}
          <div className="hero-cta mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white btn-3d group"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>

                {resumeLimitFull ? (
                  <button
                    type="button"
                    onClick={() => setLimitModalType('resume')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold btn-limit-locked"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Resume Builder</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-black text-xs">
                      !
                    </span>
                  </button>
                ) : (
                  <GlassSurface
                    as={Link}
                    to="/builder"
                    borderRadius={14}
                    interactive
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-white"
                  >
                    <PenTool className="w-4 h-4 text-[#3b9eff]" />
                    <span>Resume Builder</span>
                  </GlassSurface>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white btn-3d group"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
                <GlassSurface
                  as={Link}
                  to="/login"
                  borderRadius={14}
                  interactive
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-white"
                >
                  <span>Sign In to Account</span>
                </GlassSurface>
              </>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#979dac]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>100-Point Transparent Rubric</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Selectable-Text Vector PDFs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Zero Server Stored Files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Truthfulness Protocol</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Features — GlassSurface Cards */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-t border-[#33415c]/50">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-xs font-bold text-[#3b9eff] tracking-wider uppercase mb-2">Two Distinct Modules</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">Engineered for Honest Career Acceleration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Module 1: Analyzer */}
          <GlassSurface borderRadius={22} interactive className="p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-[#0466c8]/25 border border-[#0466c8]/40 flex items-center justify-center mb-5">
              <FileSearch className="w-6 h-6 text-[#3b9eff]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Module 1 — Resume Analyzer</h3>
            <p className="text-[#979dac] text-xs sm:text-sm leading-relaxed mb-6">
              Extracts text client-side from your PDF or DOCX file, compares it against an optional target role and job description, and evaluates it across 6 clear categories.
            </p>
            <ul className="space-y-3 text-xs text-slate-200 mb-7">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Overall 0-100 score with exact category breakdowns</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Strengths backed by direct evidence from your resume text</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Job description keyword gaps & prioritized recommendations</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Before-and-after bullet rewrites with strong action verbs</span>
              </li>
            </ul>

            {analysisLimitFull ? (
              <button
                type="button"
                onClick={() => setLimitModalType('analysis')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Your Resume (!)</span>
              </button>
            ) : (
              <Link
                to={isAuthenticated ? '/analyzer' : '/register'}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0466c8]/25 hover:bg-[#0466c8]/40 border border-[#0466c8]/45 text-xs font-semibold text-white transition-all"
              >
                <span>{isAuthenticated ? 'Test Your Resume' : 'Sign Up to Test Resume'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </GlassSurface>

          {/* Module 2: Builder */}
          <GlassSurface borderRadius={22} interactive className="p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-[#0466c8]/25 border border-[#0466c8]/40 flex items-center justify-center mb-5">
              <PenTool className="w-6 h-6 text-[#3b9eff]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Module 2 — Resume Builder</h3>
            <p className="text-[#979dac] text-xs sm:text-sm leading-relaxed mb-6">
              A structured form builder allowing you to add, edit, and organize your genuine career facts. Real AI helps polish phrasing without ever inventing fake credentials.
            </p>
            <ul className="space-y-3 text-xs text-slate-200 mb-7">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Multi-section guided forms: Experience, Skills, Education, Projects</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>AI improvement proposals with review/accept/reject controls</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>Five ATS-friendly templates with custom color themes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3b9eff] shrink-0 mt-0.5" />
                <span>One-click selectable-text vector PDF export</span>
              </li>
            </ul>

            {resumeLimitFull ? (
              <button
                type="button"
                onClick={() => setLimitModalType('resume')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch Builder (!)</span>
              </button>
            ) : (
              <Link
                to={isAuthenticated ? '/builder' : '/register'}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0466c8]/25 hover:bg-[#0466c8]/40 border border-[#0466c8]/45 text-xs font-semibold text-white transition-all"
              >
                <span>{isAuthenticated ? 'Launch Builder' : 'Sign Up to Build Resume'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </GlassSurface>
        </div>
      </section>

      {/* Interactive A4 Template Preview Section */}
      <section id="templates" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#33415c]/50">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xs font-bold text-[#3b9eff] tracking-wider uppercase mb-2">Interactive A4 Showcase</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">Five Distinct ATS-Ready Templates</p>
          <p className="text-[#979dac] text-xs sm:text-sm mt-2">
            Switch between templates and choose your preferred accent color. Displayed in true A4 paper proportions across both desktop and mobile.
          </p>

          {/* Single-Line Template Switcher + Popup Color Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <GlassSurface borderRadius={14} className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full">
              {RESUME_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTemplate === tmpl.id
                      ? 'bg-[#0466c8] text-white shadow-glass-glow'
                      : 'text-[#979dac] hover:text-white'
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
            </GlassSurface>

            <ColorPickerPopover
              value={activeColor}
              onChange={setActiveColor}
              buttonClassName="h-10 px-3.5 rounded-xl text-xs font-semibold text-white rb-glass-surface flex items-center justify-center gap-1.5 whitespace-nowrap"
            />
          </div>
        </div>

        {/* Full A4 Sheet Container without internal scrollbars */}
        <GlassSurface borderRadius={24} className="p-3 sm:p-6 md:p-8 max-w-4xl mx-auto">
          <div className="mb-4 flex items-center justify-between text-xs text-[#979dac] border-b border-[#33415c]/50 pb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>A4 Paper Preview:</span>
              <strong className="text-white capitalize">{activeTemplate}</strong>
            </span>
            {resumeLimitFull ? (
              <button
                type="button"
                onClick={() => setLimitModalType('resume')}
                className="text-amber-300 hover:text-white font-bold flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit in Builder (!)</span>
              </button>
            ) : (
              <Link
                to={isAuthenticated ? '/builder' : '/register'}
                className="text-[#3b9eff] hover:text-white font-semibold flex items-center gap-1"
              >
                <span>{isAuthenticated ? 'Edit in Builder' : 'Customize Yours'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <A4ResumeViewport>{renderActivePreview()}</A4ResumeViewport>
        </GlassSurface>
      </section>

      {/* Transparent Scoring Rubric Breakdown */}
      <section id="rubric" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#33415c]/50">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-[#3b9eff] tracking-wider uppercase mb-2">Scoring Rubric</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">How Resumind Scores Your Resume</p>
          <p className="text-[#979dac] text-sm mt-3">
            Every analysis calculates an honest 100-point total backed by clear criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: 'Content & Relevance',
              pts: '25 pts',
              desc: 'Depth of professional accomplishments, scope of responsibility, and relevance to industry expectations.'
            },
            {
              title: 'Impact & Clarity',
              pts: '20 pts',
              desc: 'Use of strong action verbs, quantifiable metrics, and concise phrasing over vague passive bullet points.'
            },
            {
              title: 'Skills & Job Alignment',
              pts: '20 pts',
              desc: 'Match against target job description keywords and relevant hard/soft competencies.'
            },
            {
              title: 'Structure & Readability',
              pts: '15 pts',
              desc: 'Logical ordering, section hierarchy, bullet point density, and scan-ability for ATS parsing systems.'
            },
            {
              title: 'Completeness & Consistency',
              pts: '10 pts',
              desc: 'Presence of contact details, uniform date formats, and lack of unexplained gaps or disjointed sections.'
            },
            {
              title: 'Language & Grammar',
              pts: '10 pts',
              desc: 'Professional voice, active phrasing, correct grammar, and absence of spelling errors.'
            }
          ].map((item) => (
            <GlassSurface key={item.title} borderRadius={18} interactive className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <span className="text-xs font-bold text-[#3b9eff] bg-[#001233] px-2 py-0.5 rounded border border-[#0466c8]/40">
                  {item.pts}
                </span>
              </div>
              <p className="text-xs text-[#979dac] leading-relaxed">{item.desc}</p>
            </GlassSurface>
          ))}
        </div>
      </section>

      {/* Truthfulness & Privacy Notice */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlassSurface borderRadius={20} className="p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#0466c8]/25 border border-[#0466c8]/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-[#3b9eff]" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Our Strict Truthfulness Protocol</h4>
            <p className="text-xs text-[#979dac] leading-relaxed">
              Resumind AI never fabricates employers, degrees, certifications, or metrics. While AI can improve phrasing and identify keywords, career credibility relies on authentic experience. Documents are parsed directly inside your browser.
            </p>
          </div>
        </GlassSurface>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#33415c]/50">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold text-[#3b9eff] tracking-wider uppercase mb-2">Frequently Asked Questions</h2>
          <p className="text-2xl font-bold text-white">Everything You Need to Know</p>
        </div>

        <div className="space-y-4 text-sm">
          <GlassSurface borderRadius={18} interactive className="p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Will my exported PDF pass through Applicant Tracking Systems (ATS)?</span>
            </h4>
            <p className="text-xs text-[#979dac] leading-relaxed">
              Yes. All Resumind AI templates export genuine vector PDFs generated with selectable text and clean hierarchy. We do not flatten resumes into screenshots or unsearchable images.
            </p>
          </GlassSurface>

          <GlassSurface borderRadius={18} interactive className="p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Is my resume stored or shared?</span>
            </h4>
            <p className="text-xs text-[#979dac] leading-relaxed">
              When you upload a file, text is parsed entirely in your browser using client-side JavaScript. Only the extracted text is processed for the evaluation. You can delete your saved resumes and analyses anytime.
            </p>
          </GlassSurface>

          <GlassSurface borderRadius={18} interactive className="p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#3b9eff] shrink-0" />
              <span>Can the AI write fake accomplishments for me?</span>
            </h4>
            <p className="text-xs text-[#979dac] leading-relaxed">
              No. Our AI is prompted with a strict truthfulness protocol. It helps reorganize and strengthen your real bullet points with powerful action verbs, but prompts you with targeted questions whenever facts or metrics are missing.
            </p>
          </GlassSurface>
        </div>
      </section>
    </div>
  );
}
