import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  FolderOpenIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import { useState, useRef } from 'react';
import { useTimerStore } from '../../states/timerStore';
import { useSettingsStore } from '../../states/settingsStore';

const Toolbar = () => {
  const running = useTimerStore((s) => s.running);
  const toggleTimer = useTimerStore((s) => s.toggle);

  const [pos, setPos] = useState({ x: 16, y: 16 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  // Attach listeners once
  useState(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onMouseDown={handleMouseDown}
      className="absolute z-10 flex flex-col gap-2 rounded-lg bg-white/90 p-3 shadow-lg cursor-move"
    >
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={() => console.log('Undo')}
      >
        <ArrowUturnLeftIcon className="size-5" />
        Undo
      </button>
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={() => console.log('Redo')}
      >
        <ArrowUturnRightIcon className="size-5" />
        Redo
      </button>
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={() => console.log('Save')}
      >
        <ArrowDownTrayIcon className="size-5" />
        Save
      </button>
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={() => console.log('Load')}
      >
        <FolderOpenIcon className="size-5" />
        Load
      </button>
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={toggleTimer}
      >
        {running ? (
          <PauseCircleIcon className="size-5" />
        ) : (
          <PlayCircleIcon className="size-5" />
        )}
        {running ? 'Stop Timer' : 'Start Timer'}
      </button>
      <button
        className="flex items-center gap-2 text-sm hover:text-blue-600"
        onClick={() => useSettingsStore.getState().open()}
      >
        <Cog6ToothIcon className="size-5" />
        Settings
      </button>
    </div>
  );
};

export default Toolbar;
