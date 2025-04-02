export interface PatternThreadEntry {
  symbol: string;
  id: string; // MUST be string to allow values like "Blanc", "B5200"
  strands: number;
}

export interface CrossStitchPattern {
  meta: {
    title: string;
    gridSize: [number, number];
    fabricCount: number;
  };
  key: PatternThreadEntry[];
  grid: string[][];
}
