import { Stage, Layer } from 'react-konva';
import { Pattern } from '../../types/pattern';
import GridLines from './GridLines';
import SymbolCell from './SymbolCell';
import { useZoomPan } from '../../hooks/useZoomPan';
import { useSelectionStore } from '../../states/selectionStore';

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
  const { toggle, isSelected } = useSelectionStore();

  // TEMP: hardcoded active tool for now
  const activeTool = 'select';

  const [cols, rows] = pattern.meta.gridSize;

  return (
    <div data-test-id="pattern-canvas">
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
            row.map((symbol, x) => {
              const key = `${x},${y}`;
              const selected = isSelected(key);

              return (
                <SymbolCell
                  key={`symbol-${x}-${y}`}
                  x={x}
                  y={y}
                  symbol={symbol}
                  color={pattern.symbols[symbol]?.color || '#000'}
                  cellSize={CELL_SIZE}
                  selected={selected}
                  onClick={() => {
                    if (activeTool === 'select') toggle(key);
                  }}
                />
              );
            })
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default PatternCanvas;
