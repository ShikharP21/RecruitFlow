import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface JsonCandidate {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  submitted_at?: string;
  work_availability?: string[];
  annual_salary_expectation?: { [key: string]: string };
  work_experiences?: { company?: string; roleName?: string }[];
  education?: {
    highest_level?: string;
    degrees?: { degree?: string; subject?: string }[];
  };
  skills?: string[];
}

async function main() {
  const dataPath = path.join(process.cwd(), 'public', 'form-submissions.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const records: JsonCandidate[] = JSON.parse(raw);

  let inserted = 0;
  let skipped = 0;

  for (const r of records) {
    if (!r.email || !r.name) {
      skipped++;
      continue;
    }

    const email = r.email.toLowerCase().trim();
    const firstExperience = r.work_experiences?.[0];
    const firstDegree = r.education?.degrees?.[0];
    const salaryStr =
      r.annual_salary_expectation?.['full-time'] ||
      (r.annual_salary_expectation
        ? Object.values(r.annual_salary_expectation)[0]
        : undefined);

    let createdAt: Date;
    try {
      createdAt = r.submitted_at ? new Date(r.submitted_at.replace(' ', 'T')) : new Date();
      if (Number.isNaN(createdAt.getTime())) createdAt = new Date();
    } catch {
      createdAt = new Date();
    }

    await prisma.candidate.upsert({
      where: { email },
      update: {
        name: r.name,
        phone: r.phone ?? null,
        location: r.location ?? null,
        workAvailability: r.work_availability?.join(',') ?? null,
        skills: r.skills?.join(',') ?? null,
        roleName: firstExperience?.roleName ?? null,
        company: firstExperience?.company ?? null,
        education: r.education?.highest_level ?? null,
        degreeSubject: firstDegree?.subject ?? null,
        salaryRange: salaryStr ?? null,
        rawData: r as unknown as object,
      },
      create: {
        name: r.name,
        email,
        phone: r.phone ?? null,
        location: r.location ?? null,
        workAvailability: r.work_availability?.join(',') ?? null,
        skills: r.skills?.join(',') ?? null,
        roleName: firstExperience?.roleName ?? null,
        company: firstExperience?.company ?? null,
        education: r.education?.highest_level ?? null,
        degreeSubject: firstDegree?.subject ?? null,
        salaryRange: salaryStr ?? null,
        rawData: r as unknown as object,
        createdAt,
      },
    });
    inserted++;
  }

  console.log(`Seed complete: ${inserted} upserted, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
