import React from 'react';
import { getThemePalette } from './themeUtils';

export const DEMO_RESUME_DATA = {
  title: 'Senior Software Engineer Resume',
  targetRole: 'Senior Full Stack Engineer',
  selectedTemplate: 'modern',
  accentColor: '#2563eb',
  personalInfo: {
    fullName: 'Daniyal',
    email: 'daniyal@example.com',
    phone: '+92 (300) 123-4567',
    location: 'Lahore, Pakistan',
    linkedin: 'linkedin.com/in/m-daniyal',
    github: 'github.com/m-daniyal',
    website: 'https://m-daniyal.vercel.app'
  },
  summary:
    'Full-stack software engineer with 5+ years of experience architecting resilient cloud services and high-performance web applications using React, Node.js, and distributed databases. Led performance initiatives that reduced API latency by 42% across 3M monthly active users.',
  skills: [
    {
      category: 'Languages & Frameworks',
      items: ['TypeScript', 'JavaScript (ESNext)', 'React', 'Node.js', 'Express', 'Next.js']
    },
    {
      category: 'Cloud & Infrastructure',
      items: ['MongoDB Atlas', 'PostgreSQL', 'Docker', 'AWS (S3, Lambda)', 'Redis']
    },
    {
      category: 'Methodologies & Practices',
      items: ['RESTful APIs', 'Microservices', 'CI/CD Pipelines', 'Agile/Scrum', 'Test-Driven Development']
    }
  ],
  experience: [
    {
      company: 'TechPulse Solutions',
      role: 'Senior Full Stack Engineer',
      location: 'Lahore, Pakistan',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected real-time collaboration pipeline processing 15,000 events/sec with 99.98% uptime.',
        'Mentored 5 junior engineers and established automated code linting and unit testing coverage standards (88%).',
        'Refactored legacy monolith into Node.js serverless functions, decreasing infrastructure monthly billing by 35%.'
      ]
    },
    {
      company: 'CodeCraft Studio',
      role: 'Full Stack Developer',
      location: 'Lahore, Pakistan',
      startDate: '2020',
      endDate: '2022',
      current: false,
      bullets: [
        'Built responsive customer dashboard in React and Tailwind CSS serving 120,000 enterprise accounts.',
        'Engineered secure JWT authentication layer and role-based access control protecting PII records.',
        'Reduced bundle size by 30% through dynamic code splitting and tree-shaking optimizations.'
      ]
    }
  ],
  projects: [
    {
      name: 'Resumind AI Platform',
      link: 'm-daniyal.vercel.app',
      description: 'AI-assisted resume analysis platform with client-side text parsing and structured rubric evaluation.',
      technologies: ['React', 'Node.js', 'Express', 'Mongoose', 'AI Engine'],
      bullets: [
        'Implemented client-side PDF/DOCX tokenization avoiding server storage of raw files.',
        'Engineered automated rubric scoring with strict schema validation.'
      ]
    }
  ],
  education: [
    {
      institution: 'FAST National University',
      degree: 'B.S. Computer Science',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.82'
    }
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' }
  ]
};

