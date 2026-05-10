import { useMemo } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';

interface Props {
  astrolabe: IFunctionalAstrolabe;
  palaceName: string | null;
}

/**
 * 宫位详情面板 — 古风版
 * 点击命盘某宫后展示该宫的详细信息
 */
export default function PalaceDetail({ astrolabe, palaceName }: Props) {
  const palace = useMemo(() => {
    if (!palaceName) return null;
    return astrolabe.palace(palaceName as any);
  }, [astrolabe, palaceName]);

  const nature = useMemo(() => {
    try {
      return astrolabe.nature();
    } catch {
      return null;
    }
  }, [astrolabe]);

  if (!palace) {
    return (
      <div className="text-text-secondary text-center py-10">
        <p className="tracking-widest">点击命盘宫位查看详情</p>
        <div className="divider-ancient max-w-32 mx-auto mt-4" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-0.5 h-5 bg-accent rounded-full" />
        <h2 className="text-accent-text font-medium text-lg tracking-wider">{palace.name}宫</h2>
        {(palace as any).isSoulPalace && <span className="seal text-xs">命宫</span>}
        {palace.isBodyPalace && <span className="px-2 py-0.5 rounded text-xs border border-accent text-accent">身宫</span>}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-1.5 border-b border-border-soft">
          <span className="text-ink-light tracking-wider">天干地支</span>
          <span className="font-medium">{palace.heavenlyStem}{palace.earthlyBranch}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-border-soft">
          <span className="text-ink-light tracking-wider">大限</span>
          <span className="text-accent">{palace.decadal.range[0]}-{palace.decadal.range[1]}岁</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-border-soft">
          <span className="text-ink-light tracking-wider">小限</span>
          <span>{palace.ages.join('、')}岁</span>
        </div>

        <div className="divider-ancient" />

        <div>
          <span className="text-ink-light block mb-2 tracking-wider text-xs">主星</span>
          <div className="flex flex-wrap gap-1.5">
            {palace.majorStars.map((s: any, i: number) => (
              <span key={i} className="bg-accent-wash text-accent-text px-2.5 py-1 rounded text-xs font-medium border border-accent/15">
                {s.name}{s.brightness ? `·${s.brightness}` : ''}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-ink-light block mb-2 tracking-wider text-xs">辅星·杂曜</span>
          <div className="flex flex-wrap gap-1.5">
            {palace.minorStars.map((s: any, i: number) => (
              <span key={i} className="bg-bg-page px-2 py-0.5 rounded text-xs text-ink-soft">
                {s.name}
              </span>
            ))}
            {palace.adjectiveStars.map((s: any, i: number) => (
              <span key={`a-${i}`} className="bg-bg-page px-2 py-0.5 rounded text-xs text-accent-soft">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {nature?.soulStarNatures && (palace as any).isSoulPalace && (
          <div className="bg-bg-page rounded p-3 mt-3">
            <span className="text-ink-light block mb-2 text-xs tracking-wider">命宫主星详解</span>
            {nature.soulStarNatures.slice(0, 2).map((sn: any, i: number) => (
              <p key={i} className="text-xs text-ink-soft leading-relaxed">
                {sn.basicNature.slice(0, 80)}……
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
