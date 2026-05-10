import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { PredictionResult } from './types';

const STEM_ELEMENTS: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土',
  庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

const BRANCH_ELEMENTS: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

/**
 * 流年运势预测
 *
 * 基于 Horoscope API，获取目标年份的大限+流年+流月数据，
 * 结合宫位星曜与四化生成人话分析。
 */
export function predictYear(astrolabe: IFunctionalAstrolabe, year: number): PredictionResult {
  const targetDate = `${year}-06-15`;
  const horoscope = astrolabe.horoscope(targetDate);

  const decadal = horoscope.decadal as any;
  const yearly = horoscope.yearly;

  // 获取大限命宫和流年命宫的星曜
  const decadalSoul = horoscope.palace('命宫', 'decadal');
  const yearlySoul = horoscope.palace('命宫', 'yearly');

  const decadalStarNames = decadalSoul
    ? decadalSoul.majorStars.filter((s: any) => s.type === 'major').map((s: any) => s.name).join('、')
    : '';
  const yearlyStarNames = yearlySoul
    ? yearlySoul.majorStars.filter((s: any) => s.type === 'major').map((s: any) => s.name).join('、')
    : '';

  // 四化文字
  const decadalMutagen = decadal.mutagen.map((m: string) => `${m}化${_getMutagenType(decadal.heavenlyStem, m)}`).filter(Boolean);
  const yearlyMutagen = yearly.mutagen.map((m: string) => `${m}化${_getMutagenType(yearly.heavenlyStem, m)}`).filter(Boolean);

  // 大限分析
  const decadalAnalysis = buildDecadalAnalysis(
    decadal.name,
    decadal.heavenlyStem,
    decadal.earthlyBranch,
    decadal.range as [number, number],
    decadalStarNames,
    decadalMutagen,
  );

  // 流年分析
  const yearlyAnalysis = buildYearlyAnalysis(
    yearly.name,
    yearly.heavenlyStem,
    yearly.earthlyBranch,
    yearlyStarNames,
    yearlyMutagen,
    year,
  );

  // 流月走势（基于流年天干地支推断四季走势）
  const monthly = buildMonthlyTrend(yearly.heavenlyStem, yearly.earthlyBranch, yearly.mutagen);

  // 年度总评
  const summary = buildSummary(decadal, yearly, yearlyAnalysis);

  return {
    year,
    decadal: {
      palace: decadal.name,
      heavenlyStem: decadal.heavenlyStem,
      earthlyBranch: decadal.earthlyBranch,
      ageRange: `${decadal.range[0]}-${decadal.range[1]}岁`,
      mutagen: decadalMutagen,
      analysis: decadalAnalysis,
    },
    yearly: {
      palace: yearly.name,
      heavenlyStem: yearly.heavenlyStem,
      earthlyBranch: yearly.earthlyBranch,
      mutagen: yearlyMutagen,
      analysis: yearlyAnalysis,
    },
    monthly,
    summary,
  };
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
  return table[stem]?.[star] || '?';
}

function buildDecadalAnalysis(
  palaceName: string,
  stem: string,
  branch: string,
  range: [number, number],
  starNames: string,
  mutagen: string[],
): string {
  const parts: string[] = [];

  parts.push(`当前处于${range[0]}-${range[1]}岁大限，大限命宫在${palaceName}。`);
  parts.push(`大限干支为${stem}${branch}，五行属${STEM_ELEMENTS[stem]}${BRANCH_ELEMENTS[branch]}。`);

  if (starNames) {
    parts.push(`大限命宫主星：${starNames}，这十年的人生主轴围绕${palaceName === '命宫' ? '自我实现' : palaceName === '财帛' ? '财富积累' : palaceName === '官禄' ? '事业晋升' : palaceName === '夫妻' ? '感情经营' : palaceName === '迁移' ? '外出发展' : palaceName + '相关议题'}展开。`);
  }

  if (mutagen.length > 0) {
    parts.push(`大限四化：${mutagen.join('、')}，十年基调受此能量牵引。`);
  }

  const palaceLuck: Record<string, string> = {
    命宫: '自我突破', 兄弟: '人际合作', 夫妻: '感情深化', 子女: '子女或创意',
    财帛: '财富重组', 疾厄: '健康关注', 迁移: '外出机遇', 仆役: '人脉扩展',
    官禄: '事业转型', 田宅: '置业安居', 福德: '精神成长', 父母: '长辈缘深',
  };
  parts.push(`此大限核心主题：${palaceLuck[palaceName] || '人生阶段性调整'}。`);

  return parts.join('');
}

function buildYearlyAnalysis(
  palaceName: string,
  stem: string,
  branch: string,
  starNames: string,
  mutagen: string[],
  year: number,
): string {
  const parts: string[] = [];

  parts.push(`${year}年流年命宫在${palaceName}，流年干支${stem}${branch}。`);

  if (starNames) {
    parts.push(`流年命宫主星：${starNames}，该年运势围绕${palaceName === '命宫' ? '自我' : palaceName === '财帛' ? '财务' : palaceName === '官禄' ? '事业' : palaceName === '夫妻' ? '感情' : palaceName}议题波动。`);
  }

  if (mutagen.length > 0) {
    parts.push(`流年四化：${mutagen.join('、')}，${year}年的关键转折能量在此。`);
  }

  const branchElement = BRANCH_ELEMENTS[branch];
  if (branchElement === '火') {
    parts.push('流年属火，能量外放，宜主动进取，忌急躁冒进。');
  } else if (branchElement === '水') {
    parts.push('流年属水，能量内敛，宜谋略规划，防情绪泛滥。');
  } else if (branchElement === '木') {
    parts.push('流年属木，生机勃发，宜播种布局，培本固元。');
  } else if (branchElement === '金') {
    parts.push('流年属金，肃杀决断，宜收束整顿，果断取舍。');
  } else {
    parts.push('流年属土，稳重厚实，宜守成巩固，厚积薄发。');
  }

  return parts.join('');
}

function buildMonthlyTrend(stem: string, _branch: string, mutagen: string[]): { trend: string; keyMonths: string[] } {
  const keyMonths: string[] = [];

  const stemElement = STEM_ELEMENTS[stem];
  if (stemElement === '木') {
    keyMonths.push('寅月（立春后）、卯月（惊蛰后）木气最旺，宜启动新计划。');
  } else if (stemElement === '火') {
    keyMonths.push('巳月（立夏后）、午月（芒种后）火气最旺，宜推进执行。');
  } else if (stemElement === '金') {
    keyMonths.push('申月（立秋后）、酉月（白露后）金气最旺，宜收获决断。');
  } else if (stemElement === '水') {
    keyMonths.push('亥月（立冬后）、子月（大雪后）水气最旺，宜静养复盘。');
  } else {
    keyMonths.push('辰月（清明后）、戌月（寒露后）、丑月（小寒后）、未月（小暑后）土气交替，宜稳守过渡。');
  }

  const mutagenMonths: Record<string, string> = {
    禄: '逢禄之月财运/机遇窗口打开，宜主动把握。',
    权: '逢权之月掌控力增强，宜做决策、签合约。',
    科: '逢科之月名声提升，宜考试、演讲、社交。',
    忌: '逢忌之月阻碍增多，宜保守、避风险、多检查。',
  };

  for (const m of mutagen) {
    const type = m.split('化')[1];
    if (type && mutagenMonths[type]) {
      keyMonths.push(mutagenMonths[type]);
      break;
    }
  }

  const trend = `全年走势呈"${stemElement}气主调"：春季${stemElement === '木' || stemElement === '火' ? '生发' : '蓄势'}，夏季${stemElement === '火' ? '炽盛' : '渐变'}，秋季${stemElement === '金' ? '肃收' : '收敛'}，冬季${stemElement === '水' ? '潜藏' : '休养'}。流月能量随节气轮转，关键月份需重点关注。`;

  return { trend, keyMonths };
}

function buildSummary(
  decadal: any,
  yearly: any,
  yearlyAnalysis: string,
): string {
  const parts: string[] = [];

  parts.push(`【年度总评】${yearly.heavenlyStem}${yearly.earthlyBranch}年，流年命宫落于${yearly.name}。`);

  const samePalace = decadal.name === yearly.name;
  if (samePalace) {
    parts.push('流年命宫与大限命宫重叠，能量加倍，该年是大限中的关键转折年，吉凶都会被放大。');
  } else {
    parts.push('流年与大限命宫分属不同领域，运势呈多线并进格局，需兼顾平衡。');
  }

  parts.push(yearlyAnalysis.slice(0, yearlyAnalysis.indexOf('流年属') > 0 ? yearlyAnalysis.indexOf('流年属') : yearlyAnalysis.length));

  if (yearly.mutagen.length > 0) {
    const hasLu = yearly.mutagen.some((m: string) => _getMutagenType(yearly.heavenlyStem, m) === '禄');
    const hasJi = yearly.mutagen.some((m: string) => _getMutagenType(yearly.heavenlyStem, m) === '忌');
    if (hasLu && !hasJi) {
      parts.push('流年化禄为主，整体偏向顺遂，宜积极开拓。');
    } else if (hasJi && !hasLu) {
      parts.push('流年化忌为主，需稳扎稳打，防小人、防失误、防冲动决策。');
    } else if (hasLu && hasJi) {
      parts.push('流年禄忌并见，吉凶交织，机遇与考验并存，得失间保持平常心。');
    }
  }

  return parts.join('');
}

export default predictYear;
