import { NextRequest, NextResponse } from 'next/server';
import { Candidate, ApiResponse } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { mapDbCandidate } from '@/lib/candidate-mapper';
import { getAuthFromRequest } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

interface JsonCandidate {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  submitted_at?: string;
  work_availability?: string[] | string;
  annual_salary_expectation?: { [key: string]: string } | string;
  work_experiences?: { company?: string; roleName?: string }[];
  education?: {
    highest_level?: string;
    degrees?: {
      degree?: string;
      subject?: string;
      school?: string;
      gpa?: string;
      startDate?: string;
      endDate?: string;
      originalSchool?: string;
      isTop50?: boolean;
      isTop25?: boolean;
    }[];
  };
  skills?: string[] | string;
}

function normalizeJsonCandidate(candidate: JsonCandidate): Candidate | null {
  if (!candidate?.email || !candidate?.name) return null;

  const workAvailability = Array.isArray(candidate.work_availability)
    ? candidate.work_availability
    : typeof candidate.work_availability === 'string' && candidate.work_availability.length > 0
      ? candidate.work_availability.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

  const skills = Array.isArray(candidate.skills)
    ? candidate.skills
    : typeof candidate.skills === 'string' && candidate.skills.length > 0
      ? candidate.skills.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

  return {
    name: candidate.name,
    email: candidate.email.toLowerCase().trim(),
    phone: candidate.phone ?? '',
    location: candidate.location ?? '',
    submitted_at: candidate.submitted_at ?? new Date().toISOString(),
    work_availability: workAvailability,
    annual_salary_expectation: candidate.annual_salary_expectation ?? '',
    work_experiences: Array.isArray(candidate.work_experiences)
      ? candidate.work_experiences.map((exp) => ({
          company: exp.company ?? '',
          roleName: exp.roleName ?? '',
        }))
      : [],
    education: {
      highest_level: candidate.education?.highest_level ?? '',
      degrees: Array.isArray(candidate.education?.degrees)
        ? candidate.education!.degrees!.map((degree) => ({
            degree: degree.degree ?? '',
            subject: degree.subject ?? '',
            school: degree.school,
            gpa: degree.gpa,
            startDate: degree.startDate,
            endDate: degree.endDate,
            originalSchool: degree.originalSchool,
            isTop50: degree.isTop50,
            isTop25: degree.isTop25,
          }))
        : [],
    },
    skills,
  };
}

async function loadJsonCandidates(): Promise<Candidate[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'form-submissions.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeJsonCandidate(entry as JsonCandidate))
      .filter((entry): entry is Candidate => Boolean(entry));
  } catch {
    return [];
  }
}

function calculateMatchScore(
  candidate: Candidate,
  filters: {
    skills: string;
    workAvailability: string[];
    location: string;
    roleName: string;
    company: string;
    educationLevel: string;
    degreeSubject: string;
  }
): number {
  let totalScore = 0;
  let totalWeight = 0;

  if (filters.skills) {
    const requiredSkills = filters.skills.toLowerCase().split(',').map((s) => s.trim());
    const candidateSkills = candidate.skills?.map((s: string) => s.toLowerCase()) || [];
    const matchedSkills = requiredSkills.filter((skill) =>
      candidateSkills.some((cs: string) => cs.includes(skill))
    );
    const skillsScore = (matchedSkills.length / requiredSkills.length) * 30;
    totalScore += skillsScore;
    totalWeight += 30;
  }

  if (filters.workAvailability.length > 0) {
    const hasMatchingAvailability = filters.workAvailability.some((a) =>
      candidate.work_availability?.includes(a)
    );
    if (hasMatchingAvailability) totalScore += 20;
    totalWeight += 20;
  }

  if (filters.location) {
    if (candidate.location?.toLowerCase().includes(filters.location.toLowerCase())) totalScore += 15;
    totalWeight += 15;
  }

  if (filters.roleName) {
    const hasMatchingRole = candidate.work_experiences?.some((exp) =>
      exp.roleName?.toLowerCase().includes(filters.roleName.toLowerCase())
    );
    if (hasMatchingRole) totalScore += 15;
    totalWeight += 15;
  }

  if (filters.company) {
    const hasMatchingCompany = candidate.work_experiences?.some((exp) =>
      exp.company?.toLowerCase().includes(filters.company.toLowerCase())
    );
    if (hasMatchingCompany) totalScore += 10;
    totalWeight += 10;
  }

  if (filters.educationLevel && filters.educationLevel !== 'all') {
    if (candidate.education?.highest_level === filters.educationLevel) totalScore += 5;
    totalWeight += 5;
  }

  if (filters.degreeSubject) {
    const hasMatchingDegree = candidate.education?.degrees?.some((degree) =>
      degree.subject?.toLowerCase().includes(filters.degreeSubject.toLowerCase())
    );
    if (hasMatchingDegree) totalScore += 5;
    totalWeight += 5;
  }

  if (totalWeight === 0) return 0;
  return Math.round((totalScore / totalWeight) * 100);
}

function parseSalary(salary: { [key: string]: string } | string | null | undefined): number {
  try {
    if (!salary) return 0;
    const salaryStr = typeof salary === 'string'
      ? salary
      : salary['full-time'] || Object.values(salary)[0] || '';
    if (!salaryStr || typeof salaryStr !== 'string') return 0;
    const match = salaryStr.match(/[\d,]+/);
    if (match) return parseInt(match[0].replace(/,/g, ''), 10);
    return 0;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'recruiter') {
      return NextResponse.json({ error: 'Only recruiters can view candidates' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const skills = searchParams.get('skills') || '';
    const workAvailabilityParam = searchParams.get('workAvailability') || '';
    const workAvailability = workAvailabilityParam ? workAvailabilityParam.split(',') : [];
    const minSalary = parseInt(searchParams.get('minSalary') || '45000', 10);
    const maxSalary = parseInt(searchParams.get('maxSalary') || '150000', 10);
    const location = searchParams.get('location') || '';
    const roleName = searchParams.get('roleName') || '';
    const company = searchParams.get('company') || '';
    const educationLevel = searchParams.get('educationLevel') || '';
    const degreeSubject = searchParams.get('degreeSubject') || '';
    const sortBy = searchParams.get('sortBy') || 'matchScore';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const [dbCandidates, jsonCandidates] = await Promise.all([
      prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } }),
      loadJsonCandidates(),
    ]);

    const mergedByEmail = new Map<string, Candidate>();

    for (const candidate of jsonCandidates) {
      mergedByEmail.set(candidate.email.toLowerCase().trim(), candidate);
    }

    for (const candidate of dbCandidates.map(mapDbCandidate)) {
      mergedByEmail.set(candidate.email.toLowerCase().trim(), candidate);
    }

    const candidates: Candidate[] = Array.from(mergedByEmail.values());

    const hasFilters =
      skills || workAvailability.length > 0 ||
      location || roleName || company ||
      (educationLevel && educationLevel !== 'all') || degreeSubject;

    const processedCandidates = candidates.map((candidate) => {
      try {
        const experienceProxy = candidate.work_experiences?.length || 0;
        const salaryNumeric = parseSalary(candidate.annual_salary_expectation);
        const isTopSchool = candidate.education?.degrees?.some(
          (degree) => degree.isTop50 || degree.isTop25
        ) || false;

        const appliedFilters = {
          skills,
          workAvailability,
          location,
          roleName,
          company,
          educationLevel,
          degreeSubject,
        };
        const matchScore = hasFilters ? calculateMatchScore(candidate, appliedFilters) : undefined;

        return { ...candidate, experienceProxy, salaryNumeric, isTopSchool, matchScore };
      } catch {
        return {
          ...candidate,
          experienceProxy: 0,
          salaryNumeric: 0,
          isTopSchool: false,
          matchScore: undefined,
        };
      }
    });

    let filteredCandidates = processedCandidates.filter((candidate) => {
      try {
        if (candidate.salaryNumeric < minSalary || candidate.salaryNumeric > maxSalary) return false;
        return true;
      } catch {
        return false;
      }
    });

    if (hasFilters) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        try {
          if (workAvailability.length > 0) {
            const hasMatchingAvailability = workAvailability.some((a) =>
              candidate.work_availability?.includes(a)
            );
            if (!hasMatchingAvailability) return false;
          }

          if (location && !candidate.location?.toLowerCase().includes(location.toLowerCase())) return false;

          if (roleName) {
            const hasMatchingRole = candidate.work_experiences?.some((exp) =>
              exp.roleName?.toLowerCase().includes(roleName.toLowerCase())
            );
            if (!hasMatchingRole) return false;
          }

          if (company) {
            const hasMatchingCompany = candidate.work_experiences?.some((exp) =>
              exp.company?.toLowerCase().includes(company.toLowerCase())
            );
            if (!hasMatchingCompany) return false;
          }

          if (educationLevel && educationLevel !== 'all' && candidate.education?.highest_level !== educationLevel) return false;

          if (degreeSubject) {
            const hasMatchingDegree = candidate.education?.degrees?.some((degree) =>
              degree.subject?.toLowerCase().includes(degreeSubject.toLowerCase())
            );
            if (!hasMatchingDegree) return false;
          }

          if (skills) {
            const requiredSkills = skills.toLowerCase().split(',').map((s) => s.trim());
            const candidateSkills = candidate.skills?.map((s: string) => s.toLowerCase()) || [];
            const hasRequiredSkills = requiredSkills.some((skill) =>
              candidateSkills.some((cs: string) => cs.includes(skill))
            );
            if (!hasRequiredSkills) return false;
          }

          return true;
        } catch {
          return false;
        }
      });
    }

    filteredCandidates.sort((a, b) => {
      try {
        switch (sortBy) {
          case 'matchScore': return (b.matchScore || 0) - (a.matchScore || 0);
          case 'date': return new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime();
          case 'salary': return (b.salaryNumeric || 0) - (a.salaryNumeric || 0);
          case 'name': return (a.name || '').localeCompare(b.name || '');
          case 'location': return (a.location || '').localeCompare(b.location || '');
          case 'education': return (a.education?.highest_level || '').localeCompare(b.education?.highest_level || '');
          case 'experience': return (b.work_experiences?.length || 0) - (a.work_experiences?.length || 0);
          case 'topSchools':
            if (a.isTopSchool !== b.isTopSchool) return a.isTopSchool ? -1 : 1;
            return (a.name || '').localeCompare(b.name || '');
          default: return 0;
        }
      } catch {
        return 0;
      }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredCandidates.length;

    const response: ApiResponse = {
      candidates: paginatedCandidates,
      hasMore,
      total: filteredCandidates.length,
      page,
      limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}
