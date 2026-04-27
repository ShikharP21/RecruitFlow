import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { mapDbCandidate } from '@/lib/candidate-mapper';
import type { Candidate as UiCandidate } from '@/lib/types';

const MAX_SHORTLIST_SIZE = 5;

function requireRecruiter(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) return { error: 'Unauthorized', status: 401 as const };
  if (auth.role !== 'recruiter') return { error: 'Forbidden', status: 403 as const };
  return { recruiterId: auth.userId };
}

export async function GET(request: NextRequest) {
  const check = requireRecruiter(request);
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const rows = await prisma.shortlist.findMany({
    where: { recruiterId: check.recruiterId },
    include: { candidate: true },
    orderBy: { createdAt: 'desc' },
  });

  const candidates = rows.map(
    (r: { candidate: Parameters<typeof mapDbCandidate>[0] }) => mapDbCandidate(r.candidate)
  );
  return NextResponse.json({ candidates });
}

export async function POST(request: NextRequest) {
  const check = requireRecruiter(request);
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: { candidateId?: string; candidateEmail?: string; candidateData?: UiCandidate } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const normalizedEmail = body.candidateEmail?.toLowerCase().trim();
  if (!body.candidateId && !normalizedEmail) {
    return NextResponse.json({ error: 'candidateId or candidateEmail is required' }, { status: 400 });
  }

  let candidate = body.candidateId
    ? await prisma.candidate.findUnique({ where: { id: body.candidateId } })
    : null;

  if (!candidate && normalizedEmail) {
    candidate = await prisma.candidate.findUnique({ where: { email: normalizedEmail } });
  }

  if (!candidate && body.candidateData?.email && body.candidateData?.name) {
    const source = body.candidateData;
    const firstExp = source.work_experiences?.[0];
    const firstDegree = source.education?.degrees?.[0];
    const salaryStr =
      typeof source.annual_salary_expectation === 'string'
        ? source.annual_salary_expectation
        : source.annual_salary_expectation?.['full-time'] ||
          Object.values(source.annual_salary_expectation || {})[0] ||
          null;

    candidate = await prisma.candidate.upsert({
      where: { email: source.email.toLowerCase().trim() },
      update: {
        name: source.name,
        phone: source.phone ?? null,
        location: source.location ?? null,
        workAvailability: source.work_availability?.join(',') ?? null,
        skills: source.skills?.join(',') ?? null,
        roleName: firstExp?.roleName ?? null,
        company: firstExp?.company ?? null,
        education: source.education?.highest_level ?? null,
        degreeSubject: firstDegree?.subject ?? null,
        salaryRange: salaryStr,
        rawData: source as unknown as object,
      },
      create: {
        name: source.name,
        email: source.email.toLowerCase().trim(),
        phone: source.phone ?? null,
        location: source.location ?? null,
        workAvailability: source.work_availability?.join(',') ?? null,
        skills: source.skills?.join(',') ?? null,
        roleName: firstExp?.roleName ?? null,
        company: firstExp?.company ?? null,
        education: source.education?.highest_level ?? null,
        degreeSubject: firstDegree?.subject ?? null,
        salaryRange: salaryStr,
        rawData: source as unknown as object,
      },
    });
  }

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  }

  const currentCount = await prisma.shortlist.count({
    where: { recruiterId: check.recruiterId },
  });
  if (currentCount >= MAX_SHORTLIST_SIZE) {
    return NextResponse.json(
      { error: `Maximum ${MAX_SHORTLIST_SIZE} candidates allowed in shortlist` },
      { status: 400 }
    );
  }

  try {
    await prisma.shortlist.create({
      data: {
        recruiterId: check.recruiterId,
        candidateId: candidate.id,
      },
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already shortlisted' }, { status: 409 });
    }
    throw e;
  }

  return NextResponse.json({ candidate: mapDbCandidate(candidate) });
}

export async function DELETE(request: NextRequest) {
  const check = requireRecruiter(request);
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: { candidateId?: string; all?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (body.all) {
    await prisma.shortlist.deleteMany({ where: { recruiterId: check.recruiterId } });
    return NextResponse.json({ success: true });
  }

  if (!body.candidateId) {
    return NextResponse.json({ error: 'candidateId is required' }, { status: 400 });
  }

  await prisma.shortlist.deleteMany({
    where: {
      recruiterId: check.recruiterId,
      candidateId: body.candidateId,
    },
  });

  return NextResponse.json({ success: true });
}
