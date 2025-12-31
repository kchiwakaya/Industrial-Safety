
export enum IndustrySector {
  CONSTRUCTION = 'Construction',
  MANUFACTURING = 'Manufacturing',
  MINING = 'Mining'
}

export type SafetyLevel = 'Critical' | 'Warning' | 'Good';

export interface Violation {
  hazard: string;
  severity: 'High' | 'Medium' | 'Low';
  category: string;
  recommendation: string;
}

export interface SafetyAnalysis {
  score: number;
  level: SafetyLevel;
  summary: string;
  violations: Violation[];
  ppeCheck: {
    item: string;
    detected: boolean;
    compliant: boolean;
  }[];
  generalRecommendations: string[];
}

export interface SiteConfig {
  sector: IndustrySector;
  guidelines?: string;
}
