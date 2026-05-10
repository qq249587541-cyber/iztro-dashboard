// @ts-nocheck
/**
 * 命盘自动解读结果
 */
export interface ReadingResult {
  /** 性格分析 */
  personality: string;
  /** 事业分析 */
  career: string;
  /** 感情分析 */
  love: string;
  /** 财运分析 */
  wealth: string;
  /** 健康分析 */
  health: string;
}

/**
 * 流年运势预测结果
 */
export interface PredictionResult {
  /** 目标年份 */
  year: number;
  /** 大限分析 */
  decadal: {
    palace: string;
    heavenlyStem: string;
    earthlyBranch: string;
    ageRange: string;
    mutagen: string[];
    analysis: string;
  };
  /** 流年分析 */
  yearly: {
    palace: string;
    heavenlyStem: string;
    earthlyBranch: string;
    mutagen: string[];
    analysis: string;
  };
  /** 流月走势 */
  monthly: {
    trend: string;
    keyMonths: string[];
  };
  /** 年度总评 */
  summary: string;
}

/**
 * 改运化解建议
 */
export interface RemedyResult {
  /** 方位建议 */
  direction: string;
  /** 颜色建议 */
  color: string;
  /** 时机建议 */
  timing: string;
  /** 行为建议 */
  behavior: string;
}

/**
 * 命盘弱点诊断
 */
export interface Weakness {
  /** 弱点类型 */
  type: 'empty_palace' | 'evil_stars' | 'broken_pattern' | 'mutagen_ji' | 'brightness_weak' | 'general';
  /** 涉及宫位 */
  palace?: string;
  /** 描述 */
  description: string;
  /** 严重程度 1-5 */
  severity: number;
}

/**
 * 命盘录入信息
 */
export interface SavedAstrolabe {
  /** 唯一ID */
  id: string;
  /** 姓名 */
  name: string;
  /** 阳历生日 */
  birthDate: string;
  /** 时辰索引 0-12 */
  birthTime: number;
  /** 性别 */
  gender: '男' | '女';
  /** 保存时间 */
  savedAt: string;
}
