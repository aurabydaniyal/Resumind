import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  PenTool,
  Tag,
  Repeat,
  ShieldCheck,
  Loader2,
  FileText
} from 'lucide-react';

export default function AnalysisResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis && Boolean(id));
  const [error, setError] = useState('');

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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-electric-600 hover:bg-electric-500 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Analyzer</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    overallScore,
    scoreBreakdown = {},
    strengths = [],
    issues = [],
    keywordGaps = [],
    rewriteSuggestions = [],
    disclaimer
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (score >= 60) return 'text-electric-400 border-electric-500/30 bg-electric-950/40';
    return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
  };

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
            Resume Evaluation Report
          </h1>
          {location.state?.resumeTitle && (
            <p className="text-xs text-slate-400 mt-1">
              Document: <strong className="text-slate-200">{location.state.resumeTitle}</strong>
              {location.state?.targetRole && ` • Target: ${location.state.targetRole}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyzer"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-space-850 hover:bg-space-800 border border-blue-500/20 transition-all"
          >
            Analyze Another
          </Link>
          <Link
            to="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow transition-all"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Open in Builder</span>
          </Link>
        </div>
      </div>

      {/* Hero Score Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-glass">
        {/* Score Ring */}
        <div className={`w-36 h-36 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor(overallScore)}`}>
          <span className="text-5xl font-black tracking-tight">{overallScore}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">out of 100</span>
        </div>

        {/* Overview Details */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-space-800 text-electric-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evaluated against 6-Category ATS Rubric</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {overallScore >= 85
              ? 'Outstanding Career Presentation'
              : overallScore >= 70
              ? 'Competitive Resume with Actionable Enhancements'
              : 'Moderate Alignment — Key Gaps Detected'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            This evaluation reflects quantifiable impact, keyword density, section organization, and ATS scanability. Review the category breakdown below for concrete areas of improvement.
          </p>
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Detailed Rubric Breakdown</h3>
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
              <div key={key} className="glass-card p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {titleMap[key] || key}
                    </h4>
                    <span className="text-xs font-bold text-electric-400">
                      {cat.score} / {cat.max}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-space-800 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-electric-500' : 'bg-amber-500'
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Strengths Backed by Evidence</span>
          </h3>

          {strengths.length === 0 ? (
            <p className="text-xs text-slate-400">No specific strengths highlighted.</p>
          ) : (
            <div className="space-y-4">
              {strengths.map((str, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-space-850/80 border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-300 mb-1">{str.title}</h4>
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
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Prioritized Areas for Improvement</span>
          </h3>

          {issues.length === 0 ? (
            <p className="text-xs text-slate-400">No critical weaknesses detected!</p>
          ) : (
            <div className="space-y-4">
              {issues.map((iss, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-space-850/80 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{iss.section || 'General'}</span>
                    {getSeverityBadge(iss.severity)}
                  </div>
                  <p className="text-xs text-slate-300 mb-2 font-medium">{iss.issue}</p>
                  <div className="text-xs text-electric-400 bg-space-900/60 p-2.5 rounded-lg border border-electric-500/20">
                    <strong className="block text-[11px] text-slate-400 mb-0.5">Recommendation:</strong>
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
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-electric-400" />
              <span>Job Description Keyword Gaps</span>
            </h3>
            <span className="text-xs text-slate-400">
              Only include skills you have genuine experience with
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordGaps.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-space-850 border border-blue-500/20">
                <span className="inline-block px-2 py-0.5 rounded bg-electric-950 text-electric-400 font-bold text-xs border border-electric-500/30 mb-2">
                  {gap.keyword}
                </span>
                {gap.context && (
                  <p className="text-[11px] text-slate-400 mb-1.5 line-clamp-2">
                    {gap.context}
                  </p>
                )}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {gap.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before / After Rewrite Suggestions */}
      {rewriteSuggestions.length > 0 && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Repeat className="w-5 h-5 text-electric-400" />
            <span>Before / After Bullet Rewrite Suggestions</span>
          </h3>

          <div className="space-y-4">
            {rewriteSuggestions.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-space-850/90 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Section: {item.section || 'Experience'}</span>
                  <span className="text-[11px] text-electric-400">{item.reason}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Original Bullet:</span>
                    <p>{item.original}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Proposed Rewrite:</span>
                    <p className="font-medium">{item.suggested}</p>
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
