import { Text } from 'react-konva';

type Props = {
  x: number;
  y: number;
  symbol: string;
  color: string;
  cellSize: number;
};

const SymbolCell = ({ x, y, symbol, color, cellSize }: Props) => {
  return (
    <Text
      x={x * cellSize}
      y={y * cellSize + cellSize / 4}
      width={cellSize}
      height={cellSize}
      text={symbol}
      fontSize={cellSize * 0.6}
      align="center"
      fill={color}
      onClick={() => console.log(`Clicked (${x}, ${y})`)}
    />
  );
};

export default SymbolCell;
