// @ts-nocheck
import { useMemo } from 'react';

type Props = {
  astrolabe: any;
};

/* ─── 四化中文映射 ─── */
const MUTAGEN_MAP: Record<string, string> = {
  禄: '化禄（财运／人缘增长）',
  权: '化权（权威／掌控力增强）',
  科: '化科（名声／贵人相助）',
  忌: '化忌（压力／课题所在）',
};

/* ─── 十四主星关键词 ─── */
const STAR_KEYWORDS: Record<string, Record<string, string>> = {
  紫微: { 庙: '帝王星，尊贵大气，领导力强，好面子', 旺: '有领袖气质，重体面', 平: '威严不足但稳重', 陷: '怀才不遇，内心孤高' },
  天机: { 庙: '智慧星，机敏善谋，善于分析策划', 旺: '聪明伶俐，思路灵活', 陷: '思虑过重，易钻牛角尖' },
  太阳: { 庙: '光明磊落，热心公益，贵气显达', 旺: '性格开朗，乐于助人', 陷: '劳心劳力，付出多回报少' },
  武曲: { 庙: '财星，刚毅果决，执行力强，适合金融', 旺: '坚毅务实，理财能力强', 陷: '孤军奋战，财运起伏' },
  天同: { 庙: '福星，随和善良，生活滋润', 旺: '性格温和，人缘好', 陷: '懒散拖延，依赖心重' },
  廉贞: { 庙: '官禄主，清廉自律，能文能武', 旺: '有担当，重原则', 陷: '锋芒太露，易惹是非' },
  天府: { 庙: '财库星，稳重守成，善于理财', 旺: '保守稳健，积累能力强', 陷: '过于保守，错失良机' },
  太阴: { 庙: '富星，温柔细腻，有艺术天赋', 旺: '文静有才，擅长精算', 陷: '多愁善感，情绪化' },
  贪狼: { 庙: '桃花星，多才多艺，社交高手', 旺: '能文能武，交际能力强', 陷: '欲望过重，沉溺享乐' },
  巨门: { 庙: '口才星，善辩论，适合法律传媒', 旺: '口齿伶俐，逻辑清晰', 陷: '口舌是非，容易得罪人' },
  天相: { 庙: '印星，协调能力强，善于辅助', 旺: '稳重正直，做事有章法', 陷: '优柔寡断，缺乏主见' },
  天梁: { 庙: '荫星，稳重慈祥，有贵人运', 旺: '成熟稳重，受人尊重', 陷: '固执老派，缺乏变通' },
  七杀: { 庙: '将星，果敢决断，开创能力强', 旺: '行动力强，敢闯敢拼', 陷: '冲动，易有冲突' },
  破军: { 庙: '耗星，破坏后重建，适合变革创新', 旺: '敢于突破，不守旧', 陷: '破耗尽，成败起伏大' },
};

/* ─── 宫位释义 ─── */
const PALACE_KEYS: Record<string, string> = {
  命宫: '根基所在，性格与人生的底色',
  兄弟: '手足缘份，兄弟姐妹关系',
  夫妻: '婚姻感情，伴侣特质',
  子女: '子女缘份，桃花与创造力',
  财帛: '财运模式，赚钱方式与态度',
  疾厄: '健康状况，体质与隐患',
  迁移: '外出运，人际缘与机遇',
  交友: '朋友与社交圈，合作伙伴',
  官禄: '事业发展，职场运势',
  田宅: '家宅运，房产与储蓄',
  福德: '精神世界，福分与内心追求',
  父母: '父母缘，长辈关系与遗传',
};

/* ─── 紫微斗数流年节点 ─── */
const KEY_YEARS: number[] = [3, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102, 112];

/* ════════════════════════════════════════════
   命盘解读引擎
   ════════════════════════════════════════════ */

/** 命宫 — 性格与天赋 */
function getSoulPalace(astrolabe: any): any {
  const branch = astrolabe.earthlyBranchOfSoulPalace;
  return astrolabe.palaces?.find((p: any) => p.earthlyBranch === branch);
}
function getBodyPalace(astrolabe: any): any {
  const branch = astrolabe.earthlyBranchOfBodyPalace;
  return astrolabe.palaces?.find((p: any) => p.earthlyBranch === branch);
}
function interpretSoul(astrolabe: any): string {
  const soul = getSoulPalace(astrolabe);
  if (!soul) return '命宫数据加载中，请确保出生信息完整。';
  const mainStars = soul.majorStars || [];
  const mutate = mainStars.find((s: any) => s.mutagen);
  const parts: string[] = [];

  if (mainStars.length > 0) {
    mainStars.forEach((s: any) => {
      const keywords = STAR_KEYWORDS[s.name];
      if (keywords) {
        const desc = keywords[s.brightness] || keywords['庙'] || '星性未详';
        parts.push(`${s.name}（${desc}）`);
      } else {
        parts.push(`${s.name}（辅星）`);
      }
    });
    parts.push('；');
  }

  // 命宫四化
  if (mutate) {
    parts.push(`四化：${mutate.name}${MUTAGEN_MAP[mutate.mutagen] || mutate.mutagen}。`);
  }

  // 身宫关联
  const body = getBodyPalace(astrolabe);
  if (body && body.name !== '命宫') {
    parts.push(`身宫落${body.name}，后天发展重心在${PALACE_KEYS[body.name] || body.name + '领域'}。`);
  }

  // 宫干
  parts.push(`命宫干支：${soul.heavenlyStem || ''}${soul.earthlyBranch || ''}。`);

  return parts.join(' ');
}

/** 财帛+官禄 — 事业财运 */
function interpretWealth(astrolabe: any): string {
  const wealth = astrolabe.palaces?.find((p: any) => p.name === '财帛');
  const career = astrolabe.palaces?.find((p: any) => p.name === '官禄');
  const parts: string[] = [];

  if (wealth) {
    const stars = wealth.majorStars || [];
    parts.push('财帛宫：');
    if (stars.length > 0) {
      stars.forEach((s: any) => {
        const kw = STAR_KEYWORDS[s.name];
        if (kw) parts.push(`${s.name}${kw[s.brightness] || ''}；`);
        else parts.push(`${s.name}（辅星）；`);
      });
    } else {
      parts.push('无主星——财运需借对宫力量，不宜独当一面；');
    }
  }

  if (career) {
    const stars = career.majorStars || [];
    parts.push('官禄宫：');
    if (stars.length > 0) {
      stars.forEach((s: any) => {
        const kw = STAR_KEYWORDS[s.name];
        if (kw) parts.push(`${s.name}${kw[s.brightness] || ''}；`);
        else parts.push(`${s.name}（辅星）；`);
      });
    } else {
      parts.push('无主星——事业方向易变，建议参考身宫与对宫；');
    }
  }

  return parts.join(' ');
}

/** 夫妻+交友 — 感情人际 */
function interpretRelation(astrolabe: any): string {
  const couple = astrolabe.palaces?.find((p: any) => p.name === '夫妻');
  const friends = astrolabe.palaces?.find((p: any) => p.name === '交友');
  const parts: string[] = [];

  if (couple) {
    const stars = couple.majorStars || [];
    parts.push('夫妻宫：');
    if (stars.length > 0) {
      stars.forEach((s: any) => {
        const kw = STAR_KEYWORDS[s.name];
        if (kw) parts.push(`${s.name}${kw[s.brightness] || ''}；`);
        else parts.push(`${s.name}（辅星）；`);
      });
    } else {
      parts.push('无主星——感情模式受对宫官禄影响较大，配偶个性与事业发展密切相关；');
    }
  }

  if (friends) {
    const stars = friends.majorStars || [];
    parts.push('交友宫：');
    if (stars.length > 0) {
      stars.forEach((s: any) => {
        const kw = STAR_KEYWORDS[s.name];
        if (kw) parts.push(`${s.name}${kw[s.brightness] || ''}；`);
        else parts.push(`${s.name}（辅星）；`);
      });
    } else {
      parts.push('无主星——社交圈较随缘，朋友质量受大运影响；');
    }
  }

  return parts.join(' ');
}

/** 大限预判 */
function interpretDecadal(astrolabe: any): string {
  const soul = getSoulPalace(astrolabe);
  if (!soul || !soul.decadal) return '大限数据加载中，请稍后再查看。';

  const currentAge = soul.decadal.range?.[0] || 0;
  const parts: string[] = [];

  parts.push(`当前大限：${soul.decadal.range?.[0] || '?'}–${soul.decadal.range?.[1] || '?'}岁（${soul.name}宫）。`);
  parts.push(`长生十二神：${soul.changsheng12 || '—'}。`);

  // 简单判断
  const chang = soul.changsheng12;
  if (chang === '长生' || chang === '沐浴' || chang === '冠带')
    parts.push('此限运势上升期，适合积极开拓。');
  else if (chang === '临官' || chang === '帝旺')
    parts.push('此限运势高峰，宜把握机遇。');
  else if (chang === '衰' || chang === '病' || chang === '死' || chang === '墓')
    parts.push('此限运势下行，宜保守积蓄、减少冒险。');
  else if (chang === '绝' || chang === '胎' || chang === '养')
    parts.push('此限为新周期孕育期，适合学习沉淀。');

  return parts.join(' ');
}

/* ════════════════════════════════════════════
   PredictionTimeline — 大限时间轴
   ════════════════════════════════════════════ */

const DECADAL_LABELS: Record<string, string> = {
  长生: '新生', 沐浴: '探索', 冠带: '起步',
  临官: '攀升', 帝旺: '顶峰', 衰: '转弱',
  病: '调养', 死: '沉寂', 墓: '积蓄',
  绝: '归零', 胎: '孕育', 养: '蓄力',
};

const DECADAL_COLORS: Record<string, string> = {
  长生: '#5a7a5a', 沐浴: '#4a7c8a', 冠带: '#6a9a6a',
  临官: '#7a9a5a', 帝旺: '#a84a4a', 衰: '#b08040',
  病: '#8a7a5a', 死: '#6a6a6a', 墓: '#8a7a6a',
  绝: '#5a5a5a', 胎: '#7a8a6a', 养: '#6a8a7a',
};

export function PredictionTimeline({ astrolabe }: Props) {
  const nodes = useMemo(() => {
    const soul = getSoulPalace(astrolabe);
    if (!soul || !soul.decadal) return [];

    const start = soul.decadal.range?.[0] || 0;
    return astrolabe.palaces?.map((p: any, i: number) => {
      const range = p.decadal?.range || [start + i * 10, start + i * 10 + 9];
      const chang = p.changsheng12 || '';
      return {
        age: `${range[0]}–${range[1]}岁`,
        palace: p.name,
        chang,
        label: DECADAL_LABELS[chang] || '',
        color: DECADAL_COLORS[chang] || '#8a8a8a',
        stars: p.majorStars?.slice(0, 2)?.map((s: any) => s.name) || [],
      };
    });
  }, [astrolabe]);

  if (nodes.length === 0) return <div className="text-text-secondary text-sm py-4">大限数据加载中…</div>;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-2 min-w-max">
        {nodes.map((n, i) => (
          <div key={i} className="flex flex-col items-center" style={{ minWidth: 100 }}>
            {/* 节点球 */}
            <div className="relative">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: n.color }}
              />
              {/* 呼吸灯 */}
              <div
                className="absolute top-0 left-0 w-4 h-4 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: n.color }}
              />
            </div>
            {/* 连接线 */}
            {i < nodes.length - 1 && (
              <div className="w-full h-px bg-border-light -mt-2 ml-2" style={{ marginLeft: 8 }} />
            )}
            <div className="mt-2 text-center">
              <div className="text-xs font-medium text-text-primary">{n.age}</div>
              <div className="text-[10px] text-daiqing mt-0.5">{n.palace}</div>
              <div
                className="text-[10px] mt-0.5 px-1.5 py-0.5 rounded-sm"
                style={{ backgroundColor: n.color + '15', color: n.color }}
              >
                {n.label || n.chang}
              </div>
              <div className="text-[10px] text-text-secondary mt-1 leading-tight">
                {n.stars.join(' ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   命盘解读 — 三宫综合分析
   ════════════════════════════════════════════ */

type SectionProps = { title: string; content: string; color: string };

function Section({ title, content, color }: SectionProps) {
  return (
    <div className="bg-pale/40 rounded-lg p-4 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium tracking-wider" style={{ color }}>{title}</span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export default function ReadingView({ astrolabe }: Props) {
  return (
    <div className="space-y-5">
      <Section title="⭐ 性格与天赋" color="#a84a4a" content={interpretSoul(astrolabe)} />
      <Section title="💰 事业与财运" color="#4a7c8a" content={interpretWealth(astrolabe)} />
      <Section title="❤️ 感情与人际" color="#b08040" content={interpretRelation(astrolabe)} />
      <Section title="🔄 大限与流年" color="#5a7a5a" content={interpretDecadal(astrolabe)} />
    </div>
  );
}
