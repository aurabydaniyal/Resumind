import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatRemainingTime } from '../components/WeeklyLimitModal';
import {
  User,
  Shield,
  LogOut,
  CheckCircle2,
  Lock,
  Mail,
  FileText,
  Sparkles,
  PenTool,
  FileSearch,
  Award,
  Calendar,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function AccountPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [resumesCount, setResumesCount] = useState(0);
  const [analysesCount, setAnalysesCount] = useState(0);
  const [bestScore, setBestScore] = useState(null);

  const quota = user?.weeklyQuota || {
    resumesLimit: 10,
    resumesUsed: 0,
    resumesRemaining: 10,
    analysesLimit: 10,
    analysesUsed: 0,
    analysesRemaining: 10,
    resetAt: null
  };

  const anyLimitExhausted = quota.resumesRemaining <= 0 || quota.analysesRemaining <= 0;
  const fallbackTargetRef = useRef(Date.now() + ONE_WEEK_MS);
  const [countdown, setCountdown] = useState(() =>
    formatRemainingTime(quota.resetAt ? new Date(quota.resetAt).getTime() : fallbackTargetRef.current)
  );

  useEffect(() => {
    refreshUser();
    async function loadUserActivity() {
      try {
        const [resumesRes, analysesRes] = await Promise.allSettled([
          api.listResumes(),
          api.listAnalyses()
        ]);
        if (resumesRes.status === 'fulfilled') {
          const r = resumesRes.value?.data?.resumes || [];
          setResumesCount(r.length);
        }
        if (analysesRes.status === 'fulfilled') {
          const a = analysesRes.value?.data?.analyses || [];
          setAnalysesCount(a.length);
          if (a.length > 0) {
            const highest = Math.max(...a.map((item) => item.overallScore || 0));
            setBestScore(highest);
          }
        }
      } catch {
        // Ignore silent activity stats error
      }
    }
    loadUserActivity();
  }, [refreshUser]);

  // Live decreasing timer only runs when a weekly limit has run out
  useEffect(() => {
    if (!anyLimitExhausted) return;
    if (quota.resetAt) {
      const parsed = new Date(quota.resetAt).getTime();
      if (!Number.isNaN(parsed) && parsed > Date.now()) {
        fallbackTargetRef.current = parsed;
      }
    }

    const tick = () => {
      const targetMs = quota.resetAt ? new Date(quota.resetAt).getTime() : fallbackTargetRef.current;
      setCountdown(formatRemainingTime(targetMs));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [anyLimitExhausted, quota.resetAt]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Active Member';

  const initials = (user?.name || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const resumesPercent = Math.min(100, Math.round((quota.resumesUsed / quota.resumesLimit) * 100));
  const analysesPercent = Math.min(100, Math.round((quota.analysesUsed / quota.analysesLimit) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 radial-bg">
      {/* 3D Profile Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-electric-600/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-electric-500 via-electric-600 to-blue-800 p-0.5 shadow-blue-glow shrink-0">
              <div className="w-full h-full bg-space-900/90 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl font-extrabold text-white tracking-wider">
                {initials}
              </div>
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold mb-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Candidate Profile</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight truncate">
                {user?.name || 'Candidate'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 break-all mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-electric-400 shrink-0" />
                <span>{user?.email || 'No email listed'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 transition-all shadow-sm shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Career Activity Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center shrink-0 shadow-glass-glow">
            <FileText className="w-6 h-6 text-electric-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Saved Resumes</span>
            <strong className="text-2xl font-extrabold text-white">{resumesCount}</strong>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Top ATS Score</span>
            <strong className="text-2xl font-extrabold text-white">
              {bestScore !== null ? `${bestScore}/100` : '—'}
            </strong>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-electric-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">ATS Reviews Run</span>
            <strong className="text-2xl font-extrabold text-white">{analysesCount}</strong>
          </div>
        </div>
      </div>

      {/* Weekly Usage Limits Section (Live Countdown Timer only shown when a limit runs out) */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-5 border border-blue-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-500/15">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-electric-400" />
              <span>Weekly Usage Limit Left</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Each account includes 10 new resume builds and 10 AI ATS evaluations per week.
            </p>
          </div>

          {anyLimitExhausted ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/70 border border-amber-500/35 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-amber-200">Limit resets in:</span>
              <strong className="font-mono font-bold text-white">
                {String(countdown.days).padStart(2, '0')}d {String(countdown.hours).padStart(2, '0')}h{' '}
                {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
              </strong>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Weekly Quota Active</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Resume Creation Quota Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-space-850/90 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-electric-600/20 border border-electric-500/30 flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-electric-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Weekly Resume Builds</h3>
                  <span className="text-[11px] text-slate-400">Editing existing resumes is unlimited</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                  quota.resumesRemaining > 0
                    ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-950/70 text-amber-400 border-amber-500/30'
                }`}
              >
                {quota.resumesRemaining} / {quota.resumesLimit} Left
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-space-950 overflow-hidden border border-blue-500/15">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quota.resumesRemaining === 0
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-electric-500 to-blue-400'
                }`}
                style={{ width: `${resumesPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Used this week: <strong className="text-slate-200">{quota.resumesUsed}</strong></span>
              <span>Remaining: <strong className="text-slate-200">{quota.resumesRemaining} builds left</strong></span>
            </div>
          </div>

          {/* AI Resume Analysis Quota Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-space-850/90 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                  <FileSearch className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Weekly AI ATS Analyses</h3>
                  <span className="text-[11px] text-slate-400">100-point rubric & keyword reviews</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                  quota.analysesRemaining > 0
                    ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-950/70 text-amber-400 border-amber-500/30'
                }`}
              >
                {quota.analysesRemaining} / {quota.analysesLimit} Left
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-space-950 overflow-hidden border border-blue-500/15">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quota.analysesRemaining === 0
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${analysesPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Used this week: <strong className="text-slate-200">{quota.analysesUsed}</strong></span>
              <span>Remaining: <strong className="text-slate-200">{quota.analysesRemaining} analyses left</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Personal Account Information */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-electric-400" />
            <span>Personal Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-space-850/90 border border-blue-500/20">
              <span className="text-[11px] text-slate-400 block mb-0.5">Full Name</span>
              <strong className="text-sm text-white font-semibold break-words">
                {user?.name || 'Candidate'}
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-space-850/90 border border-blue-500/20">
              <span className="text-[11px] text-slate-400 block mb-0.5">Registered Email</span>
              <span className="text-sm text-slate-200 break-all">{user?.email || 'N/A'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-850/90 border border-blue-500/20 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Membership Status</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-electric-400" />
                  <span>{memberSince}</span>
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-electric-950 text-electric-400 border border-electric-500/30 font-semibold text-[11px]">
                Active Plan (10/wk)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Career Workspace Actions */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-electric-400" />
              <span>Career Workspace</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jump directly to your resume builder or run an instant ATS rubric analysis against a new job description.
            </p>

            <div className="space-y-3 pt-1">
              <Link
                to="/builder"
                className="p-3.5 rounded-xl bg-space-850/90 hover:bg-space-800 border border-blue-500/20 hover:border-electric-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-electric-600/20 border border-electric-500/30 flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-electric-400" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">Resume Builder Studio</strong>
                    <span className="text-[11px] text-slate-400">
                      {quota.resumesRemaining} of {quota.resumesLimit} weekly builds left
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/analyzer"
                className="p-3.5 rounded-xl bg-space-850/90 hover:bg-space-800 border border-blue-500/20 hover:border-electric-500/40 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <FileSearch className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">AI Resume Analyzer</strong>
                    <span className="text-[11px] text-slate-400">
                      {quota.analysesRemaining} of {quota.analysesLimit} weekly analyses left
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-space-900/80 border border-blue-500/15 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session encrypted & protected</span>
            </span>
            <Link to="/resumes" className="text-electric-400 hover:text-white font-semibold">
              Manage Resumes
            </Link>
          </div>
        </div>
      </div>

      {/* Data Privacy & Protection Guarantees */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-electric-400" />
          <span>Your Privacy & Data Guarantees</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">In-Browser Document Parsing</strong>
            <p className="leading-relaxed">
              Your PDF and Word documents are converted to text directly on your device. Raw files are never uploaded or stored.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">Private Workspace</strong>
            <p className="leading-relaxed">
              Your saved resumes and ATS evaluation reports are isolated to your personal account and can be deleted anytime.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">Authentic AI Coaching</strong>
            <p className="leading-relaxed">
              AI suggestions enhance your real achievements with stronger verbs without fabricating credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
