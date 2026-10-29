import React from 'react';
import { getThemePalette } from './themeUtils';

export default function ModernTemplate({ data }) {
  const {
    personalInfo = {},
    summary = '',
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    accentColor = '#2563eb'
  } = data;

  const palette = getThemePalette(accentColor);

  return (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-10 md:p-12 shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200">
      {/* Header with dynamic modern accent */}
      <header
        className="pb-5 mb-6"
        style={{ borderBottom: `2.5px solid ${palette.primary}` }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.fullName || 'Qasim Ali'}
            </h1>
            <p
              className="text-sm font-bold tracking-wide mt-1"
              style={{ color: palette.primary }}
            >
              {data.targetRole || 'Professional Role'}
            </p>
          </div>
          <div className="text-xs text-slate-600 text-left md:text-right space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
              <div className="font-medium break-all" style={{ color: palette.primary }}>
                {[personalInfo.linkedin, personalInfo.github, personalInfo.website]
                  .filter(Boolean)
                  .join(' • ')}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
            style={{ color: palette.dark }}
          >
            <span>Executive Summary</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2.5"
            style={{ color: palette.dark }}
          >
            <span>Core Competencies & Skills</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.map((group, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded border"
                style={{
                  backgroundColor: palette.lightBg,
                  borderColor: palette.borderLight
                }}
              >
                <span className="font-bold text-slate-900">{group.category}: </span>
                <span className="text-slate-700">
                  {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3"
            style={{ color: palette.dark }}
          >
            <span>Work Experience</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="text-xs pl-3.5 py-0.5"
                style={{ borderLeft: `2.5px solid ${palette.borderLight}` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold text-slate-900">
                  <span className="text-sm font-bold text-slate-900">{exp.role || 'Job Title'}</span>
                  <span
                    className="font-semibold text-xs"
                    style={{ color: palette.primary }}
                  >
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium mb-1.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 text-xs">
                    {exp.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3"
            style={{ color: palette.dark }}
          >
            <span>Key Projects</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="text-xs p-3 rounded border"
                style={{
                  backgroundColor: palette.lightBg,
                  borderColor: palette.borderLight
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-900">
                  <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                  {proj.link && (
                    <span
                      className="text-[11px] underline break-all"
                      style={{ color: palette.primary }}
                    >
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 text-xs my-1">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                        style={{
                          backgroundColor: palette.mediumBg,
                          color: palette.dark
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 mt-1.5 space-y-0.5 text-slate-700 text-xs">
                    {proj.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
            style={{ color: palette.dark }}
          >
            <span>Education</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <div className="text-slate-600">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </div>
                </div>
                <div className="text-slate-500 text-xs">
                  {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
            style={{ color: palette.dark }}
          >
            <span>Certifications</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: palette.borderLight }} />
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {certifications.map((cert, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded text-xs border font-medium"
                style={{
                  backgroundColor: palette.lightBg,
                  borderColor: palette.borderLight,
                  color: palette.darker
                }}
              >
                {cert.name} {cert.issuer ? `(${cert.issuer})` : ''} {cert.date ? `• ${cert.date}` : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
