// Shared types for the CV Hub feature. Field names mirror the snake_case
// columns returned by the backend (server/src/modules/cv-hub).

export type HubStatus = "active" | "closed" | "draft";

export interface CvHub {
  id: string;
  employer_id: number;
  name: string;
  description: string | null;
  status: HubStatus;
  slug: string;
  views: number;
  created_at: string;
  updated_at: string;
  // Present on list rows and the single-hub endpoint.
  cv_count?: number;
  new_count?: number;
}

export interface CvHubSubmission {
  id: string;
  hub_id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  experience_level: string | null;
  education_level: string | null;
  skills: string[];
  cv_url: string;
  is_new: boolean;
  starred: boolean;
  submitted_at: string;
}

export interface PaginatedHubs {
  total: number;
  page: number;
  limit: number;
  hubs: CvHub[];
}

export interface PaginatedSubmissions {
  total: number;
  page: number;
  limit: number;
  submissions: CvHubSubmission[];
}

export type SubmissionFilter = "all" | "new" | "starred";

// What the candidate sees on the public form (no sensitive fields).
export interface PublicHub {
  id: string;
  name: string;
  description: string | null;
}

export interface SubmitCvPayload {
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  experienceLevel?: string;
  educationLevel?: string;
  skills: string[];
  cvUrl: string;
}
