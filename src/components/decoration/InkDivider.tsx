import React from 'react';

interface Props {
  direction?: 'horizontal' | 'vertical';
  color?: string;
  className?: string;
}

const InkDivider: React.FC<Props> = ({
  direction = 'horizontal',
  color = '#8b6914',
  className = '',
}) => {
  if (direction === 'vertical') {
    return (
      <svg
        className={`inline-block ${className}`}
        width="12"
        height="100%"
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        style={{ minHeight: '2rem' }}
      >
        <path
          d="M6 0 Q8 15 5 30 Q9 45 4 60 Q7 75 5 90 Q6 100 6 100"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`w-full ${className}`}
      height="10"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
    >
      <path
        d="M0 5 Q25 3 50 6 Q75 2 100 5 Q125 8 150 4 Q175 6 200 5"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M0 5 Q20 7 40 4 Q60 6 80 5 Q100 3 120 6 Q140 4 160 5 Q180 7 200 5"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        opacity="0.25"
      />
    </svg>
  );
};

export default InkDivider;
