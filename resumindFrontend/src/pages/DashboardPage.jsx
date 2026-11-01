import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { downloadResumePdf } from '../components/pdf/ResumePdfDocument';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import A4ResumeViewport from '../components/templates/A4ResumeViewport';
import ColorPickerPopover from '../components/templates/ColorPickerPopover';
import WeeklyLimitModal from '../components/WeeklyLimitModal';
import GlassSurface from '../components/react-bits/GlassSurface';
import { RESUME_TEMPLATES } from '../components/templates/themeUtils';
import { DEMO_RESUME_DATA } from '../components/templates/demoResumeData';
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
  Loader2,
  Eye,
  Timer,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Weekly Limit Modal State
  const [limitModalType, setLimitModalType] = useState(null);

  // Interactive A4 Template Demo state inside Dashboard
  const [demoTemplate, setDemoTemplate] = useState('modern');
  const [demoColor, setDemoColor] = useState('#0466c8');

  const quota = user?.weeklyQuota || {
    resumesLimit: 10,
    resumesUsed: 0,
    resumesRemaining: 10,
    analysesLimit: 10,
    analysesUsed: 0,
    analysesRemaining: 10
  };

  const resumeLimitFull = quota.resumesRemaining <= 0;
  const analysisLimitFull = quota.analysesRemaining <= 0;

  useEffect(() => {
    refreshUser();
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
  }, [refreshUser]);

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

  const renderDemoTemplate = () => {
    const data = {
      ...DEMO_RESUME_DATA,
      selectedTemplate: demoTemplate,
      accentColor: demoColor
    };
    if (demoTemplate === 'classic') return <ClassicTemplate data={data} />;
    if (demoTemplate === 'minimal') return <MinimalTemplate data={data} />;
    if (demoTemplate === 'executive') return <ExecutiveTemplate data={data} />;
    if (demoTemplate === 'creative') return <CreativeTemplate data={data} />;
    return <ModernTemplate data={data} />;
  };

  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / analyses.length)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Weekly Limit Wait Popup */}
      <WeeklyLimitModal
        open={Boolean(limitModalType)}
        onClose={() => setLimitModalType(null)}
        limitType={limitModalType || 'resume'}
        quota={user?.weeklyQuota}
      />

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-[#33415c]/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Candidate Hub — <span className="text-[#0466c8]">{user?.name || 'Daniyal'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#979dac] mt-1">
            Build, analyze, and manage all your resumes with real ATS scoring from your central hub.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {analysisLimitFull ? (
            <button
              type="button"
              onClick={() => setLimitModalType('analysis')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
              title="Weekly AI analysis limit reached — click to view reset timer"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Analyze Resume</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-black">
                !
              </span>
            </button>
          ) : (
            <GlassSurface
              as={Link}
              to="/analyzer"
              borderRadius={12}
              interactive
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white"
            >
              <FileSearch className="w-4 h-4 text-[#3b9eff]" />
              <span>Analyze Resume</span>
            </GlassSurface>
          )}

          {resumeLimitFull ? (
            <button
              type="button"
              onClick={() => setLimitModalType('resume')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
              title="Weekly resume build limit reached — click to view reset timer"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>New Resume</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-black">
                !
              </span>
            </button>
          ) : (
            <Link
              to="/builder"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </Link>
          )}
        </div>
      </div>

      {/* Weekly Usage Quota Summary Bar */}
      <GlassSurface
        borderRadius={18}
        className="px-4 py-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-lg bg-[#0466c8]/25 border border-[#0466c8]/40 flex items-center justify-center shrink-0">
            <Timer className="w-3.5 h-3.5 text-[#3b9eff]" />
          </div>
          <span className="text-white font-semibold">Weekly Quota Status:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => {
              if (resumeLimitFull) setLimitModalType('resume');
            }}
            className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
              resumeLimitFull
                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300 cursor-pointer'
                : 'bg-[#001845] border-[#33415c]/60 text-[#979dac]'
            }`}
          >
            <span>Resume Builds:</span>
            <strong className={resumeLimitFull ? 'text-amber-300' : 'text-[#3b9eff]'}>
              {quota.resumesRemaining}/{quota.resumesLimit} left
            </strong>
            {resumeLimitFull && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (analysisLimitFull) setLimitModalType('analysis');
            }}
            className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
              analysisLimitFull
                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300 cursor-pointer'
                : 'bg-[#001845] border-[#33415c]/60 text-[#979dac]'
            }`}
          >
            <span>AI Analyses:</span>
            <strong className={analysisLimitFull ? 'text-amber-300' : 'text-emerald-400'}>
              {quota.analysesRemaining}/{quota.analysesLimit} left
            </strong>
            {analysisLimitFull && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <Link
            to="/account"
            className="text-[#3b9eff] hover:text-white font-semibold inline-flex items-center gap-1 ml-1"
          >
            <span>View Reset Timer</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </GlassSurface>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <GlassSurface borderRadius={18} interactive className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0466c8]/25 border border-[#0466c8]/40 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-[#3b9eff]" />
          </div>
          <div>
            <span className="text-xs text-[#979dac] block mb-0.5">Active Resumes</span>
            <strong className="text-2xl font-extrabold text-white">{resumes.length}</strong>
          </div>
        </GlassSurface>

        <GlassSurface borderRadius={18} interactive className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/35 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-[#979dac] block mb-0.5">Average ATS Score</span>
            <strong className="text-2xl font-extrabold text-white">
              {avgScore !== null ? `${avgScore}/100` : 'No reviews'}
            </strong>
          </div>
        </GlassSurface>

        <GlassSurface borderRadius={18} interactive className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0353a4]/30 border border-[#0466c8]/40 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#3b9eff]" />
          </div>
          <div>
            <span className="text-xs text-[#979dac] block mb-0.5">Evaluation Reports</span>
            <strong className="text-2xl font-extrabold text-white">{analyses.length}</strong>
          </div>
        </GlassSurface>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#979dac] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0466c8]" />
          <p className="text-xs">Loading candidate dashboard...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Recent Saved Resumes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3b9eff]" />
                <span>My Saved Resumes ({resumes.length})</span>
              </h2>
              {resumes.length > 0 && (
                <Link
                  to="/resumes"
                  className="text-xs font-medium text-[#3b9eff] hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {resumes.length === 0 ? (
              <GlassSurface borderRadius={20} className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#001845] border border-[#33415c] flex items-center justify-center mx-auto mb-3">
                  <PenTool className="w-6 h-6 text-[#979dac]" />
                </div>
                <h3 className="text-sm font-semibold text-white">No resumes created yet</h3>
                <p className="text-xs text-[#979dac] max-w-sm mx-auto mt-1 mb-4">
                  Start building your resume with guided sections, AI-assisted bullets, and live template previews.
                </p>
                {resumeLimitFull ? (
                  <button
                    type="button"
                    onClick={() => setLimitModalType('resume')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-limit-locked"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Build First Resume (!)</span>
                  </button>
                ) : (
                  <Link
                    to="/builder"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white btn-3d"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Build First Resume</span>
                  </Link>
                )}
              </GlassSurface>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resumes.slice(0, 6).map((item) => (
                  <GlassSurface
                    key={item._id}
                    borderRadius={16}
                    interactive
                    className="p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/30"
                            style={{ backgroundColor: item.accentColor || '#0466c8' }}
                            title="Accent Color"
                          />
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#001845] text-[#3b9eff] border border-[#0466c8]/30">
                            {item.selectedTemplate || 'classic'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#979dac] mb-4">
                        {item.targetRole ? `Role: ${item.targetRole}` : 'General Resume'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#33415c]/45 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#7d8597]">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(item._id)}
                          disabled={downloadingId === item._id}
                          className="p-1.5 rounded-md text-[#979dac] hover:text-white hover:bg-[#023e7d] transition-colors"
                          title="Download PDF"
                        >
                          {downloadingId === item._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3b9eff]" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Link
                          to={`/builder?id=${item._id}`}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#0466c8]/40 hover:bg-[#0466c8] border border-[#0466c8]/60 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteResume(item._id, item.title)}
                          className="p-1.5 rounded-md text-[#7d8597] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassSurface>
                ))}
              </div>
            )}
          </div>

          {/* Recent Evaluations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#3b9eff]" />
                <span>Recent Resume Analyses ({analyses.length})</span>
              </h2>
              {analyses.length > 0 && (
                <Link
                  to="/analyses"
                  className="text-xs font-medium text-[#3b9eff] hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {analyses.length === 0 ? (
              <GlassSurface borderRadius={20} className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#001845] border border-[#33415c] flex items-center justify-center mx-auto mb-3">
                  <FileSearch className="w-6 h-6 text-[#979dac]" />
                </div>
                <h3 className="text-sm font-semibold text-white">No analyses run yet</h3>
                <p className="text-xs text-[#979dac] max-w-sm mx-auto mt-1 mb-4">
                  Upload an existing resume file to get ATS scores, identify job description keyword gaps, and receive actionable rewrites.
                </p>
                {analysisLimitFull ? (
                  <button
                    type="button"
                    onClick={() => setLimitModalType('analysis')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-limit-locked"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run First Analysis (!)</span>
                  </button>
                ) : (
                  <Link
                    to="/analyzer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white btn-3d"
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>Run First Analysis</span>
                  </Link>
                )}
              </GlassSurface>
            ) : (
              <GlassSurface borderRadius={18} className="overflow-hidden divide-y divide-[#33415c]/50">
                {analyses.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#023e7d]/25 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
                          item.overallScore >= 80
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : item.overallScore >= 60
                            ? 'bg-[#001845] text-[#3b9eff] border border-[#0466c8]/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.overallScore}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {item.resumeTitle || 'Resume Evaluation'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#979dac] mt-0.5">
                          {item.targetRole && <span>Role: {item.targetRole}</span>}
                          <span>• {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/analyses/${item._id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3b9eff] hover:text-white hover:bg-[#0466c8]/30 border border-[#0466c8]/40 transition-all self-end sm:self-auto"
                    >
                      <span>View Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </GlassSurface>
            )}
          </div>

          {/* Interactive A4 Paper Template Showcase inside Dashboard */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#3b9eff]" />
                  <span>A4 Resume Template Gallery</span>
                </h2>
                <p className="text-xs text-[#979dac] mt-0.5">
                  Preview our 5 ATS templates and color themes in real A4 proportions before building.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#001845] border border-[#33415c]/60 overflow-x-auto no-scrollbar max-w-full">
                  {RESUME_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setDemoTemplate(tmpl.id)}
                      className={`h-7 px-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                        demoTemplate === tmpl.id
                          ? 'bg-[#0466c8] text-white shadow-glass-glow'
                          : 'text-[#979dac] hover:text-white'
                      }`}
                    >
                      <span>{tmpl.name}</span>
                    </button>
                  ))}
                </div>

                <ColorPickerPopover
                  value={demoColor}
                  onChange={setDemoColor}
                  buttonClassName="h-9 px-3 rounded-xl text-xs font-semibold text-white bg-[#001845] hover:bg-[#002855] border border-[#33415c]/60 flex items-center justify-center gap-1.5 whitespace-nowrap"
                />
              </div>
            </div>

            <GlassSurface borderRadius={22} className="p-3 sm:p-6 max-w-4xl mx-auto">
              <A4ResumeViewport>{renderDemoTemplate()}</A4ResumeViewport>
            </GlassSurface>
          </div>
        </div>
      )}
    </div>
  );
}
