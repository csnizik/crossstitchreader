export type SymbolEntry = {
  color: string;
  dmc: string;
  strands: number;
};

export type Pattern = {
  meta: {
    title: string;
    gridSize: [number, number];
    fabricCount: number;
  };
  symbols: Record<string, SymbolEntry>;
  grid: string[][];
};
