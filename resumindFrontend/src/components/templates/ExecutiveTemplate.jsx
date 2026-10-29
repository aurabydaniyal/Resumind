import React from 'react';
import { getThemePalette } from './themeUtils';

export default function ExecutiveTemplate({ data }) {
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
    <div className="bg-white text-slate-900 font-sans shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200 overflow-hidden">
      {/* Commanding Executive Dark Banner with Dynamic Accent Bar */}
      <header
        className="text-white p-6 sm:p-10 relative"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, ${palette.darker} 100%)`,
          borderBottom: `4px solid ${palette.primary}`
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Daniyal'}
            </h1>
            {data.targetRole && (
              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-widest mt-1"
                style={{ color: palette.borderLight }}
              >
                {data.targetRole}
              </p>
            )}
          </div>

          <div className="text-xs text-slate-200 md:text-right space-y-1">
            {personalInfo.email && <div className="font-medium">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div className="text-slate-300">{personalInfo.location}</div>}
          </div>
        </div>

        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website]
              .filter(Boolean)
              .map((link, idx) => (
                <span key={idx} className="break-all">
                  {link}
                </span>
              ))}
          </div>
        )}
      </header>

      <div className="p-6 sm:p-10 space-y-6">
        {/* Executive Summary */}
        {summary && (
          <section
            className="p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: palette.lightBg,
              borderLeftColor: palette.primary
            }}
          >
            <h2
              className="text-[11px] font-extrabold uppercase tracking-widest mb-1.5"
              style={{ color: palette.dark }}
            >
              Executive Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Core Competencies Pill Matrix */}
        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-4 rounded-sm"
                style={{ backgroundColor: palette.primary }}
              />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Leadership & Technical Competencies
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {skills.map((group, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60"
                >
                  <div
                    className="font-bold uppercase tracking-wider text-[11px] mb-1.5"
                    style={{ color: palette.dark }}
                  >
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(group.items) ? group.items : String(group.items).split(','))
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-medium border"
                          style={{
                            backgroundColor: '#ffffff',
                            borderColor: palette.borderLight,
                            color: '#1e293b'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3.5">
              <div
                className="w-2 h-4 rounded-sm"
                style={{ backgroundColor: palette.primary }}
              />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Professional Experience
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">
                        {exp.role || 'Role Title'}
                      </span>
                      {exp.company && (
                        <span
                          className="font-bold ml-2"
                          style={{ color: palette.primary }}
                        >
                          @ {exp.company}
                        </span>
                      )}
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold self-start sm:self-auto"
                      style={{
                        backgroundColor: palette.lightBg,
                        color: palette.dark
                      }}
                    >
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                      {exp.location}
                    </div>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-slate-700 text-xs">
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

        {/* Key Projects */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-4 rounded-sm"
                style={{ backgroundColor: palette.primary }}
              />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Strategic Projects & Initiatives
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border text-xs"
                  style={{
                    borderColor: palette.borderLight,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                    {proj.link && (
                      <span
                        className="text-[11px] font-medium underline break-all"
                        style={{ color: palette.primary }}
                      >
                        {proj.link}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-slate-600 text-xs mt-1">{proj.description}</p>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-0.5 text-slate-700 text-xs">
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

        {/* Education & Certifications Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-2 h-4 rounded-sm"
                  style={{ backgroundColor: palette.primary }}
                />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Education
                </h2>
              </div>
              <div className="space-y-2.5 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">{edu.institution}</div>
                    <div className="text-slate-700">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </div>
                    <div className="text-[11px] font-medium mt-0.5" style={{ color: palette.primary }}>
                      {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-2 h-4 rounded-sm"
                  style={{ backgroundColor: palette.primary }}
                />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Certifications
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: palette.lightBg,
                      borderColor: palette.borderLight
                    }}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{cert.name}</div>
                      {cert.issuer && <div className="text-[11px] text-slate-600">{cert.issuer}</div>}
                    </div>
                    {cert.date && (
                      <span
                        className="text-[11px] font-bold shrink-0"
                        style={{ color: palette.dark }}
                      >
                        {cert.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

