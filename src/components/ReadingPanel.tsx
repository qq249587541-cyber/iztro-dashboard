import { useMemo } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import { interpretAstrolabe } from '../reading/interpreter';
import type { ReadingResult } from '../reading/types';
import ScrollEdge from './decoration/ScrollEdge';
import InkDivider from './decoration/InkDivider';
import SealStamp from './decoration/SealStamp';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

const SECTIONS: { key: keyof ReadingResult; label: string; icon: string; color: string; stamp: string }[] = [
  { key: 'personality', label: '性格底色', icon: '◆', color: 'daiqing', stamp: '性' },
  { key: 'career', label: '事业前程', icon: '◈', color: 'jinbo', stamp: '业' },
  { key: 'love', label: '感情姻缘', icon: '◇', color: 'zhusha', stamp: '缘' },
  { key: 'wealth', label: '财运格局', icon: '◉', color: 'zheshi', stamp: '财' },
  { key: 'health', label: '健康提示', icon: '◎', color: 'shiqing', stamp: '康' },
];

export default function ReadingPanel({ astrolabe }: Props) {
  const reading = useMemo(() => {
    try {
      return interpretAstrolabe(astrolabe);
    } catch (err) {
      console.error('解读失败:', err);
      return null;
    }
  }, [astrolabe]);

  if (!reading) {
    return (
      <div className="text-text-secondary text-center py-10">
        <p>解读生成失败，请检查命盘数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-5 bg-jinbo rounded-full" />
        <h2 className="text-daiqing font-bold text-lg tracking-wider font-ancient">命盘五维解读</h2>
        <span className="text-text-secondary text-xs tracking-wider ml-2">基于命宫主星 · 身宫 · 格局 · 四化</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((sec) => (
          <div
            key={sec.key}
            className="bg-[#faf6ed] rounded-lg p-4 border border-border-light book-card relative overflow-hidden"
          >
            {/* 卷轴顶部装饰 */}
            <ScrollEdge color="gold" height={3} />
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <SealStamp text={sec.stamp} size="sm" />
                <h3 className={`text-${sec.color} font-bold text-sm tracking-wider font-ancient`}>{sec.label}</h3>
                <InkDivider className="flex-1 ml-2" />
              </div>
              {/* 古籍装订线 */}
              <div className="flex gap-3">
                <div className="w-px bg-gradient-to-b from-transparent via-border-light to-transparent self-stretch flex-shrink-0" />
                <p className="text-text-primary text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {reading[sec.key]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="text-text-secondary text-xs text-center tracking-wider mt-2 opacity-60">
        解读基于 iztro 知识库自动生成，仅供参考，人生走向仍需自身努力与选择
      </div>
    </div>
  );
}
