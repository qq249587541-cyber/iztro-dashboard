// @ts-nocheck
import { useState, useMemo, useCallback } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import { predictYear } from '../reading/predictor';
import ScrollEdge from './decoration/ScrollEdge';
import InkDivider from './decoration/InkDivider';
import SealStamp from './decoration/SealStamp';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

function getGanZhi(year: number): string {
  const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const offset = year - 4;
  return gan[offset % 10] + zhi[offset % 12];
}

export default function PredictionPanel({ astrolabe }: Props) {
  const [targetYear, setTargetYear] = useState(() => new Date().getFullYear());

  const result = useMemo(() => {
    try {
      return predictYear(astrolabe, targetYear);
    } catch (err) {
      console.error('预测失败:', err);
      return null;
    }
  }, [astrolabe, targetYear]);

  const stepYear = useCallback((delta: number) => {
    setTargetYear((y) => y + delta);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-5 bg-jinbo rounded-full" />
        <h2 className="text-daiqing font-bold text-lg tracking-wider font-ancient">流年运势推演</h2>
      </div>

      {/* 年份选择 — 时光卷轴样式 */}
      <div className="flex flex-wrap gap-3 items-center bg-pale/50 rounded-lg p-4 border border-border-light relative overflow-hidden">
        <ScrollEdge color="gold" height={3} />
        <div className="w-full flex items-center gap-3 mt-1">
          <button
            onClick={() => stepYear(-1)}
            className="bg-bg-card hover:bg-pale border border-border-light px-4 py-2 rounded text-sm tracking-wider transition-colors font-ancient"
          >
            ← 上一年
          </button>
          <div className="flex flex-col items-center px-4">
            <div className="text-daiqing font-bold text-lg tracking-widest font-calligraphy">
              {targetYear}年
            </div>
            <div className="text-jinbo text-xs tracking-wider font-ancient mt-0.5">
              {getGanZhi(targetYear)}年
            </div>
          </div>
          <button
            onClick={() => stepYear(1)}
            className="bg-bg-card hover:bg-pale border border-border-light px-4 py-2 rounded text-sm tracking-wider transition-colors font-ancient"
          >
            下一年 →
          </button>
          <input
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(parseInt(e.target.value) || new Date().getFullYear())}
            className="bg-parchment border border-border-light rounded px-3 py-2 text-text-primary focus:outline-none focus:border-jinbo text-sm w-28"
            min={1900}
            max={2100}
          />
        </div>
      </div>

      {!result && (
        <div className="text-text-secondary text-center py-10">运势推演生成失败</div>
      )}

      {result && (
        <>
          {/* 年度总评 */}
          <div className="bg-[#faf6ed] rounded-lg p-4 border border-border-light book-card relative overflow-hidden"
          >
            <ScrollEdge color="gold" height={3} />
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <SealStamp text="评" size="sm" />
                <div className="divider-ancient flex-1" />
              </div>
              <p className="text-text-primary text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {result.summary}
              </p>
            </div>
          </div>

          {/* 大限/流年 — 纵向时间轴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 大限分析 */}
            <div className="bg-[#faf6ed] rounded-lg p-4 border border-border-light book-card relative overflow-hidden"
            >
              <ScrollEdge color="gold" height={3} />
              <div className="mt-2 timeline-scroll">
                <div className="timeline-node flex items-center gap-2 mb-3">
                  <SealStamp text="限" size="sm" />
                  <h3 className="text-jinbo font-bold text-sm tracking-wider font-ancient">大限 · {result.decadal.ageRange}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border-light">
                    <span className="text-text-secondary">大限命宫</span>
                    <span className="text-daiqing font-medium">{result.decadal.palace}宫</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-light">
                    <span className="text-text-secondary">大限干支</span>
                    <span className="text-daiqing font-medium">{result.decadal.heavenlyStem}{result.decadal.earthlyBranch}</span>
                  </div>
                  {result.decadal.mutagen.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-border-light">
                      <span className="text-text-secondary">大限四化</span>
                      <span className="text-jinbo font-medium">{result.decadal.mutagen.join('、')}</span>
                    </div>
                  )}
                  <p className="text-text-primary text-sm leading-relaxed mt-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {result.decadal.analysis}
                  </p>
                </div>
              </div>
            </div>

            {/* 流年分析 */}
            <div className="bg-[#faf6ed] rounded-lg p-4 border border-border-light book-card relative overflow-hidden"
            >
              <ScrollEdge color="gold" height={3} />
              <div className="mt-2 timeline-scroll">
                <div className="timeline-node flex items-center gap-2 mb-3">
                  <SealStamp text="年" size="sm" />
                  <h3 className="text-daiqing font-bold text-sm tracking-wider font-ancient">流年 · {result.year}年</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border-light">
                    <span className="text-text-secondary">流年命宫</span>
                    <span className="text-daiqing font-medium">{result.yearly.palace}宫</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-light">
                    <span className="text-text-secondary">流年干支</span>
                    <span className="text-daiqing font-medium">{result.yearly.heavenlyStem}{result.yearly.earthlyBranch}</span>
                  </div>
                  {result.yearly.mutagen.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-border-light">
                      <span className="text-text-secondary">流年四化</span>
                      <span className="text-jinbo font-medium">{result.yearly.mutagen.join('、')}</span>
                    </div>
                  )}
                  <p className="text-text-primary text-sm leading-relaxed mt-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {result.yearly.analysis}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 流月走势 */}
          <div className="bg-[#faf6ed] rounded-lg p-4 border border-border-light book-card relative overflow-hidden"
          >
            <ScrollEdge color="gold" height={3} />
            <div className="mt-2 timeline-scroll">
              <div className="timeline-node flex items-center gap-2 mb-3">
                <SealStamp text="月" size="sm" />
                <h3 className="text-shiqing font-bold text-sm tracking-wider font-ancient">流月走势</h3>
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {result.monthly.trend}
              </p>
              <div className="space-y-1.5">
                {result.monthly.keyMonths.map((m, i) => (
                  <div key={i} className="bg-pale/50 rounded px-3 py-2 text-xs text-text-secondary border border-border-light">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
