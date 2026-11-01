import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X,
  ChevronDown,
  LayoutDashboard,
  FileSearch,
  PenTool,
  FolderOpen,
  History,
  User,
  LogOut,
  ExternalLink,
  AlertCircle,
  Sparkles,
  GitBranch
} from 'lucide-react';
import ElectricLogo from './ElectricLogo';
import './BranchedMenu.css';

/**
 * @react-bits/BranchedMenu-JS-CSS
 * Interactive tree-branching navigation sidebar with glowing trunk & curved branch connectors.
 */
export default function BranchedMenu({
  open,
  onClose,
  isAuthenticated,
  user,
  onLogout,
  onTriggerLimitModal
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [expandedGroups, setExpandedGroups] = useState({
    workspace: true,
    library: true,
    account: true
  });

  if (!open) return null;

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const quota = user?.weeklyQuota || {
    resumesLimit: 10,
    resumesRemaining: 10,
    analysesLimit: 10,
    analysesRemaining: 10
  };

  const resumeLimitFull = isAuthenticated && quota.resumesRemaining <= 0;
  const analysisLimitFull = isAuthenticated && quota.analysesRemaining <= 0;

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (e, path, limitFull, limitType) => {
    if (limitFull && onTriggerLimitModal) {
      e.preventDefault();
      onClose();
      onTriggerLimitModal(limitType);
      return;
    }
    onClose();
    if (path.startsWith('/#')) {
      const hash = path.replace('/', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="rb-branched-backdrop" onClick={onClose} aria-hidden="true" />

      <aside className="rb-branched-sidebar" aria-label="Branched Navigation Sidebar">
        <div>
          {/* Sidebar Header with ElectricLogo & Brand Typography */}
          <div className="flex items-center justify-between pb-4 border-b border-[#33415c]/60">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <ElectricLogo size={36} />
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1">
                <span className="text-white">Resumind</span>
                <span className="text-[#0466c8]">AI</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#979dac] hover:text-white bg-[#002855]/80 hover:bg-[#023e7d] border border-[#33415c]/60 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Authenticated User Summary Card */}
          {isAuthenticated && (
            <div className="mt-4 p-3.5 rounded-2xl rb-glass-surface flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0466c8]/30 border border-[#0466c8]/50 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                  <p className="text-[11px] text-[#979dac] truncate">{user?.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#001845] text-[#3b9eff] border border-[#0466c8]/40 shrink-0">
                Active
              </span>
            </div>
          )}

          {isAuthenticated ? (
            <>
              {/* Branch Group 1: Core AI Modules */}
              <div className="rb-branch-group">
                <button
                  type="button"
                  onClick={() => toggleGroup('workspace')}
                  className="rb-branch-group__header"
                >
                  <span className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#3b9eff]" />
                    <span>Workspace Modules</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#979dac] transition-transform ${
                      expandedGroups.workspace ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedGroups.workspace && (
                  <div className="rb-branch-tree">
                    <div
                      className={`rb-branch-node ${
                        isActive('/dashboard') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/dashboard"
                        onClick={onClose}
                        className={`rb-branch-link ${
                          isActive('/dashboard') ? 'rb-branch-link--active' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[#3b9eff]" />
                          <span>Candidate Hub</span>
                        </span>
                      </Link>
                    </div>

                    <div
                      className={`rb-branch-node ${
                        isActive('/analyzer') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/analyzer"
                        onClick={(e) => handleNavClick(e, '/analyzer', analysisLimitFull, 'analysis')}
                        className={`rb-branch-link ${
                          isActive('/analyzer') ? 'rb-branch-link--active' : ''
                        } ${analysisLimitFull ? 'opacity-75 border-amber-500/40' : ''}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <FileSearch className="w-4 h-4 text-[#3b9eff]" />
                          <span>Resume Analyzer</span>
                        </span>
                        {analysisLimitFull ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            <span>!</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#979dac] font-mono">
                            {quota.analysesRemaining}/10
                          </span>
                        )}
                      </Link>
                    </div>

                    <div
                      className={`rb-branch-node ${
                        isActive('/builder') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/builder"
                        onClick={(e) => handleNavClick(e, '/builder', resumeLimitFull, 'resume')}
                        className={`rb-branch-link ${
                          isActive('/builder') ? 'rb-branch-link--active' : ''
                        } ${resumeLimitFull ? 'opacity-75 border-amber-500/40' : ''}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <PenTool className="w-4 h-4 text-[#3b9eff]" />
                          <span>Resume Builder</span>
                        </span>
                        {resumeLimitFull ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            <span>!</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#979dac] font-mono">
                            {quota.resumesRemaining}/10
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Branch Group 2: Career Library */}
              <div className="rb-branch-group">
                <button
                  type="button"
                  onClick={() => toggleGroup('library')}
                  className="rb-branch-group__header"
                >
                  <span className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-[#3b9eff]" />
                    <span>Career Library</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#979dac] transition-transform ${
                      expandedGroups.library ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedGroups.library && (
                  <div className="rb-branch-tree">
                    <div
                      className={`rb-branch-node ${
                        isActive('/resumes') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/resumes"
                        onClick={onClose}
                        className={`rb-branch-link ${
                          isActive('/resumes') ? 'rb-branch-link--active' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <FolderOpen className="w-4 h-4 text-[#3b9eff]" />
                          <span>My Saved Resumes</span>
                        </span>
                      </Link>
                    </div>

                    <div
                      className={`rb-branch-node ${
                        isActive('/analyses') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/analyses"
                        onClick={onClose}
                        className={`rb-branch-link ${
                          isActive('/analyses') ? 'rb-branch-link--active' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <History className="w-4 h-4 text-[#3b9eff]" />
                          <span>Analysis History</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Branch Group 3: Account & Quota */}
              <div className="rb-branch-group">
                <button
                  type="button"
                  onClick={() => toggleGroup('account')}
                  className="rb-branch-group__header"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#3b9eff]" />
                    <span>Account & Weekly Limits</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#979dac] transition-transform ${
                      expandedGroups.account ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedGroups.account && (
                  <div className="rb-branch-tree">
                    <div
                      className={`rb-branch-node ${
                        isActive('/account') ? 'rb-branch-node--active' : ''
                      }`}
                    >
                      <Link
                        to="/account"
                        onClick={onClose}
                        className={`rb-branch-link ${
                          isActive('/account') ? 'rb-branch-link--active' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-[#3b9eff]" />
                          <span>Profile & Reset Timer</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Public Branched Navigation */
            <div className="rb-branch-group">
              <div className="rb-branch-group__header">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#3b9eff]" />
                  <span>Explore Resumind AI</span>
                </span>
              </div>

              <div className="rb-branch-tree">
                <div className={`rb-branch-node ${isActive('/') ? 'rb-branch-node--active' : ''}`}>
                  <Link
                    to="/"
                    onClick={onClose}
                    className={`rb-branch-link ${isActive('/') ? 'rb-branch-link--active' : ''}`}
                  >
                    <span>Home Overview</span>
                  </Link>
                </div>
                <div className="rb-branch-node">
                  <a
                    href="/#features"
                    onClick={(e) => handleNavClick(e, '/#features', false)}
                    className="rb-branch-link"
                  >
                    <span>Core Capabilities</span>
                  </a>
                </div>
                <div className="rb-branch-node">
                  <a
                    href="/#templates"
                    onClick={(e) => handleNavClick(e, '/#templates', false)}
                    className="rb-branch-link"
                  >
                    <span>5 A4 Resume Templates</span>
                  </a>
                </div>
                <div className="rb-branch-node">
                  <a
                    href="/#rubric"
                    onClick={(e) => handleNavClick(e, '/#rubric', false)}
                    className="rb-branch-link"
                  >
                    <span>100-Point ATS Rubric</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-5 mt-6 border-t border-[#33415c]/60 space-y-3">
          <a
            href="https://m-daniyal.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl rb-glass-surface text-xs text-[#979dac] hover:text-white group"
          >
            <span>
              Developed by <strong className="text-[#3b9eff]">Daniyal</strong>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[#3b9eff] group-hover:translate-x-0.5 transition-transform" />
          </a>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/45 hover:bg-rose-900/65 border border-rose-500/35 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="text-center py-2.5 rounded-xl text-xs font-semibold text-white rb-glass-surface hover:border-[#0466c8]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0466c8] hover:bg-[#0353a4] shadow-glass-glow"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

