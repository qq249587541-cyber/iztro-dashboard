/**
 * 天干地支圆形罗盘 — 古风视觉化
 * 展示十天干十二地支的环形排布
 */

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_COLORS = ['#2d4a3e', '#8b4513', '#b22222', '#b22222', '#8b4513', '#8b4513', '#2d4a3e', '#2d4a3e', '#8b4513', '#2d4a3e'];
const BRANCH_COLORS = ['#2d4a3e', '#8b4513', '#2d4a3e', '#b22222', '#8b4513', '#b22222', '#b22222', '#8b4513', '#2d4a3e', '#b22222', '#8b4513', '#2d4a3e'];

export default function HeavenlyStemCompass() {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const radiusStem = 58;
  const radiusBranch = 36;

  return (
    <div className="flex flex-col items-center">
      <div className="compass-container" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {/* 外圈 — 赭石色 */}
          <circle cx={cx} cy={cy} r={68} fill="none" stroke="#c9a96e" strokeWidth={1} opacity={0.4} />
          <circle cx={cx} cy={cy} r={64} fill="none" stroke="#d5cbb8" strokeWidth={0.5} opacity={0.3} strokeDasharray="2 4" />
          {/* 中圈 */}
          <circle cx={cx} cy={cy} r={48} fill="none" stroke="#c9a96e" strokeWidth={0.5} opacity={0.3} />
          {/* 内圈 */}
          <circle cx={cx} cy={cy} r={28} fill="none" stroke="#d5cbb8" strokeWidth={0.5} opacity={0.3} />
          {/* 中心 */}
          <circle cx={cx} cy={cy} r={4} fill="#b22222" opacity={0.6} />

          {/* 十天干 — 外环 */}
          {HEAVENLY_STEMS.map((stem, i) => {
            const angle = (i * 36 - 90) * (Math.PI / 180);
            const x = cx + radiusStem * Math.cos(angle);
            const y = cy + radiusStem * Math.sin(angle);
            return (
              <text
                key={`stem-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={STEM_COLORS[i]}
                fontSize={11}
                fontFamily="'Ma Shan Zheng', 'Noto Serif SC', serif"
                opacity={0.85}
              >
                {stem}
              </text>
            );
          })}

          {/* 十二地支 — 内环 */}
          {EARTHLY_BRANCHES.map((branch, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = cx + radiusBranch * Math.cos(angle);
            const y = cy + radiusBranch * Math.sin(angle);
            return (
              <text
                key={`branch-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={BRANCH_COLORS[i]}
                fontSize={10}
                fontFamily="'Ma Shan Zheng', 'Noto Serif SC', serif"
                opacity={0.8}
              >
                {branch}
              </text>
            );
          })}

          {/* 方位标记 */}
          <text x={cx} y={10} textAnchor="middle" fill="#8b4513" fontSize={8} opacity={0.5} fontFamily="'Noto Serif SC', serif">北</text>
          <text x={cx} y={size - 4} textAnchor="middle" fill="#8b4513" fontSize={8} opacity={0.5} fontFamily="'Noto Serif SC', serif">南</text>
          <text x={8} y={cy + 3} textAnchor="middle" fill="#8b4513" fontSize={8} opacity={0.5} fontFamily="'Noto Serif SC', serif">西</text>
          <text x={size - 4} y={cy + 3} textAnchor="middle" fill="#8b4513" fontSize={8} opacity={0.5} fontFamily="'Noto Serif SC', serif">东</text>
        </svg>
      </div>
      <p className="text-text-secondary text-xs mt-1 tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        天干地支 · 六十甲子
      </p>
    </div>
  );
}
