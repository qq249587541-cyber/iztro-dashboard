// @ts-nocheck
import { useState, useCallback, useEffect, useRef } from 'react';

type Props = {
  astrolabe: any;
  birthDate: string;
  birthTime: string;
  gender: string;
  personName: string;
};

const DEFAULT_API_KEY = '';

/* ── 五维度 Prompt 模板 ── */
function buildPrompt(astrolabe: any, birthDate: string, birthTime: string, gender: string, name: string): string {
  const palaces = (astrolabe.palaces || []).map((p: any) => ({
    name: p.name,
    earthlyBranch: p.earthlyBranch,
    heavenlyStem: p.heavenlyStem,
    majorStars: (p.majorStars || []).map((s: any) => ({ name: s.name, brightness: s.brightness, mutagen: s.mutagen })),
    minorStars: (p.minorStars || []).map((s: any) => s.name),
    adjectiveStars: (p.adjectiveStars || []).map((s: any) => s.name),
    decadal: p.decadal?.range || [],
    changsheng12: p.changsheng12,
  }));

  const patterns = (() => {
    try { return astrolabe.patterns?.() || []; } catch { return []; }
  })();

  const jsonData = JSON.stringify({ palaces, patterns, fiveElementsClass: astrolabe.fiveElementsClass, gender: astrolabe.gender }, null, 2);

  return `# 角色
你是一位精通紫微斗数的命理大师，道号"紫微子"，给人看命盘已有三十余年。你会用平实但又略带江湖气的口吻，给人解读命盘。

# 命主信息
${name || '命主'} · ${birthDate} · 时${parseInt(birthTime)} · ${gender}

# 命盘数据(JSON)
${jsonData}

# 输出要求
请从以下五个维度输出深度解读，每个维度用一段自然语言（约150字），直接叙述，不要加序号或标题。语言风格像街边算命先生在对客户说话，语气笃定但留有余地。偶尔用比喻让描述更生动。五个维度依次：
1. 性格与天赋（结合命宫主星、身宫、福德宫分析）
2. 事业与财运（结合财帛宫、官禄宫、迁移宫联动）
3. 感情与人际（结合夫妻宫、交友宫、子女宫）
4. 健康与隐疾（结合疾厄宫、命宫星系）
5. 大限与流年（当前大限+未来关键节点运势）`;
}

/* ── Typewriter 打字机效果组件 ── */
function TypewriterText({ text, speed = 30, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!text) return;
    if (idx >= text.length) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    const timer = setTimeout(() => {
      // 每段结束加快速度（遇到句号等停顿稍长）
      const chunk = text.slice(idx, idx + (text[idx]?.match(/[。！？\n]/) ? Speed(3) : 1));
      setDisplayed(prev => prev + chunk);
      setIdx(prev => prev + chunk.length);
    }, speed);
    return () => clearTimeout(timer);
  }, [text, idx, speed, onDone]);

  return <span>{displayed}<span className="animate-pulse opacity-50">|</span></span>;
}

/* ── SSE 流式调用 Kimi API ── */
async function streamFromKimi(
  apiKey: string,
  messages: { role: string; content: string }[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
) {
  try {
    const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'kimi-k2.5', messages, stream: true, max_tokens: 4096 }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      onError(`API 请求失败 (${resp.status}): ${errBody}`);
      return;
    }

    const reader = resp.body?.getReader();
    if (!reader) { onError('无法获取响应流'); return; }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onToken(content);
        } catch { /* skip malformed chunk */ }
      }
    }
    onDone();
  } catch (err: any) {
    onError('网络错误: ' + (err.message || '未知错误'));
  }
}

/* ── 预置 demo 解读（备用 fallback） ── */
const DEMO_READING = `这位老弟，你命坐丑宫，天同旺、天梁陷，两颗星一明一暗，像是一盏灯笼挂在老屋檐下——光能照到人，但影子也拉得长。天同旺，说明你骨子里是个有福之人，性情温和，待人宽厚，走到哪儿都不缺人缘，像块温润的玉石，谁摸着都觉得舒服。你心思细腻，直觉准，常常别人还没开口，你已经猜个八九不离十。但天梁陷在这儿，就像屋梁生了虫，外表看着结实，里头藏着忧思。你容易想太多，夜里翻来覆去睡不着，替别人操心，替自己发愁。心里头有股子慈悲劲儿，见不得人受苦，可有时候这份善心反被人利用。你的天赋不在刀光剑影的战场上，而在润物细无声的地方——调解纠纷、安抚人心、出谋划策，这些都是你的拿手好戏。记住，你的福气不是大风刮来的，是你一点一滴攒下的阴德换的。

说到事业财运，你这盘里财帛宫空着，借的是对宫巨门，这就像是家里没存钱罐，钱得靠一张嘴去挣。巨门主口舌，你的财路跟说话脱不了干系——律师、销售、讲师、咨询，凡是靠嘴皮子吃饭的活儿，你都能混出点名堂。但巨门也是把双刃剑，说对了金山银山，说错了祸从口出。你这辈子不缺赚钱的机会，但守财的本事弱了些，钱来得快去得也快，像流水过手，抓不住。官禄宫坐天机，脑子转得快，点子多，适合动脑子不动拳头的行业——策划、IT、研究、参谋，越是需要灵活应变的岗位，你越能如鱼得水。天机也主变动，你这辈子很难在一个地方干到老，三五年一换跑道是常事。别慌，变动不是坏事，每一次转身都是往上蹭一层。只是切记，财不入急门，越是想一夜暴富，越容易踩坑。

感情这档子事，你夫妻宫坐天相，这颗星是颗体面星，说明你娶的人，或者你爱上的人，多半是个讲究人——注重外表，讲究生活品质，带出去有面子，回家也有里子。天相也主贤淑，对方大概率是个能持家、懂分寸的性子，你在外头奔波，她能把后方稳得妥妥的。但天相有个毛病，太要面子，夫妻之间有事喜欢憋在心里，表面风平浪静，底下暗流涌动。你得学会察言观色，别等她爆发了才后知后觉。你这人本身桃花不弱，天同的温和气质招人喜欢，可天梁的陷地又让你在感情里容易犹豫不决，前怕狼后怕虎，错过了好姻缘。提醒你一句，婚姻这事儿，挑来挑去挑花了眼，最后往往不如第一个真心待你的人。过了三十五岁，感情运会稳下来，那时候成家，反而更踏实。

健康方面，我得给你敲个警钟。命宫天梁陷，天梁本是颗寿星，可一陷就变了味儿，像老药柜里受潮的药材，看着还是那味药，效力打折了。你先天体质偏弱，脾胃不和，消化这块儿容易出毛病——吃多了胀，吃少了虚，生冷油腻最好少碰。天同旺在水，肾和泌尿系统也得留心，年轻时熬熬夜不觉得，过了四十，毛病就找上来了。还有，你这人思虑过重，肝气郁结是隐疾，胸口闷、两肋胀、睡眠浅，这些都是信号。别硬扛，扛到最后扛出大病来不值当。天梁也主皮肤，过敏体质、湿疹、风疹块，这些烦人的小毛病可能缠着你。我的建议是，宁可信其有，每年体检别偷懒，饮食清淡，作息规律，比你吃啥补药都强。

最后说说你这辈子的大限流年。你今年虚岁三十八，正走在第四个大运上，这步运关键得很，像是爬山的半山腰——上去了就是一览众山小，滑下来就得从头再来。你命盘里太阳太阴在迁移宫，这两颗星一阴一阳，照着你在外头的运势。太阳主贵，太阴主富，说明你离开出生地，往远方走，反而能闯出一片天。南方火旺之地对你有利，北方水寒之地则需谨慎。最近这两年，流年走得有些颠簸，像是船行浅滩，磕磕碰碰难免，但别灰心，这是老天在给你磨刀。过了明年，运势一转，贵人星动，会有意想不到的机会砸到你头上，到时候别犹豫，该接就接。你这辈子的大格局在中年以后才慢慢打开，五十岁前后有一步财运大运，那时候才是你真正扬眉吐气的时候。眼下这十年，稳扎稳打，积德行善，把路铺平了，后头的福自然来。
`;

export default function AIInterpretation({ astrolabe, birthDate, birthTime, gender, personName }: Props) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('kimi_api_key') || DEFAULT_API_KEY);
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [streaming, setStreaming] = useState(false);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'demo' | 'kimi'>('demo');

  const handleStreamStart = useCallback(() => {
    if (!apiKey) { setShowKeyInput(true); return; }
    setStreaming(true);
    setOutput('');
    setMode('kimi');

    const messages = [
      { role: 'system', content: '你是一位精通紫微斗数的命理大师。"' },
      { role: 'user', content: buildPrompt(astrolabe, birthDate, birthTime, gender, personName) },
    ];

    streamFromKimi(
      apiKey,
      messages,
      (token) => setOutput(prev => prev + token),
      () => setStreaming(false),
      (err) => { setStreaming(false); setOutput(prev => prev + '\n\n[错误] ' + err); },
    );
  }, [apiKey, astrolabe, birthDate, birthTime, gender, personName]);

  const handleShowDemo = useCallback(() => {
    setMode('demo');
    setOutput('');
    setStreaming(true);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= DEMO_READING.length) { clearInterval(interval); setStreaming(false); return; }
      setOutput(prev => prev + DEMO_READING[idx]);
      idx++;
    }, 20);
  }, []);

  const handleSaveKey = useCallback(() => {
    localStorage.setItem('kimi_api_key', apiKey);
    setShowKeyInput(false);
  }, [apiKey]);

  return (
    <div className="space-y-4">
      {/* API Key 配置 */}
      {showKeyInput && (
        <div className="bg-pale/50 rounded-lg p-4 border border-border-light">
          <div className="text-xs text-text-secondary mb-2 tracking-wider flex items-center gap-2">
            <span>🔑</span> 输入你的 Kimi API Key（在 platform.moonshot.cn 获取）
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-parchment border border-border-light rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-jinbo"
            />
            <button
              onClick={handleSaveKey}
              className="bg-daiqing text-parchment px-4 py-1.5 rounded text-sm tracking-wider hover:bg-daiqing-light transition-colors font-ancient"
            >
              保存
            </button>
            <button
              onClick={() => setShowKeyInput(false)}
              className="bg-bg-card text-text-secondary px-3 py-1.5 rounded text-sm border border-border-light hover:text-text-primary transition-colors"
            >
              跳过（看demo）
            </button>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {!showKeyInput && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStreamStart}
            disabled={streaming}
            className="bg-daiqing hover:bg-daiqing-light disabled:opacity-50 text-parchment px-5 py-2 rounded text-sm tracking-wider transition-all font-ancient flex items-center gap-2"
          >
            {streaming && mode === 'kimi' ? (
              <>
                <span className="w-3 h-3 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                星君解读中...
              </>
            ) : mode === 'kimi' ? (
              <>
                <span>🪄</span> AI 深度解读
              </>
            ) : (
              <>
                <span>🪄</span> 重新解读
              </>
            )}
          </button>
          <button
            onClick={handleShowDemo}
            disabled={streaming}
            className="bg-jinbo/20 hover:bg-jinbo/30 disabled:opacity-50 text-daiqing px-5 py-2 rounded text-sm tracking-wider transition-all font-ancient border border-jinbo/30"
          >
            📜 看 Demo 解读
          </button>
        </div>
      )}

      {/* 解读内容区域 */}
      {output && (
        <div className="bg-pale/30 rounded-lg p-5 border border-border-light min-h-[200px]">
          <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-wrap">
            {streaming ? (
              <span>
                {output}
                <span className="animate-pulse text-jinbo">|</span>
              </span>
            ) : (
              output
            )}
          </div>
          {!streaming && output && (
            <div className="mt-4 text-[10px] text-text-secondary/50 text-right tracking-wider">
              —— {mode === 'kimi' ? '紫微子 · 星君解读' : 'demo 预置解读'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
