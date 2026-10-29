import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { getThemePalette } from '../templates/themeUtils';

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 38,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#1e293b'
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a'
  },
  subText: {
    fontSize: 8.5,
    color: '#475569',
    marginBottom: 2
  },
  bulletList: {
    marginTop: 2,
    marginBottom: 5,
    paddingLeft: 8
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginRight: 5,
    marginTop: 4
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.35
  }
});

export function ResumePdfDocument({ data }) {
  const template = data.selectedTemplate || 'classic';
  const palette = getThemePalette(data.accentColor || '#2563eb');
  const {
    personalInfo = {},
    summary = '',
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = []
  } = data;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website
  ].filter(Boolean);

  // Creative two-column PDF layout
  if (template === 'creative') {
    return (
      <Document title={`${personalInfo.fullName || 'Resume'} - Resumind AI`} author="Resumind AI">
        <Page size="A4" style={{ fontSize: 9.2, fontFamily: 'Helvetica', lineHeight: 1.4, color: '#1e293b', flexDirection: 'row' }}>
          {/* Left Sidebar */}
          <View
            style={{
              width: '34%',
              backgroundColor: palette.lightBg,
              padding: 24,
              borderRightWidth: 1,
              borderRightColor: palette.borderLight,
              borderRightStyle: 'solid'
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 2 }}>
              {personalInfo.fullName || 'Daniyal'}
            </Text>
            {data.targetRole ? (
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: palette.primary, textTransform: 'uppercase', marginBottom: 12 }}>
                {data.targetRole}
              </Text>
            ) : null}

            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.dark, marginBottom: 4 }}>
                Contact
              </Text>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={{ fontSize: 8, color: '#334155', marginBottom: 2 }}>
                  {item}
                </Text>
              ))}
            </View>

            {skills.length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.dark, marginBottom: 5 }}>
                  Skills & Stack
                </Text>
                {skills.map((group, idx) => (
                  <View key={idx} style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 8.2, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{group.category}</Text>
                    <Text style={{ fontSize: 8, color: '#334155' }}>
                      {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {education.length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.dark, marginBottom: 5 }}>
                  Education
                </Text>
                {education.map((edu, idx) => (
                  <View key={idx} style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 8.3, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#475569' }}>{edu.institution}</Text>
                    <Text style={{ fontSize: 7.5, color: palette.primary }}>
                      {edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {certifications.length > 0 && (
              <View>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.dark, marginBottom: 5 }}>
                  Credentials
                </Text>
                {certifications.map((cert, idx) => (
                  <View key={idx} style={{ marginBottom: 3 }}>
                    <Text style={{ fontSize: 8.2, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{cert.name}</Text>
                    <Text style={{ fontSize: 7.5, color: '#475569' }}>
                      {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Main Content */}
          <View style={{ width: '66%', padding: 26 }}>
            {summary && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.primary, borderBottomWidth: 1, borderBottomColor: palette.borderLight, paddingBottom: 2, marginBottom: 5 }}>
                  Executive Profile
                </Text>
                <Text style={{ fontSize: 8.5, color: '#334155', lineHeight: 1.4 }}>{summary}</Text>
              </View>
            )}

            {experience.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.primary, borderBottomWidth: 1, borderBottomColor: palette.borderLight, paddingBottom: 2, marginBottom: 6 }}>
                  Career Experience
                </Text>
                {experience.map((exp, idx) => (
                  <View key={idx} wrap={false} style={{ marginBottom: 7 }}>
                    <View style={styles.entryRow}>
                      <Text style={{ ...styles.boldText, fontSize: 9 }}>{exp.role || 'Job Title'}</Text>
                      <Text style={{ fontSize: 8, color: palette.primary, fontFamily: 'Helvetica-Bold' }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                    <Text style={styles.subText}>
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </Text>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <View style={styles.bulletList}>
                        {exp.bullets.filter(Boolean).map((b, bIdx) => (
                          <View key={bIdx} style={styles.bulletItem}>
                            <View style={{ ...styles.bulletDot, backgroundColor: palette.primary }} />
                            <Text style={styles.bulletText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {projects.length > 0 && (
              <View>
                <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: palette.primary, borderBottomWidth: 1, borderBottomColor: palette.borderLight, paddingBottom: 2, marginBottom: 6 }}>
                  Featured Projects
                </Text>
                {projects.map((proj, idx) => (
                  <View key={idx} wrap={false} style={{ marginBottom: 6 }}>
                    <View style={styles.entryRow}>
                      <Text style={{ ...styles.boldText, fontSize: 8.8 }}>{proj.name}</Text>
                      {proj.link && <Text style={{ fontSize: 7.5, color: palette.primary }}>{proj.link}</Text>}
                    </View>
                    {proj.description && (
                      <Text style={{ fontSize: 8.2, color: '#475569', marginBottom: 2 }}>{proj.description}</Text>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <View style={styles.bulletList}>
                        {proj.bullets.filter(Boolean).map((b, bIdx) => (
                          <View key={bIdx} style={styles.bulletItem}>
                            <View style={{ ...styles.bulletDot, backgroundColor: palette.primary }} />
                            <Text style={styles.bulletText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  }

  const sectionTitleStyle = {
    fontSize: 9.8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: template === 'minimal' ? palette.primary : palette.dark,
    borderBottomWidth: template === 'minimal' ? 0 : 1,
    borderBottomColor: palette.borderLight,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 10
  };

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Resumind AI`} author="Resumind AI">
      <Page size="A4" style={styles.page}>
        {/* Header Block */}
        {template === 'executive' ? (
          <View
            style={{
              backgroundColor: palette.darker,
              padding: 16,
              marginBottom: 12,
              borderBottomWidth: 3,
              borderBottomColor: palette.primary,
              borderBottomStyle: 'solid'
            }}
          >
            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#ffffff', textTransform: 'uppercase' }}>
              {personalInfo.fullName || 'Daniyal'}
            </Text>
            {data.targetRole && (
              <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: palette.borderLight, marginTop: 2, textTransform: 'uppercase' }}>
                {data.targetRole}
              </Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={{ fontSize: 8, color: '#e2e8f0' }}>
                  {item} {idx < contactItems.length - 1 ? '•' : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : template === 'modern' ? (
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: palette.primary,
              borderBottomStyle: 'solid',
              paddingBottom: 10,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <View>
              <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
                {personalInfo.fullName || 'Daniyal'}
              </Text>
              {data.targetRole && (
                <Text style={{ fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: palette.primary, marginTop: 2 }}>
                  {data.targetRole}
                </Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {personalInfo.email && <Text style={{ fontSize: 8 }}>{personalInfo.email}</Text>}
              {personalInfo.phone && <Text style={{ fontSize: 8 }}>{personalInfo.phone}</Text>}
              {personalInfo.location && <Text style={{ fontSize: 8 }}>{personalInfo.location}</Text>}
              {personalInfo.linkedin && <Text style={{ fontSize: 8, color: palette.primary }}>{personalInfo.linkedin}</Text>}
            </View>
          </View>
        ) : template === 'minimal' ? (
          <View
            style={{
              marginBottom: 12,
              paddingBottom: 8,
              borderBottomWidth: 0.8,
              borderBottomColor: palette.borderLight,
              borderBottomStyle: 'solid'
            }}
          >
            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
              {personalInfo.fullName || 'Daniyal'}
            </Text>
            {data.targetRole && (
              <Text style={{ fontSize: 10, color: palette.primary, marginTop: 2 }}>{data.targetRole}</Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={{ fontSize: 8, color: '#64748b' }}>
                  {item} {idx < contactItems.length - 1 ? '•' : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : (
          <View
            style={{
              borderBottomWidth: 1.8,
              borderBottomColor: palette.primary,
              borderBottomStyle: 'solid',
              paddingBottom: 8,
              marginBottom: 12,
              textAlign: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Helvetica-Bold',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: palette.darker,
                marginBottom: 3
              }}
            >
              {personalInfo.fullName || 'Daniyal'}
            </Text>
            {data.targetRole && (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Helvetica-Bold',
                  color: palette.primary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  marginBottom: 4
                }}
              >
                {data.targetRole}
              </Text>
            )}
            <View style={{ fontSize: 8.5, color: '#334155', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
              {contactItems.map((item, idx) => (
                <Text key={idx}>
                  {item} {idx < contactItems.length - 1 ? '•' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Professional Summary */}
        {summary && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>
              {template === 'minimal' ? 'Profile' : 'Professional Summary'}
            </Text>
            <Text style={{ fontSize: 8.5, color: '#334155', lineHeight: 1.4 }}>{summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>
              {template === 'minimal' ? 'Skills & Competencies' : 'Core Skills'}
            </Text>
            {skills.map((group, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={{ ...styles.boldText, fontSize: 8.5, color: palette.darker }}>
                  {group.category}:{' '}
                </Text>
                <Text style={{ fontSize: 8.5, color: '#334155', flex: 1 }}>
                  {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>Professional Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} wrap={false} style={{ marginBottom: 5 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 9 }}>{exp.role || 'Job Title'}</Text>
                  <Text style={{ fontSize: 8, color: palette.primary, fontFamily: 'Helvetica-Bold' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.subText}>{exp.company}</Text>
                  {exp.location && <Text style={styles.subText}>{exp.location}</Text>}
                </View>
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.filter(Boolean).map((b, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <View style={{ ...styles.bulletDot, backgroundColor: palette.primary }} />
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} wrap={false} style={{ marginBottom: 4 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 8.8 }}>{proj.name}</Text>
                  {proj.link && <Text style={{ fontSize: 7.5, color: palette.primary }}>{proj.link}</Text>}
                </View>
                {proj.description && (
                  <Text style={{ fontSize: 8.2, color: '#475569', marginBottom: 2 }}>
                    {proj.description}
                  </Text>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: palette.primary, marginBottom: 2 }}>
                    Tech: {proj.technologies.join(', ')}
                  </Text>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {proj.bullets.filter(Boolean).map((b, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <View style={{ ...styles.bulletDot, backgroundColor: palette.primary }} />
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 3 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 8.8 }}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={{ fontSize: 8, color: palette.primary }}>
                    {edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate}
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.subText}>{edu.institution}</Text>
                  {edu.gpa && <Text style={styles.subText}>GPA: {edu.gpa}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={sectionTitleStyle}>Certifications</Text>
            {certifications.map((cert, idx) => (
              <View key={idx} style={{ ...styles.entryRow, marginBottom: 2 }}>
                <Text style={{ fontSize: 8.5, color: '#0f172a' }}>
                  <Text style={styles.boldText}>{cert.name}</Text>
                  {cert.issuer ? ` — ${cert.issuer}` : ''}
                </Text>
                {cert.date && <Text style={{ fontSize: 8, color: palette.primary }}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

/**
 * Generates and triggers browser download of the selectable-text vector PDF
 */
export async function downloadResumePdf(resumeData, customFilename) {
  const doc = <ResumePdfDocument data={resumeData} />;
  const asPdf = pdf();
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();

  const safeName = (customFilename || resumeData.title || resumeData.personalInfo?.fullName || 'Resume')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
