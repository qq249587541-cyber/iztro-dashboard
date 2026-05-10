import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { Weakness, RemedyResult } from './types';

const EVIL_STARS = ['火星', '铃星', '擎羊', '陀罗', '地空', '地劫'];

/**
 * 诊断命盘弱点
 */
export function diagnoseWeaknesses(astrolabe: IFunctionalAstrolabe): Weakness[] {
  const weaknesses: Weakness[] = [];

  const soulPalace = astrolabe.palace('命宫');
  if (!soulPalace) return weaknesses;

  const allSoulStars = [...soulPalace.majorStars, ...soulPalace.minorStars];
  const majorStars = soulPalace.majorStars.filter((s: any) => s.type === 'major');
  const surrounded = astrolabe.surroundedPalaces('命宫');

  // 1. 空宫
  if (majorStars.length === 0) {
    weaknesses.push({
      type: 'empty_palace',
      palace: '命宫',
      description: '命宫无主星，性格与运势易随波逐流，需借对宫力量，人生方向感较弱。',
      severity: 3,
    });
  }

  // 2. 煞星
  const evilInSoul = allSoulStars.filter((s: any) => EVIL_STARS.includes(s.name));
  if (evilInSoul.length > 0) {
    weaknesses.push({
      type: 'evil_stars',
      palace: '命宫',
      description: `命宫有${evilInSoul.map((s: any) => s.name).join('、')}，性情易急躁或有突发波折。`,
      severity: evilInSoul.length >= 2 ? 4 : 3,
    });
  }

  // 三方四正煞星
  const evilSurrounded = EVIL_STARS.filter((e) =>
    surrounded.haveOneOf([e as any])
  );
  if (evilSurrounded.length >= 2) {
    weaknesses.push({
      type: 'evil_stars',
      palace: '三方四正',
      description: `三方四正见${evilSurrounded.join('、')}冲破，整体格局受损，需外力化解。`,
      severity: 4,
    });
  }

  // 3. 化忌
  const jiStars = allSoulStars.filter((s: any) => s.mutagen === '忌');
  if (jiStars.length > 0) {
    weaknesses.push({
      type: 'mutagen_ji',
      palace: '命宫',
      description: `命宫有${jiStars.map((s: any) => s.name).join('、')}化忌，此生执念最深、最反复的领域，需修心放下。`,
      severity: 4,
    });
  }

  // 4. 亮度弱
  const weakStars = majorStars.filter((s: any) =>
    s.brightness === 'xian' || s.brightness === 'bu' || s.brightness === 'ping'
  );
  if (weakStars.length > 0 && majorStars.length > 0) {
    weaknesses.push({
      type: 'brightness_weak',
      palace: '命宫',
      description: `命宫主星${weakStars.map((s: any) => `${s.name}(${s.brightness === 'xian' ? '陷' : s.brightness === 'bu' ? '不' : '平'})`).join('、')}亮度不足，先天优势难以发挥，需后天加倍努力或借吉星之力。`,
      severity: weakStars.some((s: any) => s.brightness === 'xian' || s.brightness === 'bu') ? 4 : 2,
    });
  }

  // 5. 凶格
  const patterns = astrolabe.patterns();
  const inauspicious = patterns.filter((p: any) => p.matched && !p.broken && p.pattern.type === 'inauspicious');
  if (inauspicious.length >= 2) {
    weaknesses.push({
      type: 'broken_pattern',
      palace: '命宫',
      description: `命带多个凶格：${inauspicious.slice(0, 3).map((p: any) => p.pattern.name).join('、')}，人生波折较多，需以稳守为主。`,
      severity: 5,
    });
  } else if (inauspicious.length === 1) {
    weaknesses.push({
      type: 'broken_pattern',
      palace: '命宫',
      description: `命带凶格「${inauspicious[0].pattern.name}」，${inauspicious[0].pattern.description.slice(0, 30)}，需留意化解。`,
      severity: 3,
    });
  }

  return weaknesses;
}

/**
 * 生成改运化解建议
 */
export function generateRemedy(_astrolabe: IFunctionalAstrolabe, weaknesses: Weakness[]): RemedyResult {
  const direction = buildDirection(weaknesses);
  const color = buildColor(weaknesses);
  const timing = buildTiming(weaknesses);
  const behavior = buildBehavior(weaknesses);

  return { direction, color, timing, behavior };
}

function buildDirection(weaknesses: Weakness[]): string {
  const parts: string[] = [];

  // 从弱点推断需要补益的五行方向
  const hasFireEvil = weaknesses.some((w) =>
    w.type === 'evil_stars' && w.description.includes('火星')
  );
  const hasKongJie = weaknesses.some((w) =>
    w.type === 'evil_stars' && (w.description.includes('地空') || w.description.includes('地劫'))
  );
  const hasBrightnessWeak = weaknesses.some((w) => w.type === 'brightness_weak');

  if (hasBrightnessWeak) {
    parts.push('命宫主星亮度不足，宜多往东方（木气生发）或南方（火气明亮）走动，借方位之气补星曜之光。');
  } else {
    parts.push('命宫气场平稳，日常方位无特别禁忌，随遇而安即可。');
  }

  if (hasFireEvil) {
    parts.push('命宫有火星，南方属火为忌方，高温、火源之地宜少去。');
  }

  if (hasKongJie) {
    parts.push('空劫夹命或同宫，西北方（乾位）与东南方（巽位）气流不稳，重要决策不宜在此二方进行。');
  }

  parts.push('日常起居、办公桌朝向、床头方位可参考吉方布置，辅助气场调和。');

  return parts.join('');
}

function buildColor(weaknesses: Weakness[]): string {
  const parts: string[] = [];

  if (weaknesses.some((w) => w.type === 'brightness_weak')) {
    parts.push('命宫主星亮度不足，宜多穿明亮色系（非刺眼荧光），以暖色补阳气，增强自信与行动力。');
  }

  if (weaknesses.some((w) => w.type === 'mutagen_ji')) {
    parts.push('命带化忌，情绪易纠结，宜以柔和中性色（米白、浅灰）稳定心绪，忌大面积刺眼红色。');
  }

  if (weaknesses.some((w) => w.type === 'evil_stars' && w.severity >= 4)) {
    parts.push('煞星较重，可用深蓝色、黑色（水色）泄火气、化刚煞，金属饰品（白色、银色）亦可挡煞。');
  }

  parts.push('日常穿着、随身配饰、居家布置可多选用本命吉色，潜移默化中调和气场。');

  return parts.join('');
}

function buildTiming(weaknesses: Weakness[]): string {
  const parts: string[] = [];

  parts.push('流年逢「禄」「权」之月宜积极进取，逢「忌」之月宜稳守观望，逢「科」之月宜考试、社交。');

  if (weaknesses.some((w) => w.type === 'evil_stars')) {
    parts.push('命带火铃羊陀，农历四月（巳月）、五月（午月）火气最旺，此时情绪易燥，重大决策延后至秋季金水当令时再做。');
  }

  if (weaknesses.some((w) => w.type === 'mutagen_ji')) {
    parts.push('化忌之年/月，诸事不宜冒进，尤其忌在生日当月做重大变动（换工作、搬家、投资）。');
  }

  if (weaknesses.some((w) => w.type === 'empty_palace')) {
    parts.push('命宫空宫者，借对宫力量，宜在「对宫」所对应季节顺势而为（如对宫为财帛，秋季金旺时财运较佳）。');
  }

  parts.push('每日吉时：辰时（7-9点）阳气初生，巳时（9-11点）火旺行动，申时（15-17点）金旺决断，可依事项属性择时。');

  return parts.join('');
}

function buildBehavior(weaknesses: Weakness[]): string {
  const parts: string[] = [];

  parts.push('【行为改运法】');

  if (weaknesses.some((w) => w.type === 'evil_stars')) {
    parts.push('煞星重者，宜修习静心功夫：每日冥想或打坐15分钟，以柔克刚；可养绿植、鱼缸以水木之气化解火金之煞。');
  }

  if (weaknesses.some((w) => w.type === 'mutagen_ji')) {
    parts.push('化忌者，执念为病根。遇事写「情绪日记」，把纠结之事写下来再撕掉，象征放下；或培养一种「输得起」的爱好（如园艺、钓鱼），训练得失心。');
  }

  if (weaknesses.some((w) => w.type === 'brightness_weak')) {
    parts.push('主星亮度不足，宜「借力」。多亲近命带吉星之人，参加行业社群，借人脉补足自身光芒；也可在书桌放一盏暖光灯，象征「增亮」。');
  }

  if (weaknesses.some((w) => w.type === 'empty_palace')) {
    parts.push('命宫空宫，最忌随波逐流、没有主见。建议每年初制定「年度三目标」并写下来贴在显眼处，以锚定人生方向；亦可培养一项长期坚持的技艺，借「技」补「命」。');
  }

  if (weaknesses.some((w) => w.type === 'broken_pattern')) {
    parts.push('凶格在身，宜以「善」化煞：定期公益捐赠、放生、助人，以善念转化负能量；亦可佩戴开光护身符或本命佛挂件，心理锚定安全感。');
  }

  // 补充通用建议
  parts.push('通用法则：早睡早起养阳气，饮食清淡护脾胃，少言是非避口舌，多读书以文墨化煞。紫微斗数所谓「改命」，本质是借后天行为调和先天气场，持之以恒方见效。');

  return parts.join('');
}

export default { diagnoseWeaknesses, generateRemedy };
