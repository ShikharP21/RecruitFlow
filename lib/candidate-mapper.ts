import type { Candidate as DbCandidate } from '@prisma/client';
import type { Candidate } from './types';

export function mapDbCandidate(c: DbCandidate): Candidate {
  const raw = (c.rawData ?? null) as Partial<Candidate> | null;

  if (raw && typeof raw === 'object') {
    return {
      id: c.id,
      name: raw.name ?? c.name,
      email: raw.email ?? c.email,
      phone: raw.phone ?? c.phone ?? '',
      location: raw.location ?? c.location ?? '',
      submitted_at: raw.submitted_at ?? c.createdAt.toISOString(),
      work_availability: raw.work_availability ?? (c.workAvailability ? c.workAvailability.split(',') : []),
      annual_salary_expectation: raw.annual_salary_expectation ?? (c.salaryRange ?? ''),
      work_experiences: raw.work_experiences ?? (c.roleName ? [{ roleName: c.roleName, company: c.company ?? '' }] : []),
      education: raw.education ?? {
        highest_level: c.education ?? '',
        degrees: c.education
          ? [{ degree: c.education, subject: c.degreeSubject ?? '', isTop50: false, isTop25: false }]
          : [],
      },
      skills: raw.skills ?? (c.skills ? c.skills.split(',').map((s) => s.trim()) : []),
    };
  }

  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone ?? '',
    location: c.location ?? '',
    submitted_at: c.createdAt.toISOString(),
    work_availability: c.workAvailability ? c.workAvailability.split(',') : [],
    annual_salary_expectation: c.salaryRange ?? '',
    work_experiences: c.roleName ? [{ roleName: c.roleName, company: c.company ?? '' }] : [],
    education: {
      highest_level: c.education ?? '',
      degrees: c.education
        ? [{ degree: c.education, subject: c.degreeSubject ?? '', isTop50: false, isTop25: false }]
        : [],
    },
    skills: c.skills ? c.skills.split(',').map((s) => s.trim()) : [],
  };
}
