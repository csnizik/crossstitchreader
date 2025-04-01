import { Stage, Layer, Rect } from 'react-konva';
import { Pattern } from '../../types/pattern';
import GridLines from './GridLines';
import SymbolCell from './SymbolCell';
import { useZoomPan } from '../../hooks/useZoomPan';
import { useSelectionStore } from '../../states/selectionStore';
// import { useToolStore } from '../../states/toolStore'; // TODO create this

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
  // const { activeTool } = useToolStore(); // TODO
  const activeTool = 'select'; // and replace this

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
                <Rect
                  key={`cell-${x}-${y}`}
                  x={x * CELL_SIZE}
                  y={y * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={selected ? 'rgba(0, 120, 255, 0.25)' : 'transparent'}
                  onClick={() => {
                    if (activeTool === 'select') toggle(key);
                  }}
                  onTap={() => {
                    if (activeTool === 'select') toggle(key);
                  }}
                />
              );
            })
          )}
        </Layer>
        <Layer>
          {pattern.grid.map((row, y) =>
            row.map((symbol, x) => (
              <SymbolCell
                key={`symbol-${x}-${y}`}
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
    </div>
  );
};

export default PatternCanvas;
