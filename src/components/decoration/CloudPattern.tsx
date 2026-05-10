import React from 'react';

interface Props {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
}

const CloudPattern: React.FC<Props> = ({ position, opacity = 0.06 }) => {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const isFlipped = position.includes('right');

  return (
    <svg
      className={`fixed ${positionClasses[position]} pointer-events-none z-0`}
      width="280"
      height="140"
      viewBox="0 0 280 140"
      style={{ opacity }}
    >
      <g transform={isFlipped ? 'scale(-1, 1) translate(-280, 0)' : ''}>
        {/* 主祥云 */}
        <path
          d="M10 80 Q30 50 60 65 Q90 40 120 60 Q150 35 180 55 Q210 45 240 60 Q260 55 270 70"
          fill="none"
          stroke="#8b6914"
          strokeWidth="1.2"
        />
        <path
          d="M20 100 Q40 75 70 85 Q100 65 130 80 Q160 60 190 75 Q220 65 250 80 Q265 75 270 90"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* 小祥云 */}
        <path
          d="M40 120 Q55 105 75 115 Q95 100 115 110"
          fill="none"
          stroke="#8b6914"
          strokeWidth="0.6"
          opacity="0.5"
        />
        {/* 云头装饰 */}
        <circle cx="80" cy="60" r="12" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />
        <circle cx="160" cy="50" r="8" fill="none" stroke="#8b6914" strokeWidth="0.5" opacity="0.3" />
        <circle cx="220" cy="65" r="10" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.35" />
      </g>
    </svg>
  );
};

export default CloudPattern;
