import { Layer } from 'react-konva';
import GridLines from '../GridLines/GridLines';
import StitchNode from '../StitchNode/StitchNode';
import { findThreadBySymbol } from '../../utils/threadLookup'
import type { CrossStitchPattern } from '@schemas/CrossStitchPattern'

interface PatternGridProps {
  pattern: CrossStitchPattern;
  cellSize: number;
  isSelected: (key: string) => boolean;
  toggle: (key: string) => void;
  activeTool: 'select' | 'pan';
}

export default function PatternGrid({
  pattern,
  cellSize,
  isSelected,
  toggle,
  activeTool,
}: PatternGridProps) {
  const cols = pattern.grid[0].length;
  const rows = pattern.grid.length;

  return (
    <>
      <Layer>
        <GridLines cols={cols} rows={rows} cellSize={cellSize} />
      </Layer>

      <Layer>
        {pattern.grid.map((row, y) =>
          row.map((symbol, x) => {
            if (!symbol) return null;

            const thread = findThreadBySymbol(symbol, pattern.key);
            if (!thread) return null;

            const key = `${x},${y}`;
            const selected = isSelected(key);

            return (
              <StitchNode
                key={`stitch-${x}-${y}`}
                x={x}
                y={y}
                symbol={symbol}
                thread={{ ...thread, id: thread.id.toString() }}
                cellSize={cellSize}
                selected={selected}
                onClick={() => {
                  if (activeTool === 'select') toggle(key);
                }}
              />
            );
          })
        )}
      </Layer>
    </>
  );
}
