import { Line } from 'react-konva';

type Props = {
  rows: number;
  cols: number;
  cellSize: number;
};

const GridLines = ({ rows, cols, cellSize }: Props) => {
  const lines = [];

  for (let i = 0; i <= cols; i++) {
    const isThick = i % 10 === 0;
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * cellSize, 0, i * cellSize, rows * cellSize]}
        stroke="#ccc"
        strokeWidth={isThick ? 2 : 0.5}
        opacity={isThick ? 1 : 0.6}
      />
    );
  }

  for (let i = 0; i <= rows; i++) {
    const isThick = i % 10 === 0;
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * cellSize, cols * cellSize, i * cellSize]}
        stroke="#ccc"
        strokeWidth={isThick ? 2 : 0.5}
        opacity={isThick ? 1 : 0.6}
      />
    );
  }

  return <>{lines}</>;
};

export default GridLines;
