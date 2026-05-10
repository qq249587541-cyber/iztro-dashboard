// @ts-nocheck
export default function RemedyPanel() {
  const remedies = [
    {
      area: '财运补益',
      color: '#4a7c8a',
      tips: [
        '正北位摆放金属制品（铜钱、聚宝盆）增强财库',
        '随身佩戴深蓝色或黑色饰品，五行属水，水生财',
        '每月初一、十五沐浴更衣后静坐15分钟，清心聚财',
        '避免家中西北角堆放杂物，此为财位最忌堵塞',
      ],
    },
    {
      area: '事业提升',
      color: '#a84a4a',
      tips: [
        '办公桌宜背靠实墙，面朝开阔处，增强气场',
        '在东南方放置文昌塔或绿色植物，提升贵人运',
        '签署重要合同宜选上午9-11点（巳时），运势最旺',
        '每周三（水曜日）为事业决策日，宜做重大判断',
      ],
    },
    {
      area: '感情和合',
      color: '#b08040',
      tips: [
        '卧室使用暖色调灯光，避免冷白光影响感情',
        '床头柜放置粉色水晶，增强人缘与异性缘',
        '避免卧室门正对镜子，易引发感情口舌',
        '每月满月之夜焚香静心，冥想理想伴侣形象',
      ],
    },
    {
      area: '健康调养',
      color: '#5a7a5a',
      tips: [
        '根据命盘五行缺补：多食用对应颜色的食物',
        '晨起面向东方深呼吸7次，采东方生气',
        '避免在破日（农历初三、十三、廿三）进行重大手术',
        '随身携带木质饰品，木气生发，增强生命力',
      ],
    },
    {
      area: '行运择吉',
      color: '#8a6a4a',
      tips: [
        '重大出行宜选青龙日（黄历宜出行标记）',
        '面试/考试穿浅蓝色或白色衣服，文昌运最佳',
        '签约、婚嫁等红事宜选天德日或月德日',
        '每季度做一次断舍离清理，空间干净则运势通畅',
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {remedies.map((r) => (
        <div
          key={r.area}
          className="bg-pale/40 rounded-lg p-4 border-l-4 border-border-light"
          style={{ borderLeftColor: r.color }}
        >
          <h3 className="text-sm font-medium tracking-wider mb-3" style={{ color: r.color }}>
            {r.area}
          </h3>
          <ul className="space-y-2">
            {r.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-text-secondary">
                <span className="shrink-0 mt-0.5 opacity-50">
                  {['▸', '▹', '▹', '▸'][i % 4]}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
