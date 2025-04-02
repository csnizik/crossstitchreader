export interface CrossStitchPattern {
  meta: {
    title: string;
    gridSize: [number, number];
    fabricCount: number;
  };
  key: {
    symbol: string;
    id: number;
    strands: number;
  }[];
  grid: string[][];
}
