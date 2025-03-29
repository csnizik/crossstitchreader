import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';

const GRID_SIZE = 20;
const CELL_SIZE = 30;
const STAGE_WIDTH = window.innerWidth;
const STAGE_HEIGHT = window.innerHeight;

const KonvaTest = () => {
  const [scale, setScale ] = useState(1);
  const [position, setPosition] = useState( {x: 0, y:0});
  const [highlightSymbol, setHighlightSymbol] = useState<string | null>(null);

    const createDummyGrid = () => {
      const symbols = ['A', 'B', 'C'];
      return Array.from({ length: GRID_SIZE }, (_, y) =>
        Array.from({ length: GRID_SIZE }, (_, x) => {
          return symbols[(x + y) % symbols.length];
        })
      );
    };

    const grid = createDummyGrid();

      const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const stage = e.target.getStage();
        const oldScale = scale;
        const pointer = stage.getPointerPosition();

        const newScale =
          e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        setScale(newScale);

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };

        setPosition(newPos);
      };

        const gridLines = [];

        for (let i = 0; i <= GRID_SIZE; i++) {
          const isThick = i % 10 === 0;
          const strokeWidth = isThick ? 2 : 0.5;
          const color = isThick ? '#666' : '#ccc';

          gridLines.push(
            <Line
              key={`v-${i}`}
              points={[i * CELL_SIZE, 0, i * CELL_SIZE, GRID_SIZE * CELL_SIZE]}
              stroke={color}
              strokeWidth={strokeWidth}
            />
          );

          gridLines.push(
            <Line
              key={`h-${i}`}
              points={[0, i * CELL_SIZE, GRID_SIZE * CELL_SIZE, i * CELL_SIZE]}
              stroke={color}
              strokeWidth={strokeWidth}
            />
          );
        }
   return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        {['A', 'B', 'C'].map((s) => (
          <button key={s} onClick={() => setHighlightSymbol(s)} style={{ marginRight: 4 }}>
            Highlight {s}
          </button>
        ))}
      </div>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        draggable
      >
        {/* Grid lines layer */}
        <Layer>{gridLines}</Layer>

        {/* Cell content layer */}
        <Layer>
          {grid.map((row, y) =>
            row.map((symbol, x) => {
              const isHighlighted = highlightSymbol === symbol;
              const baseX = x * CELL_SIZE;
              const baseY = y * CELL_SIZE;

              return (
                <React.Fragment key={`${x}-${y}`}>
                  {isHighlighted && (
                    <Rect
                      x={baseX}
                      y={baseY}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      fill="#ffffaa"
                    />
                  )}
                  <Text
                    x={baseX}
                    y={baseY + CELL_SIZE / 4}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    text={symbol}
                    fontSize={CELL_SIZE * 0.6}
                    align="center"
                  />
                  <Rect
                    x={baseX}
                    y={baseY}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="transparent"
                    onClick={() => console.log(`Clicked cell: (${x}, ${y})`)}
                  />
                </React.Fragment>
              );
            })
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default KonvaTest;


