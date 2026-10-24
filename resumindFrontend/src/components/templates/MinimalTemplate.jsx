import React from 'react';

export default function MinimalTemplate({ data }) {
  const { personalInfo = {}, summary = '', skills = [], experience = [], education = [], projects = [], certifications = [] } = data;

  return (
    <div className="bg-white text-slate-800 font-sans p-8 md:p-12 shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200">
      {/* Minimal Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Zunair Majeed'}
        </h1>
        {data.targetRole && (
          <p className="text-sm font-medium text-slate-500 mt-1 tracking-wide">
            {data.targetRole}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>/ {personalInfo.phone}</span>}
          {personalInfo.location && <span>/ {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>/ {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>/ {personalInfo.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-7">
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                  <div>
                    <span className="font-semibold text-slate-900">{exp.role}</span>
                    <span className="text-slate-400 mx-1.5">—</span>
                    <span className="text-slate-600 font-medium">{exp.company}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1 text-slate-600 text-xs mt-1.5 pl-3 border-l border-slate-200">
                    {exp.bullets.map((b, bIdx) => (
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
        <section className="mb-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-slate-900">{proj.name}</span>
                  {proj.link && <span className="text-slate-400 text-[11px]">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="space-y-0.5 text-slate-600 text-xs mt-1 pl-3 border-l border-slate-200">
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Expertise & Skills
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((group, idx) => (
              <div key={idx}>
                <span className="font-medium text-slate-900">{group.category}: </span>
                <span className="text-slate-600">
                  {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Education
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="font-medium text-slate-900">{edu.institution}</div>
                  <div className="text-slate-500">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {edu.startDate} – {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-slate-700">
                  <span className="font-medium text-slate-900">{cert.name}</span>
                  {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
