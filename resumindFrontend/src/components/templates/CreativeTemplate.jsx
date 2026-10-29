import React from 'react';
import { getThemePalette } from './themeUtils';

export default function CreativeTemplate({ data }) {
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

  const initials = (personalInfo.fullName || 'Daniyal')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white text-slate-900 font-sans shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[700px]">
        {/* Left Studio Sidebar */}
        <aside
          className="md:col-span-4 p-6 sm:p-8 space-y-6 border-b md:border-b-0 md:border-r"
          style={{
            backgroundColor: palette.lightBg,
            borderColor: palette.borderLight
          }}
        >
          {/* Identity Badge */}
          <div className="space-y-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg tracking-wider shadow-md"
              style={{ backgroundColor: palette.primary }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {personalInfo.fullName || 'Daniyal'}
              </h1>
              {data.targetRole && (
                <p
                  className="text-xs font-bold uppercase tracking-wider mt-1"
                  style={{ color: palette.primary }}
                >
                  {data.targetRole}
                </p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: palette.borderLight }}>
            <h2
              className="text-[11px] font-extrabold uppercase tracking-widest"
              style={{ color: palette.dark }}
            >
              Contact
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700 break-all">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.linkedin && (
                <div className="font-medium" style={{ color: palette.primary }}>
                  {personalInfo.linkedin}
                </div>
              )}
              {personalInfo.github && (
                <div className="font-medium" style={{ color: palette.primary }}>
                  {personalInfo.github}
                </div>
              )}
              {personalInfo.website && (
                <div className="font-medium" style={{ color: palette.primary }}>
                  {personalInfo.website}
                </div>
              )}
            </div>
          </div>

          {/* Skills in Sidebar */}
          {skills.length > 0 && (
            <div className="space-y-3 pt-3 border-t" style={{ borderColor: palette.borderLight }}>
              <h2
                className="text-[11px] font-extrabold uppercase tracking-widest"
                style={{ color: palette.dark }}
              >
                Skills & Stack
              </h2>
              <div className="space-y-3 text-xs">
                {skills.map((group, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-slate-900 mb-1">{group.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(group.items) ? group.items : String(group.items).split(','))
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border"
                            style={{
                              borderColor: palette.borderLight,
                              color: palette.darker
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {education.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: palette.borderLight }}>
              <h2
                className="text-[11px] font-extrabold uppercase tracking-widest"
                style={{ color: palette.dark }}
              >
                Education
              </h2>
              <div className="space-y-2.5 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    {edu.fieldOfStudy && <div className="text-slate-700">{edu.fieldOfStudy}</div>}
                    <div className="text-slate-600 font-medium">{edu.institution}</div>
                    <div className="text-[11px]" style={{ color: palette.primary }}>
                      {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}
                      {edu.gpa ? ` • GPA ${edu.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {certifications.length > 0 && (
            <div className="space-y-2 pt-3 border-t" style={{ borderColor: palette.borderLight }}>
              <h2
                className="text-[11px] font-extrabold uppercase tracking-widest"
                style={{ color: palette.dark }}
              >
                Credentials
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((cert, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-[11px] text-slate-600">
                      {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Content Column */}
        <main className="md:col-span-8 p-6 sm:p-8 space-y-6">
          {/* Summary */}
          {summary && (
            <section>
              <h2
                className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-2"
                style={{ color: palette.primary }}
              >
                <span>About Me</span>
                <div className="flex-1 h-[1.5px]" style={{ backgroundColor: palette.borderLight }} />
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <section>
              <h2
                className="text-xs font-extrabold uppercase tracking-widest mb-3.5 flex items-center gap-2"
                style={{ color: palette.primary }}
              >
                <span>Career Experience</span>
                <div className="flex-1 h-[1.5px]" style={{ backgroundColor: palette.borderLight }} />
              </h2>

              <div className="space-y-5">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-4 border-l-2 text-xs"
                    style={{ borderLeftColor: palette.primary }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full absolute -left-[6px] top-1"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <span className="text-sm font-extrabold text-slate-900">
                        {exp.role || 'Job Title'}
                      </span>
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: palette.primary }}
                      >
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mb-1.5">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
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

          {/* Featured Projects */}
          {projects.length > 0 && (
            <section>
              <h2
                className="text-xs font-extrabold uppercase tracking-widest mb-3.5 flex items-center gap-2"
                style={{ color: palette.primary }}
              >
                <span>Featured Projects</span>
                <div className="flex-1 h-[1.5px]" style={{ backgroundColor: palette.borderLight }} />
              </h2>

              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border text-xs"
                    style={{
                      backgroundColor: palette.lightBg,
                      borderColor: palette.borderLight
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900">{proj.name}</span>
                      {proj.link && (
                        <span
                          className="text-[11px] font-semibold underline break-all"
                          style={{ color: palette.primary }}
                        >
                          {proj.link}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-slate-700 text-xs mt-1">{proj.description}</p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1.5 space-y-0.5 text-slate-700">
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
        </main>
      </div>
    </div>
  );
}

