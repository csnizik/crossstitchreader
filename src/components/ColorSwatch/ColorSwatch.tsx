import { useEffect, useState } from 'react';
import isDarkColor from '../../utils/isDarkColor';

interface ColorSwatchProps {
  symbol: string;
  threadID: string;
  threadName: string;
  color: string; // Hex color, e.g. "#FFFFFF"
}

export default function ColorSwatch({
  symbol,
  threadID,
  threadName,
  color,
}: ColorSwatchProps) {
  const [textColor, setTextColor] = useState('text-black');

  useEffect(() => {
    const shouldUseWhite = isDarkColor(color);
    setTextColor(shouldUseWhite ? 'text-white' : 'text-black');
  }, [color]);

  return (
    <div
      className={`p-4 rounded-md shadow-md ${textColor}`}
      style={{ backgroundColor: color }}
    >
      <div className="text-2xl font-bold mb-2">{symbol}</div>
      <div className="text-sm">{threadID}</div>
      <div className="text-sm italic">{threadName}</div>
    </div>
  );
}
