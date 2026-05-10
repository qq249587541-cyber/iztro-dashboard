import React from 'react';

interface Props {
  color?: 'gold' | 'zhusha' | 'daiqing';
  height?: number;
}

const colorMap: Record<string, [string, string, string]> = {
  gold: ['#8b6914', '#c9a96e', '#8b6914'],
  zhusha: ['#8b2222', '#b22222', '#8b2222'],
  daiqing: ['#1e352c', '#2d4a3e', '#1e352c'],
};

const ScrollEdge: React.FC<Props> = ({ color = 'gold', height = 4 }) => {
  const [c1, c2, c3] = colorMap[color] || colorMap.gold;

  return (
    <div
      className="w-full rounded-sm"
      style={{
        height,
        background: `linear-gradient(to right, ${c1} 0%, ${c2} 30%, #e0c895 50%, ${c2} 70%, ${c3} 100%)`,
        opacity: 0.7,
      }}
    />
  );
};

export default ScrollEdge;
