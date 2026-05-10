import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import { getStarNature, getPalaceNatureDetails } from 'iztro/lib/nature';
import type { ReadingResult } from './types';

const BRIGHTNESS_RANK: Record<string, number> = {
  wang: 5, miao: 5, de: 4, li: 4, ping: 3, xian: 2, bu: 1,
};

function getBrightnessRank(b: string | undefined): number {
  return b ? (BRIGHTNESS_RANK[b] || 3) : 3;
}

function getBrightnessDesc(b: string | undefined): string {
  const map: Record<string, string> = {
    wang: '旺', miao: '庙', de: '得', li: '利', ping: '平', xian: '陷', bu: '不',
  };
  return b ? (map[b] || b) : '';
}

/** 从星曜提取职业倾向 */
function extractCareerHints(astrolabe: IFunctionalAstrolabe, palaceName: string): string[] {
  const details = getPalaceNatureDetails(astrolabe, palaceName);
  const hints: string[] = [];
  for (const d of details) {
    const nature = getStarNature(d.star as any);
    const palaceNat = nature?.palaceNatures.find(
      (p: { palace: string; brightness: string | 'any'; careerHints?: string[] }) =>
        p.palace === palaceName && (p.brightness === d.brightness || p.brightness === 'any')
    );
    if (palaceNat?.careerHints) {
      hints.push(...palaceNat.careerHints);
    }
  }
  return [...new Set(hints)].slice(0, 3);
}

/** 从星曜提取注意事项 */
function extractWarnings(astrolabe: IFunctionalAstrolabe, palaceName: string): string[] {
  const details = getPalaceNatureDetails(astrolabe, palaceName);
  const warnings: string[] = [];
  for (const d of details) {
    const nature = getStarNature(d.star as any);
    const palaceNat = nature?.palaceNatures.find(
      (p: { palace: string; brightness: string | 'any'; warnings?: string[] }) =>
        p.palace === palaceName && (p.brightness === d.brightness || p.brightness === 'any')
    );
    if (palaceNat?.warnings) {
      warnings.push(...palaceNat.warnings);
    }
  }
  return [...new Set(warnings)].slice(0, 2);
}

/** 获取某宫主星名列表 */
function getMajorStarNames(astrolabe: IFunctionalAstrolabe, palaceName: string): { name: string; brightness: string }[] {
  const palace = astrolabe.palace(palaceName as any);
  if (!palace) return [];
  return palace.majorStars
    .filter((s: any) => s.type === 'major')
    .map((s: any) => ({ name: s.name, brightness: s.brightness || '' }));
}

/** 获取某宫四化简述 */
function getPalaceMutagenSummary(astrolabe: IFunctionalAstrolabe, palaceName: string): string {
  const palace = astrolabe.palace(palaceName as any);
  if (!palace) return '';
  const parts: string[] = [];
  const allStars = [...palace.majorStars, ...palace.minorStars];
  for (const s of allStars) {
    if (s.mutagen) {
      parts.push(`${s.name}化${s.mutagen}`);
    }
  }
  return parts.join('、');
}

/**
 * 命盘自动解读
 *
 * 基于命宫主星 + 身宫 + 格局 + 四化，从知识库提取描述拼接成五维分析。
 */
export function interpretAstrolabe(astrolabe: IFunctionalAstrolabe): ReadingResult {
  const bodyPalace = astrolabe.palace('身宫' as any);
  const patterns = astrolabe.patterns();

  const matchedPatterns = patterns.filter((p: any) => p.matched && !p.broken);
  const auspiciousNames = matchedPatterns
    .filter((p: any) => p.pattern.type === 'auspicious')
    .map((p: any) => p.pattern.name);
  const inauspiciousNames = matchedPatterns
    .filter((p: any) => p.pattern.type === 'inauspicious')
    .map((p: any) => p.pattern.name);

  const soulStars = getMajorStarNames(astrolabe, '命宫');
  const careerStars = getMajorStarNames(astrolabe, '官禄');
  const wealthStars = getMajorStarNames(astrolabe, '财帛');
  const loveStars = getMajorStarNames(astrolabe, '夫妻');
  const healthStars = getMajorStarNames(astrolabe, '疾厄');

  const personality = buildPersonality(astrolabe, soulStars, bodyPalace, auspiciousNames, inauspiciousNames);
  const career = buildCareer(astrolabe, careerStars, soulStars, auspiciousNames);
  const love = buildLove(astrolabe, loveStars, soulStars, auspiciousNames, inauspiciousNames);
  const wealth = buildWealth(astrolabe, wealthStars, soulStars, auspiciousNames);
  const health = buildHealth(astrolabe, healthStars, inauspiciousNames);

  return { personality, career, love, wealth, health };
}

function buildPersonality(
  astrolabe: IFunctionalAstrolabe,
  soulStars: { name: string; brightness: string }[],
  bodyPalace: any,
  auspicious: string[],
  inauspicious: string[],
): string {
  const parts: string[] = [];

  if (soulStars.length === 0) {
    parts.push('命宫无主星，需借对宫安星，性格随环境而变，易受他人影响。');
  } else {
    const starDescs = soulStars.map((s) => {
      const nat = getStarNature(s.name as any);
      const bDesc = getBrightnessDesc(s.brightness);
      let text = '';
      if (nat) {
        text += nat.basicNature.slice(0, 60);
        if (bDesc) text += `此星在命宫处于${bDesc}位，${getBrightnessRank(s.brightness) >= 4 ? '力量充沛，正面特质突出' : '力量受限，需后天努力补足'}。`;
      } else {
        text += `${s.name}在命宫，${bDesc ? '处于' + bDesc + '位。' : ''}`;
      }
      return text;
    });
    parts.push(starDescs.join(''));
  }

  if (bodyPalace) {
    parts.push(`身宫落于${bodyPalace.name}，后天发展重心在${bodyPalace.name === '命宫' ? '自我成长' : bodyPalace.name === '财帛' ? '物质积累' : bodyPalace.name === '官禄' ? '事业成就' : bodyPalace.name === '夫妻' ? '感情经营' : bodyPalace.name + '领域'}。`);
  }

  if (auspicious.length > 0) {
    parts.push(`命带${auspicious.slice(0, 3).join('、')}，主${auspicious.includes('君臣庆会格') ? '领导力强、贵人多' : auspicious.includes('日月并明格') || auspicious.includes('金灿光辉格') || auspicious.includes('月朗天门格') ? '聪明富贵、光明磊落' : auspicious.includes('石中隐玉格') ? '才学出众、大器晚成' : '先天格局不俗、运势有助力'}。`);
  }

  if (inauspicious.length > 0) {
    parts.push(`需注意${inauspicious.slice(0, 2).join('、')}带来的影响，${inauspicious.includes('羊陀夹忌格') ? '行事多阻滞，宜低调谨慎' : inauspicious.includes('火铃夹命格') ? '性情易急躁，防冲动决策' : inauspicious.includes('空劫夹命格') ? '防破财与空想，脚踏实地为宜' : '性格中带有挑战因素，需后天修炼平衡'}。`);
  }

  const soulMutagen = getPalaceMutagenSummary(astrolabe, '命宫');
  if (soulMutagen) {
    parts.push(`命宫生年四化：${soulMutagen}，这是此生最执着的能量方向。`);
  }

  return parts.join('') || '[待补知识库：命宫主星性格描述]';
}

function buildCareer(
  astrolabe: IFunctionalAstrolabe,
  careerStars: { name: string; brightness: string }[],
  _soulStars: { name: string; brightness: string }[],
  auspicious: string[],
): string {
  const parts: string[] = [];

  if (careerStars.length === 0) {
    parts.push('官禄宫无主星，事业发展需借对宫力量，或从事自由职业、多元发展。');
  } else {
    const names = careerStars.map((s) => s.name + (getBrightnessDesc(s.brightness) ? `(${getBrightnessDesc(s.brightness)})` : '')).join('、');
    parts.push(`官禄宫主星：${names}。`);
    const hints = extractCareerHints(astrolabe, '官禄');
    if (hints.length > 0) {
      parts.push(`职业倾向：${hints.join('、')}。`);
    }
    const warnings = extractWarnings(astrolabe, '官禄');
    if (warnings.length > 0) {
      parts.push(`注意：${warnings.join('、')}。`);
    }
  }

  const soulHints = extractCareerHints(astrolabe, '命宫');
  if (soulHints.length > 0) {
    parts.push(`命宫特质亦指向${soulHints.join('、')}方向，可考虑与官禄宫能力结合。`);
  }

  if (auspicious.includes('君臣庆会格') || auspicious.includes('紫府同宫格')) {
    parts.push('格局显贵，宜走管理路线，掌权柄。');
  } else if (auspicious.includes('杀破狼格')) {
    parts.push('杀破狼格局，事业多变动，宜开创性工作，不宜一成不变。');
  } else if (auspicious.includes('机月同梁格')) {
    parts.push('机月同梁，宜公职、企划、服务业。');
  }

  const careerMutagen = getPalaceMutagenSummary(astrolabe, '官禄');
  if (careerMutagen) {
    parts.push(`官禄宫四化：${careerMutagen}，事业上有明显的人生课题与转折能量。`);
  }

  return parts.join('') || '[待补知识库：官禄宫事业描述]';
}

function buildLove(
  astrolabe: IFunctionalAstrolabe,
  loveStars: { name: string; brightness: string }[],
  soulStars: { name: string; brightness: string }[],
  _auspicious: string[],
  inauspicious: string[],
): string {
  const parts: string[] = [];

  if (loveStars.length === 0) {
    parts.push('夫妻宫无主星，感情观较随缘分，配偶条件受对宫影响大。');
  } else {
    const names = loveStars.map((s) => s.name + (getBrightnessDesc(s.brightness) ? `(${getBrightnessDesc(s.brightness)})` : '')).join('、');
    parts.push(`夫妻宫主星：${names}。`);
    const details = getPalaceNatureDetails(astrolabe, '夫妻');
    if (details.length > 0) {
      parts.push(details.map((d: { description: string }) => d.description).join(''));
    }
  }

  const soulStarNames = soulStars.map((s) => s.name);
  if (soulStarNames.includes('贪狼') || soulStarNames.includes('廉贞')) {
    parts.push('命宫带桃花星，自身魅力强，但需注意感情中的分寸与专一。');
  } else if (soulStarNames.includes('紫微') || soulStarNames.includes('天府')) {
    parts.push('命宫带帝星/令星，对感情有主导性，配偶宜温顺配合。');
  } else if (soulStarNames.includes('七杀') || soulStarNames.includes('破军')) {
    parts.push('命宫带变动星，感情来得激烈，需防冲动决定。');
  }

  if (inauspicious.includes('刑囚夹印格')) {
    parts.push('命带刑囚夹印，感情上易有争执或法律相关波折，需理性沟通。');
  }

  const loveMutagen = getPalaceMutagenSummary(astrolabe, '夫妻');
  if (loveMutagen) {
    parts.push(`夫妻宫四化：${loveMutagen}，感情线是此生重要修行。`);
  }

  return parts.join('') || '[待补知识库：夫妻宫感情描述]';
}

function buildWealth(
  astrolabe: IFunctionalAstrolabe,
  wealthStars: { name: string; brightness: string }[],
  soulStars: { name: string; brightness: string }[],
  auspicious: string[],
): string {
  const parts: string[] = [];

  if (wealthStars.length === 0) {
    parts.push('财帛宫无主星，求财方式需借对宫力量，或靠技能、人脉生财。');
  } else {
    const names = wealthStars.map((s) => s.name + (getBrightnessDesc(s.brightness) ? `(${getBrightnessDesc(s.brightness)})` : '')).join('、');
    parts.push(`财帛宫主星：${names}。`);
    const details = getPalaceNatureDetails(astrolabe, '财帛');
    if (details.length > 0) {
      parts.push(details.map((d: { description: string }) => d.description).join(''));
    }
  }

  const soulStarNames = soulStars.map((s) => s.name);
  if (soulStarNames.includes('武曲')) {
    parts.push('命宫带武曲，天生有理财意识，财星坐命宜主动求财。');
  } else if (soulStarNames.includes('太阴')) {
    parts.push('命宫带太阴，善以柔克刚生财，宜置产、长线投资。');
  } else if (soulStarNames.includes('贪狼')) {
    parts.push('命宫带贪狼，求财欲望强烈，横发横破皆有可能，宜见好就收。');
  }

  if (auspicious.includes('禄马交驰格')) {
    parts.push('禄马交驰，财源广进，动中求财尤佳。');
  }
  if (auspicious.includes('三奇嘉会格') || auspicious.includes('权禄巡逢格')) {
    parts.push('带三奇/权禄，财运有贵人助力，可大胆布局。');
  }

  const wealthMutagen = getPalaceMutagenSummary(astrolabe, '财帛');
  if (wealthMutagen) {
    parts.push(`财帛宫四化：${wealthMutagen}，财运有明显的起伏周期。`);
  }

  const estateStars = getMajorStarNames(astrolabe, '田宅');
  if (estateStars.length > 0) {
    parts.push(`田宅宫有${estateStars.map((s) => s.name).join('、')}，不动产方面有${estateStars.some((s) => ['紫微', '天府', '太阴'].includes(s.name)) ? '积累潜力' : '变动因素'}。`);
  }

  return parts.join('') || '[待补知识库：财帛宫财运描述]';
}

function buildHealth(
  astrolabe: IFunctionalAstrolabe,
  healthStars: { name: string; brightness: string }[],
  inauspicious: string[],
): string {
  const parts: string[] = [];

  if (healthStars.length === 0) {
    parts.push('疾厄宫无主星，健康状况受对宫影响，整体体质需结合命宫综合判断。');
  } else {
    const names = healthStars.map((s) => s.name + (getBrightnessDesc(s.brightness) ? `(${getBrightnessDesc(s.brightness)})` : '')).join('、');
    parts.push(`疾厄宫主星：${names}。`);
  }

  const soulPalace = astrolabe.palace('命宫');
  const soulStarNames = soulPalace
    ? soulPalace.majorStars.filter((s: any) => s.type === 'major').map((s: any) => s.name as string)
    : [];

  const healthMap: Record<string, string> = {
    紫微: '注意脾胃，整体体质较好但防富贵病。',
    天机: '注意神经系统、肠胃敏感，避免思虑过度。',
    太阳: '注意心血管、眼部健康，避免过度劳累。',
    武曲: '注意肺部、骨骼关节，适度运动。',
    天同: '注意肾脏、泌尿系统，防水肿。',
    廉贞: '注意血液、心脏、眼部，防血压问题。',
    天府: '注意脾胃消化系统，饮食规律。',
    太阴: '注意内分泌、妇科/泌尿系统，情绪管理是关键。',
    贪狼: '注意肝胆、生殖系统，防纵欲过度。',
    巨门: '注意呼吸系统、口腔咽喉，防暗疾。',
    天相: '注意皮肤、脾胃，防过敏。',
    天梁: '注意肠胃、免疫系统，整体较长寿。',
    七杀: '注意外伤、金属伤害，防突发意外。',
    破军: '注意消耗性疾病，防元气大伤。',
  };

  for (const star of soulStarNames) {
    if (healthMap[star]) {
      parts.push(healthMap[star]);
      break;
    }
  }

  if (inauspicious.includes('火铃夹命格')) {
    parts.push('火铃夹命，性情急躁，长期易引发心血管或炎症问题，需修身养性。');
  }
  if (inauspicious.includes('羊陀夹忌格')) {
    parts.push('羊陀夹忌，身体易有暗疾或慢性疼痛，建议定期体检。');
  }

  const fortuneStars = getMajorStarNames(astrolabe, '福德');
  if (fortuneStars.length > 0) {
    const fNames = fortuneStars.map((s) => s.name).join('、');
    parts.push(`福德宫有${fNames}，精神状态${fortuneStars.some((s) => ['天梁', '天同', '太阴'].includes(s.name)) ? '较稳定，抗压能力尚可' : '易受外界影响，需注意心理健康'}。`);
  }

  return parts.join('') || '[待补知识库：疾厄宫健康描述]';
}

export default interpretAstrolabe;
