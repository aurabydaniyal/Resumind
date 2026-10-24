import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Shield,
  Cpu,
  Database,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Mail
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [healthData, setHealthData] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await api.getHealth();
      setHealthData(res);
    } catch (err) {
      setHealthData({ status: 'error', error: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-blue-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account & System Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review candidate credentials, active sessions, and live backend connection status.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-electric-400" />
            <span>Profile Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20">
              <span className="text-[11px] text-slate-400 block mb-0.5">Full Name</span>
              <strong className="text-sm text-white font-semibold">{user?.name || 'Candidate'}</strong>
            </div>

            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20">
              <span className="text-[11px] text-slate-400 block mb-0.5">Email Address</span>
              <span className="text-sm text-slate-200">{user?.email || 'N/A'}</span>
            </div>

            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20">
              <span className="text-[11px] text-slate-400 block mb-0.5">Account ID</span>
              <span className="font-mono text-[11px] text-slate-400">{user?._id || 'Local User'}</span>
            </div>
          </div>
        </div>

        {/* Live Backend Health Diagnostics */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-electric-400" />
              <span>Live API Diagnostics</span>
            </h2>
            <button
              onClick={checkHealth}
              disabled={checkingHealth}
              className="text-xs text-electric-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* API Health */}
            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">API Endpoint</span>
              </div>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  healthData?.status === 'ok'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                }`}
              >
                {healthData?.status === 'ok' ? 'Online' : 'Offline / Error'}
              </span>
            </div>

            {/* MongoDB Atlas */}
            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Database (MongoDB Atlas)</span>
              </div>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] capitalize ${
                  healthData?.database === 'connected'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}
              >
                {healthData?.database || 'Disconnected'}
              </span>
            </div>

            {/* AI Engine Status */}
            <div className="p-3 rounded-xl bg-space-850 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">AI Analysis Engine</span>
              </div>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  healthData?.aiProvider?.configured
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}
              >
                {healthData?.aiProvider?.configured ? 'Active & Ready' : 'Key Needed in .env'}
              </span>
            </div>

            {healthData?.environment && (
              <div className="text-[11px] text-slate-500 text-right">
                Mode: {healthData.environment}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security & Privacy Checklist */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-electric-400" />
          <span>Security & Data Privacy Protections</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">In-Browser Parsing</strong>
            <p>PDF and Word files are converted to text client-side. Binary files are not stored on our server.</p>
          </div>
          <div className="p-3 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">Ownership Isolation</strong>
            <p>All database queries strictly enforce authentication IDs. User records cannot be accessed across accounts.</p>
          </div>
          <div className="p-3 rounded-xl bg-space-850/80 border border-blue-500/20">
            <strong className="block text-slate-200 mb-1">Zero Secrets in Client</strong>
            <p>API keys and database credentials reside exclusively in server environment variables.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
