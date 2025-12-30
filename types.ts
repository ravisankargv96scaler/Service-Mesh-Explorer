export type TabId = 'problem' | 'sidecar' | 'architecture' | 'features' | 'gateway' | 'quiz';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: any; // Lucide icon type
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}