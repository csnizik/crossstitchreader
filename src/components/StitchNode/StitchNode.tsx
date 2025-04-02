import { Text } from 'react-konva';
import { DMC_THREADS } from '../../constants/threads';

interface StitchNodeProps {
  x: number;
  y: number;
  symbol: string;
  thread: { symbol: string; id: string; strands: number };
  cellSize: number;
  selected: boolean;
  onClick: () => void;
}

export default function StitchNode({
  x,
  y,
  symbol,
  thread,
  cellSize,
  selected,
  onClick,
}: StitchNodeProps) {
  const color = DMC_THREADS.find((t) => t.id === thread.id)?.color || '#000';

  return (
    <Text
      x={x * cellSize}
      y={y * cellSize}
      text={symbol}
      fontSize={cellSize * 0.6}
      fill={selected ? '#FFD700' : color}
      align="center"
      verticalAlign="middle"
      width={cellSize}
      height={cellSize}
      onClick={onClick}
    />
  );
}
