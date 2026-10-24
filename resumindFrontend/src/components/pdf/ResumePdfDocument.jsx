import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#1e293b'
  },
  // Classic Styles
  classicHeader: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 12,
    textAlign: 'center'
  },
  classicName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#0f172a',
    marginBottom: 3
  },
  classicRole: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4
  },
  classicContact: {
    fontSize: 8.5,
    color: '#334155',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#0f172a',
    borderBottomWidth: 0.8,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 10
  },
  // Modern Styles
  modernHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  modernName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a'
  },
  modernRole: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginTop: 2
  },
  modernSectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#1e40af',
    borderBottomWidth: 1,
    borderBottomColor: '#bfdbfe',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 10
  },
  // Minimal Styles
  minimalHeader: {
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid'
  },
  minimalName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a'
  },
  minimalRole: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2
  },
  minimalSectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#64748b',
    marginBottom: 6,
    marginTop: 10
  },
  // Reusable blocks
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
    backgroundColor: '#334155',
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

  const getSectionTitleStyle = () => {
    if (template === 'modern') return styles.modernSectionTitle;
    if (template === 'minimal') return styles.minimalSectionTitle;
    return styles.sectionTitle;
  };

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Resumind AI`} author="Resumind AI">
      <Page size="A4" style={styles.page}>
        {/* Header Block */}
        {template === 'modern' ? (
          <View style={styles.modernHeader}>
            <View>
              <Text style={styles.modernName}>{personalInfo.fullName || 'Daniyal'}</Text>
              {data.targetRole && <Text style={styles.modernRole}>{data.targetRole}</Text>}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {personalInfo.email && <Text style={{ fontSize: 8 }}>{personalInfo.email}</Text>}
              {personalInfo.phone && <Text style={{ fontSize: 8 }}>{personalInfo.phone}</Text>}
              {personalInfo.location && <Text style={{ fontSize: 8 }}>{personalInfo.location}</Text>}
              {personalInfo.linkedin && <Text style={{ fontSize: 8, color: '#2563eb' }}>{personalInfo.linkedin}</Text>}
            </View>
          </View>
        ) : template === 'minimal' ? (
          <View style={styles.minimalHeader}>
            <Text style={styles.minimalName}>{personalInfo.fullName || 'Daniyal'}</Text>
            {data.targetRole && <Text style={styles.minimalRole}>{data.targetRole}</Text>}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={{ fontSize: 8, color: '#64748b' }}>
                  {item} {idx < contactItems.length - 1 ? '•' : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.classicHeader}>
            <Text style={styles.classicName}>{personalInfo.fullName || 'Daniyal'}</Text>
            {data.targetRole && <Text style={styles.classicRole}>{data.targetRole}</Text>}
            <View style={styles.classicContact}>
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
            <Text style={getSectionTitleStyle()}>
              {template === 'minimal' ? 'Profile' : 'Professional Summary'}
            </Text>
            <Text style={{ fontSize: 8.5, color: '#334155', lineHeight: 1.4 }}>{summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={getSectionTitleStyle()}>
              {template === 'minimal' ? 'Skills & Competencies' : 'Core Skills'}
            </Text>
            {skills.map((group, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={{ ...styles.boldText, fontSize: 8.5 }}>{group.category}: </Text>
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
            <Text style={getSectionTitleStyle()}>Professional Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} wrap={false} style={{ marginBottom: 5 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 9 }}>{exp.role || 'Job Title'}</Text>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.subText}>{exp.company}</Text>
                  {exp.location && <Text style={styles.subText}>{exp.location}</Text>}
                </View>
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((b, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <View style={styles.bulletDot} />
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
            <Text style={getSectionTitleStyle()}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} wrap={false} style={{ marginBottom: 4 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 8.8 }}>{proj.name}</Text>
                  {proj.link && <Text style={{ fontSize: 7.5, color: '#2563eb' }}>{proj.link}</Text>}
                </View>
                {proj.description && (
                  <Text style={{ fontSize: 8.2, color: '#475569', marginBottom: 2 }}>
                    {proj.description}
                  </Text>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: '#2563eb', marginBottom: 2 }}>
                    Tech: {proj.technologies.join(', ')}
                  </Text>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {proj.bullets.map((b, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <View style={styles.bulletDot} />
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
            <Text style={getSectionTitleStyle()}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 3 }}>
                <View style={styles.entryRow}>
                  <Text style={{ ...styles.boldText, fontSize: 8.8 }}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>
                    {edu.startDate} - {edu.endDate}
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
            <Text style={getSectionTitleStyle()}>Certifications</Text>
            {certifications.map((cert, idx) => (
              <View key={idx} style={{ ...styles.entryRow, marginBottom: 2 }}>
                <Text style={{ fontSize: 8.5, color: '#0f172a' }}>
                  <Text style={styles.boldText}>{cert.name}</Text>
                  {cert.issuer ? ` — ${cert.issuer}` : ''}
                </Text>
                {cert.date && <Text style={{ fontSize: 8, color: '#64748b' }}>{cert.date}</Text>}
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
