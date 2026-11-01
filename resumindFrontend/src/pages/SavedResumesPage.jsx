import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { downloadResumePdf } from '../components/pdf/ResumePdfDocument';
import WeeklyLimitModal from '../components/WeeklyLimitModal';
import GlassSurface from '../components/react-bits/GlassSurface';
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Edit3,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function SavedResumesPage() {
  const { user, refreshUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const quota = user?.weeklyQuota || {
    resumesLimit: 10,
    resumesRemaining: 10
  };
  const resumeLimitFull = quota.resumesRemaining <= 0;

  useEffect(() => {
    refreshUser();
    fetchResumes();
  }, [refreshUser]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.listResumes();
      if (res?.data?.resumes) {
        setResumes(res.data.resumes);
      }
    } catch (err) {
      setError(err.message || 'Could not fetch your saved resumes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this resume'}"?`)) {
      return;
    }
    try {
      await api.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      const res = await api.getResume(id);
      if (res?.data?.resume) {
        await downloadResumePdf(res.data.resume);
      }
    } catch (err) {
      alert(`Could not download PDF: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <WeeklyLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        limitType="resume"
        quota={user?.weeklyQuota}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[#33415c]/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Saved Resumes
          </h1>
          <p className="text-xs sm:text-sm text-[#979dac] mt-1">
            Manage your tailored resumes, switch templates, and export selectable-text PDFs.
          </p>
        </div>

        {resumeLimitFull ? (
          <button
            type="button"
            onClick={() => setLimitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Create New Resume</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-black">
              !
            </span>
          </button>
        ) : (
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
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
          <p className="text-xs">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <GlassSurface borderRadius={22} className="p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#001845] border border-[#33415c] flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-[#979dac]" />
          </div>
          <h3 className="text-base font-bold text-white">No resumes created yet</h3>
          <p className="text-xs text-[#979dac] mt-1 mb-6">
            Build your first professional resume with ATS-ready templates and verified PDF export.
          </p>
          {resumeLimitFull ? (
            <button
              type="button"
              onClick={() => setLimitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold btn-limit-locked"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Launch Resume Builder (!)</span>
            </button>
          ) : (
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white btn-3d"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Resume Builder</span>
            </Link>
          )}
        </GlassSurface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((item) => (
            <GlassSurface
              key={item._id}
              borderRadius={20}
              interactive
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-base line-clamp-1">{item.title}</h3>
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
                  {item.targetRole ? `Target Role: ${item.targetRole}` : 'General Purpose Resume'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#33415c]/50 flex items-center justify-between text-xs text-[#979dac]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#7d8597]" />
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(item._id)}
                    disabled={downloadingId === item._id}
                    className="p-1.5 rounded-lg text-[#979dac] hover:text-white hover:bg-[#023e7d] transition-colors"
                    title="Export PDF"
                  >
                    {downloadingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#3b9eff]" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    to={`/builder?id=${item._id}`}
                    className="p-1.5 rounded-lg text-[#979dac] hover:text-white hover:bg-[#023e7d] transition-colors"
                    title="Edit Resume"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-1.5 rounded-lg text-[#7d8597] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassSurface>
          ))}
        </div>
      )}
    </div>
  );
}
