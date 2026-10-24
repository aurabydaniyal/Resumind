import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromFile } from '../services/documentParser';
import { api } from '../services/api';
import {
  FileSearch,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function AnalyzerPage() {
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

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

      if (res?.data?.analysis) {
        // Pass result and context to results page
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
      setError(err.message || 'AI analysis failed. Please verify your connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-950/80 border border-electric-500/30 text-electric-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real ATS Rubric & Keyword Gap Evaluation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Analyzer</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Upload your resume in PDF or DOCX format. Text is extracted directly in your browser.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 shadow-glass">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Analysis Notice</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-8">
        {/* Step 1: Upload or Paste */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-electric-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            <span>Upload Resume or Paste Text</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Drag/Upload Box */}
            <div>
              <label
                htmlFor="resume-upload"
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  file
                    ? 'border-electric-500 bg-electric-950/20'
                    : 'border-blue-500/25 hover:border-blue-500/50 hover:bg-space-850/50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-space-800 flex items-center justify-center mb-3">
                  {extracting ? (
                    <Loader2 className="w-6 h-6 text-electric-400 animate-spin" />
                  ) : file ? (
                    <FileText className="w-6 h-6 text-electric-400" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  {extracting ? 'Extracting text...' : file ? file.name : 'Choose a file or drag & drop'}
                </div>
                <p className="text-xs text-slate-400">PDF, DOCX, or TXT up to 10MB</p>
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
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Extracted Resume Content (Review / Edit)
              </label>
              <span className="text-[11px] text-slate-500">
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
        </div>

        {/* Step 2: Target Job Description (Optional) */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-electric-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Target Job Description (Recommended)</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-space-800 text-electric-400 border border-blue-500/20 font-medium">
              Keyword Matching
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Paste the job posting description to detect missing skill keywords and alignment score.
          </p>

          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description and requirements here..."
            className="w-full p-3.5 rounded-lg glass-input text-xs leading-relaxed resize-y"
          />
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-electric-400 shrink-0" />
            <span>Analysis runs against the 100-point transparent ATS rubric.</span>
          </div>

          <button
            type="submit"
            disabled={analyzing || extracting || !resumeText.trim()}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-blue-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Resume...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                <span>Generate ATS Analysis</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
