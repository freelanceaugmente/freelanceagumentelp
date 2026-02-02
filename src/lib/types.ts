export interface AppIdea {
  name: string;
  tagline: string;
  description: string;
  matchScore: number; // 0-100
  mrr: string; // e.g., "2K€"
  mrrClients: number; // e.g., 40
  mvpTime: string; // e.g., "1 semaine"
  effort: "Faible" | "Moyen" | "Élevé";
  targetAudience: string; // e.g., "Développeurs..."
}

export interface GenerationResult {
  id: string;
  linkedinUrl: string;
  userName: string;
  profileSummary?: string;
  apps: AppIdea[];
  createdAt: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  experiences?: {
    title: string;
    company: string;
    description?: string;
  }[];
  education?: {
    degree: string;
    school: string;
    fieldOfStudy?: string;
  }[];
}
