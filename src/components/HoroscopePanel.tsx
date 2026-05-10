import { useState, useCallback } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

/**
 * 时光机面板 — 古风版
 * 基于 HoroscopeManager 实现步进导航和运限查看
 */
export default function HoroscopePanel({ astrolabe }: Props) {
  const [targetDate, setTargetDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [horoscope, setHoroscope] = useState(() => astrolabe.horoscope());

  const refresh = useCallback((date: string) => {
    setTargetDate(date);
    setHoroscope(astrolabe.horoscope(date));
  }, [astrolabe]);

  const stepYear = (delta: number) => {
    const d = new Date(targetDate);
    d.setFullYear(d.getFullYear() + delta);
    const s = d.toISOString().slice(0, 10);
    refresh(s);
  };

  const stepMonth = (delta: number) => {
    const d = new Date(targetDate);
    d.setMonth(d.getMonth() + delta);
    const s = d.toISOString().slice(0, 10);
    refresh(s);
  };

  const labels: Record<string, string> = {
    decadal: '大限', yearly: '流年', monthly: '流月', daily: '流日', hourly: '流时', age: '小限',
  };

  const nodes = [
    { key: 'decadal', ...horoscope.decadal },
    { key: 'yearly', ...horoscope.yearly },
    { key: 'monthly', ...horoscope.monthly },
    { key: 'daily', ...horoscope.daily },
    { key: 'hourly', ...horoscope.hourly },
    { key: 'age', ...horoscope.age },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1 h-5 bg-jinbo rounded-full" />
        <h2 className="text-daiqing font-bold text-lg tracking-wider">时光机 · 运限推演</h2>
      </div>

      {/* 日期控制 */}
      <div className="flex flex-wrap gap-3 items-center mb-5 bg-pale/50 rounded-lg p-4 border border-border-light">
        <input
          type="date"
          value={targetDate}
          onChange={(e) => refresh(e.target.value)}
          className="bg-parchment border border-border-light rounded px-3 py-2 text-text-primary focus:outline-none focus:border-jinbo text-sm"
        />
        <div className="flex gap-1">
          <button onClick={() => stepYear(-1)} className="bg-bg-card hover:bg-pale border border-border-light px-3 py-2 rounded text-xs tracking-wider transition-colors">←年</button>
          <button onClick={() => stepYear(1)} className="bg-bg-card hover:bg-pale border border-border-light px-3 py-2 rounded text-xs tracking-wider transition-colors">年→</button>
          <button onClick={() => stepMonth(-1)} className="bg-bg-card hover:bg-pale border border-border-light px-3 py-2 rounded text-xs tracking-wider transition-colors">←月</button>
          <button onClick={() => stepMonth(1)} className="bg-bg-card hover:bg-pale border border-border-light px-3 py-2 rounded text-xs tracking-wider transition-colors">月→</button>
        </div>
      </div>

      {/* 运限概览 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {nodes.map((n: any) => (
          <div key={n.key} className="bg-bg-card rounded-lg p-3.5 border border-border-light hover:border-jinbo/40 transition-colors">
            <div className="text-text-secondary text-xs mb-1.5 tracking-wider">{labels[n.key]}</div>
            <div className="text-daiqing font-bold text-base tracking-widest">
              {n.heavenlyStem}{n.earthlyBranch}
            </div>
            <div className="text-text-secondary text-xs mt-1.5">
              {n.key === 'decadal' && n.name ? `${n.name} · ${horoscope.age?.nominalAge}岁` : ''}
              {n.key === 'yearly' ? `${targetDate.slice(0, 4)}年` : ''}
              {n.key === 'age' ? (n.index >= 0 ? `第${n.index + 1}宫` : '童限') : ''}
            </div>
          </div>
        ))}
      </div>

      {/* 四化展示 */}
      <div className="mt-5 bg-pale/50 rounded-lg p-4 border border-border-light">
        <div className="text-text-secondary text-xs mb-3 tracking-wider">运限四化</div>
        <div className="flex flex-wrap gap-4 text-sm">
          {horoscope.decadal.mutagen && (
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary text-xs">大限四化：</span>
              <span className="text-jinbo font-medium tracking-wider">{horoscope.decadal.mutagen.join(' ')}</span>
            </div>
          )}
          {horoscope.yearly.mutagen && (
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary text-xs">流年四化：</span>
              <span className="text-jinbo font-medium tracking-wider">{horoscope.yearly.mutagen.join(' ')}</span>
            </div>
          )}
          {horoscope.monthly.mutagen && (
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary text-xs">流月四化：</span>
              <span className="text-jinbo font-medium tracking-wider">{horoscope.monthly.mutagen.join(' ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
