/**
 * 节气与农历信息面板
 * 展示当前节气、农历日期、干支纪年
 */

import SealStamp from './decoration/SealStamp';

const SOLAR_TERMS = [
  '立春','雨水','惊蛰','春分','清明','谷雨',
  '立夏','小满','芒种','夏至','小暑','大暑',
  '立秋','处暑','白露','秋分','寒露','霜降',
  '立冬','小雪','大雪','冬至','小寒','大寒'
];

const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZODIAC_ANIMALS = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

function getSolarTermIndex(date: Date): number {
  const month = date.getMonth();
  const day = date.getDate();
  // 简化的节气判断（近似值）
  const termDays = [4,19,6,21,5,20,5,21,6,21,7,23,7,23,8,23,8,23,7,22,7,21,5,20];
  let idx = month * 2;
  if (day >= termDays[idx]) idx++;
  return idx % 24;
}

function getGanZhiYear(year: number): string {
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  return `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`;
}

function getZodiac(year: number): string {
  return ZODIAC_ANIMALS[(year - 4) % 12];
}

function getLunarDate(date: Date): string {
  // 2025春节是1月29日，以此为基准做简化偏移
  const spring2025 = new Date(2025, 0, 29);
  const spring2026 = new Date(2026, 1, 17);
  let lunarMonth, lunarDay;
  if (date < spring2026) {
    const diff = Math.floor((date.getTime() - spring2025.getTime()) / 86400000);
    lunarMonth = 1 + Math.floor(diff / 30);
    lunarDay = 1 + (diff % 30);
  } else {
    const diff = Math.floor((date.getTime() - spring2026.getTime()) / 86400000);
    lunarMonth = 1 + Math.floor(diff / 30);
    lunarDay = 1 + (diff % 30);
  }
  const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  return `${lunarMonths[Math.min(lunarMonth - 1, 11)]}月${lunarDays[Math.min(lunarDay - 1, 29)]}`;
}

export default function SolarTermPanel() {
  const now = new Date();
  const year = now.getFullYear();
  const termIdx = getSolarTermIndex(now);
  const nextTermIdx = (termIdx + 1) % 24;

  return (
    <div className="letter-form p-4">
      <h3 className="font-ancient text-ink-soft text-sm tracking-wider mb-3 flex items-center gap-2">
        <SealStamp text="岁时" size="sm" />
        岁时纪
      </h3>
      
      <div className="space-y-2.5">
        {/* 干支纪年 */}
        <div className="flex items-center justify-between">
          <span className="lunar-info">干支纪年</span>
          <span className="font-calligraphy text-ink-soft text-sm">
            {getGanZhiYear(year)}年 · {getZodiac(year)}年
          </span>
        </div>
        
        {/* 农历日期 */}
        <div className="flex items-center justify-between">
          <span className="lunar-info">农历</span>
          <span className="font-calligraphy text-ink-soft text-sm">
            {getLunarDate(now)}
          </span>
        </div>
        
        {/* 当前节气 */}
        <div className="flex items-center justify-between">
          <span className="lunar-info">当前节气</span>
          <span className="solar-term font-bold">
            {SOLAR_TERMS[termIdx]}
          </span>
        </div>
        
        {/* 下一节气 */}
        <div className="flex items-center justify-between">
          <span className="lunar-info"> upcoming</span>
          <span className="text-ink-light text-xs" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {SOLAR_TERMS[nextTermIdx]}
          </span>
        </div>
        
        {/* 分割线 */}
        <div className="divider-ancient" />
        
        {/* 当日提示 */}
        <p className="text-ink-light text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          <span className="cinnabar-note">「</span>
          {year}年 {SOLAR_TERMS[termIdx]} 时节，{getGanZhiYear(year)}之年，万物各循其序
          <span className="cinnabar-note">」</span>
        </p>
      </div>
    </div>
  );
}
