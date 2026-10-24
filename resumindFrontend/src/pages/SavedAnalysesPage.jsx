import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Clock,
  FileSearch,
  Trash2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function SavedAnalysesPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const res = await api.listAnalyses();
      if (res?.data?.analyses) {
        setAnalyses(res.data.analyses);
      }
    } catch (err) {
      setError(err.message || 'Could not load your analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete evaluation report for "${title || 'this analysis'}"?`)) {
      return;
    }
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (score >= 60) return 'text-electric-400 border-electric-500/30 bg-electric-950/40';
    return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-blue-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past ATS evaluation reports, rubric scores, and before/after recommendations.
          </p>
        </div>
        <Link
          to="/analyzer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow transition-all"
        >
          <FileSearch className="w-4 h-4" />
          <span>Run New Analysis</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-500" />
          <p className="text-xs">Loading analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-blue-500/25 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-space-800 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-white">No evaluation reports saved</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Upload your resume to test it against our 100-point rubric and get keyword gap analysis.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow"
          >
            <FileSearch className="w-4 h-4" />
            <span>Analyze Resume Now</span>
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-space-800 shadow-glass">
          {analyses.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-space-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-bold shrink-0 ${getScoreColor(
                    item.overallScore
                  )}`}
                >
                  <span className="text-lg leading-none">{item.overallScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">/ 100</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">
                    {item.resumeTitle || 'Resume Evaluation'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                    {item.targetRole && <span>Role: {item.targetRole}</span>}
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  to={`/analyses/${item._id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-electric-600/30 hover:bg-electric-600 border border-electric-500/40 transition-all"
                >
                  <span>View Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(item._id, item.resumeTitle)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
