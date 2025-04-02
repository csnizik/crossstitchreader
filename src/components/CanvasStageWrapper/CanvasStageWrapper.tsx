import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { ReactNode } from 'react';

interface CanvasStageWrapperProps {
  scale: number;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  handleWheel: (e: any) => void;
  children: ReactNode;
}

export default function CanvasStageWrapper({
  scale,
  position,
  setPosition,
  handleWheel,
  children,
}: CanvasStageWrapperProps) {
  return (
    <div data-test-id="canvas">
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
        {children}
      </Stage>
    </div>
  );
}
