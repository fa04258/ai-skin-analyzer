
export interface AnalysisResult {
  conditionName: string;
  description: string;
  homeRemedies: string[];
  advice: string;
  severity: 'Low' | 'Medium' | 'High' | 'Unknown';
}
