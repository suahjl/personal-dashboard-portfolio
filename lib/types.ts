export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publication?: string;
  year?: number;
  link?: string; // External URL to paper (can be PDF or webpage)
  abstract?: string;
  thumbnail?: string;
  category?: 'Economics' | 'Public health and epidemiology';
}

export interface DataPoint {
  date?: string;
  [key: string]: string | number | undefined;
}

export interface ChartData {
  data: DataPoint[];
  metadata?: {
    source?: string;
    lastUpdated?: string;
    description?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'coming-soon' | 'in-progress' | 'completed';
  link?: string;
  technologies?: string[];
  thumbnail?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  pypiUrl?: string;
  githubUrl?: string;
  language?: string;
}

