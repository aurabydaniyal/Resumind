import React from 'react';

export default function ModernTemplate({ data }) {
  const { personalInfo = {}, summary = '', skills = [], experience = [], education = [], projects = [], certifications = [] } = data;

  return (
    <div className="bg-white text-slate-900 font-sans p-8 md:p-12 shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200">
      {/* Header with modern cobalt accent */}
      <header className="border-b-2 border-blue-600 pb-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.fullName || 'Qasim Ali'}
            </h1>
            <p className="text-sm font-semibold text-blue-700 tracking-wide mt-1">
              {data.targetRole || 'Professional Role'}
            </p>
          </div>
          <div className="text-xs text-slate-600 text-left md:text-right space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="text-blue-600">
                {personalInfo.linkedin} {personalInfo.linkedin && personalInfo.github ? '•' : ''} {personalInfo.github}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-2">
            <span>Executive Summary</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-2">
            <span>Core Competencies & Skills</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.map((group, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-3">
            <span>Work Experience</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs border-l-2 border-blue-200 pl-3.5 py-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold text-slate-900">
                  <span className="text-sm font-bold text-slate-900">{exp.role || 'Job Title'}</span>
                  <span className="text-blue-700 font-medium text-xs">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium mb-1.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 text-xs">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-3">
            <span>Key Projects</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs bg-slate-50/70 p-3 rounded border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                  {proj.link && <span className="text-blue-600 text-[11px] underline">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-slate-600 text-xs my-1">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="bg-blue-100/70 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 mt-1.5 space-y-0.5 text-slate-700 text-xs">
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

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-2">
            <span>Education</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
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
                  {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2 mb-2">
            <span>Certifications</span>
            <div className="flex-1 h-[1px] bg-blue-200" />
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {certifications.map((cert, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs border border-slate-200">
                {cert.name} {cert.issuer ? `(${cert.issuer})` : ''} {cert.date ? `• ${cert.date}` : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
