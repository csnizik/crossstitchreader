import { Stage, Layer } from 'react-konva';
import { Pattern } from '../../types/pattern';
import GridLines from './GridLines';
import SymbolCell from './SymbolCell';
import { useZoomPan } from '../../hooks/useZoomPan';

type Props = {
  pattern: Pattern;
};

const CELL_SIZE = 30;

const PatternCanvas = ({ pattern }: Props) => {
  if (!pattern || !pattern.meta) {
    console.error('PatternCanvas: pattern prop is missing or malformed');
    return null;
  }

  const { scale, position, setPosition, handleWheel } = useZoomPan();

  const [cols, rows] = pattern.meta.gridSize;

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      onWheel={handleWheel}
      draggable
      onDragEnd={(e) => {
        setPosition({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
    >
      <Layer>
        <GridLines cols={cols} rows={rows} cellSize={CELL_SIZE} />
      </Layer>
      <Layer>
        {pattern.grid.map((row, y) =>
          row.map((symbol, x) => (
            <SymbolCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              symbol={symbol}
              color={pattern.symbols[symbol]?.color || '#000'}
              cellSize={CELL_SIZE}
            />
          ))
        )}
      </Layer>

    </Stage>
  );
};

export default PatternCanvas;
