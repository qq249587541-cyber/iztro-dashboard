/**
 * 天干地支圆形罗盘 — 古排笔记风格
 * 展示十天干十二地支的环形排布
 */

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

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
          {/* 外圈 — 暗金 */}
          <circle cx={cx} cy={cy} r={68} fill="none" stroke="#b8860b" strokeWidth={1} opacity={0.35} />
          <circle cx={cx} cy={cy} r={64} fill="none" stroke="#c9a84c" strokeWidth={0.5} opacity={0.25} strokeDasharray="2 4" />
          {/* 中圈 */}
          <circle cx={cx} cy={cy} r={48} fill="none" stroke="#b8860b" strokeWidth={0.5} opacity={0.25} />
          {/* 内圈 */}
          <circle cx={cx} cy={cy} r={28} fill="none" stroke="#c9a84c" strokeWidth={0.5} opacity={0.2} />
          {/* 中心 — 朱砂 */}
          <circle cx={cx} cy={cy} r={4} fill="#8b0000" opacity={0.5} />

          {/* 十天干 — 外环 暗金 */}
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
                fill="#b8860b"
                fontSize={11}
                fontFamily="'Ma Shan Zheng', 'Noto Serif SC', serif"
                opacity={0.85}
              >
                {stem}
              </text>
            );
          })}

          {/* 十二地支 — 内环 墨色 */}
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
                fill="#2d2926"
                fontSize={10}
                fontFamily="'Ma Shan Zheng', 'Noto Serif SC', serif"
                opacity={0.75}
              >
                {branch}
              </text>
            );
          })}

          {/* 方位标记 */}
          <text x={cx} y={10} textAnchor="middle" fill="#b8860b" fontSize={8} opacity={0.4} fontFamily="'Noto Serif SC', serif">北</text>
          <text x={cx} y={size - 4} textAnchor="middle" fill="#b8860b" fontSize={8} opacity={0.4} fontFamily="'Noto Serif SC', serif">南</text>
          <text x={8} y={cy + 3} textAnchor="middle" fill="#b8860b" fontSize={8} opacity={0.4} fontFamily="'Noto Serif SC', serif">西</text>
          <text x={size - 4} y={cy + 3} textAnchor="middle" fill="#b8860b" fontSize={8} opacity={0.4} fontFamily="'Noto Serif SC', serif">东</text>
        </svg>
      </div>
      <p className="text-ink-light text-xs mt-1 tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        天干地支 · 六十甲子
      </p>
    </div>
  );
}
