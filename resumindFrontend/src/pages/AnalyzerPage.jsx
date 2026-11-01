import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractTextFromFile } from '../services/documentParser';
import { api } from '../services/api';
import WeeklyLimitModal from '../components/WeeklyLimitModal';
import GlassSurface from '../components/react-bits/GlassSurface';
import SlideCommit from '../components/react-bits/SlideCommit';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Info,
  Timer
} from 'lucide-react';

export default function AnalyzerPage() {
  const { user, updateQuota, refreshUser } = useAuth();
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');

  // Weekly Limit Popup Modal State
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitQuota, setLimitQuota] = useState(null);

  const formRef = useRef(null);
  const navigate = useNavigate();

  const quota = user?.weeklyQuota || {
    analysesLimit: 10,
    analysesUsed: 0,
    analysesRemaining: 10
  };

  const analysisLimitFull = quota.analysesRemaining <= 0;

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError('');
    setFile(selected);
    if (!resumeTitle) {
      setResumeTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }

    setExtracting(true);
    try {
      const text = await extractTextFromFile(selected);
      if (!text || text.trim().length < 30) {
        throw new Error('Could not extract sufficient text from this file. It may be scanned or empty.');
      }
      setResumeText(text);
    } catch (err) {
      setError(err.message || 'Failed to extract text from the uploaded file.');
    } finally {
      setExtracting(false);
    }
  };

  const runAnalysis = async () => {
    setError('');

    if (analysisLimitFull) {
      setLimitModalOpen(true);
      return;
    }

    if (!resumeText.trim()) {
      setError('Please upload a resume file or paste your resume text.');
      return;
    }

    if (resumeText.trim().length < 50) {
      setError('Resume text must contain at least 50 characters to produce an accurate evaluation.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.analyzeResume({
        resumeText: resumeText.trim(),
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim(),
        resumeTitle: resumeTitle.trim() || 'Uploaded Resume Analysis'
      });

      if (res?.data?.quota) {
        updateQuota(res.data.quota);
      }

      if (res?.data?.analysis) {
        navigate('/analyzer/results', {
          state: {
            analysis: res.data.analysis,
            analysisId: res.data.analysisId,
            targetRole,
            resumeTitle: resumeTitle || 'Uploaded Resume'
          }
        });
      }
    } catch (err) {
      if (err.code === 'WEEKLY_LIMIT_REACHED' || (err.status === 429 && err.quota)) {
        if (err.quota) {
          updateQuota(err.quota);
          setLimitQuota(err.quota);
        }
        setLimitModalOpen(true);
      } else {
        setError(err.message || 'AI analysis failed. Please verify your connection.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeSubmit = (e) => {
    e.preventDefault();
    runAnalysis();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Weekly Limit Reached Popup Modal */}
      <WeeklyLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        limitType="analysis"
        quota={limitQuota || user?.weeklyQuota}
      />

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001845]/90 border border-[#0466c8]/40 text-[#3b9eff] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real ATS Rubric & Keyword Gap Evaluation</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (analysisLimitFull) setLimitModalOpen(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              analysisLimitFull
                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300 cursor-pointer'
                : 'bg-[#001845] border-[#33415c]/60 text-[#979dac]'
            }`}
          >
            {analysisLimitFull ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Timer className="w-3.5 h-3.5 text-[#3b9eff]" />
            )}
            <span>
              <strong className={analysisLimitFull ? 'text-amber-300' : 'text-white'}>
                {quota.analysesRemaining}/{quota.analysesLimit}
              </strong>{' '}
              weekly analyses left {analysisLimitFull ? '(!)' : ''}
            </span>
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Analyzer</h1>
        <p className="text-[#979dac] text-xs sm:text-sm mt-2">
          Upload your resume in PDF or DOCX format. Text is extracted directly in your browser.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 shadow-glass">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Analysis Notice</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleAnalyzeSubmit} className="space-y-8">
        {/* Step 1: Upload or Paste */}
        <GlassSurface borderRadius={22} className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0466c8] text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Upload Resume or Paste Text</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Drag/Upload Box */}
            <div>
              <label
                htmlFor="resume-upload"
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  file
                    ? 'border-[#0466c8] bg-[#0466c8]/15'
                    : 'border-[#33415c] hover:border-[#0466c8]/60 hover:bg-[#002855]/45'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#001845] border border-[#33415c]/60 flex items-center justify-center mb-3">
                  {extracting ? (
                    <Loader2 className="w-6 h-6 text-[#3b9eff] animate-spin" />
                  ) : file ? (
                    <FileText className="w-6 h-6 text-[#3b9eff]" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-[#979dac]" />
                  )}
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  {extracting ? 'Extracting text...' : file ? file.name : 'Choose a file or drag & drop'}
                </div>
                <p className="text-xs text-[#979dac]">PDF, DOCX, or TXT up to 10MB</p>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Text parsed client-side ({resumeText.length} characters)</span>
                </div>
              )}
            </div>

            {/* Resume Title Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider mb-1.5">
                  Resume Title / Identifier
                </label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Qasim Ali - Senior Full Stack Resume"
                  className="w-full px-3.5 py-2.5 rounded-lg glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider mb-1.5">
                  Target Job Title / Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Lead Full Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-lg glass-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Editable text preview */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider">
                Extracted Resume Content (Review / Edit)
              </label>
              <span className="text-[11px] text-[#7d8597]">
                {resumeText.length} / 40,000 chars
              </span>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste plain resume text here, or upload a PDF above..."
              className="w-full p-3.5 rounded-lg glass-input text-xs font-mono leading-relaxed resize-y"
            />
          </div>
        </GlassSurface>

        {/* Step 2: Target Job Description (Optional) */}
        <GlassSurface borderRadius={22} className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0466c8] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Target Job Description (Recommended)</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#001845] text-[#3b9eff] border border-[#0466c8]/30 font-medium">
              Keyword Matching
            </span>
          </div>

          <p className="text-xs text-[#979dac] mb-3">
            Paste the job posting description to detect missing skill keywords and alignment score.
          </p>

          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description and requirements here..."
            className="w-full p-3.5 rounded-lg glass-input text-xs leading-relaxed resize-y"
          />
        </GlassSurface>

        {/* Submit Action — @react-bits/SlideCommit-JS-CSS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[#979dac] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#3b9eff] shrink-0" />
            <span>Analysis runs against the 100-point transparent ATS rubric.</span>
          </div>

          <SlideCommit
            onCommit={runAnalysis}
            disabled={!analysisLimitFull && (analyzing || extracting || !resumeText.trim())}
            loading={analyzing}
            limitFull={analysisLimitFull}
            onLimitClick={() => setLimitModalOpen(true)}
            label="Slide to Generate ATS Score"
            loadingLabel="Evaluating Resume..."
            limitLabel="Weekly Limit Full — Click for Timer (!)"
          />
        </div>
      </form>
    </div>
  );
}
