import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { downloadResumePdf } from '../components/pdf/ResumePdfDocument';
import {
  Sparkles,
  FileSearch,
  PenTool,
  Clock,
  ArrowRight,
  Plus,
  Download,
  Trash2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [resumesRes, analysesRes] = await Promise.allSettled([
          api.listResumes(),
          api.listAnalyses()
        ]);

        if (resumesRes.status === 'fulfilled') {
          setResumes(resumesRes.value.data?.resumes || []);
        }
        if (analysesRes.status === 'fulfilled') {
          setAnalyses(analysesRes.value.data?.analyses || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleDownload = async (resumeId) => {
    try {
      setDownloadingId(resumeId);
      const res = await api.getResume(resumeId);
      if (res?.data?.resume) {
        await downloadResumePdf(res.data.resume);
      }
    } catch (err) {
      alert(`Could not download PDF: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteResume = async (id, title) => {
    if (!window.confirm(`Delete resume "${title || 'this resume'}"?`)) return;
    try {
      await api.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / analyses.length)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-blue-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Candidate Hub — <span className="text-electric-400">{user?.name || 'Daniyal'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build, analyze, and manage all your resumes with real ATS scoring from your central hub.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/analyzer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 transition-all shadow-sm"
          >
            <FileSearch className="w-4 h-4 text-electric-400" />
            <span>Analyze Resume</span>
          </Link>
          <Link
            to="/builder"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-electric-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Active Resumes</span>
            <strong className="text-2xl font-extrabold text-white">{resumes.length}</strong>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Average ATS Score</span>
            <strong className="text-2xl font-extrabold text-white">
              {avgScore !== null ? `${avgScore}/100` : 'No reviews'}
            </strong>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-electric-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Evaluation Reports</span>
            <strong className="text-2xl font-extrabold text-white">{analyses.length}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-500" />
          <p className="text-xs">Loading candidate dashboard...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Recent Saved Resumes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-electric-400" />
                <span>My Saved Resumes ({resumes.length})</span>
              </h2>
              {resumes.length > 0 && (
                <Link to="/resumes" className="text-xs font-medium text-electric-400 hover:text-white flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {resumes.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-blue-500/25">
                <div className="w-12 h-12 rounded-xl bg-space-800 flex items-center justify-center mx-auto mb-3">
                  <PenTool className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">No resumes created yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Start building your resume with guided sections, AI-assisted bullets, and live template previews.
                </p>
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Build First Resume</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resumes.slice(0, 6).map((item) => (
                  <div key={item._id} className="glass-card p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/30"
                            style={{ backgroundColor: item.accentColor || '#2563eb' }}
                            title="Accent Color"
                          />
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-space-800 text-electric-400 border border-blue-500/20">
                            {item.selectedTemplate || 'classic'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">
                        {item.targetRole ? `Role: ${item.targetRole}` : 'General Resume'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-space-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(item._id)}
                          disabled={downloadingId === item._id}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-space-700 transition-colors"
                          title="Download PDF"
                        >
                          {downloadingId === item._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-400" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Link
                          to={`/builder?id=${item._id}`}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-electric-600/30 hover:bg-electric-600 border border-electric-500/40 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteResume(item._id, item.title)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Evaluations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-electric-400" />
                <span>Recent Resume Analyses ({analyses.length})</span>
              </h2>
              {analyses.length > 0 && (
                <Link to="/analyses" className="text-xs font-medium text-electric-400 hover:text-white flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {analyses.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-blue-500/25">
                <div className="w-12 h-12 rounded-xl bg-space-800 flex items-center justify-center mx-auto mb-3">
                  <FileSearch className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">No analyses run yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Upload an existing resume file to get ATS scores, identify job description keyword gaps, and receive actionable rewrites.
                </p>
                <Link
                  to="/analyzer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>Run First Analysis</span>
                </Link>
              </div>
            ) : (
              <div className="glass-panel rounded-xl overflow-hidden divide-y divide-space-800">
                {analyses.slice(0, 5).map((item) => (
                  <div key={item._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-space-800/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
                          item.overallScore >= 80
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : item.overallScore >= 60
                            ? 'bg-blue-950/60 text-electric-400 border border-electric-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.overallScore}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{item.resumeTitle || 'Resume Evaluation'}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
                          {item.targetRole && <span>Role: {item.targetRole}</span>}
                          <span>• {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/analyses/${item._id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-electric-400 hover:text-white hover:bg-electric-600/20 border border-electric-500/30 transition-all self-end sm:self-auto"
                    >
                      <span>View Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
