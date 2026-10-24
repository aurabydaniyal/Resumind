import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function ClassicTemplate({ data }) {
  const { personalInfo = {}, summary = '', skills = [], experience = [], education = [], projects = [], certifications = [] } = data;

  return (
    <div className="bg-white text-slate-900 font-sans p-8 md:p-12 shadow-2xl rounded-sm max-w-4xl mx-auto text-sm leading-relaxed border border-slate-200">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-slate-900 mb-2">
          {personalInfo.fullName || 'Daniyal'}
        </h1>
        {data.targetRole && (
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-600 mb-3">
            {data.targetRole}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Professional Summary
          </h2>
          <p className="text-slate-800 text-xs md:text-sm text-justify leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Technical & Professional Skills
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((group, idx) => (
              <div key={idx} className="flex flex-wrap gap-1">
                <span className="font-bold text-slate-900">{group.category}:</span>{' '}
                <span className="text-slate-700">
                  {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold text-slate-900">
                  <span className="text-sm font-bold">{exp.role || 'Job Title'}</span>
                  <span className="text-slate-600 font-normal text-xs">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700 italic mb-1.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="text-xs font-bold">{proj.name}</span>
                  {proj.link && (
                    <span className="text-slate-500 font-normal underline">{proj.link}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-700 text-xs mb-1">{proj.description}</p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-slate-600 text-[11px] mb-1">
                    <span className="font-semibold">Technologies:</span>{' '}
                    {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold text-slate-900">
                  <span>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-slate-600 font-normal">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>{edu.institution}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Certifications & Credentials
          </h2>
          <div className="space-y-1.5 text-xs">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {cert.name} {cert.issuer ? `— ${cert.issuer}` : ''}
                </span>
                {cert.date && <span className="text-slate-600">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
