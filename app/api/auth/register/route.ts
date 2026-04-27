import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAuthToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      gender,
      role,
      age,
      phone,
      workAvailability,
      skills,
      location,
      roleName,
      company,
      education,
      degreeSubject,
      salaryRange,
    } = body;

    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
    if (!role || (role !== 'recruiter' && role !== 'candidate')) {
      return NextResponse.json({ error: 'Role must be recruiter or candidate' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: normalizedEmail,
        password: hashedPassword,
        gender: gender?.trim() || null,
        role: role,
      },
    });

    if (role === 'candidate') {
      await prisma.candidate.create({
        data: {
          userId: user.id,
          name: cleanName,
          email: normalizedEmail,
          age: age ? parseInt(String(age), 10) : null,
          phone: phone ?? null,
          workAvailability: workAvailability ?? null,
          skills: skills ?? null,
          location: location ?? null,
          roleName: roleName ?? null,
          company: company ?? null,
          education: education ?? null,
          degreeSubject: degreeSubject ?? null,
          salaryRange: salaryRange ?? null,
        },
      });
    }

    const token = signAuthToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _pw, ...safeUser } = user;
    void _pw;

    const response = NextResponse.json({ user: safeUser, token });
    response.cookies.set('token', token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (error: unknown) {
    console.error('Register error:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
