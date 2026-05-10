/**
 * 水墨加载页 — 黑白晕染动画
 * 模拟宣纸上墨滴晕染扩散的效果
 */

export default function LoadingInk() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ backgroundColor: 'rgba(243, 236, 216, 0.95)' }}>
      <div className="text-center relative">
        {/* 水墨晕染动画 SVG */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-6">
          <defs>
            {/* 水墨渐变 */}
            <radialGradient id="inkCenter" cx="60" cy="55" r="30">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#2a2a2a" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#4a4a4a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6a6a6a" stopOpacity="0" />
            </radialGradient>
            
            {/* 晕染滤镜 */}
            <filter id="inkBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
              <feDisplacementMap in="blur" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          
          {/* 晕染圈 — 最外层 */}
          <circle cx="60" cy="55" r="45" fill="url(#inkCenter)" opacity="0.15" filter="url(#inkBlur)">
            <animate attributeName="r" values="20;50;55" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.1;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          
          {/* 晕染圈 — 中层 */}
          <circle cx="60" cy="55" r="30" fill="url(#inkCenter)" opacity="0.3" filter="url(#inkBlur)">
            <animate attributeName="r" values="12;35;40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.2;0" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* 主墨滴 */}
          <circle cx="60" cy="55" r="10" fill="#1a1a1a" opacity="0.9" filter="url(#inkBlur)">
            <animate attributeName="r" values="6;14;16" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.95;0.5;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          
          {/* 墨滴核心 */}
          <circle cx="60" cy="55" r="4" fill="#1a1a1a" opacity="1">
            <animate attributeName="r" values="3;5;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          
          {/* 飞溅墨点 */}
          <circle cx="45" cy="42" r="2" fill="#3a3a3a" opacity="0.5">
            <animate attributeName="cx" values="50;40;35" dur="2s" repeatCount="indefinite" />
            <animate attributeName="cy" values="50;38;30" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0" dur="2s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="75" cy="68" r="1.5" fill="#3a3a3a" opacity="0.4">
            <animate attributeName="cx" values="65;78;85" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="cy" values="58;70;78" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          
          {/* 水墨拖尾 */}
          <ellipse cx="55" cy="72" rx="8" ry="3" fill="#2a2a2a" opacity="0.2" filter="url(#inkBlur)" transform="rotate(-15 55 72)">
            <animate attributeName="opacity" values="0.25;0.1;0" dur="2.5s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="-15 55 72; -25 55 72; -30 55 72" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
        </svg>
        
        {/* 加载文字 */}
        <p className="font-calligraphy text-ink-soft text-base tracking-[0.3em] animate-pulse">
          起盘中 ……
        </p>
        <p className="text-text-secondary text-xs mt-2 tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          墨染宣纸 · 静待命盘
        </p>
        
        {/* 底部印章 */}
        <div className="mt-4 animate-seal">
          <span className="seal-round">iztro</span>
        </div>
      </div>
    </div>
  );
}
