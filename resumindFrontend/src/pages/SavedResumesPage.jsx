import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { downloadResumePdf } from '../components/pdf/ResumePdfDocument';
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Edit3,
  Loader2,
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-blue-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Saved Resumes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your tailored resumes, switch templates, and export selectable-text PDFs.
          </p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
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
          <p className="text-xs">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-blue-500/25 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-space-800 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-white">No resumes created yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Build your first professional resume with ATS-ready templates and verified PDF export.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Resume Builder</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((item) => (
            <div key={item._id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-base line-clamp-1">{item.title}</h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-space-850 text-electric-400 border border-blue-500/20">
                    {item.selectedTemplate || 'classic'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {item.targetRole ? `Target Role: ${item.targetRole}` : 'General Purpose Resume'}
                </p>
              </div>

              <div className="pt-4 border-t border-space-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(item._id)}
                    disabled={downloadingId === item._id}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-space-700 transition-colors"
                    title="Export PDF"
                  >
                    {downloadingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-electric-400" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    to={`/builder?id=${item._id}`}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-space-700 transition-colors"
                    title="Edit Resume"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
