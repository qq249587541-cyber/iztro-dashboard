import { useState, useMemo, useCallback } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
// getStarNature inlined - CJS compat

interface Props {
  astrolabe: IFunctionalAstrolabe;
  onPalaceClick?: (palaceName: string) => void;
  selectedPalace?: string | null;
  birthDate?: string;
  birthTime?: string;
  personName?: string;
  gender?: string;
}

const MUTAGEN_COLOR: Record<string, string> = {
  禄: '#c9a96e',
  权: '#b22222',
  科: '#4a7c8a',
  忌: '#2d2d2d',
};

const BRIGHTNESS_SYMBOL: Record<string, string> = {
  庙: '★',
  旺: '☆',
  得: '●',
  利: '◐',
  平: '○',
  不: '◑',
  陷: '▽',
};

function getBrightnessSymbol(brightness?: string): string {
  if (!brightness) return '';
  return BRIGHTNESS_SYMBOL[brightness] || '';
}

export default function ZiWeiChart({ astrolabe, onPalaceClick, selectedPalace, birthDate, birthTime, personName, gender }: Props) {
  const [hoveredPalace, setHoveredPalace] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<{ name: string; x: number; y: number } | null>(null);

  const palaces = astrolabe.palaces;
  const soulBranch = (astrolabe as any).earthlyBranchOfSoulPalace;
  const bodyBranch = (astrolabe as any).earthlyBranchOfBodyPalace;
  const soulIndex = palaces.findIndex((p: any) => p.earthlyBranch === soulBranch);
  const bodyIndex = palaces.findIndex((p: any) => p.earthlyBranch === bodyBranch);

  const boxSize = 170;
  const gap = 6;
  const chartSize = boxSize * 4 + gap * 3;

  const positions = useMemo(() => {
    const posMap: Record<number, { x: number; y: number }> = {};
    const order = [5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6];
    let idx = 0;
    for (let i = 0; i < 4; i++) posMap[order[idx++]] = { x: i, y: 0 };
    for (let i = 1; i < 4; i++) posMap[order[idx++]] = { x: 3, y: i };
    for (let i = 2; i >= 0; i--) posMap[order[idx++]] = { x: i, y: 3 };
    for (let i = 2; i >= 1; i--) posMap[order[idx++]] = { x: 0, y: i };
    return posMap;
  }, []);

  const handleStarEnter = useCallback((name: string, x: number, y: number) => {
    setHoveredStar({ name, x, y });
  }, []);

  const handleStarLeave = useCallback(() => {
    setHoveredStar(null);
  }, []);

  return (
    <div className="relative inline-block w-full">
      <svg viewBox={`0 0 ${chartSize} ${chartSize}`} className="w-full max-w-2xl mx-auto">
        {palaces.map((palace: any, i: number) => {
          const pos = positions[i];
          if (!pos) return null;
          const x = pos.x * (boxSize + gap);
          const y = pos.y * (boxSize + gap);
          const isSelected = selectedPalace === palace.name;
          const isSoul = i === soulIndex;
          const isBody = i === bodyIndex;
          const isHovered = hoveredPalace === i;
          const isDimmed = hoveredPalace !== null && hoveredPalace !== i;

          const topBarY = 14;
          const mainStarStartY = 32;
          const minorStarY = 32 + Math.min(palace.majorStars.length, 2) * 16 + 4;
          const adjStarY = minorStarY + (palace.minorStars.length > 0 ? 14 : 0) + 2;
          const palaceNameY = boxSize - 10;

          return (
            <g
              key={i}
              transform={`translate(${x}, ${y})`}
              onClick={() => onPalaceClick?.(palace.name)}
              onMouseEnter={() => setHoveredPalace(i)}
              onMouseLeave={() => setHoveredPalace(null)}
              className="cursor-pointer"
              style={{ transition: 'all 0.3s ease', opacity: isDimmed ? 0.5 : 1 }}
            >
              {/* 背景框 */}
              <rect
                width={boxSize}
                height={boxSize}
                rx={2}
                fill={isSelected ? '#fdf0f0' : isHovered ? '#fdfbf5' : '#faf6ed'}
                stroke={isSelected ? '#a84a4a' : isHovered ? '#c9a96e' : '#c9a96e'}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                style={{
                  filter: isHovered
                    ? 'drop-shadow(0 0 4px rgba(201,169,110,0.5))'
                    : isSelected
                    ? 'drop-shadow(0 0 4px rgba(168,74,74,0.4))'
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              {/* 内边框 — 传统窗格感 */}
              <rect
                x={3}
                y={3}
                width={boxSize - 6}
                height={boxSize - 6}
                rx={1}
                fill="none"
                stroke={isSelected ? '#a84a4a' : '#d5cbb8'}
                strokeWidth={0.5}
                opacity={0.6}
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* 角花装饰 — 左上 */}
              <path d="M 3 12 L 3 3 L 12 3"
                    fill="none" stroke="#c9a96e" strokeWidth={1} opacity={isHovered ? 1 : 0.5}
                    style={{ transition: 'opacity 0.3s' }} />
              {/* 角花装饰 — 右下 */}
              <path d={`M ${boxSize-12} ${boxSize-3} L ${boxSize-3} ${boxSize-3} L ${boxSize-3} ${boxSize-12}`}
                    fill="none" stroke="#c9a96e" strokeWidth={1} opacity={isHovered ? 1 : 0.5}
                    style={{ transition: 'opacity 0.3s' }} />

              {/* 顶部信息条 — 大限+长生 */}
              <rect x={4} y={4} width={boxSize - 8} height={topBarY - 2} rx={1}
                    fill={isHovered ? 'rgba(201,169,110,0.06)' : 'rgba(201,169,110,0.03)'} />
              <text x={8} y={topBarY - 2} fill="#8a8a8a" fontSize={9} fontFamily="'Noto Serif SC', serif">
                {palace.decadal?.range?.[0]}-{palace.decadal?.range?.[1]}岁
              </text>
              {palace.changsheng12 && (
                <text x={boxSize - 8} y={topBarY - 2} fill="#6a7a6a" fontSize={9} textAnchor="end" fontFamily="'Noto Serif SC', serif">
                  长生:{palace.changsheng12}
                </text>
              )}

              {/* 天干地支 */}
              <text x={boxSize - 8} y={topBarY + 10} fill="#6b6b6b" fontSize={10} textAnchor="end" fontFamily="'Noto Serif SC', serif">
                {palace.heavenlyStem}{palace.earthlyBranch}
              </text>

              {/* 主星 — 大字体 + 亮度符号 + 四化色标 */}
              {palace.majorStars.slice(0, 2).map((s: any, idx: number) => {
                const sy = mainStarStartY + idx * 16;
                const isStarHovered = hoveredStar?.name === s.name;
                const bSym = getBrightnessSymbol(s.brightness);
                return (
                  <g key={s.name + idx}
                     onMouseEnter={(e) => handleStarEnter(s.name, e.clientX, e.clientY)}
                     onMouseLeave={handleStarLeave}
                  >
                    <text
                      x={12}
                      y={sy}
                      fill="#2a2a2a"
                      fontSize={isStarHovered ? 15 : 13}
                      fontFamily="'Noto Serif SC', serif"
                      fontWeight={isStarHovered ? 'bold' : 'normal'}
                      style={{
                        filter: isStarHovered ? 'drop-shadow(0 0 3px rgba(28,28,28,0.4))' : 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'help',
                      }}
                    >
                      {s.name}
                    </text>
                    {/* 亮度符号 */}
                    {bSym && (
                      <text
                        x={12 + s.name.length * 13 + 2}
                        y={sy}
                        fill="#8a8a8a"
                        fontSize={10}
                        fontFamily="'Noto Serif SC', serif"
                      >
                        {bSym}
                      </text>
                    )}
                    {/* 四化色块 */}
                    {s.mutagen && (
                      <rect
                        x={12 + s.name.length * 13 + (bSym ? 14 : 2) + 2}
                        y={sy - 9}
                        width={10}
                        height={10}
                        rx={2}
                        fill={MUTAGEN_COLOR[s.mutagen] || '#c9a96e'}
                        opacity={0.85}
                      />
                    )}
                  </g>
                );
              })}

              {/* 辅星 — 中字体 */}
              {palace.minorStars.length > 0 && (
                <text
                  x={12}
                  y={minorStarY}
                  fill="#6a6a6a"
                  fontSize={11}
                  fontFamily="'Noto Serif SC', serif"
                >
                  {palace.minorStars.slice(0, 4).map((s: any) => s.name).join(' ')}
                </text>
              )}

              {/* 杂曜 — 小字体 */}
              {palace.adjectiveStars.length > 0 && (
                <text
                  x={12}
                  y={adjStarY}
                  fill="#9a9a9a"
                  fontSize={10}
                  fontFamily="'Noto Serif SC', serif"
                >
                  {palace.adjectiveStars.slice(0, 3).map((s: any) => s.name).join(' ')}
                </text>
              )}

              {/* 宫名 — 底部粗体 */}
              <text
                x={boxSize / 2}
                y={palaceNameY}
                fill="#2d4a3e"
                fontSize={13}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="'Noto Serif SC', serif"
              >
                {palace.name}
              </text>

              {/* 命宫/身宫标记 */}
              {(isSoul || isBody) && (
                <text
                  x={boxSize - 8}
                  y={palaceNameY}
                  fill={isSoul ? '#a84a4a' : '#5a3a2a'}
                  fontSize={11}
                  textAnchor="end"
                  fontWeight="bold"
                  fontFamily="'Noto Serif SC', serif"
                  style={{ animation: 'breathe 2s ease-in-out infinite' }}
                >
                  {isSoul ? '命' : '身'}
                </text>
              )}

              {/* 年龄列表（可选小字） */}
              {palace.ages && palace.ages.length > 0 && (
                <text
                  x={8}
                  y={boxSize - 22}
                  fill="#b0a890"
                  fontSize={8}
                  fontFamily="'Noto Serif SC', serif"
                >
                  {palace.ages.slice(0, 4).join(',')}
                </text>
              )}
            </g>
          );
        })}
      {/* ====== 命盘中心区域 ====== */}
      <g>
        {/* 中心背景 — 宣纸色圆形 */}
        <circle
          cx={chartSize / 2}
          cy={chartSize / 2}
          r={165}
          fill="#f5efe0"
          stroke="#c9a96e"
          strokeWidth={1}
          opacity={0.8}
        />
        {/* 同心装饰圈 */}
        <circle
          cx={chartSize / 2}
          cy={chartSize / 2}
          r={150}
          fill="none"
          stroke="#d5cbb8"
          strokeWidth={0.5}
          strokeDasharray="4 4"
          opacity={0.6}
        />
        <circle
          cx={chartSize / 2}
          cy={chartSize / 2}
          r={135}
          fill="none"
          stroke="#d5cbb8"
          strokeWidth={0.3}
          opacity={0.4}
        />
        
        {/* 装饰角花 */}
        {[
          { x: -8, y: -8, r: 0 },
          { x: 8, y: -8, r: 90 },
          { x: 8, y: 8, r: 180 },
          { x: -8, y: 8, r: 270 },
        ].map((pos, i) => {
          const cx2 = chartSize / 2 + pos.x * 18;
          const cy2 = chartSize / 2 + pos.y * 18;
          const offset = 12;
          return (
            <g key={i} transform={`translate(${cx2}, ${cy2}) rotate(${pos.r})`}>
              <path
                d={`M -${offset} 0 L 0 0 L 0 -${offset}`}
                fill="none"
                stroke="#c9a96e"
                strokeWidth={0.8}
                opacity={0.5}
              />
            </g>
          );
        })}

        {/* 命宫主星 — 大号显示 */}
        {(() => {
          const soulPalace = palaces[soulIndex];
          const mainStars = soulPalace?.majorStars?.slice(0, 2)?.map((s: any) => s.name)?.join(' · ') || '';
          const earthBranch = soulPalace?.earthlyBranch || '';
          return (
            <>
              <text
                x={chartSize / 2}
                y={chartSize / 2 - 55}
                textAnchor="middle"
                fill="#a84a4a"
                fontSize={22}
                fontWeight="bold"
                fontFamily="'Noto Serif SC', serif"
                letterSpacing={4}
              >
                命宫
              </text>
              <text
                x={chartSize / 2}
                y={chartSize / 2 - 25}
                textAnchor="middle"
                fill="#1c1c1c"
                fontSize={18}
                fontFamily="'Noto Serif SC', serif"
                letterSpacing={2}
              >
                {mainStars || '拆命解盘'}
              </text>
              {earthBranch && (
                <text
                  x={chartSize / 2}
                  y={chartSize / 2}
                  textAnchor="middle"
                  fill="#8a8a8a"
                  fontSize={12}
                  fontFamily="'Noto Serif SC', serif"
                >
                  {earthBranch}宫 {soulPalace?.changsheng12 || ''}
                </text>
              )}
            </>
          );
        })()}

        {/* 分隔线 */}
        <line
          x1={chartSize / 2 - 60}
          y1={chartSize / 2 + 15}
          x2={chartSize / 2 + 60}
          y2={chartSize / 2 + 15}
          stroke="#d5cbb8"
          strokeWidth={0.5}
          opacity={0.8}
        />

        {/* 出生信息 */}
        {birthDate && (
          <>
            <text
              x={chartSize / 2}
              y={chartSize / 2 + 40}
              textAnchor="middle"
              fill="#6a6a6a"
              fontSize={11}
              fontFamily="'Noto Serif SC', serif"
            >
              {personName || '命盘'} · {gender || ''}
            </text>
            <text
              x={chartSize / 2}
              y={chartSize / 2 + 58}
              textAnchor="middle"
              fill="#8a8a8a"
              fontSize={10}
              fontFamily="'Noto Serif SC', serif"
            >
              {birthDate}  {birthTime ? `时${parseInt(birthTime)}` : ''}
            </text>
          </>
        )}

        {/* 底部装饰 — 太极小图 */}
        <g transform={`translate(${chartSize / 2}, ${chartSize / 2 + 85})`} opacity={0.15}>
          <circle cx={0} cy={0} r={16} fill="none" stroke="#6a6a6a" strokeWidth={0.8} />
          <path d="M 0 -16 A 8 8 0 0 1 0 0 L 0 16 A 8 8 0 0 1 0 0 Z" fill="#6a6a6a" />
          <circle cx={0} cy={-8} r={2} fill="#f5efe0" />
          <circle cx={0} cy={8} r={2} fill="#6a6a6a" />
        </g>

        {/* 四角小字：命 · 运 · 天 · 机 */}
        {[
          { text: '命', x: -70, y: -30, color: '#a84a4a' },
          { text: '运', x: 70, y: -30, color: '#4a7c8a' },
          { text: '天', x: -70, y: 30, color: '#5a7a5a' },
          { text: '机', x: 70, y: 30, color: '#b08040' },
        ].map((item) => (
          <text
            key={item.text}
            x={chartSize / 2 + item.x}
            y={chartSize / 2 + item.y}
            textAnchor="middle"
            fill={item.color}
            fontSize={10}
            fontFamily="'Noto Serif SC', serif"
            opacity={0.3}
            style={{ animation: 'breathe 3s ease-in-out infinite' }}
          >
            {item.text}
          </text>
        ))}
      </g>
      </svg>

      {/* 星曜 tooltip */}
      {hoveredStar && (
        <div
          className="star-tooltip"
          style={{
            left: hoveredStar.x + 12,
            top: hoveredStar.y - 10,
            opacity: 1,
          }}
        >
            return `✦ ${hoveredStar.name} 星性`;
        </div>
      )}
    </div>
  );
}
