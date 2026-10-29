import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  ArrowLeft,
  PenTool,
  Tag,
  Repeat,
  ShieldCheck,
  Loader2,
  Copy,
  Check,
  Award,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function AnalysisResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis && Boolean(id));
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [issueFilter, setIssueFilter] = useState('all');

  useEffect(() => {
    async function loadAnalysis() {
      if (analysis) return;
      if (!id) {
        navigate('/analyzer');
        return;
      }

      setLoading(true);
      try {
        const res = await api.getAnalysis(id);
        if (res?.data?.analysis) {
          setAnalysis(res.data.analysis);
        } else {
          setError('Analysis report not found.');
        }
      } catch (err) {
        setError(err.message || 'Could not fetch analysis record.');
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [id, analysis, navigate]);

  const handleCopyText = (text, idx) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-electric-500" />
        <p className="text-sm">Loading ATS evaluation breakdown...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 glass-panel rounded-2xl">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">No Analysis Data Available</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Please run an analysis first.'}</p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white btn-3d text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Analyzer</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    overallScore = 0,
    scoreBreakdown = {},
    strengths = [],
    issues = [],
    keywordGaps = [],
    rewriteSuggestions = [],
    disclaimer
  } = analysis;

  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        stroke: '#10b981',
        text: 'text-emerald-400',
        badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
        grade: 'A — ATS Ready'
      };
    }
    if (score >= 65) {
      return {
        stroke: '#3b82f6',
        text: 'text-electric-400',
        badge: 'bg-electric-950/70 text-electric-300 border-electric-500/30',
        grade: 'B — Competitive'
      };
    }
    return {
      stroke: '#f59e0b',
      text: 'text-amber-400',
      badge: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
      grade: 'C — Needs Polish'
    };
  };

  const scoreTheme = getScoreTheme(overallScore);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(100, Math.max(0, overallScore)) / 100) * circumference;

  const getSeverityBadge = (sev) => {
    if (sev === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
          <AlertOctagon className="w-3 h-3" /> Critical
        </span>
      );
    }
    if (sev === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-950/60 text-electric-400 border border-blue-500/30">
        <Lightbulb className="w-3 h-3" /> Tip
      </span>
    );
  };

  const filteredIssues =
    issueFilter === 'all' ? issues : issues.filter((i) => i.severity === issueFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10 radial-bg">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-blue-500/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/analyzer" className="hover:text-electric-400 transition-colors">
              Analyzer
            </Link>
            <span>/</span>
            <span className="text-white">Results Breakdown</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ATS Resume Intelligence Report
          </h1>
          {(location.state?.resumeTitle || analysis.resumeTitle) && (
            <p className="text-xs text-slate-400 mt-1">
              Document:{' '}
              <strong className="text-slate-200">
                {location.state?.resumeTitle || analysis.resumeTitle}
              </strong>
              {(location.state?.targetRole || analysis.targetRole) &&
                ` • Target: ${location.state?.targetRole || analysis.targetRole}`}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/analyzer"
            className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 transition-all"
          >
            Analyze Another
          </Link>
          <Link
            to="/builder"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Open in Builder</span>
          </Link>
        </div>
      </div>

      {/* 3D Hero Score Radial Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-electric-600/10 blur-3xl pointer-events-none" />

        {/* Radial SVG Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(30, 41, 59, 0.9)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={scoreTheme.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black tracking-tight ${scoreTheme.text}`}>
              {overallScore}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              / 100 pts
            </span>
          </div>
        </div>

        {/* Overview Details */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-space-800 text-electric-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>6-Category ATS Rubric</span>
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${scoreTheme.badge}`}>
              <Award className="w-3.5 h-3.5" />
              <span>Grade: {scoreTheme.grade}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {overallScore >= 85
              ? 'Outstanding Career Presentation'
              : overallScore >= 70
              ? 'Competitive Resume with High-Impact Opportunities'
              : 'Moderate Alignment — Priority Enhancements Needed'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Evaluated for measurable impact, action verb strength, keyword coverage, and ATS structural scanability. Explore the category breakdown and one-click bullet rewrites below.
          </p>

          {/* Mini Summary Pill Counts */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/25 text-emerald-300 font-medium">
              {strengths.length} Key Strengths
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/25 text-amber-300 font-medium">
              {issues.length} Action Items
            </span>
            <span className="px-3 py-1 rounded-lg bg-electric-950/50 border border-electric-500/25 text-electric-300 font-medium">
              {rewriteSuggestions.length} Bullet Rewrites
            </span>
          </div>
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-electric-400" />
            <span>Detailed Rubric Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400">100 Total Points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(scoreBreakdown).map(([key, cat]) => {
            const percentage = Math.round((cat.score / (cat.max || 1)) * 100);
            const titleMap = {
              contentRelevance: 'Content & Relevance',
              impactClarity: 'Impact & Clarity',
              skillsAlignment: 'Skills & Job Alignment',
              structureReadability: 'Structure & Readability',
              completenessConsistency: 'Completeness & Consistency',
              languageGrammar: 'Language & Grammar'
            };

            return (
              <div key={key} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {titleMap[key] || key}
                    </h4>
                    <span className="text-xs font-extrabold text-electric-400 bg-space-900 px-2 py-0.5 rounded-md border border-blue-500/20">
                      {cat.score} / {cat.max}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-space-900 h-2.5 rounded-full overflow-hidden mb-3 border border-blue-500/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        percentage >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : percentage >= 60
                          ? 'bg-gradient-to-r from-electric-600 to-electric-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{cat.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Verified Resume Strengths</span>
          </h3>

          {strengths.length === 0 ? (
            <p className="text-xs text-slate-400">No specific strengths highlighted.</p>
          ) : (
            <div className="space-y-3.5">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-space-850/90 border border-emerald-500/25 hover:border-emerald-500/45 transition-all"
                >
                  <h4 className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{str.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{str.evidence}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prioritized Weaknesses & Recommendations */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Prioritized Improvements</span>
            </h3>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1 bg-space-900 p-1 rounded-lg border border-blue-500/15 text-[11px]">
              {['all', 'critical', 'warning', 'tip'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setIssueFilter(sev)}
                  className={`px-2 py-0.5 rounded capitalize font-semibold transition-all ${
                    issueFilter === sev
                      ? 'bg-electric-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No issues in this category!</p>
          ) : (
            <div className="space-y-3.5">
              {filteredIssues.map((iss, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-space-850/90 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{iss.section || 'General'}</span>
                    {getSeverityBadge(iss.severity)}
                  </div>
                  <p className="text-xs text-slate-300 mb-2.5 font-medium">{iss.issue}</p>
                  <div className="text-xs text-electric-300 bg-space-900/80 p-3 rounded-lg border border-electric-500/20">
                    <strong className="block text-[10px] uppercase tracking-wider text-electric-400 mb-0.5">
                      Actionable Fix:
                    </strong>
                    {iss.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Target Job Keyword Gaps (when present) */}
      {keywordGaps.length > 0 && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-electric-400" />
              <span>Missing Job Description Keywords</span>
            </h3>
            <span className="text-xs text-slate-400">
              Only add keywords backed by your genuine experience
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordGaps.map((gap, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-electric-950 text-electric-300 font-bold text-xs border border-electric-500/35 mb-2">
                  + {gap.keyword}
                </span>
                {gap.context && (
                  <p className="text-[11px] text-slate-400 mb-1.5 line-clamp-2">
                    {gap.context}
                  </p>
                )}
                <p className="text-xs text-slate-200 leading-relaxed">{gap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before / After Rewrite Suggestions with Copy Button */}
      {rewriteSuggestions.length > 0 && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-electric-400" />
              <span>AI Bullet Point Upgrades (Before & After)</span>
            </h3>
            <span className="text-xs text-slate-400">Click Copy to paste into your Resume Builder</span>
          </div>

          <div className="space-y-4">
            {rewriteSuggestions.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-space-850/90 border border-blue-500/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-bold text-white px-2.5 py-0.5 rounded bg-space-900 border border-blue-500/20">
                    {item.section || 'Experience'}
                  </span>
                  <span className="text-[11px] text-electric-400 font-medium">{item.reason}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/25 text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                      Original Phrasing
                    </span>
                    <p className="leading-relaxed">{item.original}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-slate-100 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">
                          Upgraded ATS Bullet
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(item.suggested, idx)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-semibold transition-colors"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-medium leading-relaxed">{item.suggested}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Disclaimer */}
      <div className="p-4 rounded-xl bg-space-900 border border-slate-800 text-xs text-slate-500 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          {disclaimer ||
            'This score is an automated estimation based on standard ATS best practices and resume structure guidelines. It is not a guarantee of employment or ATS pass-through.'}
        </p>
      </div>
    </div>
  );
}
