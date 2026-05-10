import React from 'react';

interface Props {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 28, height: 28, fontSize: 10, borderWidth: 2 },
  md: { width: 36, height: 36, fontSize: 13, borderWidth: 2.5 },
  lg: { width: 48, height: 48, fontSize: 16, borderWidth: 3 },
};

const SealStamp: React.FC<Props> = ({ text, size = 'md', className = '' }) => {
  const s = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-sm font-calligraphy ${className}`}
      style={{
        width: s.width,
        height: s.height,
        fontSize: s.fontSize,
        border: `${s.borderWidth}px solid #b22222`,
        color: '#b22222',
        background: 'rgba(243, 236, 216, 0.5)',
        transform: 'rotate(-3deg)',
        textShadow: '0 0 1px rgba(178,34,34,0.2)',
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};

export default SealStamp;
