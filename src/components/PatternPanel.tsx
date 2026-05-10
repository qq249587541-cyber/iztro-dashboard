import { useMemo } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

/**
 * 格局判定面板 — 古风版
 * 展示命盘所有成格的吉凶格局
 */
export default function PatternPanel({ astrolabe }: Props) {
  const patterns = useMemo(() => {
    try {
      return astrolabe.patterns();
    } catch {
      return [];
    }
  }, [astrolabe]);

  // patterns() 返回 PatternResult[]，结构为 { pattern, matched, broken, details }
  const matchedPatterns = patterns.filter((p: any) => p.matched && !p.broken);
  const auspicious = matchedPatterns.filter((p: any) => p.pattern.type === 'auspicious');
  const inauspicious = matchedPatterns.filter((p: any) => p.pattern.type === 'inauspicious');

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-jinbo rounded-full" />
        <h2 className="text-daiqing font-bold text-lg tracking-wider">格局判定</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 吉格 */}
        <div className="bg-pale/50 rounded-lg p-4 border border-jinbo/20">
          <h3 className="text-sm text-daiqing mb-3 flex items-center gap-2 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-jinbo" />
            成格吉格 · {auspicious.length}
          </h3>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {auspicious.length === 0 && (
              <p className="text-text-secondary text-xs tracking-wider">无明显吉格</p>
            )}
            {auspicious.slice(0, 10).map((p: any, i: number) => (
              <div key={i} className="bg-bg-card rounded p-2.5 text-xs border border-border-light hover:border-jinbo transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-daiqing font-medium tracking-wider">{p.pattern.name}</span>
                  {p.pattern.score != null && <span className="text-jinbo font-medium">{p.pattern.score}分</span>}
                </div>
                {p.pattern.description && (
                  <p className="text-text-secondary mt-1.5 leading-relaxed">{p.pattern.description}</p>
                )}
                {p.pattern.quote && (
                  <p className="text-jinbo/70 mt-1 text-[10px] italic">「{p.pattern.quote}」</p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* 凶格 */}
        <div className="bg-pale/50 rounded-lg p-4 border border-zhusha/20">
          <h3 className="text-sm text-zhusha mb-3 flex items-center gap-2 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-zhusha" />
            成格凶格 · {inauspicious.length}
          </h3>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {inauspicious.length === 0 && (
              <p className="text-text-secondary text-xs tracking-wider">无明显凶格</p>
            )}
            {inauspicious.slice(0, 10).map((p: any, i: number) => (
              <div key={i} className="bg-bg-card rounded p-2.5 text-xs border border-border-light hover:border-zhusha transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-zhusha font-medium tracking-wider">{p.pattern.name}</span>
                  {p.pattern.score != null && <span className="text-zhusha-soft font-medium">{p.pattern.score}分</span>}
                </div>
                {p.pattern.description && (
                  <p className="text-text-secondary mt-1.5 leading-relaxed">{p.pattern.description}</p>
                )}
                {p.pattern.quote && (
                  <p className="text-zhusha/60 mt-1 text-[10px] italic">「{p.pattern.quote}」</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
