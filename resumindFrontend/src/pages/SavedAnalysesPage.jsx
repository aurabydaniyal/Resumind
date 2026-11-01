import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import WeeklyLimitModal from '../components/WeeklyLimitModal';
import GlassSurface from '../components/react-bits/GlassSurface';
import {
  Clock,
  FileSearch,
  Trash2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function SavedAnalysesPage() {
  const { user, refreshUser } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const quota = user?.weeklyQuota || {
    analysesLimit: 10,
    analysesRemaining: 10
  };
  const analysisLimitFull = quota.analysesRemaining <= 0;

  useEffect(() => {
    refreshUser();
    fetchAnalyses();
  }, [refreshUser]);

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
    if (score >= 60) return 'text-[#3b9eff] border-[#0466c8]/40 bg-[#001845]';
    return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <WeeklyLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        limitType="analysis"
        quota={user?.weeklyQuota}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[#33415c]/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-[#979dac] mt-1">
            Review past ATS evaluation reports, rubric scores, and before/after recommendations.
          </p>
        </div>

        {analysisLimitFull ? (
          <button
            type="button"
            onClick={() => setLimitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Run New Analysis</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-black">
              !
            </span>
          </button>
        ) : (
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
          >
            <FileSearch className="w-4 h-4" />
            <span>Run New Analysis</span>
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#979dac] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0466c8]" />
          <p className="text-xs">Loading analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <GlassSurface borderRadius={22} className="p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#001845] border border-[#33415c] flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-[#979dac]" />
          </div>
          <h3 className="text-base font-bold text-white">No evaluation reports saved</h3>
          <p className="text-xs text-[#979dac] mt-1 mb-6">
            Upload your resume to test it against our 100-point rubric and get keyword gap analysis.
          </p>
          {analysisLimitFull ? (
            <button
              type="button"
              onClick={() => setLimitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Analyze Resume Now (!)</span>
            </button>
          ) : (
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
            >
              <FileSearch className="w-4 h-4" />
              <span>Analyze Resume Now</span>
            </Link>
          )}
        </GlassSurface>
      ) : (
        <GlassSurface borderRadius={22} className="overflow-hidden divide-y divide-[#33415c]/50">
          {analyses.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#023e7d]/25 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-bold shrink-0 ${getScoreColor(
                    item.overallScore
                  )}`}
                >
                  <span className="text-lg leading-none">{item.overallScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#979dac] mt-0.5">/ 100</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">
                    {item.resumeTitle || 'Resume Evaluation'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#979dac] mt-1">
                    {item.targetRole && <span>Role: {item.targetRole}</span>}
                    <span className="flex items-center gap-1 text-[#7d8597]">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  to={`/analyses/${item._id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0466c8]/35 hover:bg-[#0466c8] border border-[#0466c8]/50 transition-all"
                >
                  <span>View Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(item._id, item.resumeTitle)}
                  className="p-2 rounded-xl text-[#979dac] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </GlassSurface>
      )}
    </div>
  );
}
