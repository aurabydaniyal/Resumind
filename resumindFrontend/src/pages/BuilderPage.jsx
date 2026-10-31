import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { downloadResumePdf } from '../components/pdf/ResumePdfDocument';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import A4ResumeViewport from '../components/templates/A4ResumeViewport';
import ColorPickerPopover from '../components/templates/ColorPickerPopover';
import { RESUME_TEMPLATES } from '../components/templates/themeUtils';
import {
  Save,
  Download,
  Sparkles,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Layers,
  Eye,
  Edit3,
  Loader2,
  Check,
  X,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const INITIAL_RESUME_STATE = {
  title: 'My Professional Resume',
  targetRole: '',
  selectedTemplate: 'modern',
  accentColor: '#2563eb',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: ''
  },
  summary: '',
  skills: [
    { category: 'Technical Skills', items: ['React', 'JavaScript', 'Node.js'] },
    { category: 'Tools & Platforms', items: ['Git', 'Docker'] }
  ],
  experience: [
    {
      id: '1',
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    }
  ],
  education: [
    {
      id: '1',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      bullets: []
    }
  ],
  projects: [],
  certifications: [],
  targetJobDescription: ''
};

export default function BuilderPage() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const navigate = useNavigate();

  const [resume, setResume] = useState(INITIAL_RESUME_STATE);
  const [activeTab, setActiveTab] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loadingResume, setLoadingResume] = useState(Boolean(resumeId));
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiTargetJob, setAiTargetJob] = useState('');

  // Fetch resume if editing existing
  useEffect(() => {
    async function loadResume() {
      if (!resumeId) return;
      try {
        setLoadingResume(true);
        const res = await api.getResume(resumeId);
        if (res?.data?.resume) {
          setResume(res.data.resume);
          setAiTargetJob(res.data.resume.targetJobDescription || '');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Could not load resume data.');
      } finally {
        setLoadingResume(false);
      }
    }
    loadResume();
  }, [resumeId]);

  const handlePersonalInfoChange = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          bullets: ['']
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume((prev) => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addExpBullet = (expIdx) => {
    setResume((prev) => {
      const exp = [...prev.experience];
      exp[expIdx].bullets = [...(exp[expIdx].bullets || []), ''];
      return { ...prev, experience: exp };
    });
  };

  const updateExpBullet = (expIdx, bulletIdx, value) => {
    setResume((prev) => {
      const exp = [...prev.experience];
      const bullets = [...exp[expIdx].bullets];
      bullets[bulletIdx] = value;
      exp[expIdx].bullets = bullets;
      return { ...prev, experience: exp };
    });
  };

  const removeExpBullet = (expIdx, bulletIdx) => {
    setResume((prev) => {
      const exp = [...prev.experience];
      exp[expIdx].bullets = exp[expIdx].bullets.filter((_, i) => i !== bulletIdx);
      return { ...prev, experience: exp };
    });
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          gpa: '',
          bullets: []
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((prev) => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          technologies: [],
          link: '',
          bullets: ['']
        }
      ]
    }));
  };

  const updateProject = (index, field, value) => {
    setResume((prev) => {
      const proj = [...prev.projects];
      proj[index] = { ...proj[index], [field]: value };
      return { ...prev, projects: proj };
    });
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCert = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Date.now().toString(),
          name: '',
          issuer: '',
          date: '',
          link: ''
        }
      ]
    }));
  };

  const updateCert = (index, field, value) => {
    setResume((prev) => {
      const certs = [...prev.certifications];
      certs[index] = { ...certs[index], [field]: value };
      return { ...prev, certifications: certs };
    });
  };

  const removeCert = (index) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addSkillCategory = () => {
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: 'New Category', items: [] }]
    }));
  };

  const updateSkillCategory = (index, category) => {
    setResume((prev) => {
      const sk = [...prev.skills];
      sk[index].category = category;
      return { ...prev, skills: sk };
    });
  };

  const updateSkillItems = (index, itemsString) => {
    const items = itemsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setResume((prev) => {
      const sk = [...prev.skills];
      sk[index].items = items;
      return { ...prev, skills: sk };
    });
  };

  const removeSkillCategory = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    setErrorMessage('');

    try {
      if (resumeId) {
        await api.updateResume(resumeId, resume);
        setSaveMessage('Resume saved successfully!');
      } else {
        const res = await api.createResume(resume);
        if (res?.data?.resume?._id) {
          setSaveMessage('Resume created and saved!');
          navigate(`/builder?id=${res.data.resume._id}`, { replace: true });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not save resume to server.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadResumePdf(resume);
    } catch (err) {
      alert(`PDF generation failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleRunAiImprovement = async () => {
    setAiLoading(true);
    setErrorMessage('');
    try {
      const res = await api.improveResume({
        resumeData: resume,
        targetJobDescription: aiTargetJob,
        targetRole: resume.targetRole
      });
      if (res?.data?.improvements) {
        setAiSuggestions(res.data.improvements);
      }
    } catch (err) {
      setErrorMessage(err.message || 'AI improvement service failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyProposedSummary = (summaryText) => {
    setResume((prev) => ({ ...prev, summary: summaryText }));
  };

  const applyProposedBullet = (companyName, originalBullet, improvedBullet) => {
    setResume((prev) => {
      const updatedExp = prev.experience.map((exp) => {
        if (exp.company.toLowerCase() === companyName.toLowerCase() || !companyName) {
          const updatedBullets = exp.bullets.map((b) =>
            b.trim() === originalBullet.trim() ? improvedBullet : b
          );
          return { ...exp, bullets: updatedBullets };
        }
        return exp;
      });
      return { ...prev, experience: updatedExp };
    });
  };

  const renderTemplatePreview = () => {
    if (resume.selectedTemplate === 'classic') return <ClassicTemplate data={resume} />;
    if (resume.selectedTemplate === 'minimal') return <MinimalTemplate data={resume} />;
    if (resume.selectedTemplate === 'executive') return <ExecutiveTemplate data={resume} />;
    if (resume.selectedTemplate === 'creative') return <CreativeTemplate data={resume} />;
    return <ModernTemplate data={resume} />;
  };

  if (loadingResume) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-electric-500" />
        <p className="text-sm">Loading your resume...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 radial-bg">
      {/* Compact Top Controls Toolbar */}
      <div className="glass-panel p-2.5 sm:p-3.5 rounded-2xl flex flex-col gap-2.5 lg:sticky lg:top-16 z-30">
        {/* Row 1: Title + Template Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            className="w-full sm:w-56 h-9 bg-space-900/90 border border-blue-500/30 rounded-xl px-3 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-electric-500"
            placeholder="Resume Title"
          />

          <div className="flex items-center gap-1 bg-space-900/90 p-1 rounded-xl border border-blue-500/20 text-[11px] sm:text-xs overflow-x-auto no-scrollbar">
            {RESUME_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setResume({ ...resume, selectedTemplate: tmpl.id })}
                className={`h-7 px-2.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                  resume.selectedTemplate === tmpl.id
                    ? 'bg-electric-600 text-white shadow-glass-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{tmpl.name}</span>
                {tmpl.badge === 'New' && (
                  <span className="text-[8px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    New
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: All Action Buttons + Color Popup Button aligned on one line with identical height */}
        <div className="grid grid-cols-5 lg:flex lg:items-center lg:justify-end gap-1.5 sm:gap-2 pt-2 border-t border-blue-500/15">
          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="lg:hidden h-9 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 flex items-center justify-center gap-1 whitespace-nowrap"
          >
            {previewMode ? (
              <Edit3 className="w-3.5 h-3.5 text-electric-400 shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-electric-400 shrink-0" />
            )}
            <span>{previewMode ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Popup Color Picker Button */}
          <ColorPickerPopover
            value={resume.accentColor || '#2563eb'}
            onChange={(hex) => setResume({ ...resume, accentColor: hex })}
            buttonClassName="w-full lg:w-auto h-9 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          />

          {/* AI Coach Button */}
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="h-9 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-semibold text-electric-300 bg-electric-950/90 hover:bg-electric-900 border border-electric-500/35 flex items-center justify-center gap-1 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>AI</span>
            <span className="hidden sm:inline">Coach</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-2 sm:px-4 rounded-xl text-[11px] sm:text-xs font-semibold text-white bg-space-800 hover:bg-space-700 border border-blue-500/30 flex items-center justify-center gap-1 transition-all whitespace-nowrap"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            ) : (
              <Save className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{saving ? '...' : 'Save'}</span>
          </button>

          {/* PDF Export Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="h-9 px-2 sm:px-4 rounded-xl text-[11px] sm:text-xs font-semibold text-white btn-3d flex items-center justify-center gap-1 whitespace-nowrap"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            ) : (
              <Download className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div className={`lg:col-span-6 space-y-4 ${previewMode ? 'hidden lg:block' : 'block'}`}>
          {/* Section Navigation Tabs (Single horizontal row on mobile) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-space-900 border border-blue-500/15 text-xs font-medium overflow-x-auto no-scrollbar">
            {[
              { id: 'personal', label: 'Contact', icon: User },
              { id: 'summary', label: 'Summary', icon: Edit3 },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Layers },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'certs', label: 'Certs', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-electric-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-space-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Panel */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-6">
            {/* 1. Contact / Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      placeholder="Zunair Majeed"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Target Role</label>
                    <input
                      type="text"
                      value={resume.targetRole}
                      onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                      placeholder="Senior Full Stack Engineer"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="zunair@example.com"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="+92 (300) 123-4567"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="Lahore, Pakistan"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Website / Portfolio</label>
                    <input
                      type="text"
                      value={resume.personalInfo.website}
                      onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                      placeholder="portfolio.dev"
                      className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Professional Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Professional Summary
                  </h3>
                  <button
                    onClick={() => setAiModalOpen(true)}
                    className="text-xs text-electric-400 hover:text-white flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Improve with AI</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Concise 2-4 sentence overview highlighting years of experience, core tech stack, and greatest measurable achievements.
                </p>
                <textarea
                  rows={5}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  placeholder="Senior software engineer with 6+ years building scalable cloud services..."
                  className="w-full p-3 rounded-lg glass-input text-xs leading-relaxed resize-y"
                />
              </div>
            )}

            {/* 3. Work Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Work Experience
                  </h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                {resume.experience.map((exp, expIdx) => (
                  <div
                    key={exp.id || expIdx}
                    className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Position #{expIdx + 1}</span>
                      <button
                        onClick={() => removeExperience(expIdx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove position"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                          placeholder="Acme Corp"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                          placeholder="Software Engineer"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                          placeholder="New York, NY"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                            placeholder="2021"
                            className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">End Date</label>
                          <input
                            type="text"
                            value={exp.current ? 'Present' : exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                            placeholder="2024"
                            className="w-full px-3 py-2 rounded-lg glass-input text-xs disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`curr-${expIdx}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(expIdx, 'current', e.target.checked)}
                        className="rounded bg-space-900 border-blue-500/30 text-electric-600 focus:ring-0"
                      />
                      <label htmlFor={`curr-${expIdx}`} className="text-xs text-slate-300">
                        I currently work here
                      </label>
                    </div>

                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Key Responsibilities & Metrics</span>
                        <button
                          onClick={() => addExpBullet(expIdx)}
                          className="text-electric-400 hover:text-white font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {exp.bullets?.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateExpBullet(expIdx, bIdx, e.target.value)}
                            placeholder="e.g. Reduced query execution time by 40% by implementing caching..."
                            className="w-full p-2.5 rounded-lg glass-input text-xs leading-relaxed resize-y"
                          />
                          <button
                            onClick={() => removeExpBullet(expIdx, bIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Skills & Competencies
                  </h3>
                  <button
                    onClick={addSkillCategory}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                {resume.skills.map((group, skIdx) => (
                  <div
                    key={skIdx}
                    className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateSkillCategory(skIdx, e.target.value)}
                        placeholder="Category Name (e.g. Languages)"
                        className="px-3 py-1.5 rounded-lg glass-input text-xs font-bold w-2/3 sm:w-1/2"
                      />
                      <button
                        onClick={() => removeSkillCategory(skIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(group.items) ? group.items.join(', ') : group.items}
                        onChange={(e) => updateSkillItems(skIdx, e.target.value)}
                        placeholder="TypeScript, React, Node.js, Express"
                        className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Key Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resume.projects.map((proj, projIdx) => (
                  <div
                    key={proj.id || projIdx}
                    className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Project #{projIdx + 1}</span>
                      <button
                        onClick={() => removeProject(projIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(projIdx, 'name', e.target.value)}
                          placeholder="Resumind Platform"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Link / Repo</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(projIdx, 'link', e.target.value)}
                          placeholder="github.com/user/project"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 text-xs">Brief Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(projIdx, 'description', e.target.value)}
                        placeholder="Built real-time collaboration tool using WebSockets..."
                        className="w-full p-2.5 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Education
                  </h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resume.education.map((edu, eduIdx) => (
                  <div
                    key={edu.id || eduIdx}
                    className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Degree #{eduIdx + 1}</span>
                      <button
                        onClick={() => removeEducation(eduIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                          placeholder="UC Berkeley"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                          placeholder="B.S."
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(eduIdx, 'fieldOfStudy', e.target.value)}
                          placeholder="Computer Science"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">Year</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(eduIdx, 'endDate', e.target.value)}
                            placeholder="2020"
                            className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">GPA (Optional)</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(eduIdx, 'gpa', e.target.value)}
                            placeholder="3.8"
                            className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications */}
            {activeTab === 'certs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Certifications
                  </h3>
                  <button
                    onClick={addCert}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                {resume.certifications.map((cert, cIdx) => (
                  <div
                    key={cert.id || cIdx}
                    className="p-4 rounded-xl bg-space-850/80 border border-blue-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Cert #{cIdx + 1}</span>
                      <button
                        onClick={() => removeCert(cIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Certificate Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCert(cIdx, 'name', e.target.value)}
                          placeholder="AWS Solutions Architect"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Issuing Authority</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCert(cIdx, 'issuer', e.target.value)}
                          placeholder="Amazon Web Services"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => updateCert(cIdx, 'date', e.target.value)}
                          placeholder="2023"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: True A4 Paper Live Preview (scales down to fit mobile like a real A4 sheet, no internal scroll) */}
        <div className={`lg:col-span-6 lg:sticky lg:top-28 ${previewMode ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-panel p-3 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-space-800">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Eye className="w-3.5 h-3.5 text-electric-400" />
                <span>A4 Paper Live Preview</span>
              </span>
              <span className="capitalize font-medium text-electric-400 bg-space-900 px-2.5 py-0.5 rounded border border-blue-500/20">
                {resume.selectedTemplate} Template
              </span>
            </div>

            <A4ResumeViewport>{renderTemplatePreview()}</A4ResumeViewport>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border-electric-500/30">
            <div className="flex items-center justify-between pb-4 border-b border-space-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-electric-600/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-electric-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Resumind AI Coach</h3>
                  <p className="text-xs text-slate-400">
                    Strict Truthfulness Protocol: Enhances real bullets, never fabricates facts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Job Context Input */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Target Job Description (Optional context for optimization)
              </label>
              <textarea
                rows={3}
                value={aiTargetJob}
                onChange={(e) => setAiTargetJob(e.target.value)}
                placeholder="Paste requirements to guide phrasing and keyword alignment..."
                className="w-full p-2.5 rounded-lg glass-input text-xs"
              />
              <button
                onClick={handleRunAiImprovement}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & drafting proposals...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Truthful Enhancement Proposals</span>
                  </>
                )}
              </button>
            </div>

            {/* Suggestions list */}
            {aiSuggestions && (
              <div className="space-y-6 pt-4 border-t border-space-800">
                {aiSuggestions.proposedSummary && (
                  <div className="p-4 rounded-xl bg-space-850 border border-blue-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-electric-400 uppercase tracking-wider">
                        Proposed Executive Summary
                      </h4>
                      <button
                        onClick={() => applyProposedSummary(aiSuggestions.proposedSummary)}
                        className="px-2.5 py-1 rounded bg-electric-600 hover:bg-electric-500 text-[11px] font-semibold text-white"
                      >
                        Apply to Resume
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {aiSuggestions.proposedSummary}
                    </p>
                  </div>
                )}

                {aiSuggestions.proposedBullets?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Proposed Bullet Rewrites
                    </h4>
                    {aiSuggestions.proposedBullets.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-space-850/90 border border-blue-500/20 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>
                            {item.company} — {item.role}
                          </span>
                          <span className="text-electric-400 font-medium">
                            {item.metricAddedOrActionVerb}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-rose-950/20 text-slate-400">
                          <strong>Original:</strong> {item.original}
                        </div>
                        <div className="p-2 rounded bg-emerald-950/20 text-slate-200 flex items-start justify-between gap-2">
                          <div>
                            <strong className="text-emerald-400">Improved:</strong> {item.improved}
                          </div>
                          <button
                            onClick={() =>
                              applyProposedBullet(item.company, item.original, item.improved)
                            }
                            className="shrink-0 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px]"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {aiSuggestions.targetedQuestions?.length > 0 && (
                  <div className="p-4 rounded-xl bg-space-850 border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Missing Facts — Questions for You</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      To protect resume authenticity, we don't invent numbers. Consider answering these in your bullets:
                    </p>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-300">
                      {aiSuggestions.targetedQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
