// @ts-nocheck
import { useMemo } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import { HoroscopeManager } from '../iztro-shim';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

function _getMutagenType(stem: string, star: string): string {
  const table: Record<string, Record<string, string>> = {
    甲: { 廉贞: '禄', 破军: '权', 武曲: '科', 太阳: '忌' },
    乙: { 天机: '禄', 天梁: '权', 紫微: '科', 太阴: '忌' },
    丙: { 天同: '禄', 天机: '权', 文昌: '科', 廉贞: '忌' },
    丁: { 太阴: '禄', 天同: '权', 天机: '科', 巨门: '忌' },
    戊: { 贪狼: '禄', 太阴: '权', 右弼: '科', 天机: '忌' },
    己: { 武曲: '禄', 贪狼: '权', 天梁: '科', 文曲: '忌' },
    庚: { 太阳: '禄', 武曲: '权', 太阴: '科', 天同: '忌' },
    辛: { 巨门: '禄', 太阳: '权', 文曲: '科', 文昌: '忌' },
    壬: { 天梁: '禄', 紫微: '权', 左辅: '科', 武曲: '忌' },
    癸: { 破军: '禄', 巨门: '权', 太阴: '科', 贪狼: '忌' },
  };
  return table[stem]?.[star] || '';
}

function getYearSummary(stem: string, branch: string, mutagen: string[]): string {
  const parts: string[] = [];
  const branchElement: Record<string, string> = {
    子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
    午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
  };

  const el = branchElement[branch];
  if (el === '火') parts.push('火年外放，宜主动进取');
  else if (el === '水') parts.push('水年内敛，宜谋略规划');
  else if (el === '木') parts.push('木年生发，宜播种布局');
  else if (el === '金') parts.push('金年肃收，宜果断取舍');
  else parts.push('土年稳重，宜守成巩固');

  if (mutagen.length > 0) {
    const hasLu = mutagen.some((m) => _getMutagenType(stem, m) === '禄');
    const hasJi = mutagen.some((m) => _getMutagenType(stem, m) === '忌');
    if (hasLu && !hasJi) parts.push('化禄顺遂');
    else if (hasJi && !hasLu) parts.push('化忌需稳');
    else if (hasLu && hasJi) parts.push('禄忌交织');
  }

  return parts.join('，');
}

export default function TimelinePanel({ astrolabe }: Props) {
  const timeline = useMemo(() => {
    const manager = new HoroscopeManager(astrolabe);
    const currentYear = new Date().getFullYear();
    const start = `${currentYear}-01-01`;
    const end = `${currentYear + 5}-12-31`;
    return manager.getTimeline(start, end, 'year');
  }, [astrolabe]);

  const decadalNodes = useMemo(() => {
    const manager = new HoroscopeManager(astrolabe);
    return manager.getDecadalNodes();
  }, [astrolabe]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="font-ancient text-daiqing text-lg tracking-wider mb-1">时光纵轴</h3>
        <p className="text-text-secondary text-xs">{currentYear}—{currentYear + 5} 大限·流年·流月走势</p>
      </div>

      <div className="relative pl-8">
        {/* 纵向中轴线 */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-jinbo via-border-light to-jinbo opacity-40"></div>

        {timeline.map((item, idx) => {
          const h = item.horoscope;
          const decadal = h.decadal as any;
          const yearly = h.yearly;
          const yearlyMutagen = yearly.mutagen
            .map((m: string) => {
              const type = _getMutagenType(yearly.heavenlyStem, m);
              return type ? `${m}化${type}` : null;
            })
            .filter(Boolean) as string[];

          // 判断是否大限切换年
          const isDecadalSwitch = decadalNodes.some(
            (n) => n.startDate.startsWith(item.date.slice(0, 4))
          );

          const yearlyPalace = h.palace('命宫', 'yearly');
          const decadalPalace = h.palace('命宫', 'decadal');

          return (
            <div key={item.date} className="relative mb-6 animate-ink" style={{ animationDelay: `${idx * 0.1}s` }}>
              {/* 节点圆点 */}
              <div
                className={`absolute left-4 top-3 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10 ${
                  isDecadalSwitch
                    ? 'bg-zhusha border-zhusha-soft'
                    : 'bg-jinbo border-jinbo-light'
                }`}
              ></div>

              <div className="bg-bg-card rounded-lg p-4 border border-border-light parchment-texture corner-flower hover:border-jinbo transition-colors">
                <div className="flex items-start gap-4">
                  {/* 年份标签 */}
                  <div className="shrink-0 text-center">
                    <div className={`font-calligraphy text-xl ${isDecadalSwitch ? 'text-zhusha' : 'text-daiqing'}`}>
                      {item.date.slice(0, 4)}
                    </div>
                    <div className="text-text-secondary text-[10px] mt-0.5">虚岁 {item.age}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 大限信息 */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="seal-sm">大限</span>
                      <span className="text-text-primary text-sm">
                        {decadal.heavenlyStem}{decadal.earthlyBranch} · {decadalPalace?.name || decadal.name}
                      </span>
                      <span className="text-jinbo text-xs">
                        {decadal.range?.[0]}-{decadal.range?.[1]}岁
                      </span>
                    </div>

                    {/* 流年信息 */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="seal-sm">流年</span>
                      <span className="text-text-primary text-sm">
                        {yearly.heavenlyStem}{yearly.earthlyBranch} · {yearlyPalace?.name || yearly.name}
                      </span>
                    </div>

                    {/* 四化标签 */}
                    {yearlyMutagen.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {yearlyMutagen.map((m) => (
                          <span
                            key={m}
                            className="inline-block px-2 py-0.5 rounded text-[11px] border"
                            style={{
                              borderColor: m.includes('忌') ? '#d87070' : m.includes('禄') ? '#c9a96e' : m.includes('权') ? '#b22222' : '#4a7c8a',
                              color: m.includes('忌') ? '#b22222' : m.includes('禄') ? '#8b6914' : m.includes('权') ? '#a84a4a' : '#2d4a3e',
                              background: m.includes('忌') ? 'rgba(178,34,34,0.06)' : m.includes('禄') ? 'rgba(201,169,110,0.08)' : 'rgba(45,74,62,0.06)',
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 简要解读 */}
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {getYearSummary(yearly.heavenlyStem, yearly.earthlyBranch, yearly.mutagen)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
