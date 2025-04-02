import { Line } from 'react-konva';

interface GridLinesProps {
  cols: number;
  rows: number;
  cellSize: number;
}

export default function GridLines({ cols, rows, cellSize }: GridLinesProps) {
  const lines = [];

  for (let i = 0; i <= cols; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * cellSize, 0, i * cellSize, rows * cellSize]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  for (let j = 0; j <= rows; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * cellSize, cols * cellSize, j * cellSize]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  return <>{lines}</>;
}
