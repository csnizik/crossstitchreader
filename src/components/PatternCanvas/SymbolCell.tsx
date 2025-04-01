import { Group, Rect, Text } from 'react-konva';

type Props = {
  x: number;
  y: number;
  symbol: string;
  color: string;
  cellSize: number;
  selected?: boolean;
  onClick?: () => void;
};

const SymbolCell = ({
  x,
  y,
  symbol,
  color,
  cellSize,
  selected = false,
  onClick,
}: Props) => {
  return (
    <Group x={x * cellSize} y={y * cellSize} onClick={onClick} onTap={onClick}>
      {selected && (
        <Rect
          width={cellSize}
          height={cellSize}
          fill="rgba(0, 120, 255, 0.25)"
        />
      )}
      <Text
        text={symbol}
        fontSize={cellSize * 0.6}
        fill={color}
        width={cellSize}
        height={cellSize}
        align="center"
        verticalAlign="middle"
        y={cellSize * 0.25} // vertical nudge to center better
      />
    </Group>
  );
};

export default SymbolCell;
