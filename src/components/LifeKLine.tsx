import { useMemo, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';

interface Props {
  astrolabe: IFunctionalAstrolabe;
}

/**
 * 人生K线 — 古风版
 * 使用 HoroscopeManager.getTimeline() 生成十年运势时间线
 */
export default function LifeKLine({ astrolabe }: Props) {
  const [granularity, setGranularity] = useState<'year' | 'month'>('year');
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    try {
      const birthday = new Date(astrolabe.solarDate);
      const start = birthday;
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + years);

      const mgr = astrolabe.timeline(start);
      return mgr.getTimeline(start, end, granularity).map((snap: any) => ({
        date: snap.date,
        decadal: snap.decadalIndex + 1,
        yearly: snap.yearlyIndex + 1,
        age: snap.age,
        label: granularity === 'year'
          ? snap.date.slice(0, 4)
          : snap.date.slice(0, 7),
      }));
    } catch (err) {
      console.error('Timeline error:', err);
      return [];
    }
  }, [astrolabe, granularity, years]);

  const decadeBoundaries = useMemo(() => {
    try {
      const mgr = astrolabe.timeline();
      return mgr.getDecadalNodes().map((n: any) => ({
        age: n.startAge,
        label: `${n.heavenlyStem}${n.earthlyBranch}(${n.palaceName})`,
      }));
    } catch {
      return [];
    }
  }, [astrolabe]);

  if (data.length === 0) {
    return (
      <div className="text-text-secondary text-center py-10 tracking-wider">
        无法生成时间线
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-jinbo rounded-full" />
          <h2 className="text-daiqing font-bold text-lg tracking-wider">人生K线 · 运势走势</h2>
        </div>
        <div className="flex gap-2">
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="bg-parchment border border-border-light rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-jinbo"
          >
            {[5, 10, 20, 30, 60].map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as 'year' | 'month')}
            className="bg-parchment border border-border-light rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-jinbo"
          >
            <option value="year">按年</option>
            <option value="month">按月</option>
          </select>
        </div>
      </div>

      {/* 大限标注 */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {decadeBoundaries.slice(0, 6).map((d: any, i: number) => (
          <span key={i} className="bg-pale px-2.5 py-1 rounded border border-jinbo/20 text-text-secondary tracking-wider">
            {d.age}岁起 <span className="text-jinbo">{d.label}</span>
          </span>
        ))}
      </div>

      {/* 流年走势图 */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="inkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2d4a3e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2d4a3e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d5cbb8" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#8a8a8a" fontSize={10} fontFamily="'Noto Serif SC', serif" />
            <YAxis stroke="#8a8a8a" fontSize={10} domain={[0, 12]} fontFamily="'Noto Serif SC', serif" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fdf9f0',
                border: '1px solid #d5cbb8',
                borderRadius: '4px',
                fontFamily: "'Noto Serif SC', serif",
                fontSize: '12px',
              }}
              labelStyle={{ color: '#2d4a3e', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="yearly"
              stroke="#2d4a3e"
              fill="url(#inkGradient)"
              strokeWidth={1.5}
              dot={{ r: 2, fill: '#c9a96e', stroke: '#2d4a3e', strokeWidth: 1 }}
              activeDot={{ r: 4, fill: '#a84a4a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-text-secondary mt-3 tracking-wider leading-relaxed">
        Y轴为流年宫位索引（1-12），反映每年运势所在宫位。大限切换时可能出现趋势转折。
      </p>
    </div>
  );
}