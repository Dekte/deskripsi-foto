
export interface StockMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export interface AnalysisResult {
  metadata?: StockMetadata;
  error?: string;
  loading: boolean;
}
