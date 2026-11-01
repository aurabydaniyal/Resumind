import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, X, Sparkles, Calendar } from 'lucide-react';

export function formatRemainingTime(resetAtIso) {
  if (!resetAtIso) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = new Date(resetAtIso).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

export default function WeeklyLimitModal({ open, onClose, limitType = 'resume', quota }) {
  const [countdown, setCountdown] = useState(() => formatRemainingTime(quota?.resetAt));

  useEffect(() => {
    if (!open || !quota?.resetAt) return;
    setCountdown(formatRemainingTime(quota.resetAt));
    const timer = setInterval(() => {
      setCountdown(formatRemainingTime(quota.resetAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [open, quota?.resetAt]);

  if (!open || typeof document === 'undefined') return null;

  const isResume = limitType === 'resume';
  const title = isResume
    ? 'Weekly Resume Creation Limit Reached'
    : 'Weekly ATS Analysis Limit Reached';

  const subtitle = isResume
    ? 'You have built 10 out of 10 new resumes included in your weekly allocation. You can still edit and export your existing saved resumes anytime.'
    : 'You have completed 10 out of 10 AI resume evaluations for this week. Please return once your weekly counter resets below.';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-blue-500/35 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-electric-600/15 blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white bg-space-900 border border-blue-500/20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/35 flex items-center justify-center mx-auto shadow-glass-glow">
          <Clock className="w-7 h-7 text-amber-400" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            <ShieldAlert className="w-3 h-3" />
            <span>Weekly Fair-Use Protection (10 / Week)</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{subtitle}</p>
        </div>

        {/* Live Countdown Timer Boxes */}
        <div className="p-4 rounded-2xl bg-space-900/90 border border-blue-500/25 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-electric-400 block">
            Quota Resets Automatically In
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-space-850 border border-blue-500/20">
              <strong className="text-xl sm:text-2xl font-black text-white block leading-none">
                {String(countdown.days).padStart(2, '0')}
              </strong>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 block">
                Days
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-space-850 border border-blue-500/20">
              <strong className="text-xl sm:text-2xl font-black text-white block leading-none">
                {String(countdown.hours).padStart(2, '0')}
              </strong>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 block">
                Hours
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-space-850 border border-blue-500/20">
              <strong className="text-xl sm:text-2xl font-black text-white block leading-none">
                {String(countdown.minutes).padStart(2, '0')}
              </strong>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 block">
                Mins
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-space-850 border border-blue-500/20">
              <strong className="text-xl sm:text-2xl font-black text-electric-400 block leading-none">
                {String(countdown.seconds).padStart(2, '0')}
              </strong>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 block">
                Secs
              </span>
            </div>
          </div>
          {quota?.resetAt && (
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <Calendar className="w-3 h-3 text-electric-400" />
              <span>Resets on {new Date(quota.resetAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Link
            to="/account"
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 transition-all"
          >
            View Quota Status
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white btn-3d"
          >
            Got It, Thanks
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

