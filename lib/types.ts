export interface Candidate {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  submitted_at: string;
  work_availability: string[];
  annual_salary_expectation: { [key: string]: string } | string;
  work_experiences: { company: string; roleName: string }[];
  education: {
    highest_level: string;
    degrees: {
      degree: string;
      subject: string;
      school?: string;
      gpa?: string;
      startDate?: string;
      endDate?: string;
      originalSchool?: string;
      isTop50?: boolean;
      isTop25?: boolean;
    }[];
  };
  skills: string[];

  // Computed properties to be added in the backend
  experienceProxy?: number;
  salaryNumeric?: number;
  isTopSchool?: boolean;
  matchScore?: number;
}

export interface FilterState {
  skills: string;
  workAvailability: string[];
  minSalary: number;
  maxSalary: number;
  location: string;
  roleName: string;
  company: string;
  educationLevel: string;
  degreeSubject: string;
  sortBy: string;
  page: number;
  limit: number;
}

export interface ApiResponse {
  candidates: Candidate[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  role: 'recruiter' | 'candidate';
  createdAt: Date;
}
